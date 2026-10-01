import { api } from './api';
import { Payment } from '../types/payment';

interface SingleResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export const paymentApi = {
  async create(orderId: number): Promise<Payment> {
    const response = await api.post<SingleResponse<Payment>>('/payments/create', { orderId });
    return response.data.data;
  },

  async getById(paymentId: string): Promise<Payment> {
    const response = await api.get<SingleResponse<Payment>>(`/payments/${paymentId}`);
    return response.data.data;
  },

  async listByOrder(orderId: number): Promise<Payment[]> {
    const response = await api.get<SingleResponse<Payment[]>>(`/payments/order/${orderId}`);
    return response.data.data;
  },

  /**
   * Simula um webhook confirmando o pagamento.
   * ⚠️ Apenas em desenvolvimento!
   */
  async simulateWebhook(providerRef: string, status: 'PAID' | 'FAILED' | 'REFUNDED'): Promise<void> {
    await api.post('/payments/webhook/test', {
      providerRef,
      status,
    });
  },
};
