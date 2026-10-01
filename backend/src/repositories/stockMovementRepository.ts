import prisma from '../lib/prisma';

export class StockMovementRepository {
  async create(productId: number, quantity: number, type: 'IN' | 'OUT' | 'ADJUSTMENT', reason?: string) {
    return prisma.stock_movements.create({
      data: {
        product_id: productId,
        quantity: quantity,
        type: type,
        reason: reason || null,
      },
    });
  }

  async findByProductId(productId: number) {
    return prisma.stock_movements.findMany({
      where: { product_id: productId },
      orderBy: { created_at: 'desc' },
      include: {
        products: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });
  }

  async findAll(skip: number = 0, take: number = 20) {
    const [movements, total] = await Promise.all([
      prisma.stock_movements.findMany({
        skip,
        take,
        orderBy: { created_at: 'desc' },
        include: {
          products: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
      }),
      prisma.stock_movements.count(),
    ]);

    return { movements, total };
  }
}

export const stockMovementRepository = new StockMovementRepository();
