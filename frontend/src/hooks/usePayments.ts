import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { paymentApi } from '../services/paymentApi';

export function usePayment(paymentId: string | undefined) {
  return useQuery({
    queryKey: ['payment', paymentId],
    queryFn: () => paymentApi.getById(paymentId!),
    enabled: !!paymentId,
  });
}

export function usePaymentsByOrder(orderId: number | undefined) {
  return useQuery({
    queryKey: ['payments', 'order', orderId],
    queryFn: () => paymentApi.listByOrder(orderId!),
    enabled: !!orderId,
  });
}

export function useCreatePayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (orderId: number) => paymentApi.create(orderId),
    onSuccess: (payment) => {
      queryClient.invalidateQueries({ queryKey: ['payments', 'order', payment.orderId] });
      queryClient.invalidateQueries({ queryKey: ['order', payment.orderId] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erro ao criar pagamento');
    },
  });
}

export function useSimulateWebhook() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ providerRef, status }: { providerRef: string; status: 'PAID' | 'FAILED' | 'REFUNDED' }) =>
      paymentApi.simulateWebhook(providerRef, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['order'] });
      toast.success('Webhook simulado');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erro ao simular webhook');
    },
  });
}
