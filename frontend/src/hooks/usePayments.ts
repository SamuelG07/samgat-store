import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { paymentApi } from '../services/paymentApi';
import { adminApi } from '../services/adminApi';

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
    mutationFn: ({ orderId, method }: { orderId: number; method: 'transfer' | 'multicaixa' }) =>
      paymentApi.create(orderId, method),
    onSuccess: (payment) => {
      queryClient.invalidateQueries({ queryKey: ['payments', 'order', payment.orderId] });
      queryClient.invalidateQueries({ queryKey: ['order', payment.orderId] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erro ao criar pagamento');
    },
  });
}

export function useUploadProof() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ paymentId, file }: { paymentId: number; file: File }) =>
      paymentApi.uploadProof(paymentId, file),
    onSuccess: (payment) => {
      queryClient.invalidateQueries({ queryKey: ['payments', 'order', payment.orderId] });
      toast.success('Comprovativo anexado');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erro ao enviar comprovativo');
    },
  });
}

// ===== ADMIN =====
export function usePendingPayments() {
  return useQuery({
    queryKey: ['admin', 'payments', 'pending'],
    queryFn: () => adminApi.getPendingPayments(),
  });
}

export function useConfirmPayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (paymentId: number) => adminApi.confirmPayment(paymentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'payments'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'orders'] });
      toast.success('Pagamento confirmado');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erro ao confirmar');
    },
  });
}
