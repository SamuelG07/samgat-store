import { z } from 'zod';

export const createReviewSchema = z.object({
  productId: z.number().int().positive(),
  orderId: z.number().int().positive(),
  rating: z.number().int().min(1, 'Rating mínimo é 1').max(5, 'Rating máximo é 5'),
  comment: z
    .string()
    .max(1000, 'Comentário muito longo')
    .optional()
    .nullable()
    .refine(
      (val) => !val || !/<script|<\/script|<iframe|javascript:|onerror=/i.test(val),
      'Comentário contém conteúdo não permitido'
    ),
});

export const reviewQuerySchema = z.object({
  page: z
    .string()
    .regex(/^\d+$/)
    .transform(Number)
    .default('1')
    .pipe(z.number().int().positive()),
  limit: z
    .string()
    .regex(/^\d+$/)
    .transform(Number)
    .default('10')
    .pipe(z.number().int().min(1).max(50)),
});

export type CreateReviewInput = z.infer<typeof createReviewSchema>;
