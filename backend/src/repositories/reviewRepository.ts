import prisma from '../lib/prisma';

export class ReviewRepository {
  async create(data: {
    productId: number;
    userId: number;
    orderId: number;
    rating: number;
    comment?: string | null;
  }) {
    return prisma.product_reviews.create({
      data: {
        product_id: data.productId,
        user_id: data.userId,
        order_id: data.orderId,
        rating: data.rating,
        comment: data.comment || null,
      },
      include: {
        users: { select: { id: true, name: true } },
        products: { select: { id: true, name: true, slug: true } },
      },
    });
  }

  async findByProduct(productId: number, skip: number, take: number) {
    const [reviews, total] = await Promise.all([
      prisma.product_reviews.findMany({
        where: { product_id: productId },
        skip,
        take,
        orderBy: { created_at: 'desc' },
        include: {
          users: { select: { id: true, name: true } },
        },
      }),
      prisma.product_reviews.count({ where: { product_id: productId } }),
    ]);
    return { reviews, total };
  }

  async findByUserAndProduct(userId: number, productId: number) {
    return prisma.product_reviews.findFirst({
      where: { user_id: userId, product_id: productId },
    });
  }

  async findById(id: number) {
    return prisma.product_reviews.findUnique({ where: { id } });
  }

  async delete(id: number) {
    return prisma.product_reviews.delete({ where: { id } });
  }

  async getAverageRating(productId: number) {
    const result = await prisma.product_reviews.aggregate({
      where: { product_id: productId },
      _avg: { rating: true },
      _count: { rating: true },
    });
    return {
      average: result._avg.rating || 0,
      total: result._count.rating || 0,
    };
  }

  async userHasPurchased(userId: number, productId: number): Promise<boolean> {
    const orderItem = await prisma.order_items.findFirst({
      where: {
        product_id: productId,
        orders: { user_id: userId },
      },
    });
    return !!orderItem;
  }
}

export const reviewRepository = new ReviewRepository();
