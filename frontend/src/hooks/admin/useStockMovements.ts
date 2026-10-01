import { useQuery } from '@tanstack/react-query';
import { adminApi } from '../../services/adminApi';

interface MovementFilters {
  page?: number;
  limit?: number;
  productId?: number;
  type?: 'IN' | 'OUT' | 'ADJUSTMENT';
  sort?: string;
}

export function useStockMovements(filters: MovementFilters = {}) {
  return useQuery({
    queryKey: ['admin', 'stock-movements', filters],
    queryFn: () => adminApi.getStockMovements(filters),
  });
}
