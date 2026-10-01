import { useDashboard } from '../../hooks/admin/useDashboard';
import StatCard from '../../components/admin/StatCard';
import LoadingState from '../../components/admin/LoadingState';
import ErrorState from '../../components/admin/ErrorState';
import EmptyState from '../../components/admin/EmptyState';

export default function AdminDashboard() {
  const { data, isLoading, isError, refetch } = useDashboard();

  if (isLoading) return <LoadingState message="Carregando dashboard..." />;
  if (isError || !data) return <ErrorState onRetry={() => refetch()} />;

  const { metrics, recentOrders, lowStockProducts } = data;

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
    <div className="space-y-8">
      {/* Título */}
      <div>
        <h1 className="text-2xl font-bold text-samgat-black">Dashboard</h1>
        <p className="text-samgat-gray-light text-sm mt-1">
          Visão geral da sua loja
        </p>
      </div>

      {/* Cards de Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Receita Total"
          value={formatKz(metrics.revenue.total)}
          subtitle="Pedidos não cancelados"
          highlight
        />
        <StatCard
          title="Produtos"
          value={metrics.products.total}
          subtitle={`${metrics.products.active} ativos · ${metrics.products.inactive} inativos`}
        />
        <StatCard
          title="Pedidos"
          value={metrics.orders.total}
          subtitle={`${metrics.orders.pending} pendentes`}
        />
        <StatCard
          title="Stock Baixo"
          value={metrics.inventory.lowStock}
          subtitle={`Abaixo de ${metrics.inventory.threshold} unidades`}
        />
      </div>

      {/* Segunda linha de métricas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="Usuários" value={metrics.users.total} />
        <StatCard title="Categorias" value={metrics.categories.total} />
        <StatCard
          title="Entregues"
          value={metrics.orders.delivered}
          subtitle={`${metrics.orders.cancelled} cancelados`}
        />
      </div>

      {/* Duas colunas: Pedidos Recentes + Stock Baixo */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pedidos Recentes */}
        <div className="bg-white rounded-lg border border-samgat-gray-lighter p-6">
          <h3 className="text-lg font-semibold text-samgat-black mb-4">
            Pedidos Recentes
          </h3>

          {recentOrders.length === 0 ? (
            <EmptyState title="Sem pedidos" message="Nenhum pedido registrado ainda." />
          ) : (
            <div className="space-y-3">
              {recentOrders.map((order: any) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between border-b border-samgat-gray-lighter pb-3 last:border-0"
                >
                  <div>
                    <p className="text-sm font-medium text-samgat-black">
                      #{order.id} — {order.users?.name || 'Sem nome'}
                    </p>
                    <p className="text-xs text-samgat-gray-light mt-1">
                      {formatDate(order.created_at)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-samgat-black">
                      {formatKz(Number(order.total))}
                    </p>
                    <p className="text-xs text-samgat-gray-light mt-1">
                      {order.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Stock Baixo */}
        <div className="bg-white rounded-lg border border-samgat-gray-lighter p-6">
          <h3 className="text-lg font-semibold text-samgat-black mb-4">
            Produtos com Stock Baixo
          </h3>

          {lowStockProducts.length === 0 ? (
            <EmptyState
              title="Tudo em ordem"
              message="Nenhum produto com stock baixo."
            />
          ) : (
            <div className="space-y-3">
              {lowStockProducts.map((item: any) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between border-b border-samgat-gray-lighter pb-3 last:border-0"
                >
                  <div>
                    <p className="text-sm font-medium text-samgat-black">
                      {item.products?.name}
                    </p>
                    <p className="text-xs text-samgat-gray-light mt-1">
                      {item.products?.is_active ? 'Ativo' : 'Inativo'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-red-600">
                      {item.quantity} un.
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
