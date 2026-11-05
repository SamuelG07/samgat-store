import { Link, useNavigate } from 'react-router-dom';
import { Plus, Check, Loader2, Heart } from 'lucide-react';
import { Product } from '../../types/store';
import { useAddToCart } from '../../hooks/useCart';
import { useAuth } from '../../contexts/AuthContext';
import { useWishlist } from '../../hooks/useWishlist';
import { formatKz } from '../../utils/format';
import toast from 'react-hot-toast';

export default function ProductCard({ product }: { product: Product }) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const addToCart = useAddToCart();
  const wishlist = useWishlist();
  const inWishlist = wishlist.has(product.id);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.error('Faça login para adicionar ao carrinho');
      navigate('/login', { state: { from: { pathname: '/produtos' } } });
      return;
    }
    addToCart.mutate({ productId: product.id, quantity: 1 });
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    wishlist.toggle(product.id);
    toast.success(inWishlist ? 'Removido dos favoritos' : 'Adicionado aos favoritos');
  };

  return (
    <Link
      to={`/produtos/${product.id}`}
      className="group block bg-white border border-samgat-gray-lighter rounded-lg overflow-hidden hover:border-samgat-black transition-colors"
    >
      <div className="relative aspect-square bg-samgat-off-white overflow-hidden">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-samgat-gray-light text-sm">
            Sem imagem
          </div>
        )}

        {/* Wishlist */}
        <button
          onClick={handleWishlist}
          className="absolute top-2 right-2 w-9 h-9 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow-sm hover:bg-white transition-all z-10"
          aria-label="Favorito"
          title={inWishlist ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              inWishlist ? 'fill-red-500 text-red-500' : 'text-samgat-gray-light'
            }`}
          />
        </button>

        {/* Quick add */}
        {product.is_active && (
          <button
            onClick={handleQuickAdd}
            disabled={addToCart.isPending}
            className="absolute bottom-2 right-2 w-10 h-10 rounded-full bg-samgat-black text-white flex items-center justify-center shadow-lg hover:bg-samgat-dark transition-all hover:scale-110 disabled:opacity-70 disabled:cursor-not-allowed z-10"
            aria-label="Adicionar ao carrinho"
            title="Adicionar ao carrinho"
          >
            {addToCart.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : addToCart.isSuccess ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
          </button>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-medium text-samgat-black text-sm mb-1 line-clamp-2 min-h-[2.5rem]">
          {product.name}
        </h3>
        <p className="text-base font-bold text-samgat-black">
          {formatKz(Number(product.price))}
        </p>
      </div>
    </Link>
  );
}
