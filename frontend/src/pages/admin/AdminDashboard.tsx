import { useDashboard } from '../../hooks/admin/useDashboard';
import StatsCard from '../../components/admin/dashboard/StatsCard';
import RecentOrders from '../../components/admin/dashboard/RecentOrders';
import LowStockProducts from '../../components/admin/dashboard/LowStockProducts';
import LoadingState from '../../components/admin/LoadingState';
import ErrorState from '../../components/admin/ErrorState';
import { formatKz } from '../../utils/format';

export default function AdminDashboard() {
  const { data, isLoading, isError, refetch } = useDashboard();

  if (isLoading) return <LoadingState message="Carregando dashboard..." />;
  if (isError || !data) return <ErrorState onRetry={() => refetch()} />;

  const { metrics, recentOrders, lowStockProducts } = data;

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-samgat-black">Dashboard</h1>
        <p className="text-samgat-gray-light text-sm mt-1">
          Visão geral da sua loja
        </p>
      </div>

      {/* Cards de métricas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total de Produtos"
          value={metrics.products.total}
          subtitle={`${metrics.products.active} ativos · ${metrics.products.inactive} inativos`}
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          }
        />
        <StatsCard
          title="Pedidos"
          value={metrics.orders.total}
          subtitle={`${metrics.orders.pending} pendentes`}
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          }
        />
        <StatsCard
          title="Clientes"
          value={metrics.users.total}
          subtitle="Utilizadores registados"
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          }
        />
        <StatsCard
          title="Receita"
          value={formatKz(metrics.revenue.total)}
          subtitle="Pedidos não cancelados"
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
      </div>

      {/* Pedidos recentes */}
      <RecentOrders orders={recentOrders} />

      {/* Stock baixo */}
      <LowStockProducts
        products={lowStockProducts}
        threshold={metrics.inventory.threshold}
      />
    </div>
  );
}
