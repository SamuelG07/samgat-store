import { api } from './api';

export interface Payment {
  paymentId: string;
  orderId: number;
  amount: number;
  currency: string;
  status: string;
  provider: string;
  providerRef: string;
  transactionId?: string;
  proofUrl?: string | null;
  metadata?: any;
  createdAt: string;
}

interface SingleResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export const paymentApi = {
  async create(orderId: number, method: 'transfer' | 'multicaixa'): Promise<Payment> {
    const response = await api.post<SingleResponse<Payment>>('/payments/create', { orderId, method });
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

  async uploadProof(paymentId: number, file: File): Promise<Payment> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post<SingleResponse<Payment>>(
      `/payments/${paymentId}/proof`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );

    return response.data.data;
  },
};
