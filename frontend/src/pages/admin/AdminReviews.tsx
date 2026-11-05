import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../services/api';
import LoadingState from '../../components/admin/LoadingState';
import ErrorState from '../../components/admin/ErrorState';
import EmptyState from '../../components/admin/EmptyState';
import StarRating from '../../components/reviews/StarRating';
import Button from '../../components/ui/Button';
import { formatDate } from '../../utils/format';
import { Trash2, User } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminReviews() {
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['admin', 'reviews', page],
    queryFn: async () => {
      const res = await api.get('/admin/reviews', { params: { page, limit: 20 } });
      return res.data;
    },
  });

  const deleteReview = useMutation({
    mutationFn: (id: number) => api.delete(`/reviews/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'reviews'] });
      toast.success('Review removida');
    },
    onError: () => toast.error('Erro ao remover'),
  });

  if (isLoading) return <LoadingState message="Carregando reviews..." />;
  if (isError || !data) return <ErrorState onRetry={() => refetch()} />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-samgat-black">Reviews</h1>
        <p className="text-samgat-gray-light text-sm mt-1">
          {data.pagination?.total || 0} reviews no total
        </p>
      </div>

      {!data.data || data.data.length === 0 ? (
        <EmptyState title="Sem reviews" message="Nenhuma review registada ainda." />
      ) : (
        <div className="space-y-3">
          {data.data.map((review: any) => (
            <div key={review.id} className="bg-white border border-samgat-gray-lighter rounded-lg p-4 sm:p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <div className="w-8 h-8 rounded-full bg-samgat-black text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                      {review.user?.name?.charAt(0).toUpperCase() || '?'}
                    </div>
                    <span className="text-sm font-medium text-samgat-black">
                      {review.user?.name || 'Anónimo'}
                    </span>
                    <StarRating value={review.rating} size="sm" />
                  </div>
                  <p className="text-xs text-samgat-gray-light mb-2">
                    {review.product?.name} · {formatDate(review.createdAt)}
                  </p>
                  {review.comment && (
                    <p className="text-sm text-samgat-gray">{review.comment}</p>
                  )}
                </div>
                <button
                  onClick={() => {
                    if (window.confirm('Remover esta review?')) {
                      deleteReview.mutate(review.id);
                    }
                  }}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                  title="Remover"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {data.pagination?.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
            Anterior
          </Button>
          <span className="text-sm text-samgat-gray-light px-3">
            Página {data.pagination.page} de {data.pagination.totalPages}
          </span>
          <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.min(data.pagination.totalPages, p + 1))} disabled={page >= data.pagination.totalPages}>
            Próxima
          </Button>
        </div>
      )}
    </div>
  );
}
