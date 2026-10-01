import { useState } from 'react';
import { useOrders, useUpdateOrderStatus, useUpdatePaymentStatus } from '../../hooks/admin/useOrders';
import LoadingState from '../../components/admin/LoadingState';
import ErrorState from '../../components/admin/ErrorState';
import EmptyState from '../../components/admin/EmptyState';

const ORDER_STATUSES = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
const PAYMENT_STATUSES = ['PENDING', 'PAID', 'FAILED', 'REFUNDED'];

export default function AdminOrders() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');

  const { data, isLoading, isError, refetch } = useOrders({
    page,
    limit: 10,
    status: status || undefined,
    paymentStatus: paymentStatus || undefined,
  });

  const updateStatus = useUpdateOrderStatus();
  const updatePayment = useUpdatePaymentStatus();

  if (isLoading) return <LoadingState message="Carregando pedidos..." />;
  if (isError || !data) return <ErrorState onRetry={() => refetch()} />;

  const formatKz = (value: number) =>
    new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' }).format(value);

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('pt-AO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-samgat-black">Pedidos</h1>
        <p className="text-samgat-gray-light text-sm mt-1">{data.pagination.total} pedidos no total</p>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg border border-samgat-gray-lighter p-4 flex flex-wrap gap-3">
        <select
          value={status}
          onChange={(e) => { setStatus(e.target.value); setPage(1); }}
          className="px-4 py-2 border border-samgat-gray-lighter rounded-lg text-sm focus:outline-none focus:border-samgat-black"
        >
          <option value="">Todos os status</option>
          {ORDER_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>

        <select
          value={paymentStatus}
          onChange={(e) => { setPaymentStatus(e.target.value); setPage(1); }}
          className="px-4 py-2 border border-samgat-gray-lighter rounded-lg text-sm focus:outline-none focus:border-samgat-black"
        >
          <option value="">Todos os pagamentos</option>
          {PAYMENT_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {data.data.length === 0 ? (
        <EmptyState title="Nenhum pedido" message="Nenhum pedido encontrado." />
      ) : (
        <div className="bg-white rounded-lg border border-samgat-gray-lighter overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-samgat-off-white border-b border-samgat-gray-lighter">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-samgat-gray">Pedido</th>
                <th className="text-left px-4 py-3 font-medium text-samgat-gray">Cliente</th>
                <th className="text-left px-4 py-3 font-medium text-samgat-gray">Total</th>
                <th className="text-left px-4 py-3 font-medium text-samgat-gray">Data</th>
                <th className="text-left px-4 py-3 font-medium text-samgat-gray">Status</th>
                <th className="text-left px-4 py-3 font-medium text-samgat-gray">Pagamento</th>
              </tr>
            </thead>
            <tbody>
              {data.data.map((order) => (
                <tr key={order.id} className="border-b border-samgat-gray-lighter last:border-0">
                  <td className="px-4 py-3 font-medium text-samgat-black">#{order.id}</td>
                  <td className="px-4 py-3">
                    <p className="text-samgat-black">{order.user?.name}</p>
                    <p className="text-xs text-samgat-gray-light">{order.user?.email}</p>
                  </td>
                  <td className="px-4 py-3 font-medium text-samgat-black">{formatKz(order.total)}</td>
                  <td className="px-4 py-3 text-samgat-gray-light text-xs">{formatDate(order.createdAt)}</td>
                  <td className="px-4 py-3">
                    <select
                      value={order.status}
                      onChange={(e) => updateStatus.mutate({ id: order.id, status: e.target.value })}
                      disabled={updateStatus.isPending}
                      className="text-xs px-2 py-1 border border-samgat-gray-lighter rounded focus:outline-none focus:border-samgat-black disabled:opacity-50"
                    >
                      {ORDER_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={order.paymentStatus}
                      onChange={(e) => updatePayment.mutate({ id: order.id, paymentStatus: e.target.value })}
                      disabled={updatePayment.isPending}
                      className="text-xs px-2 py-1 border border-samgat-gray-lighter rounded focus:outline-none focus:border-samgat-black disabled:opacity-50"
                    >
                      {PAYMENT_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="px-4 py-3 border-t border-samgat-gray-lighter flex items-center justify-between text-sm">
            <p className="text-samgat-gray-light">Página {data.pagination.page} de {data.pagination.totalPages}</p>
            <div className="flex gap-2">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
                className="px-3 py-1 border border-samgat-gray-lighter rounded hover:bg-samgat-off-white disabled:opacity-50">
                Anterior
              </button>
              <button onClick={() => setPage((p) => Math.min(data.pagination.totalPages, p + 1))}
                disabled={page >= data.pagination.totalPages}
                className="px-3 py-1 border border-samgat-gray-lighter rounded hover:bg-samgat-off-white disabled:opacity-50">
                Próxima
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
