import { Request, Response, NextFunction } from 'express';
import { productService } from '../services/productService';
import { productQuerySchema } from '../validations/productSchemas';
import { AppError } from '../utils/errorHandler';

export class ProductController {
  async findAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const query = productQuerySchema.parse(req.query);
      const includeInactive = req.user?.role === 'ADMIN' && req.query.includeInactive === 'true';
      const result = await productService.findAll(query, includeInactive);

      res.status(200).json({
        success: true,
        data: result.data,
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  }

  async findById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        throw new AppError({ message: 'ID inválido', statusCode: 400, code: 'INVALID_ID' });
      }

      const includeInactive = req.user?.role === 'ADMIN';
      const product = await productService.findById(id, includeInactive);

      res.status(200).json({ success: true, data: product });
    } catch (error) {
      next(error);
    }
  }

  async findBySlug(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { slug } = req.params;
      const includeInactive = req.user?.role === 'ADMIN';
      const product = await productService.findBySlug(slug, includeInactive);

      res.status(200).json({ success: true, data: product });
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const product = await productService.create(req.body);
      res.status(201).json({
        success: true,
        message: 'Produto criado com sucesso!',
        data: product,
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        throw new AppError({ message: 'ID inválido', statusCode: 400, code: 'INVALID_ID' });
      }

      const product = await productService.update(id, req.body);
      res.status(200).json({
        success: true,
        message: 'Produto atualizado com sucesso!',
        data: product,
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        throw new AppError({ message: 'ID inválido', statusCode: 400, code: 'INVALID_ID' });
      }

      await productService.delete(id);
      res.status(200).json({
        success: true,
        message: 'Produto desativado com sucesso!',
      });
    } catch (error) {
      next(error);
    }
  }
}

export const productController = new ProductController();
