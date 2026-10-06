import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { formatKz } from '../../../utils/format';

interface SalesChartProps {
  data: any[];
  isLoading?: boolean;
}

export default function SalesChart({ data, isLoading }: SalesChartProps) {
  if (isLoading) {
    return (
      <div className="bg-white border border-samgat-gray-lighter rounded-lg p-5">
        <h2 className="text-base sm:text-lg font-semibold text-samgat-black mb-4">Vendas ao longo do tempo</h2>
        <div className="h-64 flex items-center justify-center text-samgat-gray-light">Carregando...</div>
      </div>
    );
  }

  const chartData = data.map((d) => ({
    date: new Date(d.date).toLocaleDateString('pt-AO', { day: '2-digit', month: 'short' }),
    receita: d.revenue,
    pedidos: d.orders,
  }));

  return (
    <div className="bg-white border border-samgat-gray-lighter rounded-lg p-5">
      <h2 className="text-base sm:text-lg font-semibold text-samgat-black mb-4">Vendas ao longo do tempo</h2>
      {chartData.length === 0 ? (
        <div className="h-64 flex items-center justify-center text-samgat-gray-light text-sm">
          Sem dados no período
        </div>
      ) : (
        <div className="w-full h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorReceita" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#000000" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#000000" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#666' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#666' }} axisLine={false} tickLine={false} width={60} />
              <Tooltip
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #E0E0E0', borderRadius: '8px', fontSize: '12px' }}
                formatter={(value: any) => formatKz(Number(value))}
              />
              <Area type="monotone" dataKey="receita" stroke="#000000" strokeWidth={2} fill="url(#colorReceita)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
