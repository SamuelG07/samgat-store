import { Link } from 'react-router-dom';
import { formatKz, formatDateTime } from '../../../utils/format';

interface RecentOrdersProps {
  orders: any[];
}

const statusLabels: Record<string, string> = {
  PENDING: 'Pendente',
  CONFIRMED: 'Confirmado',
  PROCESSING: 'Processamento',
  SHIPPED: 'Enviado',
  DELIVERED: 'Entregue',
  CANCELLED: 'Cancelado',
};

export default function RecentOrders({ orders }: RecentOrdersProps) {
  return (
    <div className="bg-white border border-samgat-gray-lighter rounded-lg overflow-hidden">
      <div className="px-4 sm:px-6 py-4 border-b border-samgat-gray-lighter flex items-center justify-between">
        <h2 className="text-base sm:text-lg font-semibold text-samgat-black">
          Pedidos recentes
        </h2>
        <Link
          to="/admin/orders"
          className="text-xs sm:text-sm text-samgat-gray-light hover:text-samgat-black transition-colors"
        >
          Ver todos →
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="p-8 text-center text-sm text-samgat-gray-light">
          Nenhum pedido ainda.
        </div>
      ) : (
        <>
          {/* Desktop: tabela */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-samgat-off-white border-b border-samgat-gray-lighter">
                <tr>
                  <th className="text-left px-6 py-3 font-medium text-samgat-gray">ID</th>
                  <th className="text-left px-6 py-3 font-medium text-samgat-gray">Cliente</th>
                  <th className="text-left px-6 py-3 font-medium text-samgat-gray">Data</th>
                  <th className="text-left px-6 py-3 font-medium text-samgat-gray">Total</th>
                  <th className="text-left px-6 py-3 font-medium text-samgat-gray">Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b border-samgat-gray-lighter last:border-0">
                    <td className="px-6 py-4 text-samgat-gray-light">#{order.id}</td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-samgat-black truncate max-w-[200px]">
                        {order.users?.name || 'Sem nome'}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-samgat-gray-light text-xs">
                      {formatDateTime(order.created_at)}
                    </td>
                    <td className="px-6 py-4 font-medium text-samgat-black">
                      {formatKz(Number(order.total))}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-block px-2 py-1 text-xs bg-samgat-gray-lighter text-samgat-gray rounded">
                        {statusLabels[order.status] || order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile: cards */}
          <div className="md:hidden divide-y divide-samgat-gray-lighter">
            {orders.map((order) => (
              <div key={order.id} className="p-4 space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-semibold text-samgat-black">
                    #{order.id}
                  </span>
                  <span className="text-xs bg-samgat-gray-lighter text-samgat-gray px-2 py-1 rounded">
                    {statusLabels[order.status] || order.status}
                  </span>
                </div>
                <p className="text-sm text-samgat-black truncate">
                  {order.users?.name || 'Sem nome'}
                </p>
                <div className="flex items-center justify-between text-xs text-samgat-gray-light">
                  <span>{formatDateTime(order.created_at)}</span>
                  <span className="font-semibold text-samgat-black">
                    {formatKz(Number(order.total))}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
