import { useQuery } from '@tanstack/react-query';
import { adminApi } from '../../services/adminApi';

export function useDashboard() {
  return useQuery({
    queryKey: ['admin', 'dashboard'],
    queryFn: () => adminApi.getDashboard(),
    refetchInterval: 30000, // atualiza a cada 30s
  });
}
