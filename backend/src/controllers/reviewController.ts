import { Request, Response, NextFunction } from 'express';
import { reviewService } from '../services/reviewService';
import { createReviewSchema, reviewQuerySchema } from '../validations/reviewSchemas';
import { AppError } from '../utils/errorHandler';

export class ReviewController {
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError({ message: 'Não autenticado', statusCode: 401, code: 'UNAUTHENTICATED' });
      }

      const data = createReviewSchema.parse(req.body);
      const review = await reviewService.create(req.user.userId, data);

      res.status(201).json({
        success: true,
        message: 'Review criada com sucesso',
        data: review,
      });
    } catch (error) {
      next(error);
    }
  }

  async getByProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const productId = parseInt(req.params.productId, 10);
      if (isNaN(productId)) {
        throw new AppError({ message: 'ID inválido', statusCode: 400, code: 'INVALID_ID' });
      }

      const query = reviewQuerySchema.parse(req.query);
      const result = await reviewService.getByProduct(productId, query.page, query.limit);

      res.status(200).json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError({ message: 'Não autenticado', statusCode: 401, code: 'UNAUTHENTICATED' });
      }

      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        throw new AppError({ message: 'ID inválido', statusCode: 400, code: 'INVALID_ID' });
      }

      await reviewService.delete(id);

      res.status(200).json({
        success: true,
        message: 'Review removida',
      });
    } catch (error) {
      next(error);
    }
  }
}

export const reviewController = new ReviewController();
