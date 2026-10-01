import { Request, Response, NextFunction } from 'express';
import { orderService } from '../services/orderService';
import { orderQuerySchema } from '../validations/orderSchemas';
import { AppError } from '../utils/errorHandler';

export class OrderController {
  async checkout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError({
          message: 'Usuário não autenticado',
          statusCode: 401,
          code: 'UNAUTHENTICATED',
        });
      }

      const result = await orderService.checkout(req.user.userId);

      res.status(201).json({
        success: true,
        message: 'Pedido realizado com sucesso!',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async getOrders(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError({
          message: 'Usuário não autenticado',
          statusCode: 401,
          code: 'UNAUTHENTICATED',
        });
      }

      const query = orderQuerySchema.parse(req.query);
      const result = await orderService.getOrders(req.user.userId, query);

      res.status(200).json({
        success: true,
        ...result,
      });
    } catch (error) {
      next(error);
    }
  }

  async getOrderById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError({
          message: 'Usuário não autenticado',
          statusCode: 401,
          code: 'UNAUTHENTICATED',
        });
      }

      const orderId = parseInt(req.params.id, 10);
      if (isNaN(orderId)) {
        throw new AppError({
          message: 'ID do pedido inválido',
          statusCode: 400,
          code: 'INVALID_ID',
        });
      }

      const order = await orderService.getOrderById(req.user.userId, orderId);

      res.status(200).json({
        success: true,
        data: order,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const orderController = new OrderController();
