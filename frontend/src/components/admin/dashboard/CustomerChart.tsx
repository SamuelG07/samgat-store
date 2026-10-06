import { Link } from 'react-router-dom';
import { Users, TrendingUp, Repeat } from 'lucide-react';

interface CustomerChartProps {
  growth: any[];
  stats: any;
  isLoading?: boolean;
}

export default function CustomerChart({ growth, stats, isLoading }: CustomerChartProps) {
  const maxCount = Math.max(...growth.map((d) => d.count), 1);

  return (
    <div className="bg-white border border-samgat-gray-lighter rounded-lg p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base sm:text-lg font-semibold text-samgat-black">Clientes</h2>
        <Link to="/admin/customers" className="text-xs sm:text-sm text-samgat-gray-light hover:text-samgat-black">
          Ver todos →
        </Link>
      </div>

      {stats && (
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="p-2 border border-samgat-gray-lighter rounded-lg">
            <Users className="w-4 h-4 text-samgat-black mb-1" />
            <p className="text-xs text-samgat-gray-light">Total</p>
            <p className="text-base font-bold text-samgat-black">{stats.total}</p>
          </div>
          <div className="p-2 border border-samgat-gray-lighter rounded-lg">
            <TrendingUp className="w-4 h-4 text-green-600 mb-1" />
            <p className="text-xs text-samgat-gray-light">Novos 30d</p>
            <p className="text-base font-bold text-samgat-black">{stats.newLast30}</p>
          </div>
          <div className="p-2 border border-samgat-gray-lighter rounded-lg">
            <Repeat className="w-4 h-4 text-samgat-black mb-1" />
            <p className="text-xs text-samgat-gray-light">Recorrentes</p>
            <p className="text-base font-bold text-samgat-black">{stats.recurring}</p>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="h-40 flex items-center justify-center text-sm text-samgat-gray-light">Carregando...</div>
      ) : growth.length === 0 ? (
        <div className="h-40 flex items-center justify-center text-sm text-samgat-gray-light">Sem dados no período</div>
      ) : (
        <div className="h-40 flex items-end gap-1 border-b border-samgat-gray-lighter pb-2 overflow-x-auto">
          {growth.map((d, i) => {
            const height = (d.count / maxCount) * 100;
            const date = new Date(d.date);
            const label = date.toLocaleDateString('pt-AO', { day: '2-digit', month: 'short' });

            return (
              <div key={i} className="flex-shrink-0 flex flex-col items-center gap-1 group" style={{ minWidth: '28px' }}>
                <div className="relative w-full flex-1 flex items-end">
                  <div
                    className="w-full bg-samgat-black rounded-t hover:bg-samgat-dark transition-colors"
                    style={{ height: `${Math.max(height, 3)}%` }}
                  />
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block bg-samgat-black text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10">
                    {label}: {d.count}
                  </div>
                </div>
                <span className="text-[9px] text-samgat-gray-light">{label.split(' ')[0]}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
