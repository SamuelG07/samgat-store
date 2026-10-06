import { Link } from 'react-router-dom';
import { formatKz } from '../../../utils/format';

interface TopProductsProps {
  products: any[];
  isLoading?: boolean;
}

export default function TopProducts({ products, isLoading }: TopProductsProps) {
  const maxQty = Math.max(...products.map((p) => p.quantity), 1);

  return (
    <div className="bg-white border border-samgat-gray-lighter rounded-lg p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base sm:text-lg font-semibold text-samgat-black">Produtos mais vendidos</h2>
        <Link to="/admin/products" className="text-xs sm:text-sm text-samgat-gray-light hover:text-samgat-black">
          Ver todos →
        </Link>
      </div>

      {isLoading ? (
        <div className="text-center py-8 text-sm text-samgat-gray-light">Carregando...</div>
      ) : products.length === 0 ? (
        <div className="text-center py-8 text-sm text-samgat-gray-light">Sem dados de vendas ainda</div>
      ) : (
        <div className="space-y-4">
          {products.map((p, i) => (
            <div key={p.productId} className="space-y-2">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="w-8 h-8 rounded bg-samgat-off-white flex items-center justify-center text-samgat-black font-bold text-xs flex-shrink-0">
                    #{i + 1}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-samgat-black truncate">{p.name}</p>
                    <p className="text-xs text-samgat-gray-light">{p.quantity} un. vendidas</p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-semibold text-samgat-black">{formatKz(p.revenue)}</p>
                </div>
              </div>
              <div className="h-1.5 bg-samgat-gray-lighter rounded-full overflow-hidden">
                <div className="h-full bg-samgat-black rounded-full" style={{ width: `${(p.quantity / maxQty) * 100}%` }} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
