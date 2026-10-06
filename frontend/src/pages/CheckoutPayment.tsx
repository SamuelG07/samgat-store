import { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useOrder } from '../hooks/useOrders';
import { useCreatePayment, usePaymentsByOrder, useUploadProof } from '../hooks/usePayments';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Spinner from '../components/ui/Spinner';
import ErrorState from '../components/ui/ErrorState';
import PaymentMethodSelector from '../components/payment/PaymentMethodSelector';
import PaymentInstructions from '../components/payment/PaymentInstructions';
import { formatKz } from '../utils/format';

export default function CheckoutPayment() {
  const { orderId } = useParams();
  const id = Number(orderId);

  const { data: order, isLoading: loadingOrder, isError, refetch } = useOrder(id);
  const { data: payments, isLoading: loadingPayments } = usePaymentsByOrder(id);
  const createPayment = useCreatePayment();
  const uploadProof = useUploadProof();

  const [method, setMethod] = useState<'transfer' | 'multicaixa'>('transfer');
  const hasRequestedPayment = useRef(false);

  const currentPayment =
    payments?.find((p) => p.status === 'PENDING') || payments?.[0];

  const reference = currentPayment?.metadata?.reference as string | undefined;

  // Criar pagamento apenas quando necessário
  useEffect(() => {
    if (
      order &&
      !loadingPayments &&
      (!payments || payments.length === 0) &&
      order.payment_status !== 'PAID' &&
      !hasRequestedPayment.current &&
      !createPayment.isPending
    ) {
      hasRequestedPayment.current = true;
      createPayment.mutate({ orderId: id, method });
    }
  }, [order, payments, loadingPayments, id, createPayment, method]);

  const handleFileSelect = (file: File) => {
    if (!currentPayment) {
      toast.error('Aguarda enquanto criamos o pagamento...');
      return;
    }
    uploadProof.mutate({ paymentId: Number(currentPayment.paymentId), file });
  };

  if (loadingOrder || loadingPayments) return <Spinner />;

  if (isError || !order) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <ErrorState message="Pedido não encontrado" onRetry={() => refetch()} />
      </div>
    );
  }

  const total = Number(order.total);
  const itemsCount = order.order_items?.length || 0;
  const isPaid = currentPayment?.status === 'PAID';

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <nav className="text-sm text-samgat-gray-light mb-6">
        <Link to="/pedidos" className="hover:text-samgat-black">Meus Pedidos</Link>
        <span className="mx-2">/</span>
        <Link to={`/pedidos/${id}`} className="hover:text-samgat-black">Pedido #{id}</Link>
        <span className="mx-2">/</span>
        <span className="text-samgat-black">Pagamento</span>
      </nav>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-samgat-black">Pagamento</h1>
        <p className="text-samgat-gray-light mt-1 text-sm">
          Escolhe o método e conclui o teu pedido
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {!isPaid && (
            <div className="bg-white border border-samgat-gray-lighter rounded-lg p-6">
              <h2 className="text-lg font-semibold text-samgat-black mb-4">Método de pagamento</h2>
              <PaymentMethodSelector
                value={method}
                onChange={(m) => setMethod(m as 'transfer' | 'multicaixa')}
                disabled={!!currentPayment?.proofUrl}
              />
            </div>
          )}

          {isPaid ? (
            <div className="bg-white border border-samgat-gray-lighter rounded-lg p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-samgat-black text-white flex items-center justify-center mx-auto mb-4 text-2xl">
                ✓
              </div>
              <h2 className="text-xl font-bold text-samgat-black mb-2">Pagamento confirmado</h2>
              <p className="text-sm text-samgat-gray-light mb-6">
                O teu pedido foi confirmado com sucesso.
              </p>
              <Link to={`/pedidos/${id}`}>
                <Button>Ver Pedido</Button>
              </Link>
            </div>
          ) : (
            <>
              {currentPayment?.proofUrl ? (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-5 text-center">
                  <p className="text-sm font-medium text-yellow-800 mb-2">
                    ⏳ Aguarda confirmação
                  </p>
                  <p className="text-xs text-yellow-700">
                    Recebemos o teu comprovativo. Vamos verificar e confirmar em breve.
                  </p>
                </div>
              ) : (
                <PaymentInstructions
                  method={method}
                  orderId={id}
                  total={total}
                  formatKz={formatKz}
                  reference={reference}
                  onFileSelect={handleFileSelect}
                  isUploading={uploadProof.isPending}
                  uploadedUrl={currentPayment?.proofUrl}
                />
              )}
            </>
          )}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white border border-samgat-gray-lighter rounded-lg p-6 lg:sticky lg:top-24">
            <h2 className="text-lg font-semibold text-samgat-black mb-4">Resumo do Pedido</h2>

            <div className="space-y-3 mb-6 text-sm">
              <div className="flex justify-between text-samgat-gray">
                <span>Itens</span>
                <span>{itemsCount}</span>
              </div>
              <div className="flex justify-between text-samgat-gray">
                <span>Subtotal</span>
                <span>{formatKz(total)}</span>
              </div>
              <div className="flex justify-between text-samgat-gray">
                <span>Envio</span>
                <span className="text-samgat-black">Grátis</span>
              </div>
              <div className="border-t border-samgat-gray-lighter pt-3 flex justify-between font-bold text-samgat-black text-base">
                <span>Total</span>
                <span>{formatKz(total)}</span>
              </div>
            </div>

            {currentPayment && (
              <div className="mb-4">
                <p className="text-xs text-samgat-gray-light uppercase mb-1">Estado</p>
                <Badge variant={currentPayment.status === 'PAID' ? 'success' : currentPayment.status === 'FAILED' ? 'danger' : 'warning'}>
                  {currentPayment.status === 'PAID' ? 'Pago' : currentPayment.status === 'FAILED' ? 'Falhou' : 'Pendente'}
                </Badge>
              </div>
            )}

            <div className="pt-4 border-t border-samgat-gray-lighter flex items-center gap-2 text-xs text-samgat-gray-light">
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span>Pagamento seguro</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
