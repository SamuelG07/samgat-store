import { useQuery } from '@tanstack/react-query';
import { categoriesApi } from '../services/storeApi';

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => categoriesApi.list(),
  });
}
