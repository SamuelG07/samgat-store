import prisma from '../lib/prisma';
import { adminConfig } from '../config/admin';

export class AdminRepository {
  async getDashboardMetrics() {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

    const [
      totalProducts,
      activeProducts,
      inactiveProducts,
      totalCategories,
      totalUsers,
      newUsersLast30,
      totalOrders,
      pendingOrders,
      confirmedOrders,
      processingOrders,
      shippedOrders,
      deliveredOrders,
      cancelledOrders,
      lowStockCount,
    ] = await Promise.all([
      prisma.products.count(),
      prisma.products.count({ where: { is_active: true } }),
      prisma.products.count({ where: { is_active: false } }),
      prisma.categories.count(),
      prisma.users.count({ where: { role: 'CUSTOMER' } }),
      prisma.users.count({
        where: { role: 'CUSTOMER', created_at: { gte: thirtyDaysAgo } },
      }),
      prisma.orders.count(),
      prisma.orders.count({ where: { status: 'PENDING' } }),
      prisma.orders.count({ where: { status: 'CONFIRMED' } }),
      prisma.orders.count({ where: { status: 'PROCESSING' } }),
      prisma.orders.count({ where: { status: 'SHIPPED' } }),
      prisma.orders.count({ where: { status: 'DELIVERED' } }),
      prisma.orders.count({ where: { status: 'CANCELLED' } }),
      prisma.inventory.count({
        where: { quantity: { lt: adminConfig.lowStockThreshold } },
      }),
    ]);

    const revenueResult = await prisma.orders.aggregate({
      where: { status: { not: 'CANCELLED' } },
      _sum: { total: true },
      _count: { id: true },
    });

    const revenue30 = await prisma.orders.aggregate({
      where: { status: { not: 'CANCELLED' }, created_at: { gte: thirtyDaysAgo } },
      _sum: { total: true },
      _count: { id: true },
    });

    const revenue60 = await prisma.orders.aggregate({
      where: {
        status: { not: 'CANCELLED' },
        created_at: { gte: sixtyDaysAgo, lt: thirtyDaysAgo },
      },
      _sum: { total: true },
      _count: { id: true },
    });

    const soldResult = await prisma.order_items.aggregate({
      where: { orders: { status: { not: 'CANCELLED' } } },
      _sum: { quantity: true },
    });

    const totalRevenue = Number(revenueResult._sum.total || 0);
    const revenue30Val = Number(revenue30._sum.total || 0);
    const revenue60Val = Number(revenue60._sum.total || 0);
    const orders30 = revenue30._count.id || 0;
    const orders60 = revenue60._count.id || 0;

    const calcChange = (current: number, previous: number) => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return Number((((current - previous) / previous) * 100).toFixed(1));
    };

    const totalOrdersNonCancelled = revenueResult._count.id || 0;
    const averageTicket = totalOrdersNonCancelled > 0 ? totalRevenue / totalOrdersNonCancelled : 0;
    const totalSold = Number(soldResult._sum.quantity || 0);

    return {
      products: { total: totalProducts, active: activeProducts, inactive: inactiveProducts },
      categories: { total: totalCategories },
      users: { total: totalUsers, newLast30: newUsersLast30 },
      orders: {
        total: totalOrders, pending: pendingOrders, confirmed: confirmedOrders,
        processing: processingOrders, shipped: shippedOrders,
        delivered: deliveredOrders, cancelled: cancelledOrders,
      },
      inventory: { lowStock: lowStockCount, threshold: adminConfig.lowStockThreshold },
      revenue: {
        total: totalRevenue, last30Days: revenue30Val, previous30Days: revenue60Val,
        change: calcChange(revenue30Val, revenue60Val),
      },
      ordersStats: {
        last30Days: orders30, previous30Days: orders60,
        change: calcChange(orders30, orders60),
      },
      productsSold: { total: totalSold },
      averageTicket,
    };
  }

  async getRecentOrders(limit: number = 5) {
    return prisma.orders.findMany({
      take: limit,
      orderBy: { created_at: 'desc' },
      include: {
        users: { select: { id: true, name: true, email: true } },
        order_items: { select: { id: true, quantity: true } },
      },
    });
  }

  async getLowStockProducts(limit: number = 5) {
    return prisma.inventory.findMany({
      take: limit,
      where: { quantity: { lt: adminConfig.lowStockThreshold } },
      orderBy: { quantity: 'asc' },
      include: {
        products: {
          select: { id: true, name: true, slug: true, is_active: true, image_url: true },
        },
      },
    });
  }
}

export const adminRepository = new AdminRepository();
