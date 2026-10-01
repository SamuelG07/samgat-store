import { ReactNode, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

interface PublicLayoutProps {
  children: ReactNode;
}

export default function PublicLayout({ children }: PublicLayoutProps) {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    toast.success('Sessão encerrada');
    navigate('/');
    setMobileOpen(false);
  };

  const navLinks = [
    { to: '/', label: 'Início' },
    { to: '/produtos', label: 'Produtos' },
    { to: '/categorias', label: 'Categorias' },
  ];

  if (isAuthenticated) {
    navLinks.push({ to: '/pedidos', label: 'Meus Pedidos' });
  }

  const isAdmin = user?.role === 'ADMIN';

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <header className="sticky top-0 z-40 bg-white border-b border-samgat-gray-lighter">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="text-xl font-bold text-samgat-black">
              Samgat Store
            </Link>

            <nav className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === '/'}
                  className={({ isActive }) =>
                    `text-sm font-medium transition-colors ${
                      isActive ? 'text-samgat-black' : 'text-samgat-gray-light hover:text-samgat-black'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>

            <div className="flex items-center gap-3">
              <Link
                to="/carrinho"
                className="text-sm font-medium text-samgat-black hover:opacity-70 transition-opacity"
              >
                Carrinho
              </Link>

              <div className="hidden md:flex items-center gap-3">
                {isAuthenticated ? (
                  <>
                    {isAdmin && (
                      <Link
                        to="/admin"
                        className="text-sm font-medium bg-samgat-black text-white px-3 py-1.5 rounded-lg hover:bg-samgat-dark transition-colors"
                      >
                        Painel Admin
                      </Link>
                    )}
                    <span className="text-sm text-samgat-gray-light">{user?.name}</span>
                    <button
                      onClick={handleLogout}
                      className="text-sm text-samgat-gray-light hover:text-samgat-black transition-colors"
                    >
                      Sair
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="text-sm font-medium text-samgat-black hover:opacity-70"
                    >
                      Entrar
                    </Link>
                    <Link
                      to="/register"
                      className="text-sm font-medium bg-samgat-black text-white px-4 py-2 rounded-lg hover:bg-samgat-dark transition-colors"
                    >
                      Criar Conta
                    </Link>
                  </>
                )}
              </div>

              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden text-samgat-black p-2"
                aria-label="Menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {mobileOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {mobileOpen && (
          <div className="md:hidden border-t border-samgat-gray-lighter bg-white">
            <nav className="px-4 py-4 space-y-3">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === '/'}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `block text-sm font-medium py-2 ${
                      isActive ? 'text-samgat-black' : 'text-samgat-gray-light'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}

              <div className="pt-3 border-t border-samgat-gray-lighter">
                {isAuthenticated ? (
                  <>
                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setMobileOpen(false)}
                        className="block text-sm font-medium bg-samgat-black text-white px-4 py-2 rounded-lg text-center mb-2"
                      >
                        Painel Admin
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left text-sm font-medium text-samgat-gray-light py-2"
                    >
                      Sair ({user?.name})
                    </button>
                  </>
                ) : (
                  <div className="space-y-2">
                    <Link
                      to="/login"
                      onClick={() => setMobileOpen(false)}
                      className="block text-sm font-medium text-samgat-black py-2"
                    >
                      Entrar
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setMobileOpen(false)}
                      className="block text-sm font-medium bg-samgat-black text-white px-4 py-2 rounded-lg text-center"
                    >
                      Criar Conta
                    </Link>
                  </div>
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
              <h3 className="text-lg font-bold mb-3">Samgat Store</h3>
              <p className="text-sm text-samgat-gray-lighter leading-relaxed">
                A sua loja virtual em Angola. Produtos selecionados, entrega rápida e compra segura.
              </p>
            </div>

            <div>
              <h4 className="text-sm font-semibold mb-3">Navegação</h4>
              <ul className="space-y-2 text-sm text-samgat-gray-lighter">
                <li><Link to="/" className="hover:text-white">Início</Link></li>
                <li><Link to="/produtos" className="hover:text-white">Produtos</Link></li>
                <li><Link to="/categorias" className="hover:text-white">Categorias</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold mb-3">Conta</h4>
              <ul className="space-y-2 text-sm text-samgat-gray-lighter">
                <li><Link to="/login" className="hover:text-white">Entrar</Link></li>
                <li><Link to="/register" className="hover:text-white">Criar Conta</Link></li>
                <li><Link to="/carrinho" className="hover:text-white">Carrinho</Link></li>
              </ul>
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
