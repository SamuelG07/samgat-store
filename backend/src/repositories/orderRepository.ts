import prisma from '../lib/prisma';

export class OrderRepository {
  async create(userId: number, total: number) {
    return prisma.orders.create({
      data: {
        user_id: userId,
        total: total,
      },
      include: {
        order_items: {
          include: {
            products: {
              select: {
                id: true,
                name: true,
                price: true,
                image_url: true,
              },
            },
          },
        },
        users: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async findById(id: number) {
    return prisma.orders.findUnique({
      where: { id },
      include: {
        order_items: {
          include: {
            products: {
              select: {
                id: true,
                name: true,
                price: true,
                image_url: true,
              },
            },
          },
        },
        users: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async findByUserId(userId: number, skip: number, take: number) {
    const [orders, total] = await Promise.all([
      prisma.orders.findMany({
        where: { user_id: userId },
        include: {
          order_items: {
            include: {
              products: {
                select: {
                  id: true,
                  name: true,
                  price: true,
                  image_url: true,
                },
              },
            },
          },
        },
        orderBy: { created_at: 'desc' },
        skip,
        take,
      }),
      prisma.orders.count({
        where: { user_id: userId },
      }),
    ]);

    return { orders, total };
  }

  async countByUserId(userId: number) {
    return prisma.orders.count({
      where: { user_id: userId },
    });
  }
}

export const orderRepository = new OrderRepository();
