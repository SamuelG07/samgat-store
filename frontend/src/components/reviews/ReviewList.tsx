import { useState } from 'react';
import { useProductReviews } from '../../hooks/useReviews';
import StarRating from './StarRating';
import { formatDate } from '../../utils/format';
import Button from '../ui/Button';
import { User, MessageSquare } from 'lucide-react';

interface ReviewListProps {
  productId: number;
}

export default function ReviewList({ productId }: ReviewListProps) {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError } = useProductReviews(productId, page, 10);

  if (isLoading) {
    return (
      <div className="py-8 text-center text-sm text-samgat-gray-light">
        Carregando reviews...
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="py-8 text-center text-sm text-samgat-gray-light">
        Erro ao carregar reviews
      </div>
    );
  }

  return (
    <div>
      {/* Resumo */}
      {data.stats.total > 0 && (
        <div className="bg-samgat-off-white border border-samgat-gray-lighter rounded-lg p-4 sm:p-6 mb-6">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="text-center">
              <p className="text-4xl font-bold text-samgat-black">{data.stats.average.toFixed(1)}</p>
              <StarRating value={data.stats.average} size="sm" />
              <p className="text-xs text-samgat-gray-light mt-1">{data.stats.total} review(s)</p>
            </div>
            <div className="flex-1 min-w-[200px]">
              {[5, 4, 3, 2, 1].map((stars) => {
                const count = data.data.filter((r) => Math.round(r.rating) === stars).length;
                const percentage = data.stats.total > 0 ? (count / data.stats.total) * 100 : 0;
                return (
                  <div key={stars} className="flex items-center gap-2 text-xs mb-1">
                    <span className="w-8 text-samgat-gray">{stars}★</span>
                    <div className="flex-1 h-1.5 bg-samgat-gray-lighter rounded-full overflow-hidden">
                      <div className="h-full bg-samgat-black rounded-full" style={{ width: `${percentage}%` }} />
                    </div>
                    <span className="w-8 text-right text-samgat-gray-light">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Lista */}
      {data.data.length === 0 ? (
        <div className="text-center py-12 bg-white border border-samgat-gray-lighter rounded-lg">
          <MessageSquare className="w-10 h-10 mx-auto mb-3 text-samgat-gray-lighter" />
          <p className="text-sm text-samgat-gray-light">Ainda não há reviews para este produto.</p>
          <p className="text-xs text-samgat-gray-lighter mt-1">Sê o primeiro a avaliar!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {data.data.map((review) => (
            <div key={review.id} className="bg-white border border-samgat-gray-lighter rounded-lg p-4 sm:p-5">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-samgat-black text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                  {review.user.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div>
                      <p className="text-sm font-medium text-samgat-black">{review.user.name}</p>
                      <p className="text-xs text-samgat-gray-light">{formatDate(review.createdAt)}</p>
                    </div>
                    <StarRating value={review.rating} size="sm" />
                  </div>
                  {review.comment && (
                    <p className="text-sm text-samgat-gray mt-2 leading-relaxed">{review.comment}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Paginação */}
      {data.pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
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
