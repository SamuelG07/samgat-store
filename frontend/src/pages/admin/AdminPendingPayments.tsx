import { usePendingPayments, useConfirmPayment } from '../../hooks/usePayments';
import LoadingState from '../../components/admin/LoadingState';
import ErrorState from '../../components/admin/ErrorState';
import EmptyState from '../../components/admin/EmptyState';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { formatKz, formatDateTime } from '../../utils/format';

export default function AdminPendingPayments() {
  const { data: payments, isLoading, isError, refetch } = usePendingPayments();
  const confirmPayment = useConfirmPayment();

  if (isLoading) return <LoadingState message="Carregando pagamentos..." />;
  if (isError || !payments) return <ErrorState onRetry={() => refetch()} />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-samgat-black">Pagamentos Pendentes</h1>
        <p className="text-samgat-gray-light text-sm mt-1">
          {payments.length} pagamento(s) a aguardar confirmação
        </p>
      </div>

      {payments.length === 0 ? (
        <EmptyState
          title="Nenhum pagamento pendente"
          message="Todos os pagamentos foram processados."
        />
      ) : (
        <div className="space-y-3">
          {payments.map((p: any) => (
            <div
              key={p.id}
              className="bg-white border border-samgat-gray-lighter rounded-lg p-5"
            >
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <span className="font-bold text-samgat-black">
                      Pedido #{p.order_id}
                    </span>
                    <Badge variant="warning">Pendente</Badge>
                  </div>

                  <p className="text-sm text-samgat-gray">
                    Cliente: <strong>{p.orders?.users?.name || '-'}</strong>
                  </p>
                  <p className="text-xs text-samgat-gray-light mt-1">
                    {p.orders?.users?.email}
                  </p>
                  <p className="text-xs text-samgat-gray-light mt-1">
                    Ref: {p.provider_ref}
                  </p>
                  <p className="text-xs text-samgat-gray-light mt-1">
                    {formatDateTime(p.created_at)}
                  </p>
                </div>

                <div className="text-right flex-shrink-0">
                  <p className="text-lg font-bold text-samgat-black">
                    {formatKz(Number(p.amount))}
                  </p>
                  <Button
                    size="sm"
                    className="mt-3"
                    onClick={() => {
                      if (window.confirm(`Confirmar pagamento de ${formatKz(Number(p.amount))}?`)) {
                        confirmPayment.mutate(p.id);
                      }
                    }}
                    isLoading={confirmPayment.isPending}
                  >
                    Confirmar
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
