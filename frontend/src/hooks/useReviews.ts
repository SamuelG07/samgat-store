import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { reviewApi } from '../services/reviewApi';

export function useProductReviews(productId: number, page = 1, limit = 10) {
  return useQuery({
    queryKey: ['reviews', productId, page, limit],
    queryFn: () => reviewApi.getByProduct(productId, page, limit),
    enabled: !!productId,
  });
}

export function useCreateReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { productId: number; orderId: number; rating: number; comment?: string }) =>
      reviewApi.create(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['reviews', variables.productId] });
      toast.success('Review publicada!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erro ao publicar review');
    },
  });
}

export function useDeleteReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => reviewApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      toast.success('Review removida');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erro ao remover');
    },
  });
}
