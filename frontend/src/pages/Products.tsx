import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { useProducts } from '../hooks/useProducts';
import { useCategories } from '../hooks/useCategories';
import ProductCard from '../components/products/ProductCard';
import Skeleton from '../components/ui/Skeleton';
import EmptyState from '../components/ui/EmptyState';
import ErrorState from '../components/ui/ErrorState';
import Button from '../components/ui/Button';
import SEO from '../components/seo/SEO';

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [searchInput, setSearchInput] = useState(searchParams.get('search') || '');
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState<number | undefined>(
    searchParams.get('category') ? Number(searchParams.get('category')) : undefined
  );
  const [sort, setSort] = useState(searchParams.get('sort') || 'newest');
  const [page, setPage] = useState(searchParams.get('page') ? Number(searchParams.get('page')) : 1);
  const [showFilters, setShowFilters] = useState(false);

  const { data: categories } = useCategories();
  const { data, isLoading, isError, refetch } = useProducts({
    page, limit: 12, search: search || undefined, category, sort,
  });

  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (category) params.set('category', String(category));
    if (sort !== 'newest') params.set('sort', sort);
    if (page > 1) params.set('page', String(page));
    setSearchParams(params, { replace: true });
  }, [search, category, sort, page, setSearchParams]);

  const handleSearch = (e: React.FormEvent) => { e.preventDefault(); setSearch(searchInput); setPage(1); };

  const clearFilters = () => {
    setSearch(''); setSearchInput(''); setCategory(undefined); setSort('newest'); setPage(1);
  };

  const hasFilters = search || category || sort !== 'newest';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <SEO
        title="Produtos | Samgat Store"
        description="Explora o catálogo completo da Samgat Store. Produtos selecionados para entrega em todo o país."
        url="https://samgat-store.onrender.com/produtos"
      />

      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-samgat-black">Produtos</h1>
        <p className="text-samgat-gray-light mt-2">{data?.pagination.total ?? 0} produtos encontrados</p>
      </div>

      <div className="lg:grid lg:grid-cols-4 lg:gap-8">
        {/* Sidebar filtros desktop */}
        <aside className="hidden lg:block">
          <div className="bg-white border border-samgat-gray-lighter rounded-lg p-5 sticky top-32">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-samgat-black flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4" /> Filtros
              </h2>
              {hasFilters && (
                <button onClick={clearFilters} className="text-xs text-samgat-gray-light hover:text-samgat-black">
                  Limpar
                </button>
              )}
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-samgat-black mb-2">Categoria</label>
                <select
                  value={category ?? ''}
                  onChange={(e) => { setCategory(e.target.value ? Number(e.target.value) : undefined); setPage(1); }}
                  className="w-full px-3 py-2 border border-samgat-gray-lighter rounded-lg text-sm focus:outline-none focus:border-samgat-black"
                >
                  <option value="">Todas</option>
                  {categories?.map((cat) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-samgat-black mb-2">Ordenar por</label>
                <select
                  value={sort}
                  onChange={(e) => { setSort(e.target.value); setPage(1); }}
                  className="w-full px-3 py-2 border border-samgat-gray-lighter rounded-lg text-sm focus:outline-none focus:border-samgat-black"
                >
                  <option value="newest">Mais recentes</option>
                  <option value="price_asc">Preço (menor)</option>
                  <option value="price_desc">Preço (maior)</option>
                  <option value="name">Nome (A-Z)</option>
                </select>
              </div>
            </div>
          </div>
        </aside>

        <div className="lg:col-span-3">
          {/* Barra de pesquisa + toggle mobile */}
          <div className="flex gap-2 mb-6">
            <form onSubmit={handleSearch} className="flex-1 flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-samgat-gray-light" />
                <input
                  type="text"
                  placeholder="Buscar produtos..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-samgat-gray-lighter rounded-lg text-sm focus:outline-none focus:border-samgat-black"
                />
              </div>
              <Button type="submit">Buscar</Button>
            </form>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden px-4 py-2.5 border border-samgat-gray-lighter rounded-lg bg-white hover:bg-samgat-off-white"
              aria-label="Filtros"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>
          </div>

          {/* Filtros mobile */}
          {showFilters && (
            <div className="lg:hidden bg-white border border-samgat-gray-lighter rounded-lg p-4 mb-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-samgat-black">Filtros</h3>
                <button onClick={() => setShowFilters(false)} className="p-1 hover:bg-samgat-off-white rounded">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <select
                value={category ?? ''}
                onChange={(e) => { setCategory(e.target.value ? Number(e.target.value) : undefined); setPage(1); }}
                className="w-full px-3 py-2 border border-samgat-gray-lighter rounded-lg text-sm"
              >
                <option value="">Todas as categorias</option>
                {categories?.map((cat) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
              </select>
              <select
                value={sort}
                onChange={(e) => { setSort(e.target.value); setPage(1); }}
                className="w-full px-3 py-2 border border-samgat-gray-lighter rounded-lg text-sm"
              >
                <option value="newest">Mais recentes</option>
                <option value="price_asc">Preço (menor)</option>
                <option value="price_desc">Preço (maior)</option>
                <option value="name">Nome (A-Z)</option>
              </select>
              {hasFilters && <Button variant="outline" onClick={clearFilters} className="w-full">Limpar filtros</Button>}
            </div>
          )}

          {/* Grid */}
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              {[...Array(9)].map((_, i) => (
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
              action={<Button variant="outline" onClick={clearFilters}>Limpar Filtros</Button>}
            />
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-8">
                {data?.data.map((product) => <ProductCard key={product.id} product={product} />)}
              </div>

              {data && data.pagination.totalPages > 1 && (
                <div className="flex items-center justify-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>Anterior</Button>
                  <span className="text-sm text-samgat-gray-light px-4">Página {data.pagination.page} de {data.pagination.totalPages}</span>
                  <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.min(data.pagination.totalPages, p + 1))} disabled={page >= data.pagination.totalPages}>Próxima</Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
