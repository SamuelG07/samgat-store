import { Link } from 'react-router-dom';
import { ShoppingBag, Truck, Shield, CreditCard, ArrowRight, Star, Quote, Mail } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useProducts } from '../hooks/useProducts';
import { useCategories } from '../hooks/useCategories';
import ProductCard from '../components/products/ProductCard';
import Skeleton from '../components/ui/Skeleton';
import SEO from '../components/seo/SEO';

const BENEFITS = [
  { icon: Truck, title: 'Entrega em todo o país', desc: 'Recebe em casa em 2-5 dias úteis.' },
  { icon: Shield, title: 'Compra 100% segura', desc: 'Pagamento protegido e dados encriptados.' },
  { icon: CreditCard, title: 'Pagamento flexível', desc: 'Transferência, Multicaixa Express ou KWiK.' },
  { icon: Star, title: 'Qualidade garantida', desc: 'Produtos selecionados e verificados.' },
];

const TESTIMONIALS = [
  { name: 'Maria Silva', role: 'Cliente · Luanda', text: 'Excelente atendimento! O produto chegou em perfeitas condições e antes do prazo previsto.' },
  { name: 'João Manuel', role: 'Cliente · Benguela', text: 'Comprei um smartphone e fiquei impressionado com a rapidez da entrega. Recomendo!' },
  { name: 'Ana Costa', role: 'Cliente · Huambo', text: 'Loja de confiança. O processo de compra foi simples e o suporte sempre disponível.' },
];

export default function Home() {
  const [email, setEmail] = useState('');
  const { data: products, isLoading: loadingProducts } = useProducts({ limit: 8, sort: 'newest' });
  const { data: categories, isLoading: loadingCategories } = useCategories();

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast.success('Inscrição recebida! Entraremos em contacto.');
      setEmail('');
    }
  };

  return (
    <div>
      <SEO title="Samgat Store — Loja Virtual em Angola" />

      {/* Hero */}
      <section className="relative bg-samgat-black text-white overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url(https://previews.123rf.com/images/bodnarphoto/bodnarphoto1803/bodnarphoto180300249/98219436-many-smartphones-are-on-the-table-in-the-technology-store-buying-a-mobile-phone-at-the-electronics.jpg)', backgroundColor: '#1A1A1A' }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="max-w-2xl">
            <p className="text-xs sm:text-sm uppercase tracking-[0.2em] text-samgat-gray-lighter mb-4">
              Samgat Store · Angola
            </p>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              A sua loja virtual em Angola
            </h1>
            <p className="text-lg md:text-xl text-samgat-gray-lighter mb-8 leading-relaxed">
              Produtos selecionados, compra segura e entrega em todo o país.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/produtos" className="inline-flex items-center gap-2 bg-white text-samgat-black px-6 py-3 rounded-lg font-medium hover:bg-samgat-off-white transition-colors">
                <ShoppingBag className="w-4 h-4" />
                Explorar Produtos
              </Link>
              <Link to="/categorias" className="inline-flex items-center gap-2 border border-white/60 text-white px-6 py-3 rounded-lg font-medium hover:bg-white hover:text-samgat-black transition-colors backdrop-blur-sm">
                Ver Categorias
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Benefícios */}
      <section className="bg-white border-b border-samgat-gray-lighter">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {BENEFITS.map((b, i) => (
              <div key={i} className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-lg bg-samgat-black text-white flex items-center justify-center mb-3">
                  <b.icon className="w-6 h-6" />
                </div>
                <p className="text-sm font-medium text-samgat-black">{b.title}</p>
                <p className="text-xs text-samgat-gray-light mt-1">{b.desc}</p>
              </div>
            ))}
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
          <Link to="/categorias" className="text-sm text-samgat-black hover:underline flex items-center gap-1">
            Ver todas <ArrowRight className="w-3 h-3" />
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
                className="group bg-white border border-samgat-gray-lighter rounded-lg p-6 text-center hover:border-samgat-black hover:shadow-sm transition-all"
              >
                <div className="w-10 h-10 rounded-lg bg-samgat-off-white flex items-center justify-center mx-auto mb-3 group-hover:bg-samgat-black group-hover:text-white transition-colors">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <p className="font-medium text-samgat-black">{cat.name}</p>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Produtos em destaque */}
      <section className="bg-samgat-off-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-samgat-black">Produtos em Destaque</h2>
              <p className="text-samgat-gray-light text-sm mt-1">Os mais recentes da nossa loja</p>
            </div>
            <Link to="/produtos" className="text-sm text-samgat-black hover:underline flex items-center gap-1">
              Ver todos <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {loadingProducts ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => <Skeleton key={i} className="aspect-square" />)}
            </div>
          ) : products?.data.length === 0 ? (
            <p className="text-samgat-gray-light text-center py-12">Ainda não há produtos disponíveis.</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {products?.data.map((product) => <ProductCard key={product.id} product={product} />)}
            </div>
          )}
        </div>
      </section>

      {/* Depoimentos */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-samgat-black">O que dizem os nossos clientes</h2>
          <p className="text-samgat-gray-light text-sm mt-1">Histórias reais de quem já comprou</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <div key={i} className="bg-white border border-samgat-gray-lighter rounded-lg p-6">
              <Quote className="w-6 h-6 text-samgat-gray-lighter mb-3" />
              <p className="text-sm text-samgat-gray leading-relaxed mb-4">{t.text}</p>
              <div className="flex items-center gap-3 pt-3 border-t border-samgat-gray-lighter">
                <div className="w-9 h-9 rounded-full bg-samgat-black text-white flex items-center justify-center text-sm font-bold">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-medium text-samgat-black">{t.name}</p>
                  <p className="text-xs text-samgat-gray-light">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-samgat-black text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <Mail className="w-10 h-10 mx-auto mb-4 text-samgat-gray-lighter" />
          <h2 className="text-2xl md:text-3xl font-bold mb-3">Receba as melhores ofertas</h2>
          <p className="text-samgat-gray-lighter text-sm mb-6">
            Subscreve a nossa newsletter e recebe promoções exclusivas antes de todos.
          </p>
          <form onSubmit={handleNewsletter} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
              className="flex-1 px-4 py-3 rounded-lg text-samgat-black text-sm focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button type="submit" className="bg-white text-samgat-black px-6 py-3 rounded-lg font-medium hover:bg-samgat-off-white transition-colors">
              Subscrever
            </button>
          </form>
        </div>
      </section>

      {/* CTA Final */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-samgat-black mb-4">Pronto para começar?</h2>
        <p className="text-samgat-gray mb-8">Explore o nosso catálogo completo</p>
        <Link to="/produtos" className="inline-flex items-center gap-2 bg-samgat-black text-white px-8 py-3 rounded-lg font-medium hover:bg-samgat-dark transition-colors">
          Ver Todos os Produtos
          <ArrowRight className="w-4 h-4" />
        </Link>
      </section>
    </div>
  );
}
