import { manualPaymentProvider } from './payments/ManualPaymentProvider';
import { paymentRepository } from '../repositories/paymentRepository';
import { orderRepository } from '../repositories/orderRepository';
import { AppError } from '../utils/errorHandler';
import { logger } from '../utils/logger';

export class PaymentService {
  async createPayment(userId: number, orderId: number, method: string, paymentData: any) {
    const order = await orderRepository.findById(orderId);
    if (!order) {
      throw new AppError({ message: 'Pedido não encontrado', statusCode: 404, code: 'ORDER_NOT_FOUND' });
    }

    if (order.user_id !== userId) {
      throw new AppError({ message: 'Acesso negado', statusCode: 403, code: 'FORBIDDEN' });
    }

    if (order.payment_status === 'PAID') {
      throw new AppError({ message: 'Pedido já está pago', statusCode: 409, code: 'ORDER_ALREADY_PAID' });
    }

    const idempotencyKey = `order-${orderId}-pending`;

    // Reutilizar PENDING existente
    const existingPending = await paymentRepository.findPendingByOrderId(orderId);
    if (existingPending) {
      logger.info(`[Payment] Reutilizando: ${existingPending.id}`);
      return this.serialize(existingPending);
    }

    // Idempotency hit
    const existingByKey = await paymentRepository.findByIdempotencyKey(idempotencyKey);
    if (existingByKey) {
      return this.serialize(existingByKey);
    }

    // Criar pagamento via provider
    const amount = Number(order.total);
    const providerResult = await manualPaymentProvider.createPayment({
      orderId,
      amount,
      currency: 'AOA',
      metadata: { userId, method, ...paymentData },
    });

    // Gerar transaction_id se PAID
    const transactionId = providerResult.status === 'PAID'
      ? manualPaymentProvider.generateTransactionId()
      : undefined;

    try {
      const payment = await paymentRepository.create({
        orderId,
        provider: manualPaymentProvider.name,
        providerRef: providerResult.providerRef,
        transactionId,
        amount,
        currency: 'AOA',
        status: providerResult.status,
        metadata: providerResult.metadata,
        idempotencyKey,
      });

      // Se já PAID, sincronizar order
      if (providerResult.status === 'PAID') {
        await paymentRepository.updatePaymentStatus(orderId, 'PAID');
      } else if (providerResult.status === 'FAILED') {
        await paymentRepository.updatePaymentStatus(orderId, 'FAILED');
      }

      logger.info(`[Payment] Criado: ${payment.id} (${providerResult.status})`);
      return this.serialize(payment);
    } catch (error: any) {
      if (error.code === 'P2002') {
        const raceWinner = await paymentRepository.findByIdempotencyKey(idempotencyKey);
        if (raceWinner) return this.serialize(raceWinner);
      }
      throw error;
    }
  }

  async getPayment(userId: number, paymentId: number) {
    const payment = await paymentRepository.findById(paymentId);
    if (!payment) {
      throw new AppError({ message: 'Pagamento não encontrado', statusCode: 404, code: 'PAYMENT_NOT_FOUND' });
    }

    const order = await orderRepository.findById(payment.order_id);
    if (!order || order.user_id !== userId) {
      throw new AppError({ message: 'Acesso negado', statusCode: 403, code: 'FORBIDDEN' });
    }

    return this.serialize(payment);
  }

  async getPaymentsByOrder(userId: number, orderId: number) {
    const order = await orderRepository.findById(orderId);
    if (!order) {
      throw new AppError({ message: 'Pedido não encontrado', statusCode: 404, code: 'ORDER_NOT_FOUND' });
    }

    if (order.user_id !== userId) {
      throw new AppError({ message: 'Acesso negado', statusCode: 403, code: 'FORBIDDEN' });
    }

    const payments = await paymentRepository.findByOrderId(orderId);
    return payments.map((p) => this.serialize(p));
  }

  async processWebhook(payload: any, signature: string): Promise<void> {
    if (!manualPaymentProvider.verifyWebhookSignature(payload, signature)) {
      throw new AppError({ message: 'Assinatura inválida', statusCode: 401, code: 'INVALID_SIGNATURE' });
    }

    const result = await manualPaymentProvider.handleWebhook(payload);
    const payment = await paymentRepository.findByProviderRef(result.providerRef);
    if (!payment) {
      throw new AppError({ message: 'Pagamento não encontrado', statusCode: 404, code: 'PAYMENT_NOT_FOUND' });
    }

    if (payment.status === result.status) return;
    if (payment.status !== 'PENDING') return;

    const transactionId = result.status === 'PAID'
      ? manualPaymentProvider.generateTransactionId()
      : undefined;

    await paymentRepository.updateStatus(payment.id, result.status, transactionId);

    if (result.status === 'PAID') {
      await paymentRepository.updatePaymentStatus(payment.order_id, 'PAID');
    } else if (result.status === 'FAILED') {
      await paymentRepository.updatePaymentStatus(payment.order_id, 'FAILED');
    } else if (result.status === 'REFUNDED') {
      await paymentRepository.updatePaymentStatus(payment.order_id, 'REFUNDED');
    }

    logger.info(`[Payment] Webhook: ${payment.id} → ${result.status}`);
  }

  generateTestSignature(payload: any): string {
    return manualPaymentProvider.generateSignature(payload);
  }

  private serialize(payment: any) {
    return {
      paymentId: String(payment.id),
      orderId: payment.order_id,
      amount: Number(payment.amount),
      currency: payment.currency,
      status: payment.status,
      provider: payment.provider,
      providerRef: payment.provider_ref,
      transactionId: payment.transaction_id,
      metadata: payment.metadata,
      createdAt: payment.created_at,
    };
  }
}

export const paymentService = new PaymentService();
