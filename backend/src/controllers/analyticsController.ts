import { Request, Response, NextFunction } from 'express';
import { analyticsService } from '../services/analyticsService';
import { AppError } from '../utils/errorHandler';

export class AnalyticsController {
  async getSalesOverTime(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { from, to } = req.query;
      if (!from || !to) {
        throw new AppError({ message: 'Parâmetros from e to obrigatórios', statusCode: 400, code: 'MISSING_PARAMS' });
      }
      const data = await analyticsService.getSalesOverTime(String(from), String(to));
      res.status(200).json({ success: true, data });
    } catch (error) { next(error); }
  }

  async getTopProducts(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const limit = req.query.limit ? parseInt(String(req.query.limit), 10) : 5;
      const data = await analyticsService.getTopProducts(limit);
      res.status(200).json({ success: true, data });
    } catch (error) { next(error); }
  }

  async getSalesByCategory(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await analyticsService.getSalesByCategory();
      res.status(200).json({ success: true, data });
    } catch (error) { next(error); }
  }

  async getCustomerGrowth(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { from, to } = req.query;
      if (!from || !to) {
        throw new AppError({ message: 'Parâmetros from e to obrigatórios', statusCode: 400, code: 'MISSING_PARAMS' });
      }
      const data = await analyticsService.getCustomerGrowth(String(from), String(to));
      res.status(200).json({ success: true, data });
    } catch (error) { next(error); }
  }

  async getCustomerStats(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await analyticsService.getCustomerStats();
      res.status(200).json({ success: true, data });
    } catch (error) { next(error); }
  }
}

export const analyticsController = new AnalyticsController();
