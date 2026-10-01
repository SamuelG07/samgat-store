import { useQuery } from '@tanstack/react-query';
import { adminApi } from '../../services/adminApi';

interface UserFilters {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
}

export function useUsers(filters: UserFilters = {}) {
  return useQuery({
    queryKey: ['admin', 'users', filters],
    queryFn: () => adminApi.getUsers(filters),
  });
}
