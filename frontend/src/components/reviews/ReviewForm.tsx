import { useState } from 'react';
import { useCreateReview } from '../../hooks/useReviews';
import { useOrders } from '../../hooks/useOrders';
import StarRating from './StarRating';
import Button from '../ui/Button';
import { Loader2, Star } from 'lucide-react';
import { formatKz } from '../../utils/format';

interface ReviewFormProps {
  productId: number;
  onSuccess?: () => void;
}

export default function ReviewForm({ productId, onSuccess }: ReviewFormProps) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const { data: ordersData } = useOrders(1, 50);
  const createReview = useCreateReview();

  // Filtrar pedidos que contêm este produto
  const validOrders = ordersData?.data.filter((order: any) =>
    order.order_items?.some((item: any) => item.product_id === productId)
  ) || [];

  if (validOrders.length === 0) {
    return (
      <div className="bg-samgat-off-white border border-samgat-gray-lighter rounded-lg p-6 text-center">
        <Star className="w-8 h-8 mx-auto mb-3 text-samgat-gray-lighter" />
        <p className="text-sm text-samgat-gray-light">
          Só podes avaliar produtos que já compraste.
        </p>
      </div>
    );
  }

  const handleSubmit = () => {
    if (!selectedOrderId) {
      return;
    }

    createReview.mutate(
      {
        productId,
        orderId: selectedOrderId,
        rating,
        comment: comment.trim() || undefined,
      },
      {
        onSuccess: () => {
          setComment('');
          setRating(5);
          setSelectedOrderId(null);
          onSuccess?.();
        },
      }
    );
  };

  return (
    <div className="bg-white border border-samgat-gray-lighter rounded-lg p-5 sm:p-6">
      <h3 className="text-base font-semibold text-samgat-black mb-4">
        Avaliar produto
      </h3>

      {/* Escolher pedido */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-samgat-black mb-2">
          Qual pedido?
        </label>
        <select
          value={selectedOrderId || ''}
          onChange={(e) => setSelectedOrderId(Number(e.target.value) || null)}
          className="w-full px-3 py-2 border border-samgat-gray-lighter rounded-lg text-sm focus:outline-none focus:border-samgat-black"
        >
          <option value="">Selecione um pedido</option>
          {validOrders.map((order: any) => (
            <option key={order.id} value={order.id}>
              Pedido #{order.id} — {formatKz(Number(order.total))}
            </option>
          ))}
        </select>
      </div>

      {/* Rating */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-samgat-black mb-2">
          Classificação
        </label>
        <StarRating value={rating} onChange={setRating} size="lg" />
      </div>

      {/* Comentário */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-samgat-black mb-2">
          Comentário (opcional)
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          maxLength={1000}
          placeholder="Conta-nos a tua experiência com este produto..."
          className="w-full px-3 py-2 border border-samgat-gray-lighter rounded-lg text-sm focus:outline-none focus:border-samgat-black resize-none"
        />
        <p className="text-xs text-samgat-gray-light mt-1 text-right">
          {comment.length}/1000
        </p>
      </div>

      <Button
        onClick={handleSubmit}
        disabled={!selectedOrderId || createReview.isPending}
        className="w-full sm:w-auto"
      >
        {createReview.isPending ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
            A publicar...
          </>
        ) : (
          'Publicar Review'
        )}
      </Button>
    </div>
  );
}
