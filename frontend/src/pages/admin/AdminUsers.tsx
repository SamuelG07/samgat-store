import { useState } from 'react';
import { useUsers } from '../../hooks/admin/useUsers';
import LoadingState from '../../components/admin/LoadingState';
import ErrorState from '../../components/admin/ErrorState';
import EmptyState from '../../components/admin/EmptyState';

export default function AdminUsers() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [role, setRole] = useState('');

  const { data, isLoading, isError, refetch } = useUsers({
    page,
    limit: 10,
    search: search || undefined,
    role: role || undefined,
  });

  if (isLoading) return <LoadingState message="Carregando usuários..." />;
  if (isError || !data) return <ErrorState onRetry={() => refetch()} />;

  const formatDate = (date: string) => new Date(date).toLocaleDateString('pt-AO');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-samgat-black">Usuários</h1>
        <p className="text-samgat-gray-light text-sm mt-1">{data.pagination.total} usuários</p>
      </div>

      <div className="bg-white rounded-lg border border-samgat-gray-lighter p-4 flex flex-col sm:flex-row gap-3">
        <form onSubmit={handleSearch} className="flex-1 flex gap-2">
          <input
            type="text"
            placeholder="Buscar por nome ou email..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="flex-1 px-4 py-2 border border-samgat-gray-lighter rounded-lg text-sm focus:outline-none focus:border-samgat-black"
          />
          <button type="submit" className="bg-samgat-black text-white px-4 py-2 rounded-lg text-sm hover:bg-samgat-dark">
            Buscar
          </button>
        </form>

        <select
          value={role}
          onChange={(e) => { setRole(e.target.value); setPage(1); }}
          className="px-4 py-2 border border-samgat-gray-lighter rounded-lg text-sm focus:outline-none focus:border-samgat-black"
        >
          <option value="">Todos</option>
          <option value="CUSTOMER">Clientes</option>
          <option value="ADMIN">Admins</option>
        </select>
      </div>

      {data.data.length === 0 ? (
        <EmptyState title="Nenhum usuário" message="Nenhum usuário encontrado." />
      ) : (
        <div className="bg-white rounded-lg border border-samgat-gray-lighter overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-samgat-off-white border-b border-samgat-gray-lighter">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-samgat-gray">ID</th>
                <th className="text-left px-4 py-3 font-medium text-samgat-gray">Nome</th>
                <th className="text-left px-4 py-3 font-medium text-samgat-gray">Email</th>
                <th className="text-left px-4 py-3 font-medium text-samgat-gray">Role</th>
                <th className="text-left px-4 py-3 font-medium text-samgat-gray">Pedidos</th>
                <th className="text-left px-4 py-3 font-medium text-samgat-gray">Registado em</th>
              </tr>
            </thead>
            <tbody>
              {data.data.map((user) => (
                <tr key={user.id} className="border-b border-samgat-gray-lighter last:border-0">
                  <td className="px-4 py-3 text-samgat-gray-light">#{user.id}</td>
                  <td className="px-4 py-3 font-medium text-samgat-black">{user.name}</td>
                  <td className="px-4 py-3 text-samgat-gray">{user.email}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2 py-1 text-xs rounded ${
                      user.role === 'ADMIN' ? 'bg-samgat-black text-white' : 'bg-samgat-gray-lighter text-samgat-gray'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-samgat-gray">{user.ordersCount || 0}</td>
                  <td className="px-4 py-3 text-samgat-gray-light text-xs">{formatDate(user.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="px-4 py-3 border-t border-samgat-gray-lighter flex items-center justify-between text-sm">
            <p className="text-samgat-gray-light">Página {data.pagination.page} de {data.pagination.totalPages}</p>
            <div className="flex gap-2">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
                className="px-3 py-1 border border-samgat-gray-lighter rounded hover:bg-samgat-off-white disabled:opacity-50">
                Anterior
              </button>
              <button onClick={() => setPage((p) => Math.min(data.pagination.totalPages, p + 1))}
                disabled={page >= data.pagination.totalPages}
                className="px-3 py-1 border border-samgat-gray-lighter rounded hover:bg-samgat-off-white disabled:opacity-50">
                Próxima
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
