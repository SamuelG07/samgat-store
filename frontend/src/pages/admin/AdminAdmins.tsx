import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useUsers } from '../../hooks/admin/useUsers';
import LoadingState from '../../components/admin/LoadingState';
import ErrorState from '../../components/admin/ErrorState';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import ResponsiveTable, { Column, MobileCardField } from '../../components/admin/ui/ResponsiveTable';
import { formatDate } from '../../utils/format';

interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export default function AdminAdmins() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');

  const { data, isLoading, isError, refetch } = useUsers({
    page,
    limit: 10,
    search: search || undefined,
    role: 'ADMIN',
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  if (isLoading) return <LoadingState message="Carregando administradores..." />;
  if (isError || !data) return <ErrorState onRetry={() => refetch()} />;

  const columns: Column<AdminUser>[] = [
    {
      key: 'id',
      label: 'ID',
      render: (u) => <span className="text-samgat-gray-light">#{u.id}</span>,
    },
    {
      key: 'name',
      label: 'Nome',
      render: (u) => (
        <Link
          to={`/admin/admins/${u.id}`}
          className="font-medium text-samgat-black hover:underline"
        >
          {u.name}
        </Link>
      ),
    },
    {
      key: 'email',
      label: 'Email',
      render: (u) => <span className="text-samgat-gray">{u.email}</span>,
    },
    {
      key: 'role',
      label: 'Função',
      render: () => <Badge variant="dark">ADMIN</Badge>,
    },
    {
      key: 'createdAt',
      label: 'Criado em',
      render: (u) => (
        <span className="text-samgat-gray-light text-xs">
          {formatDate(u.createdAt)}
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Ações',
      className: 'text-right',
      render: (u) => (
        <div className="flex justify-end gap-3">
          <Link
            to={`/admin/admins/${u.id}`}
            className="text-xs text-samgat-black hover:underline"
          >
            Ver
          </Link>
        </div>
      ),
    },
  ];

  const mobileFields: MobileCardField<AdminUser>[] = [
    { label: 'Email', render: (u) => u.email },
    { label: 'Função', render: () => 'ADMIN' },
    {
      label: 'Criado em',
      render: (u) => formatDate(u.createdAt),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-samgat-black">Administradores</h1>
        <p className="text-samgat-gray-light text-sm mt-1">
          {data.pagination.total} administrador(es)
        </p>
      </div>

      <form
        onSubmit={handleSearch}
        className="bg-white border border-samgat-gray-lighter rounded-lg p-4 flex flex-col sm:flex-row gap-3"
      >
        <input
          type="text"
          placeholder="Buscar por nome ou email..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="flex-1 px-4 py-2 border border-samgat-gray-lighter rounded-lg text-sm focus:outline-none focus:border-samgat-black"
        />
        <Button type="submit" size="sm">
          Buscar
        </Button>
      </form>

      <ResponsiveTable
        data={data.data as AdminUser[]}
        columns={columns}
        mobileTitle={(u) => (
          <div className="flex items-center justify-between gap-2">
            <Link
              to={`/admin/admins/${u.id}`}
              className="font-semibold text-samgat-black"
            >
              {u.name}
            </Link>
            <Badge variant="dark">ADMIN</Badge>
          </div>
        )}
        mobileFields={mobileFields}
        mobileActions={(u) => (
          <Link to={`/admin/admins/${u.id}`} className="flex-1">
            <Button variant="outline" size="sm" className="w-full">
              Ver Detalhes
            </Button>
          </Link>
        )}
        keyExtractor={(u) => u.id}
        emptyMessage="Nenhum administrador encontrado."
      />

      {data.pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Anterior
          </Button>
          <span className="text-sm text-samgat-gray-light px-3">
            Página {data.pagination.page} de {data.pagination.totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.min(data.pagination.totalPages, p + 1))}
            disabled={page >= data.pagination.totalPages}
          >
            Próxima
          </Button>
        </div>
      )}
    </div>
  );
}
