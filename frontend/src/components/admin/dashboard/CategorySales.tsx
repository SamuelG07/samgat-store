import { formatKz } from '../../../utils/format';

interface CategorySalesProps {
  categories: any[];
  isLoading?: boolean;
}

export default function CategorySales({ categories, isLoading }: CategorySalesProps) {
  return (
    <div className="bg-white border border-samgat-gray-lighter rounded-lg p-5">
      <h2 className="text-base sm:text-lg font-semibold text-samgat-black mb-4">Vendas por categoria</h2>

      {isLoading ? (
        <div className="text-center py-8 text-sm text-samgat-gray-light">Carregando...</div>
      ) : categories.length === 0 ? (
        <div className="text-center py-8 text-sm text-samgat-gray-light">Sem vendas por categoria ainda</div>
      ) : (
        <div className="space-y-4">
          {categories.map((c) => (
            <div key={c.categoryId} className="space-y-2">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-samgat-black truncate">{c.name}</p>
                  <p className="text-xs text-samgat-gray-light">{c.quantity} un. · {c.percentage}%</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-semibold text-samgat-black">{formatKz(c.revenue)}</p>
                </div>
              </div>
              <div className="h-1.5 bg-samgat-gray-lighter rounded-full overflow-hidden">
                <div className="h-full bg-samgat-black rounded-full" style={{ width: `${c.percentage}%` }} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
