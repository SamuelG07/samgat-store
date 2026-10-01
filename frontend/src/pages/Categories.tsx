import { Link } from 'react-router-dom';
import { useCategories } from '../hooks/useCategories';
import Skeleton from '../components/ui/Skeleton';
import ErrorState from '../components/ui/ErrorState';

export default function Categories() {
  const { data: categories, isLoading, isError, refetch } = useCategories();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-samgat-black">Categorias</h1>
        <p className="text-samgat-gray-light mt-2">Explore os nossos produtos por categoria</p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-32" />)}
        </div>
      ) : isError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : categories?.length === 0 ? (
        <p className="text-center py-12 text-samgat-gray-light">Nenhuma categoria disponível.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {categories?.map((cat) => (
            <Link
              key={cat.id}
              to={`/produtos?category=${cat.id}`}
              className="block bg-white border border-samgat-gray-lighter rounded-lg p-6 hover:border-samgat-black transition-colors"
            >
              <h3 className="text-lg font-semibold text-samgat-black mb-2">{cat.name}</h3>
              {cat.description && (
                <p className="text-sm text-samgat-gray-light line-clamp-2">{cat.description}</p>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
