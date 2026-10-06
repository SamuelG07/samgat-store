import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Link } from 'react-router-dom';
import { Users, TrendingUp, Repeat } from 'lucide-react';

interface CustomerChartProps {
  growth: any[];
  stats: any;
  isLoading?: boolean;
}

export default function CustomerChart({ growth, stats, isLoading }: CustomerChartProps) {
  const chartData = growth.map((d) => ({
    date: new Date(d.date).toLocaleDateString('pt-AO', { day: '2-digit', month: 'short' }),
    novos: d.count,
  }));

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
      ) : chartData.length === 0 ? (
        <div className="h-40 flex items-center justify-center text-sm text-samgat-gray-light">Sem dados</div>
      ) : (
        <div className="w-full h-40">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#666' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#666' }} axisLine={false} tickLine={false} width={30} />
              <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #E0E0E0', borderRadius: '8px', fontSize: '12px' }} />
              <Line type="monotone" dataKey="novos" stroke="#000000" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
