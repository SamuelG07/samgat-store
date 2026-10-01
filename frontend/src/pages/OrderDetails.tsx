import { useParams, Link } from 'react-router-dom';
import { useOrder } from '../hooks/useOrders';
import Spinner from '../components/ui/Spinner';
import ErrorState from '../components/ui/ErrorState';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import { formatKz, formatDateTime } from '../utils/format';

const statusVariant: Record<string, 'default' | 'success' | 'warning' | 'danger' | 'dark'> = {
  PENDING: 'warning',
  CONFIRMED: 'default',
  PROCESSING: 'default',
  SHIPPED: 'dark',
  DELIVERED: 'success',
  CANCELLED: 'danger',
};

const statusLabels: Record<string, string> = {
  PENDING: 'Pendente',
  CONFIRMED: 'Confirmado',
  PROCESSING: 'Em processamento',
  SHIPPED: 'Enviado',
  DELIVERED: 'Entregue',
  CANCELLED: 'Cancelado',
};

const paymentLabels: Record<string, string> = {
  PENDING: 'Pagamento pendente',
  PAID: 'Pago',
  FAILED: 'Pagamento falhou',
  REFUNDED: 'Reembolsado',
};

export default function OrderDetails() {
  const { id } = useParams();
  const orderId = Number(id);
  const { data: order, isLoading, isError, refetch } = useOrder(orderId);

  if (isLoading) return <Spinner />;

  if (isError || !order) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <ErrorState message="Pedido não encontrado" onRetry={() => refetch()} />
      </div>
    );
  }

  const needsPayment = order.payment_status === 'PENDING' || order.payment_status === 'FAILED';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <nav className="text-sm text-samgat-gray-light mb-6">
        <Link to="/pedidos" className="hover:text-samgat-black">Meus Pedidos</Link>
        <span className="mx-2">/</span>
        <span className="text-samgat-black">Pedido #{order.id}</span>
      </nav>

      <div className="bg-white border border-samgat-gray-lighter rounded-lg p-6 mb-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-samgat-black mb-2">
              Pedido #{order.id}
            </h1>
            <p className="text-sm text-samgat-gray-light">
              Realizado a {formatDateTime(order.created_at)}
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Badge variant={statusVariant[order.status] || 'default'}>
              {statusLabels[order.status] || order.status}
            </Badge>
            <span className="text-xs text-samgat-gray-light">
              {paymentLabels[order.payment_status] || order.payment_status}
            </span>
          </div>
        </div>

        {/* Botão de pagar */}
        {needsPayment && (
          <div className="mt-6 pt-6 border-t border-samgat-gray-lighter">
            <Link to={`/checkout/pagamento/${order.id}`}>
              <Button className="w-full sm:w-auto">
                {order.payment_status === 'FAILED' ? 'Tentar Pagamento Novamente' : 'Pagar Agora'}
              </Button>
            </Link>
          </div>
        )}
      </div>

      <div className="bg-white border border-samgat-gray-lighter rounded-lg overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-samgat-gray-lighter">
          <h2 className="font-semibold text-samgat-black">Itens do Pedido</h2>
        </div>

        <div className="divide-y divide-samgat-gray-lighter">
          {order.order_items?.map((item: any) => {
            const product = item.products || item.product;
            return (
              <div key={item.id} className="p-6 flex items-center gap-4">
                <div className="w-16 h-16 bg-samgat-off-white rounded-lg overflow-hidden flex-shrink-0">
                  {product?.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-samgat-gray-light">
                      —
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <Link
                    to={`/produtos/${item.product_id}`}
                    className="font-medium text-samgat-black hover:underline"
                  >
                    {product?.name || 'Produto'}
                  </Link>
                  <p className="text-sm text-samgat-gray-light mt-1">
                    {item.quantity} × {formatKz(Number(item.price))}
                  </p>
                </div>

                <div className="text-right flex-shrink-0">
                  <p className="font-bold text-samgat-black">
                    {formatKz(Number(item.price) * item.quantity)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-samgat-black text-white rounded-lg p-6">
        <div className="flex items-center justify-between">
          <span className="text-sm uppercase tracking-wider text-samgat-gray-lighter">
            Total do Pedido
          </span>
          <span className="text-2xl font-bold">
            {formatKz(Number(order.total))}
          </span>
        </div>
      </div>

      <div className="mt-6 text-center">
        <Link to="/produtos">
          <Button variant="outline">Continuar a Comprar</Button>
        </Link>
      </div>
    </div>
  );
}
