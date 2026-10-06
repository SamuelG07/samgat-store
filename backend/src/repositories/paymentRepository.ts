import prisma from '../lib/prisma';
import { PaymentStatus } from '../types/payment';

export interface CreatePaymentData {
  orderId: number;
  provider: string;
  providerRef: string;
  transactionId?: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  metadata?: Record<string, any>;
  idempotencyKey?: string;
}

export class PaymentRepository {
  async create(data: CreatePaymentData) {
    return prisma.payments.create({
      data: {
        order_id: data.orderId,
        provider: data.provider,
        provider_ref: data.providerRef,
        transaction_id: data.transactionId ?? null,
        amount: data.amount,
        currency: data.currency,
        status: data.status,
        metadata: data.metadata ?? undefined,
        idempotency_key: data.idempotencyKey ?? null,
      },
    });
  }

  async findById(id: number) {
    return prisma.payments.findUnique({ where: { id } });
  }

  async findByProviderRef(providerRef: string) {
    return prisma.payments.findUnique({ where: { provider_ref: providerRef } });
  }

  async findByIdempotencyKey(key: string) {
    return prisma.payments.findUnique({ where: { idempotency_key: key } });
  }

  async findByOrderId(orderId: number) {
    return prisma.payments.findMany({
      where: { order_id: orderId },
      orderBy: { created_at: 'desc' },
    });
  }

  async findPendingByOrderId(orderId: number) {
    return prisma.payments.findFirst({
      where: { order_id: orderId, status: 'PENDING' },
      orderBy: { created_at: 'desc' },
    });
  }

  async findPendingAll() {
    return prisma.payments.findMany({
      where: { status: 'PENDING' },
      orderBy: { created_at: 'desc' },
      include: {
        orders: {
          include: {
            users: { select: { id: true, name: true, email: true } },
          },
        },
      },
    });
  }

  async updateStatus(id: number, status: PaymentStatus, transactionId?: string) {
    return prisma.payments.update({
      where: { id },
      data: {
        status,
        ...(transactionId ? { transaction_id: transactionId } : {}),
        updated_at: new Date(),
      },
    });
  }

  async updateProof(id: number, proofUrl: string) {
    return prisma.payments.update({
      where: { id },
      data: {
        proof_url: proofUrl,
        proof_uploaded_at: new Date(),
        updated_at: new Date(),
      },
    });
  }

  async updatePaymentStatus(orderId: number, status: PaymentStatus) {
    return prisma.orders.update({
      where: { id: orderId },
      data: { payment_status: status, updated_at: new Date() },
    });
  }
}

export const paymentRepository = new PaymentRepository();
