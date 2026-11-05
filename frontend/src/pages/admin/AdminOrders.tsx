import { useState } from 'react';
import { Download, Eye, X } from 'lucide-react';
import { useOrders, useUpdateOrderStatus, useUpdatePaymentStatus } from '../../hooks/admin/useOrders';
import LoadingState from '../../components/admin/LoadingState';
import ErrorState from '../../components/admin/ErrorState';
import EmptyState from '../../components/admin/EmptyState';
import Button from '../../components/ui/Button';
import { formatKz, formatDateTime } from '../../utils/format';
import { exportToCsv } from '../../utils/exportCsv';

const ORDER_STATUSES = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
const PAYMENT_STATUSES = ['PENDING', 'PAID', 'FAILED', 'REFUNDED'];

const statusLabels: Record<string, string> = {
  PENDING: 'Pendente', CONFIRMED: 'Confirmado', PROCESSING: 'Processamento',
  SHIPPED: 'Enviado', DELIVERED: 'Entregue', CANCELLED: 'Cancelado',
};

export default function AdminOrders() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const { data, isLoading, isError, refetch } = useOrders({
    page, limit: 10, status: status || undefined, paymentStatus: paymentStatus || undefined,
  });

  const updateStatus = useUpdateOrderStatus();
  const updatePayment = useUpdatePaymentStatus();

  const handleExport = () => {
    if (!data) return;
    const rows = data.data.map((o: any) => ({
      ID: o.id, Cliente: o.user?.name || '', Email: o.user?.email || '',
      Total: o.total, Status: statusLabels[o.status] || o.status,
      Pagamento: o.paymentStatus, Data: new Date(o.createdAt).toLocaleDateString('pt-AO'),
    }));
    exportToCsv(`pedidos-${new Date().toISOString().split('T')[0]}.csv`, rows);
  };

  if (isLoading) return <LoadingState message="Carregando pedidos..." />;
  if (isError || !data) return <ErrorState onRetry={() => refetch()} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-samgat-black">Pedidos</h1>
          <p className="text-samgat-gray-light text-sm mt-1">{data.pagination.total} pedidos</p>
        </div>
        <Button variant="outline" onClick={handleExport} size="sm">
          <Download className="w-4 h-4 mr-1" /> Exportar CSV
        </Button>
      </div>

      <div className="bg-white rounded-lg border border-samgat-gray-lighter p-4 flex flex-col sm:flex-row gap-3">
        <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} className="px-4 py-2 border border-samgat-gray-lighter rounded-lg text-sm focus:outline-none focus:border-samgat-black">
          <option value="">Todos os status</option>
          {ORDER_STATUSES.map((s) => <option key={s} value={s}>{statusLabels[s]}</option>)}
        </select>
        <select value={paymentStatus} onChange={(e) => { setPaymentStatus(e.target.value); setPage(1); }} className="px-4 py-2 border border-samgat-gray-lighter rounded-lg text-sm focus:outline-none focus:border-samgat-black">
          <option value="">Todos os pagamentos</option>
          {PAYMENT_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {data.data.length === 0 ? (
        <EmptyState title="Nenhum pedido" message="Nenhum pedido encontrado." />
      ) : (
        <div className="bg-white rounded-lg border border-samgat-gray-lighter overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[800px]">
              <thead className="bg-samgat-off-white border-b border-samgat-gray-lighter">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-samgat-gray">Pedido</th>
                  <th className="text-left px-4 py-3 font-medium text-samgat-gray">Cliente</th>
                  <th className="text-left px-4 py-3 font-medium text-samgat-gray">Total</th>
                  <th className="text-left px-4 py-3 font-medium text-samgat-gray">Data</th>
                  <th className="text-left px-4 py-3 font-medium text-samgat-gray">Status</th>
                  <th className="text-left px-4 py-3 font-medium text-samgat-gray">Pagamento</th>
                  <th className="text-right px-4 py-3 font-medium text-samgat-gray">Ações</th>
                </tr>
              </thead>
              <tbody>
                {data.data.map((order: any) => (
                  <tr key={order.id} className="border-b border-samgat-gray-lighter last:border-0">
                    <td className="px-4 py-3 font-medium text-samgat-black">#{order.id}</td>
                    <td className="px-4 py-3">
                      <p className="text-samgat-black">{order.user?.name}</p>
                      <p className="text-xs text-samgat-gray-light">{order.user?.email}</p>
                    </td>
                    <td className="px-4 py-3 font-medium text-samgat-black">{formatKz(Number(order.total))}</td>
                    <td className="px-4 py-3 text-samgat-gray-light text-xs">{formatDateTime(order.createdAt)}</td>
                    <td className="px-4 py-3">
                      <select value={order.status} onChange={(e) => updateStatus.mutate({ id: order.id, status: e.target.value })} disabled={updateStatus.isPending} className="text-xs px-2 py-1 border border-samgat-gray-lighter rounded focus:outline-none focus:border-samgat-black">
                        {ORDER_STATUSES.map((s) => <option key={s} value={s}>{statusLabels[s]}</option>)}
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <select value={order.paymentStatus} onChange={(e) => updatePayment.mutate({ id: order.id, paymentStatus: e.target.value })} disabled={updatePayment.isPending} className="text-xs px-2 py-1 border border-samgat-gray-lighter rounded focus:outline-none focus:border-samgat-black">
                        {PAYMENT_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => setSelectedOrder(order)} className="p-1.5 text-samgat-black hover:bg-samgat-off-white rounded">
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 border-t border-samgat-gray-lighter flex items-center justify-between text-sm">
            <p className="text-samgat-gray-light">Página {data.pagination.page} de {data.pagination.totalPages}</p>
            <div className="flex gap-2">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1 border border-samgat-gray-lighter rounded hover:bg-samgat-off-white disabled:opacity-50">Anterior</button>
              <button onClick={() => setPage((p) => Math.min(data.pagination.totalPages, p + 1))} disabled={page >= data.pagination.totalPages} className="px-3 py-1 border border-samgat-gray-lighter rounded hover:bg-samgat-off-white disabled:opacity-50">Próxima</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal detalhes do pedido */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-samgat-black">Pedido #{selectedOrder.id}</h3>
              <button onClick={() => setSelectedOrder(null)} className="p-1 hover:bg-samgat-off-white rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3 text-sm">
              <div><span className="text-samgat-gray-light">Cliente:</span> <span className="font-medium">{selectedOrder.user?.name}</span></div>
              <div><span className="text-samgat-gray-light">Email:</span> {selectedOrder.user?.email}</div>
              <div><span className="text-samgat-gray-light">Data:</span> {formatDateTime(selectedOrder.createdAt)}</div>
              <div><span className="text-samgat-gray-light">Total:</span> <span className="font-bold">{formatKz(Number(selectedOrder.total))}</span></div>
              <div className="pt-3 border-t">
                <p className="font-medium mb-2">Itens:</p>
                {selectedOrder.items?.map((item: any) => (
                  <div key={item.id} className="flex justify-between py-1">
                    <span>{item.product?.name} × {item.quantity}</span>
                    <span className="font-medium">{formatKz(Number(item.price) * item.quantity)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
