// Configurações do painel administrativo
export const adminConfig = {
  // Limite de stock baixo (abaixo deste valor é considerado stock baixo)
  lowStockThreshold: 10,

  // Paginação padrão do admin
  defaultPageSize: 20,
  maxPageSize: 100,

  // Status de pedidos permitidos
  orderStatuses: ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'] as const,

  // Status de pagamento permitidos
  paymentStatuses: ['PENDING', 'PAID', 'FAILED', 'REFUNDED'] as const,

  // Tipos de movimentação de estoque
  stockMovementTypes: ['IN', 'OUT', 'ADJUSTMENT'] as const,
};

// Transições de status permitidas (state machine)
export const orderStatusTransitions: Record<string, string[]> = {
  PENDING: ['CONFIRMED', 'CANCELLED'],
  CONFIRMED: ['PROCESSING', 'CANCELLED'],
  PROCESSING: ['SHIPPED', 'CANCELLED'],
  SHIPPED: ['DELIVERED'],
  DELIVERED: [],
  CANCELLED: [],
};

// Verificar se uma transição é válida
export const isValidStatusTransition = (from: string, to: string): boolean => {
  const allowed = orderStatusTransitions[from] || [];
  return allowed.includes(to);
};

// Status que não permitem cancelamento
export const nonCancellableStatuses = ['SHIPPED', 'DELIVERED', 'CANCELLED'];
