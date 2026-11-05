import { useQuery } from '@tanstack/react-query';
import { api } from '../../services/api';

export function useNotifications() {
  return useQuery({
    queryKey: ['admin', 'notifications'],
    queryFn: async () => {
      const res = await api.get('/admin/notifications');
      return res.data.data;
    },
    refetchInterval: 30000,
  });
}
