import { formatKz } from '../../../utils/format';

interface SalesChartProps {
  data: any[];
  isLoading?: boolean;
}

export default function SalesChart({ data, isLoading }: SalesChartProps) {
  const maxRevenue = Math.max(...data.map((d) => d.revenue), 1);
  const totalRevenue = data.reduce((sum, d) => sum + d.revenue, 0);
  const totalOrders = data.reduce((sum, d) => sum + d.orders, 0);

  return (
    <div className="bg-white border border-samgat-gray-lighter rounded-lg p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base sm:text-lg font-semibold text-samgat-black">
          Vendas ao longo do tempo
        </h2>
        <div className="text-right">
          <p className="text-xs text-samgat-gray-light">Total no período</p>
          <p className="text-sm font-bold text-samgat-black">{formatKz(totalRevenue)}</p>
        </div>
      </div>

      {isLoading ? (
        <div className="h-64 flex items-center justify-center text-samgat-gray-light text-sm">
          Carregando...
        </div>
      ) : data.length === 0 ? (
        <div className="h-64 flex items-center justify-center text-samgat-gray-light text-sm">
          Sem dados no período
        </div>
      ) : (
        <div className="space-y-2">
          {/* Bar chart em CSS puro */}
          <div className="h-48 flex items-end gap-1 border-b border-samgat-gray-lighter pb-2 overflow-x-auto">
            {data.map((d, i) => {
              const height = (d.revenue / maxRevenue) * 100;
              const date = new Date(d.date);
              const label = date.toLocaleDateString('pt-AO', { day: '2-digit', month: 'short' });

              return (
                <div key={i} className="flex-shrink-0 flex flex-col items-center gap-2 group" style={{ minWidth: '32px' }}>
                  <div className="relative w-full flex-1 flex items-end">
                    <div
                      className="w-full bg-samgat-black rounded-t hover:bg-samgat-dark transition-colors"
                      style={{ height: `${Math.max(height, 2)}%` }}
                      title={`${label}: ${formatKz(d.revenue)}`}
                    />
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-samgat-black text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10">
                      {label}: {formatKz(d.revenue)}
                    </div>
                  </div>
                  <span className="text-[10px] text-samgat-gray-light">{label}</span>
                </div>
              );
            })}
          </div>

          {/* Resumo */}
          <div className="grid grid-cols-2 gap-3 pt-3">
            <div className="p-3 bg-samgat-off-white rounded-lg">
              <p className="text-xs text-samgat-gray-light">Receita total</p>
              <p className="text-sm font-bold text-samgat-black">{formatKz(totalRevenue)}</p>
            </div>
            <div className="p-3 bg-samgat-off-white rounded-lg">
              <p className="text-xs text-samgat-gray-light">Pedidos</p>
              <p className="text-sm font-bold text-samgat-black">{totalOrders}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
