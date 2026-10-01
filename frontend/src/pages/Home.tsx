import { Link } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { useCategories } from '../hooks/useCategories';
import ProductCard from '../components/products/ProductCard';
import Skeleton from '../components/ui/Skeleton';

export default function Home() {
  const { data: products, isLoading: loadingProducts } = useProducts({ limit: 8, sort: 'newest' });
  const { data: categories, isLoading: loadingCategories } = useCategories();

  return (
    <div>
      {/* Hero */}
      <section className="bg-samgat-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              A sua loja virtual em Angola
            </h1>
            <p className="text-lg md:text-xl text-samgat-gray-lighter mb-8">
              Produtos selecionados, compra segura e entrega em todo o país.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/produtos"
                className="bg-white text-samgat-black px-6 py-3 rounded-lg font-medium hover:bg-samgat-off-white transition-colors"
              >
                Explorar Produtos
              </Link>
              <Link
                to="/categorias"
                className="border border-white text-white px-6 py-3 rounded-lg font-medium hover:bg-white hover:text-samgat-black transition-colors"
              >
                Ver Categorias
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categorias */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-samgat-black">Categorias</h2>
            <p className="text-samgat-gray-light text-sm mt-1">Navegue por categoria</p>
          </div>
          <Link to="/categorias" className="text-sm text-samgat-black hover:underline">
            Ver todas →
          </Link>
        </div>

        {loadingCategories ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-24" />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories?.slice(0, 8).map((cat) => (
              <Link
                key={cat.id}
                to={`/produtos?category=${cat.id}`}
                className="bg-white border border-samgat-gray-lighter rounded-lg p-6 text-center hover:border-samgat-black transition-colors"
              >
                <p className="font-medium text-samgat-black">{cat.name}</p>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Produtos em destaque */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-samgat-black">Produtos em Destaque</h2>
            <p className="text-samgat-gray-light text-sm mt-1">Os mais recentes da nossa loja</p>
          </div>
          <Link to="/produtos" className="text-sm text-samgat-black hover:underline">
            Ver todos →
          </Link>
        </div>

        {loadingProducts ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => <Skeleton key={i} className="aspect-square" />)}
          </div>
        ) : products?.data.length === 0 ? (
          <p className="text-samgat-gray-light text-center py-12">
            Ainda não há produtos disponíveis.
          </p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {products?.data.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Institucional */}
      <section className="bg-samgat-off-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-samgat-black mb-4">
            Porquê a Samgat Store?
          </h2>
          <p className="text-samgat-gray leading-relaxed">
            Somos uma loja dedicada a oferecer produtos de qualidade com uma experiência de compra
            simples, segura e transparente. Do catálogo ao checkout, tudo foi pensado para você.
          </p>
        </div>
      </section>

      {/* CTA Final */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-samgat-black mb-4">
          Pronto para começar?
        </h2>
        <p className="text-samgat-gray mb-8">Explore o nosso catálogo completo</p>
        <Link
          to="/produtos"
          className="inline-block bg-samgat-black text-white px-8 py-3 rounded-lg font-medium hover:bg-samgat-dark transition-colors"
        >
          Ver Todos os Produtos
        </Link>
      </section>
    </div>
  );
}
