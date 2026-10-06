import { useState } from 'react';
import { useStockMovements } from '../../hooks/admin/useStockMovements';
import LoadingState from '../../components/admin/LoadingState';
import ErrorState from '../../components/admin/ErrorState';
import EmptyState from '../../components/admin/EmptyState';
import { formatDateTime } from '../../utils/format';

const TYPE_COLORS: Record<string, string> = {
  IN: 'bg-samgat-black text-white',
  OUT: 'bg-red-100 text-red-700',
  ADJUSTMENT: 'bg-samgat-gray-lighter text-samgat-gray',
};

export default function AdminStockMovements() {
  const [page, setPage] = useState(1);
  const [type, setType] = useState('');

  const { data, isLoading, isError, refetch } = useStockMovements({
    page,
    limit: 20,
    type: (type as any) || undefined,
  });

  if (isLoading) return <LoadingState message="Carregando movimentações..." />;
  if (isError || !data) return <ErrorState onRetry={() => refetch()} />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-samgat-black">Movimentações de Stock</h1>
        <p className="text-samgat-gray-light text-sm mt-1">
          {data.pagination.total} movimentações registadas
        </p>
      </div>

      <div className="bg-white rounded-lg border border-samgat-gray-lighter p-4">
        <select
          value={type}
          onChange={(e) => { setType(e.target.value); setPage(1); }}
          className="px-4 py-2 border border-samgat-gray-lighter rounded-lg text-sm focus:outline-none focus:border-samgat-black"
        >
          <option value="">Todos os tipos</option>
          <option value="IN">Entrada</option>
          <option value="OUT">Saída</option>
          <option value="ADJUSTMENT">Ajuste</option>
        </select>
      </div>

      {data.data.length === 0 ? (
        <EmptyState title="Sem movimentações" message="Nenhuma movimentação registada." />
      ) : (
        <div className="bg-white rounded-lg border border-samgat-gray-lighter overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[700px]">
              <thead className="bg-samgat-off-white border-b border-samgat-gray-lighter">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-samgat-gray">ID</th>
                  <th className="text-left px-4 py-3 font-medium text-samgat-gray">Produto</th>
                  <th className="text-left px-4 py-3 font-medium text-samgat-gray">Tipo</th>
                  <th className="text-left px-4 py-3 font-medium text-samgat-gray">Quantidade</th>
                  <th className="text-left px-4 py-3 font-medium text-samgat-gray">Motivo</th>
                  <th className="text-left px-4 py-3 font-medium text-samgat-gray">Data</th>
                </tr>
              </thead>
              <tbody>
                {data.data.map((m: any) => (
                  <tr key={m.id} className="border-b border-samgat-gray-lighter last:border-0">
                    <td className="px-4 py-3 text-samgat-gray-light">#{m.id}</td>
                    <td className="px-4 py-3 text-samgat-black">{m.product?.name}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-block px-2 py-1 text-xs rounded ${TYPE_COLORS[m.type] || ''}`}>
                        {m.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-medium text-samgat-black">
                      {m.quantity > 0 ? `+${m.quantity}` : m.quantity}
                    </td>
                    <td className="px-4 py-3 text-samgat-gray text-xs">
                      {m.reason || '-'}
                    </td>
                    <td className="px-4 py-3 text-samgat-gray-light text-xs">
                      {formatDateTime(m.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-4 py-3 border-t border-samgat-gray-lighter flex items-center justify-between text-sm">
            <p className="text-samgat-gray-light">
              Página {data.pagination.page} de {data.pagination.totalPages}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1 border border-samgat-gray-lighter rounded hover:bg-samgat-off-white disabled:opacity-50"
              >
                Anterior
              </button>
              <button
                onClick={() => setPage((p) => Math.min(data.pagination.totalPages, p + 1))}
                disabled={page >= data.pagination.totalPages}
                className="px-3 py-1 border border-samgat-gray-lighter rounded hover:bg-samgat-off-white disabled:opacity-50"
              >
                Próxima
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
