import crypto from 'crypto';
import { PaymentProvider, PaymentStatus } from '../../types/payment';
import { logger } from '../../utils/logger';

export class ManualPaymentProvider implements PaymentProvider {
  name = 'manual';
  private webhookSecret: string;

  constructor() {
    this.webhookSecret = process.env.PAYMENT_WEBHOOK_SECRET || 'dev-webhook-secret-change-me';
  }

  async createPayment(data: {
    orderId: number;
    amount: number;
    currency: string;
    metadata?: Record<string, any>;
  }) {
    const method = data.metadata?.method || 'transfer';
    const providerRef = `manual_${method}_${data.orderId}_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;

    logger.info(`[Payment] Criado: ${providerRef} (${method}) para order ${data.orderId}`);

    // Gerar referência para Multicaixa Express
    let reference: string | undefined;
    if (method === 'multicaixa') {
      const random = crypto.randomInt(100000, 999999);
      reference = `MCX-${random}`;
    }

    return {
      providerRef,
      status: 'PENDING' as PaymentStatus,
      metadata: {
        ...data.metadata,
        method,
        reference,
      },
    };
  }

  verifyWebhookSignature(payload: any, signature: string): boolean {
    const body = JSON.stringify(payload);
    const expected = crypto.createHmac('sha256', this.webhookSecret).update(body).digest('hex');
    try {
      return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
    } catch {
      return false;
    }
  }

  async handleWebhook(payload: any) {
    const { providerRef, status, metadata } = payload;
    if (!providerRef || !status) throw new Error('Webhook inválido');
    if (!['PAID', 'FAILED', 'REFUNDED'].includes(status)) throw new Error(`Status inválido: ${status}`);

    return {
      providerRef,
      status: status as PaymentStatus,
      metadata,
    };
  }

  generateSignature(payload: any): string {
    const body = JSON.stringify(payload);
    return crypto.createHmac('sha256', this.webhookSecret).update(body).digest('hex');
  }

  generateTransactionId(): string {
    const date = new Date();
    const dateStr = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`;
    const random = crypto.randomBytes(4).toString('hex').toUpperCase();
    return `TXN-${dateStr}-${random}`;
  }
}

export const manualPaymentProvider = new ManualPaymentProvider();
