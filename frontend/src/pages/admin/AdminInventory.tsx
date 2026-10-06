import { useState } from 'react';
import { useInventory, useStockIn, useStockAdjust } from '../../hooks/admin/useInventory';
import LoadingState from '../../components/admin/LoadingState';
import ErrorState from '../../components/admin/ErrorState';
import EmptyState from '../../components/admin/EmptyState';
import Button from '../../components/ui/Button';

export default function AdminInventory() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [lowStock, setLowStock] = useState(false);
  const [modalProduct, setModalProduct] = useState<any>(null);
  const [modalMode, setModalMode] = useState<'in' | 'adjust'>('in');
  const [quantity, setQuantity] = useState('');
  const [reason, setReason] = useState('');

  const { data, isLoading, isError, refetch } = useInventory({
    page,
    limit: 10,
    search: search || undefined,
    lowStock: lowStock || undefined,
  });

  const stockIn = useStockIn();
  const stockAdjust = useStockAdjust();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  const openModal = (item: any, mode: 'in' | 'adjust') => {
    setModalProduct(item);
    setModalMode(mode);
    setQuantity('');
    setReason('');
  };

  const closeModal = () => {
    setModalProduct(null);
    setQuantity('');
    setReason('');
  };

  const handleSubmit = () => {
    if (!modalProduct || !quantity) return;
    const qty = parseInt(quantity, 10);
    if (isNaN(qty) || qty === 0) return;

    if (modalMode === 'in') {
      stockIn.mutate(
        { productId: modalProduct.productId, data: { quantity: qty, reason: reason || undefined } },
        { onSuccess: closeModal }
      );
    } else {
      if (!reason || reason.length < 3) return;
      stockAdjust.mutate(
        { productId: modalProduct.productId, data: { quantity: qty, reason } },
        { onSuccess: closeModal }
      );
    }
  };

  if (isLoading) return <LoadingState message="Carregando inventário..." />;
  if (isError || !data) return <ErrorState onRetry={() => refetch()} />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-samgat-black">Stock / Inventário</h1>
        <p className="text-samgat-gray-light text-sm mt-1">
          {data.pagination.total} produtos em stock
        </p>
      </div>

      <div className="bg-white rounded-lg border border-samgat-gray-lighter p-4 flex flex-col sm:flex-row gap-3">
        <form onSubmit={handleSearch} className="flex-1 flex gap-2">
          <input
            type="text"
            placeholder="Buscar produto..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="flex-1 px-4 py-2 border border-samgat-gray-lighter rounded-lg text-sm focus:outline-none focus:border-samgat-black"
          />
          <Button type="submit" size="sm">Buscar</Button>
        </form>

        <label className="flex items-center gap-2 text-sm text-samgat-gray cursor-pointer">
          <input
            type="checkbox"
            checked={lowStock}
            onChange={(e) => { setLowStock(e.target.checked); setPage(1); }}
          />
          Apenas stock baixo
        </label>
      </div>

      {data.data.length === 0 ? (
        <EmptyState title="Sem items" message="Nenhum produto em stock." />
      ) : (
        <div className="bg-white rounded-lg border border-samgat-gray-lighter overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[600px]">
              <thead className="bg-samgat-off-white border-b border-samgat-gray-lighter">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-samgat-gray">Produto</th>
                  <th className="text-left px-4 py-3 font-medium text-samgat-gray">Quantidade</th>
                  <th className="text-left px-4 py-3 font-medium text-samgat-gray">Status</th>
                  <th className="text-right px-4 py-3 font-medium text-samgat-gray">Ações</th>
                </tr>
              </thead>
              <tbody>
                {data.data.map((item: any) => (
                  <tr key={item.id} className="border-b border-samgat-gray-lighter last:border-0">
                    <td className="px-4 py-3">
                      <p className="font-medium text-samgat-black">{item.product?.name}</p>
                      <p className="text-xs text-samgat-gray-light">{item.product?.slug}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`font-semibold ${item.lowStock ? 'text-red-600' : 'text-samgat-black'}`}>
                        {item.quantity} un.
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {item.lowStock ? (
                        <span className="inline-block px-2 py-1 text-xs bg-red-100 text-red-700 rounded">
                          Stock baixo
                        </span>
                      ) : (
                        <span className="inline-block px-2 py-1 text-xs bg-samgat-gray-lighter text-samgat-gray rounded">
                          OK
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right space-x-3 whitespace-nowrap">
                      <button
                        onClick={() => openModal(item, 'in')}
                        className="text-xs text-samgat-black hover:underline"
                      >
                        + Entrada
                      </button>
                      <button
                        onClick={() => openModal(item, 'adjust')}
                        className="text-xs text-samgat-gray hover:underline"
                      >
                        Ajustar
                      </button>
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

      {/* Modal */}
      {modalProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-samgat-black mb-2">
              {modalMode === 'in' ? 'Entrada de Stock' : 'Ajuste de Stock'}
            </h3>
            <p className="text-sm text-samgat-gray-light mb-4">
              {modalProduct.product?.name} — Atual: {modalProduct.quantity} un.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-samgat-black mb-1">
                  Quantidade {modalMode === 'adjust' && '(negativo para reduzir)'}
                </label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-full px-4 py-2 border border-samgat-gray-lighter rounded-lg text-sm focus:outline-none focus:border-samgat-black"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-samgat-black mb-1">
                  Motivo {modalMode === 'adjust' && '(obrigatório)'}
                </label>
                <input
                  type="text"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full px-4 py-2 border border-samgat-gray-lighter rounded-lg text-sm focus:outline-none focus:border-samgat-black"
                  placeholder={modalMode === 'in' ? 'Reposição...' : 'Motivo do ajuste'}
                />
              </div>

              <div className="flex gap-2 pt-2">
                <Button variant="outline" className="flex-1" onClick={closeModal}>
                  Cancelar
                </Button>
                <Button
                  className="flex-1"
                  onClick={handleSubmit}
                  disabled={!quantity || (modalMode === 'adjust' && reason.length < 3) || stockIn.isPending || stockAdjust.isPending}
                  isLoading={stockIn.isPending || stockAdjust.isPending}
                >
                  Confirmar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
