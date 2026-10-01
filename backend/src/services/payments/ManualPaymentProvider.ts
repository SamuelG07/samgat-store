import crypto from 'crypto';
import { PaymentProvider, PaymentStatus } from '../../types/payment';
import { logger } from '../../utils/logger';

// Números mágicos para testes
const MAGIC_NUMBERS: Record<string, { status: PaymentStatus; reason: string }> = {
  '244900000000': { status: 'PAID', reason: 'Sucesso simulado' },
  '244900000001': { status: 'FAILED', reason: 'Saldo insuficiente' },
  '244900000002': { status: 'PENDING', reason: 'Timeout' },
  '244900000003': { status: 'FAILED', reason: 'Cartão inválido' },
};

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
    // Gerar providerRef
    const providerRef = `manual_${data.orderId}_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;

    // Método e número enviados pelo frontend (simulados)
    const method = data.metadata?.method || 'unknown';
    const phone = data.metadata?.phone || '';
    const cardNumber = data.metadata?.cardNumber || '';

    // Verificar número mágico (Multicaixa)
    if (method === 'multicaixa' && phone && MAGIC_NUMBERS[phone]) {
      const magic = MAGIC_NUMBERS[phone];
      logger.info(`[Payment] Magic number ${phone} → ${magic.reason}`);

      return {
        providerRef,
        status: magic.status,
        metadata: {
          ...data.metadata,
          simulatedResult: magic.reason,
          method: 'multicaixa',
        },
      };
    }

    // Verificar cartão mágico
    if (method === 'card' && cardNumber) {
      const cleanCard = cardNumber.replace(/\s/g, '');

      if (cleanCard === '4000000000000002') {
        return {
          providerRef,
          status: 'FAILED' as PaymentStatus,
          metadata: { ...data.metadata, simulatedResult: 'Cartão recusado' },
        };
      }

      if (cleanCard === '4000000000000119') {
        return {
          providerRef,
          status: 'FAILED' as PaymentStatus,
          metadata: { ...data.metadata, simulatedResult: 'Cartão expirado' },
        };
      }
    }

    // Default: PENDING (aguarda confirmação via webhook)
    logger.info(`[Payment] Criado: ${providerRef} para order ${data.orderId}`);

    return {
      providerRef,
      status: 'PENDING' as PaymentStatus,
      metadata: {
        ...data.metadata,
        method,
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

    logger.info(`[Payment] Webhook: ${providerRef} → ${status}`);

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

  /**
   * Gera transaction_id único (simula o que o gateway devolveria)
   */
  generateTransactionId(): string {
    const date = new Date();
    const dateStr = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`;
    const random = crypto.randomBytes(4).toString('hex').toUpperCase();
    return `TXN-${dateStr}-${random}`;
  }
}

export const manualPaymentProvider = new ManualPaymentProvider();
