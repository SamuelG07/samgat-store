import { z } from 'zod';

export const createPaymentSchema = z.object({
  orderId: z.number().int().positive(),
  method: z
    .enum(['multicaixa', 'card', 'reference', 'cash'])
    .optional()
    .default('card'),
  phone: z.string().optional(),
  cardNumber: z.string().optional(),
  cardName: z.string().optional(),
  cardExpiry: z.string().optional(),
  cardCvv: z.string().optional(),
});

export const webhookSchema = z.object({
  providerRef: z.string().min(1),
  status: z.enum(['PAID', 'FAILED', 'REFUNDED']),
  metadata: z.record(z.any()).optional(),
});

export type CreatePaymentInput = z.infer<typeof createPaymentSchema>;
