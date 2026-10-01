import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useOrder } from '../hooks/useOrders';
import { useCreatePayment, usePaymentsByOrder, useSimulateWebhook } from '../hooks/usePayments';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Spinner from '../components/ui/Spinner';
import ErrorState from '../components/ui/ErrorState';
import PaymentMethodSelector from '../components/payment/PaymentMethodSelector';
import PaymentTimer from '../components/payment/PaymentTimer';
import PaymentProcessing from '../components/payment/PaymentProcessing';
import PaymentSuccess from '../components/payment/PaymentSuccess';
import PaymentFailure from '../components/payment/PaymentFailure';
import { formatKz } from '../utils/format';

type PageState = 'idle' | 'processing' | 'success' | 'failure' | 'expired';

const paymentLabels: Record<string, string> = {
  PENDING: 'Pendente',
  PAID: 'Pago',
  FAILED: 'Falhou',
  REFUNDED: 'Reembolsado',
};

const paymentVariant: Record<string, 'default' | 'success' | 'warning' | 'danger' | 'dark'> = {
  PENDING: 'warning',
  PAID: 'success',
  FAILED: 'danger',
  REFUNDED: 'default',
};

export default function CheckoutPayment() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const id = Number(orderId);

  const { data: order, isLoading: loadingOrder, isError, refetch } = useOrder(id);
  const { data: payments, isLoading: loadingPayments } = usePaymentsByOrder(id);
  const createPayment = useCreatePayment();
  const simulateWebhook = useSimulateWebhook();

  const [selectedMethod, setSelectedMethod] = useState('card');
  const [pageState, setPageState] = useState<PageState>('idle');

  // Guarda contra duplicação (React StrictMode + race condition)
  const hasRequestedPayment = useRef(false);

  const currentPayment =
    payments?.find((p) => p.status === 'PENDING') || payments?.[0];

  // Criar pagamento automaticamente APENAS UMA VEZ
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
      createPayment.mutate(id);
    }
  }, [order, payments, loadingPayments, id, createPayment]);

  // Sincronizar estado da página com estado do pagamento
  useEffect(() => {
    if (currentPayment) {
      if (currentPayment.status === 'PAID') setPageState('success');
      else if (currentPayment.status === 'FAILED') setPageState('failure');
      else setPageState('idle');
    }
  }, [currentPayment]);

  const handleExpire = useCallback(() => {
    setPageState('expired');
  }, []);

  const handlePay = async () => {
    if (!currentPayment) return;
    setPageState('processing');

    setTimeout(async () => {
      try {
        await simulateWebhook.mutateAsync({
          providerRef: currentPayment.providerRef,
          status: 'PAID',
        });
        setPageState('success');
      } catch {
        setPageState('failure');
      }
    }, 1500);
  };

  const handleRetry = async () => {
    if (!currentPayment) return;
    setPageState('processing');

    setTimeout(async () => {
      try {
        await simulateWebhook.mutateAsync({
          providerRef: currentPayment.providerRef,
          status: 'PAID',
        });
        setPageState('success');
      } catch {
        setPageState('failure');
      }
    }, 1500);
  };

  const handleSimulateFailure = async () => {
    if (!currentPayment) return;
    setPageState('processing');

    setTimeout(async () => {
      try {
        await simulateWebhook.mutateAsync({
          providerRef: currentPayment.providerRef,
          status: 'FAILED',
        });
        setPageState('failure');
      } catch {
        setPageState('failure');
      }
    }, 1200);
  };

  if (loadingOrder || loadingPayments) return <Spinner />;

  if (isError || !order) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <ErrorState message="Pedido não encontrado" onRetry={() => refetch()} />
      </div>
    );
  }

  if (pageState === 'processing') {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <PaymentProcessing />
      </div>
    );
  }

  if (pageState === 'success') {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <PaymentSuccess orderId={order.id} total={Number(order.total)} formatKz={formatKz} />
      </div>
    );
  }

  if (pageState === 'failure') {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <PaymentFailure onRetry={handleRetry} isLoading={simulateWebhook.isPending} />
      </div>
    );
  }

  if (pageState === 'expired') {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4 text-center">
        <div>
          <div className="w-20 h-20 rounded-full bg-yellow-50 border-2 border-yellow-200 flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">⏱️</span>
          </div>
          <h2 className="text-2xl font-bold text-samgat-black mb-2">Tempo expirado</h2>
          <p className="text-sm text-samgat-gray-light mb-8">
            O tempo para completar o pagamento expirou.
          </p>
          <Button
            onClick={() => {
              hasRequestedPayment.current = false;
              createPayment.mutate(id);
            }}
            isLoading={createPayment.isPending}
          >
            Tentar Novamente
          </Button>
        </div>
      </div>
    );
  }

  const itemsCount = order.order_items?.length || 0;
  const total = Number(order.total);

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
          Escolhe o método e conclui o teu pedido em segurança
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {currentPayment?.status === 'PENDING' && (
            <PaymentTimer expiresInMinutes={15} onExpire={handleExpire} />
          )}

          <div className="bg-white border border-samgat-gray-lighter rounded-lg p-6">
            <h2 className="text-lg font-semibold text-samgat-black mb-4">
              Método de pagamento
            </h2>
            <PaymentMethodSelector
              value={selectedMethod}
              onChange={setSelectedMethod}
              disabled={currentPayment?.status !== 'PENDING'}
            />
          </div>

          {currentPayment && (
            <div className="bg-white border border-samgat-gray-lighter rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-samgat-black">Detalhes</h2>
                <Badge variant={paymentVariant[currentPayment.status] || 'default'}>
                  {paymentLabels[currentPayment.status] || currentPayment.status}
                </Badge>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-samgat-gray-light">Referência</span>
                  <span className="text-samgat-black font-mono text-xs">
                    {currentPayment.providerRef}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-samgat-gray-light">Método</span>
                  <span className="text-samgat-black capitalize">{currentPayment.provider}</span>
                </div>
              </div>
            </div>
          )}

          {currentPayment?.status === 'PENDING' && (
            <div className="bg-samgat-off-white border border-samgat-gray-lighter rounded-lg p-4">
              <p className="text-xs text-samgat-gray-light mb-3">
                💡 <strong>Modo teste:</strong> escolhe o que queres simular
              </p>
              <div className="flex gap-2">
                <Button onClick={handlePay} isLoading={simulateWebhook.isPending} className="flex-1">
                  Pagar Agora
                </Button>
                <Button
                  variant="outline"
                  onClick={handleSimulateFailure}
                  disabled={simulateWebhook.isPending}
                >
                  Simular Falha
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white border border-samgat-gray-lighter rounded-lg p-6 sticky top-24">
            <h2 className="text-lg font-semibold text-samgat-black mb-4">
              Resumo do Pedido
            </h2>

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

            {currentPayment?.status === 'PENDING' && (
              <Button onClick={handlePay} size="lg" className="w-full" isLoading={simulateWebhook.isPending}>
                Pagar {formatKz(total)}
              </Button>
            )}

            {currentPayment?.status === 'PAID' && (
              <Link to={`/pedidos/${id}`}>
                <Button size="lg" className="w-full">
                  Ver Pedido
                </Button>
              </Link>
            )}

            {currentPayment?.status === 'FAILED' && (
              <Button size="lg" className="w-full" onClick={handleRetry} isLoading={simulateWebhook.isPending}>
                Tentar Novamente
              </Button>
            )}

            <div className="mt-6 pt-6 border-t border-samgat-gray-lighter flex items-center gap-2 text-xs text-samgat-gray-light">
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span>Pagamento encriptado e seguro</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
