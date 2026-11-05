import { ReactNode, useState, FormEvent } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  Store, Home, Package, LayoutGrid, ShoppingBag, ShoppingCart,
  LogIn, UserPlus, LogOut, Menu, X, User, Phone, Mail, MapPin,
  Share2, MessageCircle, Search, Heart,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useWishlist } from '../hooks/useWishlist';
import toast from 'react-hot-toast';

interface PublicLayoutProps {
  children: ReactNode;
}

export default function PublicLayout({ children }: PublicLayoutProps) {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleLogout = async () => {
    await logout();
    toast.success('Sessão encerrada');
    navigate('/');
    setMobileOpen(false);
  };

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    const term = searchTerm.trim();
    if (term) {
      navigate(`/produtos?search=${encodeURIComponent(term)}`);
      setSearchTerm('');
      setMobileOpen(false);
    }
  };

  const navLinks = [
    { to: '/', label: 'Início', icon: Home, end: true },
    { to: '/produtos', label: 'Produtos', icon: ShoppingBag, end: false },
    { to: '/categorias', label: 'Categorias', icon: LayoutGrid, end: false },
  ];

  if (isAuthenticated) {
    navLinks.push({ to: '/pedidos', label: 'Meus Pedidos', icon: Package, end: false });
  }

  const isAdmin = user?.role === 'ADMIN';

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <header className="sticky top-0 z-40 bg-white border-b border-samgat-gray-lighter">
        {/* ===== LINHA 1 — Logo + Nav + User ===== */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-3">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 text-xl font-bold text-samgat-black flex-shrink-0">
              <Store className="w-6 h-6" />
              <span className="hidden sm:inline">Samgat Store</span>
            </Link>

            {/* Nav links desktop */}
            <nav className="hidden lg:flex items-center gap-5 flex-1 justify-center">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.end}
                  className={({ isActive }) =>
                    `flex items-center gap-1.5 text-sm font-medium transition-colors ${
                      isActive ? 'text-samgat-black' : 'text-samgat-gray-light hover:text-samgat-black'
                    }`
                  }
                >
                  <link.icon className="w-4 h-4" />
                  {link.label}
                </NavLink>
              ))}
            </nav>

            {/* Right side */}
            <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
              <Link
                to="/carrinho"
                className="flex items-center gap-1.5 text-sm font-medium text-samgat-black hover:opacity-70 transition-opacity p-2"
              >
                <ShoppingCart className="w-5 h-5" />
                <span className="hidden lg:inline">Carrinho</span>
              </Link>

              <div className="hidden md:flex items-center gap-2 lg:gap-3">
                {isAuthenticated ? (
                  <>
                    {isAdmin && (
                      <Link
                        to="/admin"
                        className="text-sm font-medium bg-samgat-black text-white px-3 py-1.5 rounded-lg hover:bg-samgat-dark transition-colors"
                      >
                        Painel
                      </Link>
                    )}
                    <div className="hidden lg:flex items-center gap-1.5 text-sm text-samgat-gray-light">
                      <User className="w-4 h-4" />
                      <span className="max-w-[100px] truncate">{user?.name}</span>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-1.5 text-sm text-samgat-gray-light hover:text-samgat-black transition-colors p-2"
                      title="Sair"
                    >
                      <LogOut className="w-4 h-4" />
                      <span className="hidden lg:inline">Sair</span>
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="flex items-center gap-1.5 text-sm font-medium text-samgat-black hover:opacity-70">
                      <LogIn className="w-4 h-4" />
                      <span className="hidden lg:inline">Entrar</span>
                    </Link>
                    <Link
                      to="/register"
                      className="flex items-center gap-1.5 text-sm font-medium bg-samgat-black text-white px-3 py-2 rounded-lg hover:bg-samgat-dark transition-colors"
                    >
                      <UserPlus className="w-4 h-4" />
                      <span className="hidden lg:inline">Criar Conta</span>
                    </Link>
                  </>
                )}
              </div>

              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden text-samgat-black p-2"
                aria-label="Menu"
              >
                {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* ===== LINHA 2 — BARRA DE PESQUISA (full width) ===== */}
        <div className="border-t border-samgat-gray-lighter bg-samgat-off-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-samgat-gray-light pointer-events-none" />
              <input
                type="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Pesquisar produtos, categorias..."
                className="w-full pl-12 pr-28 py-2.5 sm:py-3 border border-samgat-gray-lighter rounded-lg text-sm sm:text-base focus:outline-none focus:border-samgat-black bg-white transition-colors"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-samgat-black text-white px-4 sm:px-6 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm font-medium hover:bg-samgat-dark transition-colors"
              >
                Pesquisar
              </button>
            </form>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-samgat-gray-lighter bg-white">
            <nav className="px-4 py-4 space-y-2">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.end}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-2 text-sm font-medium py-2 ${
                      isActive ? 'text-samgat-black' : 'text-samgat-gray-light'
                    }`
                  }
                >
                  <link.icon className="w-4 h-4" />
                  {link.label}
                </NavLink>
              ))}

              <div className="pt-3 border-t border-samgat-gray-lighter space-y-2">
                {isAuthenticated ? (
                  <>
                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setMobileOpen(false)}
                        className="block text-sm font-medium bg-samgat-black text-white px-4 py-2 rounded-lg text-center"
                      >
                        Painel Admin
                      </Link>
                    )}
                    <div className="flex items-center gap-2 py-2 text-sm text-samgat-gray-light">
                      <User className="w-4 h-4" />
                      {user?.name}
                    </div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full text-left text-sm font-medium text-samgat-gray-light py-2"
                    >
                      <LogOut className="w-4 h-4" />
                      Sair
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2 text-sm font-medium text-samgat-black py-2"
                    >
                      <LogIn className="w-4 h-4" />
                      Entrar
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center justify-center gap-2 text-sm font-medium bg-samgat-black text-white px-4 py-2 rounded-lg"
                    >
                      <UserPlus className="w-4 h-4" />
                      Criar Conta
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </header>

      <main className="flex-1">{children}</main>

      <footer className="bg-samgat-black text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-3">
                <Store className="w-5 h-5" />
                <h3 className="text-lg font-bold">Samgat Store</h3>
              </div>
              <p className="text-sm text-samgat-gray-lighter leading-relaxed">
                A sua loja virtual em Angola. Produtos selecionados, entrega rápida e compra segura.
              </p>
            </div>

            <div>
              <h4 className="text-sm font-semibold mb-3">Navegação</h4>
              <ul className="space-y-2 text-sm text-samgat-gray-lighter">
                <li><Link to="/" className="flex items-center gap-2 hover:text-white transition-colors"><Home className="w-3.5 h-3.5" />Início</Link></li>
                <li><Link to="/produtos" className="flex items-center gap-2 hover:text-white transition-colors"><ShoppingBag className="w-3.5 h-3.5" />Produtos</Link></li>
                <li><Link to="/categorias" className="flex items-center gap-2 hover:text-white transition-colors"><LayoutGrid className="w-3.5 h-3.5" />Categorias</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold mb-3">Contacto</h4>
              <ul className="space-y-2 text-sm text-samgat-gray-lighter">
                <li className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 flex-shrink-0" /><span>+244 923 000 000</span></li>
                <li className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 flex-shrink-0" /><span>info@samgatstore.com</span></li>
                <li className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 flex-shrink-0" /><span>Luanda, Angola</span></li>
              </ul>
              <div className="flex gap-3 mt-4">
                <a href="#" className="hover:text-white transition-colors" aria-label="Partilhar"><Share2 className="w-5 h-5" /></a>
                <a href="#" className="hover:text-white transition-colors" aria-label="WhatsApp"><MessageCircle className="w-5 h-5" /></a>
              </div>
            </div>
          </div>

          <div className="border-t border-samgat-gray mt-8 pt-6 text-center text-xs text-samgat-gray-lighter">
            © {new Date().getFullYear()} Samgat Store. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}
