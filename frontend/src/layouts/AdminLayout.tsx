import { ReactNode } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';

interface AdminLayoutProps {
  children: ReactNode;
}

const navItems = [
  { to: '/admin', label: 'Dashboard', end: true },
  { to: '/admin/products', label: 'Produtos' },
  { to: '/admin/categories', label: 'Categorias' },
  { to: '/admin/inventory', label: 'Stock' },
  { to: '/admin/orders', label: 'Pedidos' },
  { to: '/admin/users', label: 'Usuários' },
  { to: '/admin/stock-movements', label: 'Movimentações' },
];

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logout realizado');
      navigate('/login');
    } catch {
      toast.error('Erro ao fazer logout');
    }
  };

  return (
    <div className="h-screen flex overflow-hidden bg-samgat-off-white">
      <aside className="w-64 bg-samgat-black text-white flex flex-col flex-shrink-0">
        <div className="p-6 border-b border-samgat-gray flex-shrink-0">
          <h1 className="text-xl font-bold">Samgat Store</h1>
          <p className="text-xs text-samgat-gray-lighter mt-1">Painel Administrativo</p>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-white text-samgat-black'
                    : 'text-samgat-gray-lighter hover:bg-samgat-dark hover:text-white'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-samgat-gray flex-shrink-0">
          <div className="mb-3">
            <p className="text-sm font-medium text-white truncate">{user?.name}</p>
            <p className="text-xs text-samgat-gray-lighter truncate">{user?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full bg-samgat-dark text-white text-sm py-2 rounded-lg hover:bg-samgat-gray transition-colors"
          >
            Sair
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-samgat-gray-lighter px-8 py-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-samgat-black">Painel Administrativo</h2>
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-samgat-gray-light hover:text-samgat-black transition-colors"
            >
              Ver Loja →
            </a>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8">{children}</main>
      </div>
    </div>
  );
}
