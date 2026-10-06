import { z } from 'zod';

export const createPaymentSchema = z.object({
  orderId: z.number().int().positive(),
  method: z.enum(['transfer', 'multicaixa']).default('transfer'),
});

export type CreatePaymentInput = z.infer<typeof createPaymentSchema>;
