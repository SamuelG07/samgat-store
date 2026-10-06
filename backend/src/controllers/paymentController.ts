import { Request, Response, NextFunction } from 'express';
import { paymentService } from '../services/paymentService';
import { createPaymentSchema } from '../validations/paymentSchemas';
import { AppError } from '../utils/errorHandler';

export class PaymentController {
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) throw new AppError({ message: 'Não autenticado', statusCode: 401, code: 'UNAUTHENTICATED' });
      const data = createPaymentSchema.parse(req.body);

      const payment = await paymentService.createPayment(
        req.user.userId,
        data.orderId,
        data.method || 'transfer',
        {}
      );

      res.status(201).json({ success: true, message: 'Pagamento criado', data: payment });
    } catch (error) { next(error); }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) throw new AppError({ message: 'Não autenticado', statusCode: 401, code: 'UNAUTHENTICATED' });
      const paymentId = parseInt(req.params.id, 10);
      if (isNaN(paymentId)) throw new AppError({ message: 'ID inválido', statusCode: 400, code: 'INVALID_ID' });
      const payment = await paymentService.getPayment(req.user.userId, paymentId);
      res.status(200).json({ success: true, data: payment });
    } catch (error) { next(error); }
  }

  async getByOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) throw new AppError({ message: 'Não autenticado', statusCode: 401, code: 'UNAUTHENTICATED' });
      const orderId = parseInt(req.params.orderId, 10);
      if (isNaN(orderId)) throw new AppError({ message: 'ID inválido', statusCode: 400, code: 'INVALID_ID' });
      const payments = await paymentService.getPaymentsByOrder(req.user.userId, orderId);
      res.status(200).json({ success: true, data: payments });
    } catch (error) { next(error); }
  }

  async listPending(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const payments = await paymentService.getPendingPayments();
      res.status(200).json({ success: true, data: payments });
    } catch (error) { next(error); }
  }

  async confirm(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const paymentId = parseInt(req.params.id, 10);
      if (isNaN(paymentId)) throw new AppError({ message: 'ID inválido', statusCode: 400, code: 'INVALID_ID' });
      const payment = await paymentService.confirmPaymentByAdmin(paymentId);
      res.status(200).json({ success: true, message: 'Pagamento confirmado', data: payment });
    } catch (error) { next(error); }
  }

  async uploadProof(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) throw new AppError({ message: 'Não autenticado', statusCode: 401, code: 'UNAUTHENTICATED' });
      const paymentId = parseInt(req.params.id, 10);
      if (isNaN(paymentId)) throw new AppError({ message: 'ID inválido', statusCode: 400, code: 'INVALID_ID' });
      if (!req.file) throw new AppError({ message: 'Nenhum ficheiro enviado', statusCode: 400, code: 'NO_FILE' });

      const payment = await paymentService.uploadProof(req.user.userId, paymentId, req.file.buffer);

      res.status(200).json({ success: true, message: 'Comprovativo anexado', data: payment });
    } catch (error) { next(error); }
  }
}

export const paymentController = new PaymentController();
