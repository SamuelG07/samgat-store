import { z } from 'zod';

export const addToCartSchema = z.object({
  productId: z
    .number({
      required_error: 'ID do produto é obrigatório',
      invalid_type_error: 'ID do produto deve ser um número',
    })
    .int('ID do produto deve ser um número inteiro')
    .positive('ID do produto deve ser positivo'),

  quantity: z
    .number({
      required_error: 'Quantidade é obrigatória',
      invalid_type_error: 'Quantidade deve ser um número',
    })
    .int('Quantidade deve ser um número inteiro')
    .min(1, 'Quantidade deve ser pelo menos 1')
    .max(100, 'Quantidade máxima é 100'),
});

export const updateCartItemSchema = z.object({
  quantity: z
    .number({
      required_error: 'Quantidade é obrigatória',
      invalid_type_error: 'Quantidade deve ser um número',
    })
    .int('Quantidade deve ser um número inteiro')
    .min(0, 'Quantidade deve ser pelo menos 0')
    .max(100, 'Quantidade máxima é 100'),
});

export type AddToCartInput = z.infer<typeof addToCartSchema>;
export type UpdateCartItemInput = z.infer<typeof updateCartItemSchema>;
