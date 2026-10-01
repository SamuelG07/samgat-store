export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';

export interface PaymentProvider {
  name: string;
  
  createPayment(data: {
    orderId: number;
    amount: number;
    currency: string;
    metadata?: Record<string, any>;
  }): Promise<{
    providerRef: string;
    status: PaymentStatus;
    metadata?: Record<string, any>;
  }>;

  verifyWebhookSignature(payload: any, signature: string): boolean;

  handleWebhook(payload: any): Promise<{
    providerRef: string;
    status: PaymentStatus;
    metadata?: Record<string, any>;
  }>;
}

export interface PaymentResponse {
  paymentId: string;
  orderId: number;
  amount: number;
  currency: string;
  status: PaymentStatus;
  provider: string;
  providerRef: string;
  createdAt: string;
}
