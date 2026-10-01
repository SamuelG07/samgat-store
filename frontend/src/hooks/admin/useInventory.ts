import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { adminApi } from '../../services/adminApi';

interface InventoryFilters {
  page?: number;
  limit?: number;
  search?: string;
  lowStock?: boolean;
}

export function useInventory(filters: InventoryFilters = {}) {
  return useQuery({
    queryKey: ['admin', 'inventory', filters],
    queryFn: () => adminApi.getInventory(filters),
  });
}

export function useStockIn() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ productId, data }: { productId: number; data: { quantity: number; reason?: string } }) =>
      adminApi.stockIn(productId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'inventory'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'stock-movements'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] });
      toast.success('Entrada de stock registada');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erro ao registar entrada');
    },
  });
}

export function useStockAdjust() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ productId, data }: { productId: number; data: { quantity: number; reason: string } }) =>
      adminApi.stockAdjust(productId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'inventory'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'stock-movements'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] });
      toast.success('Ajuste registado');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erro ao registar ajuste');
    },
  });
}
