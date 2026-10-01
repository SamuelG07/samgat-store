import { useQuery } from '@tanstack/react-query';
import { ordersApi } from '../services/storeApi';

export function useOrders(page: number = 1, limit: number = 10) {
  return useQuery({
    queryKey: ['orders', { page, limit }],
    queryFn: () => ordersApi.list({ page, limit }),
  });
}

export function useOrder(id: number) {
  return useQuery({
    queryKey: ['order', id],
    queryFn: () => ordersApi.getById(id),
    enabled: !!id,
  });
}
