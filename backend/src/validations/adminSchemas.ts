import { z } from 'zod';

// Paginação
export const adminPaginationSchema = z.object({
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
    .pipe(z.number().int().min(1).max(100, 'Limit máximo é 100')),
});

// Filtros de produtos
export const adminProductQuerySchema = adminPaginationSchema.extend({
  search: z.string().optional(),
  category: z
    .string()
    .regex(/^\d+$/, 'Categoria deve ser um número')
    .transform(Number)
    .optional(),
  status: z.enum(['active', 'inactive', 'all']).default('all'),
  lowStock: z
    .string()
    .transform(val => val === 'true')
    .optional(),
  sort: z
    .enum(['newest', 'oldest', 'name_asc', 'name_desc', 'price_asc', 'price_desc'])
    .default('newest'),
});

// Filtros de pedidos
export const adminOrderQuerySchema = adminPaginationSchema.extend({
  status: z
    .enum(['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'])
    .optional(),
  paymentStatus: z
    .enum(['PENDING', 'PAID', 'FAILED', 'REFUNDED'])
    .optional(),
  search: z.string().optional(),
  sort: z
    .enum(['newest', 'oldest', 'total_asc', 'total_desc'])
    .default('newest'),
});

// Filtros de usuários
export const adminUserQuerySchema = adminPaginationSchema.extend({
  search: z.string().optional(),
  role: z.enum(['CUSTOMER', 'ADMIN']).optional(),
  sort: z.enum(['newest', 'oldest', 'name_asc', 'name_desc']).default('newest'),
});

// Filtros de inventory
export const adminInventoryQuerySchema = adminPaginationSchema.extend({
  search: z.string().optional(),
  lowStock: z
    .string()
    .transform(val => val === 'true')
    .optional(),
  sort: z.enum(['quantity_asc', 'quantity_desc', 'newest']).default('quantity_asc'),
});

// Filtros de stock movements
export const adminStockMovementQuerySchema = adminPaginationSchema.extend({
  productId: z
    .string()
    .regex(/^\d+$/, 'Produto deve ser um número')
    .transform(Number)
    .optional(),
  type: z.enum(['IN', 'OUT', 'ADJUSTMENT']).optional(),
  sort: z.enum(['newest', 'oldest']).default('newest'),
});

// Entrada de stock
export const stockInSchema = z.object({
  quantity: z
    .number({
      required_error: 'Quantidade é obrigatória',
      invalid_type_error: 'Quantidade deve ser um número',
    })
    .int('Quantidade deve ser um número inteiro')
    .positive('Quantidade deve ser positiva')
    .max(100000, 'Quantidade máxima é 100.000'),
  reason: z
    .string()
    .max(255, 'Motivo deve ter no máximo 255 caracteres')
    .optional()
    .nullable(),
});

// Ajuste de stock (pode ser positivo ou negativo)
export const stockAdjustSchema = z.object({
  quantity: z
    .number({
      required_error: 'Quantidade é obrigatória',
      invalid_type_error: 'Quantidade deve ser um número',
    })
    .int('Quantidade deve ser um número inteiro')
    .refine(val => val !== 0, 'Quantidade não pode ser zero'),
  reason: z
    .string({
      required_error: 'Motivo é obrigatório para ajustes',
    })
    .min(3, 'Motivo deve ter pelo menos 3 caracteres')
    .max(255, 'Motivo deve ter no máximo 255 caracteres'),
});

// Atualizar status do pedido
export const updateOrderStatusSchema = z.object({
  status: z.enum(['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'], {
    errorMap: () => ({ message: 'Status inválido' }),
  }),
});

// Atualizar status de pagamento
export const updatePaymentStatusSchema = z.object({
  paymentStatus: z.enum(['PENDING', 'PAID', 'FAILED', 'REFUNDED'], {
    errorMap: () => ({ message: 'Status de pagamento inválido' }),
  }),
});

export type AdminProductQuery = z.infer<typeof adminProductQuerySchema>;
export type AdminOrderQuery = z.infer<typeof adminOrderQuerySchema>;
export type AdminUserQuery = z.infer<typeof adminUserQuerySchema>;
export type AdminInventoryQuery = z.infer<typeof adminInventoryQuerySchema>;
export type AdminStockMovementQuery = z.infer<typeof adminStockMovementQuerySchema>;
export type StockInInput = z.infer<typeof stockInSchema>;
export type StockAdjustInput = z.infer<typeof stockAdjustSchema>;
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;
