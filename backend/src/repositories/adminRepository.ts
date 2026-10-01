import prisma from '../lib/prisma';
import { adminConfig } from '../config/admin';

export class AdminRepository {
  // ===== DASHBOARD =====
  async getDashboardMetrics() {
    const [
      totalProducts,
      activeProducts,
      inactiveProducts,
      totalCategories,
      totalUsers,
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
      prisma.users.count(),
      prisma.orders.count(),
      prisma.orders.count({ where: { status: 'PENDING' } }),
      prisma.orders.count({ where: { status: 'CONFIRMED' } }),
      prisma.orders.count({ where: { status: 'PROCESSING' } }),
      prisma.orders.count({ where: { status: 'SHIPPED' } }),
      prisma.orders.count({ where: { status: 'DELIVERED' } }),
      prisma.orders.count({ where: { status: 'CANCELLED' } }),
      prisma.inventory.count({
        where: {
          quantity: { lt: adminConfig.lowStockThreshold },
        },
      }),
    ]);

    // Calcular receita total (pedidos não cancelados)
    const revenueResult = await prisma.orders.aggregate({
      where: {
        status: { not: 'CANCELLED' },
      },
      _sum: { total: true },
    });

    return {
      products: {
        total: totalProducts,
        active: activeProducts,
        inactive: inactiveProducts,
      },
      categories: {
        total: totalCategories,
      },
      users: {
        total: totalUsers,
      },
      orders: {
        total: totalOrders,
        pending: pendingOrders,
        confirmed: confirmedOrders,
        processing: processingOrders,
        shipped: shippedOrders,
        delivered: deliveredOrders,
        cancelled: cancelledOrders,
      },
      inventory: {
        lowStock: lowStockCount,
        threshold: adminConfig.lowStockThreshold,
      },
      revenue: {
        total: Number(revenueResult._sum.total || 0),
      },
    };
  }

  async getRecentOrders(limit: number = 5) {
    return prisma.orders.findMany({
      take: limit,
      orderBy: { created_at: 'desc' },
      include: {
        users: {
          select: { id: true, name: true, email: true },
        },
        order_items: {
          select: { id: true, quantity: true },
        },
      },
    });
  }

  async getLowStockProducts(limit: number = 5) {
    return prisma.inventory.findMany({
      take: limit,
      where: {
        quantity: { lt: adminConfig.lowStockThreshold },
      },
      orderBy: { quantity: 'asc' },
      include: {
        products: {
          select: {
            id: true,
            name: true,
            slug: true,
            is_active: true,
            image_url: true,
          },
        },
      },
    });
  }
}

export const adminRepository = new AdminRepository();
