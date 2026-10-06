import { useState } from 'react';
import { DollarSign, ShoppingCart, Users, Package, Receipt, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useDashboard } from '../../hooks/admin/useDashboard';
import {
  useSalesOverTime,
  useTopProducts,
  useSalesByCategory,
  useCustomerGrowth,
  useCustomerStats,
} from '../../hooks/admin/useAnalytics';
import DashboardHeader, { DateRange } from '../../components/admin/dashboard/DashboardHeader';
import StatCard from '../../components/admin/dashboard/StatCard';
import StockOverview from '../../components/admin/dashboard/StockOverview';
import LowStockProducts from '../../components/admin/dashboard/LowStockProducts';
import RecentOrders from '../../components/admin/dashboard/RecentOrders';
import SalesChart from '../../components/admin/dashboard/SalesChart';
import TopProducts from '../../components/admin/dashboard/TopProducts';
import CategorySales from '../../components/admin/dashboard/CategorySales';
import CustomerChart from '../../components/admin/dashboard/CustomerChart';
import LoadingState from '../../components/admin/LoadingState';
import ErrorState from '../../components/admin/ErrorState';
import { formatKz } from '../../utils/format';

export default function AdminDashboard() {
  const [dateRange, setDateRange] = useState<DateRange>(() => {
    const today = new Date();
    const from = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
    return { from, to: today };
  });

  const { data, isLoading, isError, refetch } = useDashboard();

  const fromDate = dateRange.from || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const toDate = dateRange.to || new Date();

  const salesQuery = useSalesOverTime(fromDate, toDate);
  const topProductsQuery = useTopProducts(5);
  const categoriesQuery = useSalesByCategory();
  const customerGrowthQuery = useCustomerGrowth(fromDate, toDate);
  const customerStatsQuery = useCustomerStats();

  if (isLoading) return <LoadingState message="Carregando dashboard..." />;
  if (isError || !data) return <ErrorState onRetry={() => refetch()} />;

  const { metrics, recentOrders, lowStockProducts } = data;

  return (
    <div className="space-y-6">
      <DashboardHeader dateRange={dateRange} onDateRangeChange={setDateRange} />

      {/* Cards de métricas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        <StatCard title="Receita total" value={formatKz(metrics.revenue.total)} change={metrics.revenue.change} icon={<DollarSign className="w-5 h-5" />} />
        <StatCard title="Pedidos" value={metrics.orders.total} change={metrics.ordersStats?.change} icon={<ShoppingCart className="w-5 h-5" />} />
        <StatCard title="Clientes" value={metrics.users.total} subtitle={`${metrics.users.newLast30 || 0} novos este mês`} icon={<Users className="w-5 h-5" />} />
        <StatCard title="Produtos vendidos" value={metrics.productsSold?.total || 0} icon={<Package className="w-5 h-5" />} />
        <StatCard title="Ticket médio" value={formatKz(metrics.averageTicket || 0)} icon={<Receipt className="w-5 h-5" />} />
      </div>

      {/* Gráfico de vendas */}
      <SalesChart data={salesQuery.data || []} isLoading={salesQuery.isLoading} />

      {/* Grid: Top produtos + Categorias */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <TopProducts products={topProductsQuery.data || []} isLoading={topProductsQuery.isLoading} />
        <CategorySales categories={categoriesQuery.data || []} isLoading={categoriesQuery.isLoading} />
      </div>

      {/* Grid: Clientes + Stock */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <CustomerChart
          growth={customerGrowthQuery.data || []}
          stats={customerStatsQuery.data}
          isLoading={customerGrowthQuery.isLoading || customerStatsQuery.isLoading}
        />
        <StockOverview
          totalProducts={metrics.products.total}
          activeProducts={metrics.products.active}
          lowStock={metrics.inventory.lowStock}
          threshold={metrics.inventory.threshold}
        />
      </div>

      {/* Grid: Stock baixo + Relatórios */}
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

      {/* Pedidos recentes */}
      <RecentOrders orders={recentOrders} />
    </div>
  );
}
