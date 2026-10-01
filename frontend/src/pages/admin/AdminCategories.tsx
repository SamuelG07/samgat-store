import { useState } from 'react';
import { useCategories, useCreateCategory, useUpdateCategory, useDeleteCategory } from '../../hooks/admin/useCategories';
import LoadingState from '../../components/admin/LoadingState';
import ErrorState from '../../components/admin/ErrorState';
import EmptyState from '../../components/admin/EmptyState';

interface CategoryForm {
  id?: number;
  name: string;
  description: string;
  slug: string;
}

export default function AdminCategories() {
  const { data: categories, isLoading, isError, refetch } = useCategories();
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();

  const [modal, setModal] = useState<CategoryForm | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{ id: number; name: string } | null>(null);

  const openCreate = () => setModal({ name: '', description: '', slug: '' });
  const openEdit = (cat: any) =>
    setModal({
      id: cat.id,
      name: cat.name,
      description: cat.description || '',
      slug: cat.slug,
    });
  const closeModal = () => setModal(null);

  const handleSubmit = () => {
    if (!modal || !modal.name) return;

    const payload = {
      name: modal.name,
      description: modal.description || undefined,
      slug: modal.slug || undefined,
    };

    if (modal.id) {
      updateCategory.mutate(
        { id: modal.id, data: payload },
        { onSuccess: closeModal }
      );
    } else {
      createCategory.mutate(payload, { onSuccess: closeModal });
    }
  };

  const handleDelete = () => {
    if (!confirmDelete) return;
    deleteCategory.mutate(confirmDelete.id, {
      onSuccess: () => setConfirmDelete(null),
    });
  };

  if (isLoading) return <LoadingState message="Carregando categorias..." />;
  if (isError || !categories) return <ErrorState onRetry={() => refetch()} />;

  const isPending = createCategory.isPending || updateCategory.isPending;

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-samgat-black">Categorias</h1>
          <p className="text-samgat-gray-light text-sm mt-1">{categories.length} categorias</p>
        </div>
        <button
          onClick={openCreate}
          className="bg-samgat-black text-white px-4 py-2 rounded-lg text-sm hover:bg-samgat-dark transition-colors"
        >
          + Nova Categoria
        </button>
      </div>

      {/* Tabela */}
      {categories.length === 0 ? (
        <EmptyState title="Sem categorias" message="Crie a primeira categoria." />
      ) : (
        <div className="bg-white rounded-lg border border-samgat-gray-lighter overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-samgat-off-white border-b border-samgat-gray-lighter">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-samgat-gray">ID</th>
                <th className="text-left px-4 py-3 font-medium text-samgat-gray">Nome</th>
                <th className="text-left px-4 py-3 font-medium text-samgat-gray">Slug</th>
                <th className="text-left px-4 py-3 font-medium text-samgat-gray">Descrição</th>
                <th className="text-right px-4 py-3 font-medium text-samgat-gray">Ações</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat.id} className="border-b border-samgat-gray-lighter last:border-0">
                  <td className="px-4 py-3 text-samgat-gray-light">#{cat.id}</td>
                  <td className="px-4 py-3 font-medium text-samgat-black">{cat.name}</td>
                  <td className="px-4 py-3 text-samgat-gray-light text-xs">{cat.slug}</td>
                  <td className="px-4 py-3 text-samgat-gray text-xs">{cat.description || '-'}</td>
                  <td className="px-4 py-3 text-right space-x-3">
                    <button
                      onClick={() => openEdit(cat)}
                      className="text-xs text-samgat-black hover:underline"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => setConfirmDelete({ id: cat.id, name: cat.name })}
                      className="text-xs text-red-600 hover:underline"
                    >
                      Remover
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Criar/Editar */}
      {modal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-samgat-black mb-4">
              {modal.id ? 'Editar Categoria' : 'Nova Categoria'}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-samgat-black mb-1">
                  Nome *
                </label>
                <input
                  type="text"
                  value={modal.name}
                  onChange={(e) => setModal({ ...modal, name: e.target.value })}
                  className="w-full px-4 py-2 border border-samgat-gray-lighter rounded-lg text-sm focus:outline-none focus:border-samgat-black"
                  placeholder="Ex: Eletrónicos"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-samgat-black mb-1">
                  Slug (opcional)
                </label>
                <input
                  type="text"
                  value={modal.slug}
                  onChange={(e) => setModal({ ...modal, slug: e.target.value })}
                  className="w-full px-4 py-2 border border-samgat-gray-lighter rounded-lg text-sm focus:outline-none focus:border-samgat-black"
                  placeholder="deixe vazio para gerar automaticamente"
                />
              </div>

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

              <div className="flex gap-2 pt-2">
                <button
                  onClick={closeModal}
                  className="flex-1 px-4 py-2 border border-samgat-gray-lighter rounded-lg text-sm hover:bg-samgat-off-white"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!modal.name || isPending}
                  className="flex-1 bg-samgat-black text-white px-4 py-2 rounded-lg text-sm hover:bg-samgat-dark disabled:opacity-50"
                >
                  {isPending ? 'A guardar...' : 'Guardar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Confirmar Remoção */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-samgat-black mb-2">
              Remover Categoria
            </h3>
            <p className="text-sm text-samgat-gray mb-6">
              Tem a certeza que quer remover <strong>{confirmDelete.name}</strong>? Esta ação não pode ser desfeita.
            </p>

            <div className="flex gap-2">
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 px-4 py-2 border border-samgat-gray-lighter rounded-lg text-sm hover:bg-samgat-off-white"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteCategory.isPending}
                className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700 disabled:opacity-50"
              >
                {deleteCategory.isPending ? 'A remover...' : 'Remover'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
