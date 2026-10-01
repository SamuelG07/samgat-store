import { Request, Response, NextFunction } from 'express';
import { paymentService } from '../services/paymentService';
import { createPaymentSchema, webhookSchema } from '../validations/paymentSchemas';
import { AppError } from '../utils/errorHandler';

export class PaymentController {
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) throw new AppError({ message: 'Não autenticado', statusCode: 401, code: 'UNAUTHENTICATED' });

      const data = createPaymentSchema.parse(req.body);

      const paymentData: any = {};
      if (data.method === 'multicaixa' && data.phone) paymentData.phone = data.phone;
      if (data.method === 'card') {
        if (data.cardNumber) paymentData.cardNumber = data.cardNumber;
        if (data.cardName) paymentData.cardName = data.cardName;
        if (data.cardExpiry) paymentData.cardExpiry = data.cardExpiry;
        if (data.cardCvv) paymentData.cardCvv = data.cardCvv;
      }

      const payment = await paymentService.createPayment(
        req.user.userId,
        data.orderId,
        data.method,
        paymentData
      );

      res.status(201).json({
        success: true,
        message: 'Pagamento processado',
        data: payment,
      });
    } catch (error) {
      next(error);
    }
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

  async webhook(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const signature = req.headers['x-webhook-signature'] as string;
      if (!signature) throw new AppError({ message: 'Assinatura ausente', statusCode: 401, code: 'SIGNATURE_MISSING' });
      const payload = webhookSchema.parse(req.body);
      await paymentService.processWebhook(payload, signature);
      res.status(200).json({ success: true });
    } catch (error) { next(error); }
  }

  async webhookTest(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (process.env.NODE_ENV === 'production') {
        throw new AppError({ message: 'Endpoint indisponível', statusCode: 404, code: 'NOT_FOUND' });
      }
      const payload = webhookSchema.parse(req.body);
      const signature = paymentService.generateTestSignature(payload);
      await paymentService.processWebhook(payload, signature);
      res.status(200).json({ success: true, message: 'Webhook processado' });
    } catch (error) { next(error); }
  }
}

export const paymentController = new PaymentController();
