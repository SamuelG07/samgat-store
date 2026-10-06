import { useState } from 'react';
import { DollarSign, ShoppingCart, Users, Package, Receipt, FileText } from 'lucide-react';
import { useDashboard } from '../../hooks/admin/useDashboard';
import DashboardHeader, { DateRange } from '../../components/admin/dashboard/DashboardHeader';
import StatCard from '../../components/admin/dashboard/StatCard';
import StockOverview from '../../components/admin/dashboard/StockOverview';
import LowStockProducts from '../../components/admin/dashboard/LowStockProducts';
import RecentOrders from '../../components/admin/dashboard/RecentOrders';
import LoadingState from '../../components/admin/LoadingState';
import ErrorState from '../../components/admin/ErrorState';
import { formatKz } from '../../utils/format';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const [dateRange, setDateRange] = useState<DateRange>(() => {
    const today = new Date();
    const from = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
    return { from, to: today };
  });

  const { data, isLoading, isError, refetch } = useDashboard();

  if (isLoading) return <LoadingState message="Carregando dashboard..." />;
  if (isError || !data) return <ErrorState onRetry={() => refetch()} />;

  const { metrics, recentOrders, lowStockProducts } = data;

  return (
    <div className="space-y-6">
      <DashboardHeader dateRange={dateRange} onDateRangeChange={setDateRange} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        <StatCard title="Receita total" value={formatKz(metrics.revenue.total)} change={metrics.revenue.change} icon={<DollarSign className="w-5 h-5" />} />
        <StatCard title="Pedidos" value={metrics.orders.total} change={metrics.ordersStats?.change} icon={<ShoppingCart className="w-5 h-5" />} />
        <StatCard title="Clientes" value={metrics.users.total} subtitle={`${metrics.users.newLast30 || 0} novos este mês`} icon={<Users className="w-5 h-5" />} />
        <StatCard title="Produtos vendidos" value={metrics.productsSold?.total || 0} icon={<Package className="w-5 h-5" />} />
        <StatCard title="Ticket médio" value={formatKz(metrics.averageTicket || 0)} icon={<Receipt className="w-5 h-5" />} />
      </div>

      <StockOverview
        totalProducts={metrics.products.total}
        activeProducts={metrics.products.active}
        lowStock={metrics.inventory.lowStock}
        threshold={metrics.inventory.threshold}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <LowStockProducts products={lowStockProducts} threshold={metrics.inventory.threshold} />

        <div className="bg-white border border-samgat-gray-lighter rounded-lg p-5">
          <h2 className="text-base sm:text-lg font-semibold text-samgat-black mb-4">Relatórios</h2>
          <div className="space-y-2">
            {[
              { label: 'Relatório de vendas', href: '/admin/orders' },
              { label: 'Relatório de produtos', href: '/admin/products' },
              { label: 'Relatório de stock', href: '/admin/inventory' },
              { label: 'Relatório de clientes', href: '/admin/customers' },
              { label: 'Relatório de pedidos', href: '/admin/orders' },
            ].map((r, i) => (
              <Link key={i} to={r.href} className="flex items-center gap-3 p-3 border border-samgat-gray-lighter rounded-lg hover:border-samgat-black transition-colors group">
                <FileText className="w-4 h-4 text-samgat-gray-light group-hover:text-samgat-black transition-colors" />
                <span className="text-sm text-samgat-black group-hover:font-medium transition-all">{r.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <RecentOrders orders={recentOrders} />
    </div>
  );
}
