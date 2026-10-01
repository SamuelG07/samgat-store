import { useQuery } from '@tanstack/react-query';
import { productsApi } from '../services/storeApi';

interface ProductFilters {
  page?: number;
  limit?: number;
  search?: string;
  category?: number;
  sort?: string;
}

export function useProducts(filters: ProductFilters = {}) {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: () => productsApi.list(filters),
  });
}

export function useProduct(id: number) {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => productsApi.getById(id),
    enabled: !!id,
  });
}
