import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { adminApi } from '../../services/adminApi';
import LoadingState from '../../components/admin/LoadingState';
import ErrorState from '../../components/admin/ErrorState';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { formatDate } from '../../utils/format';

export default function AdminDetails() {
  const { id } = useParams();
  const userId = Number(id);

  const { data: user, isLoading, isError, refetch } = useQuery({
    queryKey: ['admin', 'user', userId],
    queryFn: () => adminApi.getUserById(userId),
    enabled: !!userId,
  });

  if (isLoading) return <LoadingState message="Carregando administrador..." />;
  if (isError || !user) return <ErrorState message="Administrador não encontrado" onRetry={() => refetch()} />;

  const userData = user as any;

  return (
    <div className="space-y-6">
      <nav className="text-sm text-samgat-gray-light">
        <Link to="/admin/admins" className="hover:text-samgat-black">
          Administradores
        </Link>
        <span className="mx-2">/</span>
        <span className="text-samgat-black">{userData.name}</span>
      </nav>

      <div className="bg-white border border-samgat-gray-lighter rounded-lg p-6">
        <div className="flex items-center gap-4 min-w-0">
          <div className="w-14 h-14 rounded-full bg-samgat-black text-white flex items-center justify-center text-xl font-bold flex-shrink-0">
            {userData.name?.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-xl sm:text-2xl font-bold text-samgat-black truncate">
              {userData.name}
            </h1>
            <p className="text-sm text-samgat-gray-light truncate">
              {userData.email}
            </p>
          </div>
          <Badge variant="dark">ADMIN</Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 pt-6 border-t border-samgat-gray-lighter">
          <div>
            <p className="text-xs text-samgat-gray-light uppercase">Criado em</p>
            <p className="text-lg font-bold text-samgat-black mt-1">
              {formatDate(userData.created_at)}
            </p>
          </div>
          <div>
            <p className="text-xs text-samgat-gray-light uppercase">Estado</p>
            <p className="text-lg font-bold text-samgat-black mt-1">Ativo</p>
          </div>
        </div>
      </div>

      <div className="flex justify-start">
        <Link to="/admin/admins">
          <Button variant="outline">← Voltar aos administradores</Button>
        </Link>
      </div>
    </div>
  );
}
