import { Request, Response, NextFunction } from 'express';
import { cartService } from '../services/cartService';
import { addToCartSchema, updateCartItemSchema } from '../validations/cartSchemas';
import { AppError } from '../utils/errorHandler';

export class CartController {
  async getCart(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError({
          message: 'Usuário não autenticado',
          statusCode: 401,
          code: 'UNAUTHENTICATED',
        });
      }

      const cart = await cartService.getCart(req.user.userId);
      res.status(200).json({
        success: true,
        data: cart,
      });
    } catch (error) {
      next(error);
    }
  }

  async addItem(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError({
          message: 'Usuário não autenticado',
          statusCode: 401,
          code: 'UNAUTHENTICATED',
        });
      }

      const validatedData = addToCartSchema.parse(req.body);
      const cart = await cartService.addItem(req.user.userId, validatedData);

      res.status(200).json({
        success: true,
        message: 'Produto adicionado ao carrinho!',
        data: cart,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateItem(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError({
          message: 'Usuário não autenticado',
          statusCode: 401,
          code: 'UNAUTHENTICATED',
        });
      }

      const itemId = parseInt(req.params.itemId, 10);
      if (isNaN(itemId)) {
        throw new AppError({
          message: 'ID do item inválido',
          statusCode: 400,
          code: 'INVALID_ID',
        });
      }

      const validatedData = updateCartItemSchema.parse(req.body);
      const cart = await cartService.updateItem(req.user.userId, itemId, validatedData);

      res.status(200).json({
        success: true,
        message: 'Item atualizado com sucesso!',
        data: cart,
      });
    } catch (error) {
      next(error);
    }
  }

  async removeItem(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError({
          message: 'Usuário não autenticado',
          statusCode: 401,
          code: 'UNAUTHENTICATED',
        });
      }

      const itemId = parseInt(req.params.itemId, 10);
      if (isNaN(itemId)) {
        throw new AppError({
          message: 'ID do item inválido',
          statusCode: 400,
          code: 'INVALID_ID',
        });
      }

      const cart = await cartService.removeItem(req.user.userId, itemId);

      res.status(200).json({
        success: true,
        message: 'Item removido do carrinho!',
        data: cart,
      });
    } catch (error) {
      next(error);
    }
  }

  async clearCart(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError({
          message: 'Usuário não autenticado',
          statusCode: 401,
          code: 'UNAUTHENTICATED',
        });
      }

      const cart = await cartService.clearCart(req.user.userId);

      res.status(200).json({
        success: true,
        message: 'Carrinho limpo com sucesso!',
        data: cart,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const cartController = new CartController();
