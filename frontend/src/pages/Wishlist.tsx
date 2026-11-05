import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Heart, Trash2 } from 'lucide-react';
import { api } from '../services/api';
import { useWishlist } from '../hooks/useWishlist';
import ProductCard from '../components/products/ProductCard';
import Button from '../components/ui/Button';
import EmptyState from '../components/ui/EmptyState';
import Skeleton from '../components/ui/Skeleton';
import SEO from '../components/seo/SEO';
import { Product } from '../types/store';

export default function Wishlist() {
  const wishlist = useWishlist();
  const { data, isLoading } = useQuery({
    queryKey: ['products', 'wishlist', wishlist.items],
    queryFn: async () => {
      if (wishlist.items.length === 0) return [];
      const results = await Promise.all(
        wishlist.items.map((id) =>
          api.get(`/products/${id}`).then((r) => r.data.data).catch(() => null)
        )
      );
      return results.filter(Boolean) as Product[];
    },
    enabled: wishlist.items.length > 0,
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <SEO title="Lista de Desejos | Samgat Store" description="Produtos que guardaste para mais tarde." />

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-samgat-black flex items-center gap-2">
            <Heart className="w-7 h-7 fill-red-500 text-red-500" />
            Lista de Desejos
          </h1>
          <p className="text-samgat-gray-light mt-1">{wishlist.count} produto(s) guardado(s)</p>
        </div>
        {wishlist.count > 0 && (
          <Button variant="outline" size="sm" onClick={wishlist.clear}>
            <Trash2 className="w-4 h-4 mr-1" /> Limpar tudo
          </Button>
        )}
      </div>

      {wishlist.count === 0 ? (
        <EmptyState
          title="Lista vazia"
          message="Guarda produtos que gostas para os encontrares depois."
          action={<Link to="/produtos"><Button>Explorar Produtos</Button></Link>}
        />
      ) : isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(wishlist.count)].map((_, i) => <Skeleton key={i} className="aspect-square" />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {data?.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      )}
    </div>
  );
}
