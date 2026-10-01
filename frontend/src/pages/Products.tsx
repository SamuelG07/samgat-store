import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { useCategories } from '../hooks/useCategories';
import ProductCard from '../components/products/ProductCard';
import Skeleton from '../components/ui/Skeleton';
import EmptyState from '../components/ui/EmptyState';
import ErrorState from '../components/ui/ErrorState';
import Button from '../components/ui/Button';

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [searchInput, setSearchInput] = useState(search);
  const [category, setCategory] = useState<number | undefined>(
    searchParams.get('category') ? Number(searchParams.get('category')) : undefined
  );
  const [sort, setSort] = useState(searchParams.get('sort') || 'newest');
  const [page, setPage] = useState(
    searchParams.get('page') ? Number(searchParams.get('page')) : 1
  );

  const { data: categories } = useCategories();

  const { data, isLoading, isError, refetch } = useProducts({
    page,
    limit: 12,
    search: search || undefined,
    category,
    sort,
  });

  // Sincronizar URL
  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (category) params.set('category', String(category));
    if (sort !== 'newest') params.set('sort', sort);
    if (page > 1) params.set('page', String(page));
    setSearchParams(params, { replace: true });
  }, [search, category, sort, page, setSearchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-samgat-black">Produtos</h1>
        <p className="text-samgat-gray-light mt-2">
          {data?.pagination.total ?? 0} produtos encontrados
        </p>
      </div>

      {/* Filtros */}
      <div className="bg-white border border-samgat-gray-lighter rounded-lg p-4 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Busca */}
          <form onSubmit={handleSearch} className="flex gap-2 md:col-span-1">
            <input
              type="text"
              placeholder="Buscar produtos..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="flex-1 px-3 py-2 border border-samgat-gray-lighter rounded-lg text-sm focus:outline-none focus:border-samgat-black"
            />
            <Button type="submit" size="sm">Buscar</Button>
          </form>

          {/* Categoria */}
          <select
            value={category ?? ''}
            onChange={(e) => {
              setCategory(e.target.value ? Number(e.target.value) : undefined);
              setPage(1);
            }}
            className="px-3 py-2 border border-samgat-gray-lighter rounded-lg text-sm focus:outline-none focus:border-samgat-black"
          >
            <option value="">Todas as categorias</option>
            {categories?.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>

          {/* Ordenação */}
          <select
            value={sort}
            onChange={(e) => { setSort(e.target.value); setPage(1); }}
            className="px-3 py-2 border border-samgat-gray-lighter rounded-lg text-sm focus:outline-none focus:border-samgat-black"
          >
            <option value="newest">Mais recentes</option>
            <option value="price_asc">Preço (menor primeiro)</option>
            <option value="price_desc">Preço (maior primeiro)</option>
            <option value="name">Nome (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Conteúdo */}
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="aspect-square" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      ) : isError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : data?.data.length === 0 ? (
        <EmptyState
          title="Nenhum produto encontrado"
          message="Tente ajustar os filtros ou a busca."
          action={
            <Button
              variant="outline"
              onClick={() => {
                setSearch('');
                setSearchInput('');
                setCategory(undefined);
                setSort('newest');
                setPage(1);
              }}
            >
              Limpar Filtros
            </Button>
          }
        />
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
            {data?.data.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Paginação */}
          {data && data.pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Anterior
              </Button>
              <span className="text-sm text-samgat-gray-light px-4">
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
        </>
      )}
    </div>
  );
}
