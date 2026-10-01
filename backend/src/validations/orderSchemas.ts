import { z } from 'zod';

export const orderQuerySchema = z.object({
  page: z
    .string()
    .regex(/^\d+$/, 'Page deve ser um número')
    .transform(Number)
    .default('1')
    .pipe(z.number().int().positive('Page deve ser positivo')),
  limit: z
    .string()
    .regex(/^\d+$/, 'Limit deve ser um número')
    .transform(Number)
    .default('10')
    .pipe(z.number().int().min(1, 'Limit deve ser no mínimo 1').max(50, 'Limit deve ser no máximo 50')),
});

export type OrderQueryInput = z.infer<typeof orderQuerySchema>;
