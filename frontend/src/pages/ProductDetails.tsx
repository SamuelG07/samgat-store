import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Star, Heart, Package, Truck, Shield, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { useProduct, useProducts } from '../hooks/useProducts';
import { useAuth } from '../contexts/AuthContext';
import { useAddToCart } from '../hooks/useCart';
import { useProductReviews } from '../hooks/useReviews';
import { useWishlist } from '../hooks/useWishlist';
import Button from '../components/ui/Button';
import Skeleton from '../components/ui/Skeleton';
import ErrorState from '../components/ui/ErrorState';
import Badge from '../components/ui/Badge';
import ProductCard from '../components/products/ProductCard';
import ReviewList from '../components/reviews/ReviewList';
import ReviewForm from '../components/reviews/ReviewForm';
import SEO from '../components/seo/SEO';
import { formatKz } from '../utils/format';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [quantity, setQuantity] = useState(1);
  const wishlist = useWishlist();

  const productId = Number(id);
  const { data: product, isLoading, isError, refetch } = useProduct(productId);
  const { data: reviewsData } = useProductReviews(productId, 1, 1);
  const { data: related } = useProducts({
    limit: 4,
    category: product?.category_id,
    sort: 'newest',
  });
  const addToCart = useAddToCart();

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast.error('Faça login para adicionar ao carrinho');
      navigate('/login', { state: { from: { pathname: `/produtos/${id}` } } });
      return;
    }
    addToCart.mutate({ productId, quantity });
  };

  const handleWishlist = () => {
    wishlist.toggle(productId);
    toast.success(wishlist.has(productId) ? 'Removido dos favoritos' : 'Adicionado aos favoritos');
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <Skeleton className="aspect-square" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-24" />
            <Skeleton className="h-12" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <ErrorState message="Produto não encontrado" onRetry={() => refetch()} />
      </div>
    );
  }

  const inWishlist = wishlist.has(product.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <SEO
        title={`${product.name} | Samgat Store`}
        description={product.description || `Compre ${product.name} na Samgat Store`}
        image={product.image_url || undefined}
        url={`https://samgat-store.onrender.com/produtos/${product.id}`}
        type="product"
        product={{
          name: product.name,
          description: product.description || '',
          price: Number(product.price),
          image: product.image_url || '',
          sku: String(product.id),
          inStock: product.is_active,
        }}
      />

      <nav className="text-sm text-samgat-gray-light mb-6 flex items-center gap-2 flex-wrap">
        <Link to="/" className="hover:text-samgat-black">Início</Link>
        <span>/</span>
        <Link to="/produtos" className="hover:text-samgat-black">Produtos</Link>
        <span>/</span>
        <span className="text-samgat-black truncate max-w-[200px]">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        {/* Imagem */}
        <div className="aspect-square bg-samgat-off-white rounded-lg overflow-hidden border border-samgat-gray-lighter relative">
          {product.image_url ? (
            <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-samgat-gray-light">Sem imagem</div>
          )}
          <button
            onClick={handleWishlist}
            className="absolute top-3 right-3 w-11 h-11 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow-md hover:bg-white transition-all"
            aria-label="Favorito"
          >
            <Heart className={`w-5 h-5 ${inWishlist ? 'fill-red-500 text-red-500' : 'text-samgat-gray-light'}`} />
          </button>
        </div>

        {/* Detalhes */}
        <div>
          <div className="mb-4 flex items-center gap-3 flex-wrap">
            <Badge variant={product.is_active ? 'dark' : 'danger'}>
              {product.is_active ? 'Disponível' : 'Indisponível'}
            </Badge>
            {reviewsData && reviewsData.stats.total > 0 && (
              <div className="flex items-center gap-1.5 text-sm">
                <Star className="w-4 h-4 fill-samgat-black text-samgat-black" />
                <span className="font-medium text-samgat-black">{reviewsData.stats.average.toFixed(1)}</span>
                <span className="text-samgat-gray-light">({reviewsData.stats.total})</span>
              </div>
            )}
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-samgat-black mb-4">{product.name}</h1>
          <p className="text-3xl font-bold text-samgat-black mb-6">{formatKz(Number(product.price))}</p>

          {product.description && (
            <p className="text-samgat-gray leading-relaxed mb-6">{product.description}</p>
          )}

          {/* Info rápido */}
          <div className="grid grid-cols-3 gap-3 mb-6 py-4 border-y border-samgat-gray-lighter">
            <div className="text-center">
              <Truck className="w-5 h-5 mx-auto mb-1 text-samgat-black" />
              <p className="text-xs text-samgat-gray-light">Entrega 2-5 dias</p>
            </div>
            <div className="text-center">
              <Shield className="w-5 h-5 mx-auto mb-1 text-samgat-black" />
              <p className="text-xs text-samgat-gray-light">Compra segura</p>
            </div>
            <div className="text-center">
              <Package className="w-5 h-5 mx-auto mb-1 text-samgat-black" />
              <p className="text-xs text-samgat-gray-light">Em stock</p>
            </div>
          </div>

          {product.is_active && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-samgat-black mb-2">Quantidade</label>
              <div className="flex items-center gap-3">
                <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="w-10 h-10 border border-samgat-gray-lighter rounded-lg hover:bg-samgat-off-white">−</button>
                <span className="text-lg font-medium w-12 text-center">{quantity}</span>
                <button onClick={() => setQuantity((q) => Math.min(100, q + 1))} className="w-10 h-10 border border-samgat-gray-lighter rounded-lg hover:bg-samgat-off-white">+</button>
              </div>
            </div>
          )}

          <div className="space-y-3">
            <Button size="lg" onClick={handleAddToCart} disabled={!product.is_active || addToCart.isPending} isLoading={addToCart.isPending} className="w-full">
              {product.is_active ? 'Adicionar ao Carrinho' : 'Produto Indisponível'}
            </Button>
            <Link to="/produtos"><Button variant="outline" size="lg" className="w-full">Continuar a Comprar</Button></Link>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <section className="mt-16">
        <h2 className="text-2xl font-bold text-samgat-black mb-6">Avaliações</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2"><ReviewList productId={product.id} /></div>
          <div className="lg:col-span-1">
            {isAuthenticated ? (
              <ReviewForm productId={product.id} />
            ) : (
              <div className="bg-samgat-off-white border border-samgat-gray-lighter rounded-lg p-6 text-center">
                <Star className="w-8 h-8 mx-auto mb-3 text-samgat-gray-lighter" />
                <p className="text-sm text-samgat-gray-light mb-4">Faz login para avaliar este produto.</p>
                <Link to="/login"><Button size="sm">Entrar</Button></Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Relacionados */}
      {related && related.data.length > 1 && (
        <section className="mt-16">
          <div className="flex items-end justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-samgat-black">Também poderás gostar</h2>
              <p className="text-samgat-gray-light text-sm mt-1">Produtos da mesma categoria</p>
            </div>
            <Link to="/produtos" className="text-sm text-samgat-black hover:underline flex items-center gap-1">
              <ArrowLeft className="w-3 h-3 rotate-180" /> Ver todos
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {related.data.filter((p) => p.id !== product.id).slice(0, 4).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
