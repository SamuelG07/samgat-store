import { Link, useNavigate } from 'react-router-dom';
import { useCart, useUpdateCartItem, useRemoveCartItem, useClearCart } from '../hooks/useCart';
import { ordersApi } from '../services/storeApi';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import Button from '../components/ui/Button';
import EmptyState from '../components/ui/EmptyState';
import Spinner from '../components/ui/Spinner';
import { formatKz } from '../utils/format';
import { useState } from 'react';

export default function Cart() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: cart, isLoading } = useCart();
  const updateItem = useUpdateCartItem();
  const removeItem = useRemoveCartItem();
  const clearCart = useClearCart();
  const [confirmCheckout, setConfirmCheckout] = useState(false);

  const checkout = useMutation({
    mutationFn: () => ordersApi.checkout(),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast.success('Pedido realizado com sucesso!');
      navigate(`/pedidos/${result.data.order.id}`);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erro ao finalizar pedido');
    },
  });

  if (isLoading) return <Spinner />;

  if (!cart || cart.items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <EmptyState
          title="O seu carrinho está vazio"
          message="Adicione produtos para começar a comprar."
          action={
            <Link to="/produtos">
              <Button>Explorar Produtos</Button>
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl md:text-4xl font-bold text-samgat-black mb-8">
        Carrinho
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Itens */}
        <div className="lg:col-span-2 space-y-4">
          {cart.items.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-samgat-gray-lighter rounded-lg p-4 flex gap-4"
            >
              {/* Imagem */}
              <div className="w-24 h-24 bg-samgat-off-white rounded-lg overflow-hidden flex-shrink-0">
                {item.product.image_url ? (
                  <img
                    src={item.product.image_url}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-samgat-gray-light">
                    Sem imagem
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <Link
                  to={`/produtos/${item.productId}`}
                  className="font-medium text-samgat-black hover:underline line-clamp-2"
                >
                  {item.product.name}
                </Link>
                <p className="text-sm text-samgat-gray-light mt-1">
                  {formatKz(Number(item.product.price))} cada
                </p>

                {/* Controles */}
                <div className="flex items-center gap-3 mt-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        updateItem.mutate({ itemId: item.id, quantity: Math.max(1, item.quantity - 1) })
                      }
                      disabled={item.quantity <= 1 || updateItem.isPending}
                      className="w-8 h-8 border border-samgat-gray-lighter rounded hover:bg-samgat-off-white disabled:opacity-50 text-sm"
                    >
                      −
                    </button>
                    <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                    <button
                      onClick={() =>
                        updateItem.mutate({ itemId: item.id, quantity: item.quantity + 1 })
                      }
                      disabled={updateItem.isPending}
                      className="w-8 h-8 border border-samgat-gray-lighter rounded hover:bg-samgat-off-white disabled:opacity-50 text-sm"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => removeItem.mutate(item.id)}
                    disabled={removeItem.isPending}
                    className="text-xs text-red-600 hover:underline ml-auto disabled:opacity-50"
                  >
                    Remover
                  </button>
                </div>
              </div>

              {/* Subtotal */}
              <div className="text-right flex-shrink-0">
                <p className="font-bold text-samgat-black">
                  {formatKz(item.subtotal)}
                </p>
              </div>
            </div>
          ))}

          {/* Limpar carrinho */}
          <div className="pt-2">
            <button
              onClick={() => clearCart.mutate()}
              disabled={clearCart.isPending}
              className="text-sm text-samgat-gray-light hover:text-red-600 disabled:opacity-50"
            >
              Limpar carrinho
            </button>
          </div>
        </div>

        {/* Resumo */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-samgat-gray-lighter rounded-lg p-6 sticky top-24">
            <h2 className="text-lg font-semibold text-samgat-black mb-4">
              Resumo do Pedido
            </h2>

            <div className="space-y-3 mb-6 text-sm">
              <div className="flex justify-between text-samgat-gray">
                <span>Itens</span>
                <span>{cart.totalItems}</span>
              </div>
              <div className="flex justify-between text-samgat-gray">
                <span>Subtotal</span>
                <span>{formatKz(cart.subtotal)}</span>
              </div>
              <div className="border-t border-samgat-gray-lighter pt-3 flex justify-between font-bold text-samgat-black text-base">
                <span>Total</span>
                <span>{formatKz(cart.subtotal)}</span>
              </div>
            </div>

            <Button
              size="lg"
              className="w-full"
              onClick={() => setConfirmCheckout(true)}
            >
              Finalizar Pedido
            </Button>

            <Link to="/produtos" className="block text-center text-xs text-samgat-gray-light hover:text-samgat-black mt-4">
              Continuar a comprar
            </Link>
          </div>
        </div>
      </div>

      {/* Modal Confirmar */}
      {confirmCheckout && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-samgat-black mb-2">
              Confirmar Pedido
            </h3>
            <p className="text-sm text-samgat-gray mb-4">
              Ao confirmar, o seu pedido será criado com {cart.totalItems} item(s) no total de{' '}
              <strong>{formatKz(cart.subtotal)}</strong>.
            </p>

            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setConfirmCheckout(false)}>
                Cancelar
              </Button>
              <Button
                className="flex-1"
                onClick={() => checkout.mutate()}
                isLoading={checkout.isPending}
              >
                Confirmar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
