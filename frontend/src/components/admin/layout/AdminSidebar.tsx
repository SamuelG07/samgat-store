import { NavLink, Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../../contexts/AuthContext';

interface AdminSidebarProps {
  onNavigate?: () => void;
}

const navItems = [
  { to: '/admin', label: 'Dashboard', end: true },
  { to: '/admin/products', label: 'Produtos' },
  { to: '/admin/categories', label: 'Categorias' },
  { to: '/admin/inventory', label: 'Stock' },
  { to: '/admin/orders', label: 'Pedidos' },
  { to: '/admin/payments', label: 'Pagamentos' },
  { to: '/admin/customers', label: 'Clientes' },
  { to: '/admin/admins', label: 'Administradores' },
  { to: '/admin/stock-movements', label: 'Movimentações' },
];

export default function AdminSidebar({ onNavigate }: AdminSidebarProps) {
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
    <div className="flex flex-col h-full bg-samgat-black text-white">
      <Link
        to="/admin"
        onClick={onNavigate}
        className="p-6 border-b border-samgat-gray flex-shrink-0 block hover:bg-samgat-dark transition-colors"
      >
        <h1 className="text-xl font-bold">Samgat Store</h1>
        <p className="text-xs text-samgat-gray-lighter mt-1">Painel Administrativo</p>
      </Link>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={onNavigate}
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

        <div className="pt-3 mt-3 border-t border-samgat-gray">
          <Link
            to="/"
            onClick={onNavigate}
            className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium text-samgat-gray-lighter hover:bg-samgat-dark hover:text-white transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Ir para a Loja
          </Link>
        </div>
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
    </div>
  );
}
