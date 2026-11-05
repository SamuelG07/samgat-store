import { Request, Response, NextFunction } from 'express';
import prisma from '../lib/prisma';
import { adminConfig } from '../config/admin';

export class NotificationController {
  async getCounts(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const [pendingOrders, pendingPayments, totalReviews, lowStock] = await Promise.all([
        prisma.orders.count({ where: { status: 'PENDING' } }),
        prisma.payments.count({ where: { status: 'PENDING' } }),
        prisma.product_reviews.count(),
        prisma.inventory.count({ where: { quantity: { lt: adminConfig.lowStockThreshold } } }),
      ]);

      res.status(200).json({
        success: true,
        data: { pendingOrders, pendingPayments, totalReviews, lowStock },
      });
    } catch (error) { next(error); }
  }
}

export const notificationController = new NotificationController();
