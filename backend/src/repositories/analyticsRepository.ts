import prisma from '../lib/prisma';

export class AnalyticsRepository {
  /**
   * Vendas ao longo do tempo (agrupadas por dia)
   */
  async getSalesOverTime(from: Date, to: Date) {
    const orders = await prisma.orders.findMany({
      where: {
        status: { not: 'CANCELLED' },
        created_at: { gte: from, lte: to },
      },
      select: {
        created_at: true,
        total: true,
      },
      orderBy: { created_at: 'asc' },
    });

    // Agrupar por dia
    const grouped: Record<string, { date: string; orders: number; revenue: number }> = {};

    for (const order of orders) {
      const date = order.created_at.toISOString().split('T')[0];
      if (!grouped[date]) {
        grouped[date] = { date, orders: 0, revenue: 0 };
      }
      grouped[date].orders += 1;
      grouped[date].revenue += Number(order.total);
    }

    return Object.values(grouped).sort((a, b) => a.date.localeCompare(b.date));
  }

  /**
   * Produtos mais vendidos
   */
  async getTopProducts(limit: number = 5) {
    const result = await prisma.order_items.groupBy({
      by: ['product_id'],
      where: {
        orders: { status: { not: 'CANCELLED' } },
      },
      _sum: { quantity: true, price: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take: limit,
    });

    const productIds = result.map((r) => r.product_id);
    const products = await prisma.products.findMany({
      where: { id: { in: productIds } },
      select: { id: true, name: true, image_url: true },
    });

    return result.map((r) => {
      const product = products.find((p) => p.id === r.product_id);
      return {
        productId: r.product_id,
        name: product?.name || 'Desconhecido',
        imageUrl: product?.image_url || null,
        quantity: Number(r._sum.quantity || 0),
        revenue: Number(r._sum.price || 0),
      };
    });
  }

  /**
   * Vendas por categoria
   */
  async getSalesByCategory() {
    const orderItems = await prisma.order_items.findMany({
      where: { orders: { status: { not: 'CANCELLED' } } },
      select: {
        quantity: true,
        price: true,
        products: {
          select: {
            categories: { select: { id: true, name: true } },
          },
        },
      },
    });

    const grouped: Record<string, { categoryId: number; name: string; quantity: number; revenue: number }> = {};

    for (const item of orderItems) {
      const cat = item.products?.categories;
      if (!cat) continue;

      const key = String(cat.id);
      if (!grouped[key]) {
        grouped[key] = { categoryId: cat.id, name: cat.name, quantity: 0, revenue: 0 };
      }

      grouped[key].quantity += item.quantity;
      grouped[key].revenue += Number(item.price) * item.quantity;
    }

    const categories = Object.values(grouped).sort((a, b) => b.revenue - a.revenue);
    const totalRevenue = categories.reduce((sum, c) => sum + c.revenue, 0);

    return categories.map((c) => ({
      ...c,
      percentage: totalRevenue > 0 ? Number(((c.revenue / totalRevenue) * 100).toFixed(1)) : 0,
    }));
  }

  /**
   * Crescimento de clientes
   */
  async getCustomerGrowth(from: Date, to: Date) {
    const customers = await prisma.users.findMany({
      where: {
        role: 'CUSTOMER',
        created_at: { gte: from, lte: to },
      },
      select: { created_at: true },
      orderBy: { created_at: 'asc' },
    });

    const grouped: Record<string, { date: string; count: number }> = {};
    for (const c of customers) {
      const date = c.created_at.toISOString().split('T')[0];
      if (!grouped[date]) grouped[date] = { date, count: 0 };
      grouped[date].count += 1;
    }

    return Object.values(grouped).sort((a, b) => a.date.localeCompare(b.date));
  }

  /**
   * Resumo de clientes
   */
  async getCustomerStats() {
    const total = await prisma.users.count({ where: { role: 'CUSTOMER' } });

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const newLast30 = await prisma.users.count({
      where: { role: 'CUSTOMER', created_at: { gte: thirtyDaysAgo } },
    });

    // Clientes recorrentes (com mais de 1 pedido)
    const recurring = await prisma.orders.groupBy({
      by: ['user_id'],
      _count: { id: true },
      having: { id: { _count: { gt: 1 } } },
    });

    return {
      total,
      newLast30,
      recurring: recurring.length,
    };
  }
}

export const analyticsRepository = new AnalyticsRepository();
