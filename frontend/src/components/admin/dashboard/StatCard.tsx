import { ReactNode } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  subtitle?: string;
  icon: ReactNode;
}

export default function StatCard({ title, value, change, subtitle, icon }: StatCardProps) {
  const isPositive = change !== undefined && change >= 0;
  const showChange = change !== undefined;

  return (
    <div className="bg-white border border-samgat-gray-lighter rounded-lg p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="w-9 h-9 rounded-lg bg-samgat-off-white flex items-center justify-center text-samgat-black flex-shrink-0">
          {icon}
        </div>
        {showChange && (
          <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded ${isPositive ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {isPositive ? '+' : ''}{change}%
          </div>
        )}
      </div>
      <p className="text-xs font-medium text-samgat-gray-light uppercase tracking-wide">{title}</p>
      <p className="text-2xl font-bold text-samgat-black mt-1">{value}</p>
      {subtitle && <p className="text-xs text-samgat-gray-light mt-1">{subtitle}</p>}
    </div>
  );
}
