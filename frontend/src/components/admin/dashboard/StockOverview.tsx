import { Package, AlertTriangle, XCircle, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

interface StockOverviewProps {
  totalProducts: number;
  activeProducts: number;
  lowStock: number;
  threshold: number;
}

export default function StockOverview({ totalProducts, activeProducts, lowStock, threshold }: StockOverviewProps) {
  const inactive = totalProducts - activeProducts;

  const stats = [
    { label: 'Total de produtos', value: totalProducts, icon: <Package className="w-4 h-4" />, color: 'text-samgat-black' },
    { label: 'Produtos ativos', value: activeProducts, icon: <CheckCircle className="w-4 h-4" />, color: 'text-green-600' },
    { label: 'Produtos inativos', value: inactive, icon: <XCircle className="w-4 h-4" />, color: 'text-samgat-gray-light' },
    { label: `Stock baixo (< ${threshold})`, value: lowStock, icon: <AlertTriangle className="w-4 h-4" />, color: 'text-red-600' },
  ];

  return (
    <div className="bg-white border border-samgat-gray-lighter rounded-lg p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base sm:text-lg font-semibold text-samgat-black">Estado do stock</h2>
        <Link to="/admin/inventory" className="text-xs sm:text-sm text-samgat-gray-light hover:text-samgat-black transition-colors">
          Ver stock →
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {stats.map((s, i) => (
          <div key={i} className="p-3 border border-samgat-gray-lighter rounded-lg">
            <div className={`${s.color} mb-2`}>{s.icon}</div>
            <p className="text-xs text-samgat-gray-light uppercase">{s.label}</p>
            <p className="text-xl font-bold text-samgat-black mt-1">{s.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
