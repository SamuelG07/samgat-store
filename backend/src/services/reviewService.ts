import { reviewRepository } from '../repositories/reviewRepository';
import { AppError } from '../utils/errorHandler';
import { CreateReviewInput } from '../validations/reviewSchemas';

export class ReviewService {
  async create(userId: number, data: CreateReviewInput) {
    // Verificar se o utilizador comprou o produto
    const hasPurchased = await reviewRepository.userHasPurchased(userId, data.productId);
    if (!hasPurchased) {
      throw new AppError({
        message: 'Só podes avaliar produtos que compraste',
        statusCode: 403,
        code: 'NOT_PURCHASED',
      });
    }

    // Verificar se já existe review deste user para este produto
    const existing = await reviewRepository.findByUserAndProduct(userId, data.productId);
    if (existing) {
      throw new AppError({
        message: 'Já avaliaste este produto',
        statusCode: 409,
        code: 'REVIEW_ALREADY_EXISTS',
      });
    }

    return reviewRepository.create({
      productId: data.productId,
      userId,
      orderId: data.orderId,
      rating: data.rating,
      comment: data.comment,
    });
  }

  async getByProduct(productId: number, page: number, limit: number) {
    const skip = (page - 1) * limit;
    const { reviews, total } = await reviewRepository.findByProduct(productId, skip, limit);
    const stats = await reviewRepository.getAverageRating(productId);

    return {
      data: reviews.map((r) => ({
        id: r.id,
        rating: r.rating,
        comment: r.comment,
        createdAt: r.created_at,
        user: { id: r.users.id, name: r.users.name },
      })),
      stats: {
        average: Number(stats.average.toFixed(2)),
        total: stats.total,
      },
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getStats(productId: number) {
    const stats = await reviewRepository.getAverageRating(productId);
    return {
      average: Number(stats.average.toFixed(2)),
      total: stats.total,
    };
  }

  async delete(id: number) {
    const review = await reviewRepository.findById(id);
    if (!review) {
      throw new AppError({
        message: 'Review não encontrada',
        statusCode: 404,
        code: 'REVIEW_NOT_FOUND',
      });
    }
    return reviewRepository.delete(id);
  }
}

export const reviewService = new ReviewService();
