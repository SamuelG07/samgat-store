import { Request, Response, NextFunction } from 'express';
import { categoryService } from '../services/categoryService';

export class CategoryController {
  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const categories = await categoryService.findAll();
      res.json({ success: true, data: categories });
    } catch (error) { next(error); }
  }

  async findById(req: Request, res: Response, next: NextFunction) {
    try {
      const category = await categoryService.findById(Number(req.params.id));
      res.json({ success: true, data: category });
    } catch (error) { next(error); }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const category = await categoryService.create(req.body);
      res.status(201).json({ success: true, message: 'Categoria criada!', data: category });
    } catch (error) { next(error); }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const category = await categoryService.update(Number(req.params.id), req.body);
      res.json({ success: true, message: 'Categoria atualizada!', data: category });
    } catch (error) { next(error); }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await categoryService.delete(Number(req.params.id));
      res.json({ success: true, message: 'Categoria removida!' });
    } catch (error) { next(error); }
  }
}

export const categoryController = new CategoryController();
