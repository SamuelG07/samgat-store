import { Request, Response, NextFunction } from 'express';
import { adminService } from '../services/adminService';
import {
  adminProductQuerySchema,
  adminOrderQuerySchema,
  adminUserQuerySchema,
  adminInventoryQuerySchema,
  adminStockMovementQuerySchema,
  stockInSchema,
  stockAdjustSchema,
  updateOrderStatusSchema,
  updatePaymentStatusSchema,
} from '../validations/adminSchemas';
import { AppError } from '../utils/errorHandler';

export class AdminController {
  // ===== DASHBOARD =====
  async getDashboard(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await adminService.getDashboard();
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  // ===== PRODUCTS =====
  async getProducts(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const query = adminProductQuerySchema.parse(req.query);
      const result = await adminService.getProducts(query);
      res.status(200).json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  }

  async activateProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        throw new AppError({ message: 'ID inválido', statusCode: 400, code: 'INVALID_ID' });
      }
      const product = await adminService.toggleProductStatus(id, true);
      res.status(200).json({ success: true, message: 'Produto ativado', data: product });
    } catch (error) {
      next(error);
    }
  }

  async deactivateProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        throw new AppError({ message: 'ID inválido', statusCode: 400, code: 'INVALID_ID' });
      }
      const product = await adminService.toggleProductStatus(id, false);
      res.status(200).json({ success: true, message: 'Produto desativado', data: product });
    } catch (error) {
      next(error);
    }
  }

  // ===== INVENTORY =====
  async getInventory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const query = adminInventoryQuerySchema.parse(req.query);
      const result = await adminService.getInventory(query);
      res.status(200).json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  }

  async stockIn(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError({ message: 'Não autenticado', statusCode: 401, code: 'UNAUTHENTICATED' });
      }
      const productId = parseInt(req.params.productId, 10);
      if (isNaN(productId)) {
        throw new AppError({ message: 'ID do produto inválido', statusCode: 400, code: 'INVALID_ID' });
      }
      const data = stockInSchema.parse(req.body);
      const result = await adminService.stockIn(productId, data, req.user.userId);
      res.status(200).json({ success: true, message: 'Entrada de stock registrada', data: result });
    } catch (error) {
      next(error);
    }
  }

  async stockAdjust(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError({ message: 'Não autenticado', statusCode: 401, code: 'UNAUTHENTICATED' });
      }
      const productId = parseInt(req.params.productId, 10);
      if (isNaN(productId)) {
        throw new AppError({ message: 'ID do produto inválido', statusCode: 400, code: 'INVALID_ID' });
      }
      const data = stockAdjustSchema.parse(req.body);
      const result = await adminService.stockAdjust(productId, data, req.user.userId);
      res.status(200).json({ success: true, message: 'Ajuste registrado', data: result });
    } catch (error) {
      next(error);
    }
  }

  async getStockMovements(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const query = adminStockMovementQuerySchema.parse(req.query);
      const result = await adminService.getStockMovements(query);
      res.status(200).json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  }

  // ===== ORDERS =====
  async getOrders(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const query = adminOrderQuerySchema.parse(req.query);
      const result = await adminService.getOrders(query);
      res.status(200).json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  }

  async getOrderById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        throw new AppError({ message: 'ID inválido', statusCode: 400, code: 'INVALID_ID' });
      }
      const order = await adminService.getOrderById(id);
      res.status(200).json({ success: true, data: order });
    } catch (error) {
      next(error);
    }
  }

  async updateOrderStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        throw new AppError({ message: 'ID inválido', statusCode: 400, code: 'INVALID_ID' });
      }
      const { status } = updateOrderStatusSchema.parse(req.body);
      const order = await adminService.updateOrderStatus(id, status);
      res.status(200).json({ success: true, message: 'Status atualizado', data: order });
    } catch (error) {
      next(error);
    }
  }

  async updatePaymentStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        throw new AppError({ message: 'ID inválido', statusCode: 400, code: 'INVALID_ID' });
      }
      const { paymentStatus } = updatePaymentStatusSchema.parse(req.body);
      const order = await adminService.updatePaymentStatus(id, paymentStatus);
      res.status(200).json({ success: true, message: 'Status de pagamento atualizado', data: order });
    } catch (error) {
      next(error);
    }
  }

  // ===== USERS =====
  async getUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const query = adminUserQuerySchema.parse(req.query);
      const result = await adminService.getUsers(query);
      res.status(200).json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  }

  async getUserById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        throw new AppError({ message: 'ID inválido', statusCode: 400, code: 'INVALID_ID' });
      }
      const user = await adminService.getUserById(id);
      res.status(200).json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  }
}

export const adminController = new AdminController();
