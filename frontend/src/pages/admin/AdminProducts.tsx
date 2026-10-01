import { useState, FormEvent } from 'react';
import {
  useProducts,
  useActivateProduct,
  useDeactivateProduct,
  useCreateProduct,
  useUpdateProduct,
} from '../../hooks/admin/useProducts';
import { useCategories } from '../../hooks/useCategories';
import LoadingState from '../../components/admin/LoadingState';
import ErrorState from '../../components/admin/ErrorState';
import EmptyState from '../../components/admin/EmptyState';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

interface ProductForm {
  id?: number;
  name: string;
  description: string;
  price: string;
  categoryId: string;
  imageUrl: string;
  isActive: boolean;
  initialStock: string;
}

const EMPTY_FORM: ProductForm = {
  name: '',
  description: '',
  price: '',
  categoryId: '',
  imageUrl: '',
  isActive: true,
  initialStock: '0',
};

export default function AdminProducts() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [status, setStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [modal, setModal] = useState<ProductForm | null>(null);
  const [editingProductStock, setEditingProductStock] = useState<number>(0);

  const { data, isLoading, isError, refetch } = useProducts({
    page,
    limit: 10,
    search: search || undefined,
    status,
  });

  const { data: categories } = useCategories();

  const activate = useActivateProduct();
  const deactivate = useDeactivateProduct();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  const openCreate = () => {
    setEditingProductStock(0);
    setModal({ ...EMPTY_FORM });
  };

  const openEdit = (product: any) => {
    setEditingProductStock(product.stock ?? 0);
    setModal({
      id: product.id,
      name: product.name,
      description: product.description || '',
      price: String(product.price),
      categoryId: String(product.categoryId),
      imageUrl: product.imageUrl || '',
      isActive: product.isActive,
      initialStock: '0',
    });
  };

  const closeModal = () => setModal(null);

  const handleSubmit = () => {
    if (!modal) return;

    const basePayload = {
      name: modal.name.trim(),
      description: modal.description.trim() || undefined,
      price: Number(modal.price),
      categoryId: Number(modal.categoryId),
      imageUrl: modal.imageUrl.trim() || undefined,
      isActive: modal.isActive,
    };

    if (modal.id) {
      updateProduct.mutate({ id: modal.id, data: basePayload }, { onSuccess: closeModal });
    } else {
      const payload = {
        ...basePayload,
        initialStock: Number(modal.initialStock) || 0,
      };
      createProduct.mutate(payload, { onSuccess: closeModal });
    }
  };

  const isSubmitting = createProduct.isPending || updateProduct.isPending;

  const formatKz = (value: number) =>
    new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' }).format(value);

  if (isLoading) return <LoadingState message="Carregando produtos..." />;
  if (isError || !data) return <ErrorState onRetry={() => refetch()} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-samgat-black">Produtos</h1>
          <p className="text-samgat-gray-light text-sm mt-1">
            {data.pagination.total} produtos no total
          </p>
        </div>
        <Button onClick={openCreate}>+ Novo Produto</Button>
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

        <select
          value={status}
          onChange={(e) => { setStatus(e.target.value as any); setPage(1); }}
          className="px-4 py-2 border border-samgat-gray-lighter rounded-lg text-sm focus:outline-none focus:border-samgat-black"
        >
          <option value="all">Todos</option>
          <option value="active">Ativos</option>
          <option value="inactive">Inativos</option>
        </select>
      </div>

      {data.data.length === 0 ? (
        <EmptyState
          title="Nenhum produto"
          message="Crie o primeiro produto."
          action={<Button onClick={openCreate}>+ Novo Produto</Button>}
        />
      ) : (
        <div className="bg-white rounded-lg border border-samgat-gray-lighter overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-samgat-off-white border-b border-samgat-gray-lighter">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-samgat-gray">ID</th>
                  <th className="text-left px-4 py-3 font-medium text-samgat-gray">Produto</th>
                  <th className="text-left px-4 py-3 font-medium text-samgat-gray">Categoria</th>
                  <th className="text-left px-4 py-3 font-medium text-samgat-gray">Preço</th>
                  <th className="text-left px-4 py-3 font-medium text-samgat-gray">Stock</th>
                  <th className="text-left px-4 py-3 font-medium text-samgat-gray">Status</th>
                  <th className="text-right px-4 py-3 font-medium text-samgat-gray">Ações</th>
                </tr>
              </thead>
              <tbody>
                {data.data.map((product) => (
                  <tr key={product.id} className="border-b border-samgat-gray-lighter last:border-0">
                    <td className="px-4 py-3 text-samgat-gray-light">#{product.id}</td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-samgat-black">{product.name}</p>
                      <p className="text-xs text-samgat-gray-light">{product.slug}</p>
                    </td>
                    <td className="px-4 py-3 text-samgat-gray">
                      {product.category?.name || '-'}
                    </td>
                    <td className="px-4 py-3 text-samgat-black font-medium">
                      {formatKz(product.price)}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`font-medium ${product.lowStock ? 'text-red-600' : 'text-samgat-black'}`}>
                        {product.stock} un.
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-block px-2 py-1 text-xs rounded ${
                        product.isActive ? 'bg-samgat-black text-white' : 'bg-samgat-gray-lighter text-samgat-gray'
                      }`}>
                        {product.isActive ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right space-x-3 whitespace-nowrap">
                      <button
                        onClick={() => openEdit(product)}
                        className="text-xs text-samgat-black hover:underline"
                      >
                        Editar
                      </button>
                      {product.isActive ? (
                        <button
                          onClick={() => deactivate.mutate(product.id)}
                          disabled={deactivate.isPending}
                          className="text-xs text-red-600 hover:underline disabled:opacity-50"
                        >
                          Desativar
                        </button>
                      ) : (
                        <button
                          onClick={() => activate.mutate(product.id)}
                          disabled={activate.isPending}
                          className="text-xs text-samgat-black hover:underline disabled:opacity-50"
                        >
                          Ativar
                        </button>
                      )}
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
                className="px-3 py-1 border border-samgat-gray-lighter rounded hover:bg-samgat-off-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Anterior
              </button>
              <button
                onClick={() => setPage((p) => Math.min(data.pagination.totalPages, p + 1))}
                disabled={page >= data.pagination.totalPages}
                className="px-3 py-1 border border-samgat-gray-lighter rounded hover:bg-samgat-off-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Próxima
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Criar/Editar */}
      {modal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-samgat-black mb-4">
              {modal.id ? 'Editar Produto' : 'Novo Produto'}
            </h3>

            <div className="space-y-4">
              <Input
                label="Nome *"
                type="text"
                value={modal.name}
                onChange={(e) => setModal({ ...modal, name: e.target.value })}
                placeholder="Ex: Smartphone XYZ"
              />

              <div>
                <label className="block text-sm font-medium text-samgat-black mb-1">
                  Descrição
                </label>
                <textarea
                  value={modal.description}
                  onChange={(e) => setModal({ ...modal, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-samgat-gray-lighter rounded-lg text-sm focus:outline-none focus:border-samgat-black resize-none"
                  placeholder="Descrição opcional"
                />
              </div>

              <Input
                label="Preço (Kz) *"
                type="number"
                min="0.01"
                step="0.01"
                value={modal.price}
                onChange={(e) => setModal({ ...modal, price: e.target.value })}
                placeholder="Ex: 250000"
              />

              <div>
                <label className="block text-sm font-medium text-samgat-black mb-1">
                  Categoria *
                </label>
                <select
                  value={modal.categoryId}
                  onChange={(e) => setModal({ ...modal, categoryId: e.target.value })}
                  className="w-full px-4 py-2 border border-samgat-gray-lighter rounded-lg text-sm focus:outline-none focus:border-samgat-black"
                >
                  <option value="">Selecione uma categoria</option>
                  {categories?.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <Input
                label="URL da Imagem"
                type="url"
                value={modal.imageUrl}
                onChange={(e) => setModal({ ...modal, imageUrl: e.target.value })}
                placeholder="https://exemplo.com/imagem.jpg"
              />

              {/* Stock: criação = editável | edição = leitura */}
              {!modal.id ? (
                <Input
                  label="Stock Inicial"
                  type="number"
                  min="0"
                  step="1"
                  value={modal.initialStock}
                  onChange={(e) => setModal({ ...modal, initialStock: e.target.value })}
                  placeholder="0"
                />
              ) : (
                <div>
                  <label className="block text-sm font-medium text-samgat-black mb-1">
                    Stock Atual
                  </label>
                  <div className="flex items-center justify-between px-4 py-2 bg-samgat-off-white border border-samgat-gray-lighter rounded-lg">
                    <span className="text-sm text-samgat-black font-medium">
                      {editingProductStock} un.
                    </span>
                    <a
                      href="/admin/inventory"
                      className="text-xs text-samgat-gray-light hover:text-samgat-black underline"
                    >
                      Alterar em Stock →
                    </a>
                  </div>
                  <p className="text-xs text-samgat-gray-light mt-1">
                    O stock só pode ser alterado no módulo Stock (para manter o histórico).
                  </p>
                </div>
              )}

              <label className="flex items-center gap-2 text-sm text-samgat-black cursor-pointer">
                <input
                  type="checkbox"
                  checked={modal.isActive}
                  onChange={(e) => setModal({ ...modal, isActive: e.target.checked })}
                />
                Produto ativo (visível na loja)
              </label>

              <div className="flex gap-2 pt-2">
                <Button variant="outline" className="flex-1" onClick={closeModal}>
                  Cancelar
                </Button>
                <Button
                  className="flex-1"
                  onClick={handleSubmit}
                  isLoading={isSubmitting}
                  disabled={!modal.name || !modal.price || !modal.categoryId}
                >
                  {modal.id ? 'Guardar' : 'Criar'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
