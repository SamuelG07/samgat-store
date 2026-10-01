import { z } from 'zod';

export const createProductSchema = z.object({
  name: z
    .string()
    .min(3, 'Nome deve ter pelo menos 3 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres')
    .trim(),
  slug: z
    .string()
    .min(3)
    .max(100)
    .regex(/^[a-z0-9-]+$/, 'Slug inválido')
    .optional(),
  description: z
    .string()
    .max(2000)
    .optional()
    .nullable(),
  price: z
    .number()
    .positive('Preço deve ser positivo')
    .min(0.01),
  categoryId: z
    .number()
    .int('ID da categoria deve ser um número inteiro')
    .positive('ID da categoria deve ser positivo'),
  imageUrl: z
    .string()
    .url('URL da imagem inválida')
    .optional()
    .nullable(),
  isActive: z
    .boolean()
    .default(true)
    .optional(),
  initialStock: z
    .number()
    .int('Stock inicial deve ser um número inteiro')
    .min(0, 'Stock inicial não pode ser negativo')
    .max(100000, 'Stock inicial máximo é 100.000')
    .default(0)
    .optional(),
});

export const updateProductSchema = createProductSchema.partial();

export const productQuerySchema = z.object({
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
    .default('20')
    .pipe(z.number().int().min(1).max(100)),
  search: z
    .string()
    .optional()
    .transform(val => val?.trim() || undefined),
  category: z
    .string()
    .regex(/^\d+$/, 'Category deve ser um número')
    .transform(Number)
    .optional()
    .pipe(z.number().int().positive().optional()),
  sort: z
    .enum(['newest', 'price_asc', 'price_desc', 'name'])
    .default('newest'),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type ProductQueryInput = z.infer<typeof productQuerySchema>;
