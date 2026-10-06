import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { adminApi } from '../../services/adminApi';
import LoadingState from '../../components/admin/LoadingState';
import ErrorState from '../../components/admin/ErrorState';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { formatKz, formatDate } from '../../utils/format';

const statusLabels: Record<string, string> = {
  PENDING: 'Pendente',
  CONFIRMED: 'Confirmado',
  PROCESSING: 'Processamento',
  SHIPPED: 'Enviado',
  DELIVERED: 'Entregue',
  CANCELLED: 'Cancelado',
};

export default function CustomerDetails() {
  const { id } = useParams();
  const userId = Number(id);

  const { data: user, isLoading, isError, refetch } = useQuery({
    queryKey: ['admin', 'user', userId],
    queryFn: () => adminApi.getUserById(userId),
    enabled: !!userId,
  });

  if (isLoading) return <LoadingState message="Carregando cliente..." />;
  if (isError || !user) return <ErrorState message="Cliente não encontrado" onRetry={() => refetch()} />;

  const userData = user as any;

  return (
    <div className="space-y-6">
      <nav className="text-sm text-samgat-gray-light">
        <Link to="/admin/customers" className="hover:text-samgat-black">
          Clientes
        </Link>
        <span className="mx-2">/</span>
        <span className="text-samgat-black">{userData.name}</span>
      </nav>

      {/* Info básica */}
      <div className="bg-white border border-samgat-gray-lighter rounded-lg p-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4 min-w-0">
            <div className="w-14 h-14 rounded-full bg-samgat-black text-white flex items-center justify-center text-xl font-bold flex-shrink-0">
              {userData.name?.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl font-bold text-samgat-black truncate">
                {userData.name}
              </h1>
              <p className="text-sm text-samgat-gray-light truncate">
                {userData.email}
              </p>
            </div>
          </div>
          <Badge variant={userData.role === 'ADMIN' ? 'dark' : 'default'}>
            {userData.role}
          </Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-samgat-gray-lighter">
          <div>
            <p className="text-xs text-samgat-gray-light uppercase">Total de pedidos</p>
            <p className="text-lg font-bold text-samgat-black mt-1">
              {userData._count?.orders || userData.orders?.length || 0}
            </p>
          </div>
          <div>
            <p className="text-xs text-samgat-gray-light uppercase">Cadastro</p>
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

      {/* Pedidos recentes */}
      <div className="bg-white border border-samgat-gray-lighter rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-samgat-gray-lighter">
          <h2 className="font-semibold text-samgat-black">Pedidos recentes</h2>
        </div>

        {!userData.orders || userData.orders.length === 0 ? (
          <div className="p-8 text-center text-sm text-samgat-gray-light">
            Este cliente ainda não tem pedidos.
          </div>
        ) : (
          <div className="divide-y divide-samgat-gray-lighter">
            {userData.orders.map((order: any) => (
              <div key={order.id} className="p-4 sm:p-6 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-medium text-samgat-black">
                    Pedido #{order.id}
                  </p>
                  <p className="text-xs text-samgat-gray-light mt-1">
                    {formatDate(order.created_at)}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-bold text-samgat-black">
                    {formatKz(Number(order.total))}
                  </p>
                  <span className="text-xs text-samgat-gray-light">
                    {statusLabels[order.status] || order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-start">
        <Link to="/admin/customers">
          <Button variant="outline">← Voltar aos clientes</Button>
        </Link>
      </div>
    </div>
  );
}
