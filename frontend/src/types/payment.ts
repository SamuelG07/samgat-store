export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';

export interface Payment {
  paymentId: string;
  orderId: number;
  amount: number;
  currency: string;
  status: PaymentStatus;
  provider: string;
  providerRef: string;
  createdAt: string;
}
