import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useOrders } from '../hooks/useOrders';
import Button from '../components/ui/Button';
import EmptyState from '../components/ui/EmptyState';
import Spinner from '../components/ui/Spinner';
import ErrorState from '../components/ui/ErrorState';
import Badge from '../components/ui/Badge';
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

export default function Orders() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, refetch } = useOrders(page, 10);

  if (isLoading) return <Spinner />;

  if (isError || !data) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <ErrorState onRetry={() => refetch()} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-samgat-black">Meus Pedidos</h1>
        <p className="text-samgat-gray-light mt-2">{data.pagination.total} pedidos</p>
      </div>

      {data.data.length === 0 ? (
        <EmptyState
          title="Ainda não tem pedidos"
          message="Comece a comprar para ver os seus pedidos aqui."
          action={
            <Link to="/produtos">
              <Button>Explorar Produtos</Button>
            </Link>
          }
        />
      ) : (
        <>
          <div className="space-y-3">
            {data.data.map((order: any) => (
              <Link
                key={order.id}
                to={`/pedidos/${order.id}`}
                className="block bg-white border border-samgat-gray-lighter rounded-lg p-5 hover:border-samgat-black transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <span className="font-bold text-samgat-black">Pedido #{order.id}</span>
                      <Badge variant={statusVariant[order.status] || 'default'}>
                        {statusLabels[order.status] || order.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-samgat-gray-light">
                      {formatDateTime(order.created_at)}
                    </p>
                    <p className="text-sm text-samgat-gray mt-2">
                      {order.order_items?.length || 0} item(s)
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-bold text-samgat-black text-lg">
                      {formatKz(Number(order.total))}
                    </p>
                    <p className="text-xs text-samgat-gray-light mt-1">Ver detalhes →</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {data.pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Anterior
              </Button>
              <span className="text-sm text-samgat-gray-light px-4">
                Página {data.pagination.page} de {data.pagination.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(data.pagination.totalPages, p + 1))}
                disabled={page >= data.pagination.totalPages}
              >
                Próxima
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
