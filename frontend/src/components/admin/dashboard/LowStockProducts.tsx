import { Link } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';

interface LowStockProductsProps {
  products: any[];
  threshold: number;
}

export default function LowStockProducts({ products, threshold }: LowStockProductsProps) {
  return (
    <div className="bg-white border border-samgat-gray-lighter rounded-lg overflow-hidden">
      <div className="px-4 sm:px-6 py-4 border-b border-samgat-gray-lighter flex items-center justify-between">
        <h2 className="text-base sm:text-lg font-semibold text-samgat-black">Produtos com stock baixo</h2>
        <Link to="/admin/inventory" className="text-xs sm:text-sm text-samgat-gray-light hover:text-samgat-black transition-colors">
          Ver stock →
        </Link>
      </div>
      {products.length === 0 ? (
        <div className="p-8 text-center text-sm text-samgat-gray-light">
          Tudo em ordem. Nenhum produto com stock baixo.
        </div>
      ) : (
        <div className="divide-y divide-samgat-gray-lighter">
          {products.map((item) => (
            <div key={item.id} className="p-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="w-8 h-8 rounded bg-red-50 flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-samgat-black truncate">
                    {item.products?.name || 'Produto'}
                  </p>
                  <p className="text-xs text-samgat-gray-light">Limite: {threshold} un.</p>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-sm font-semibold text-red-600">{item.quantity} un.</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
