import { NavLink, useNavigate } from 'react-router-dom';
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
  { to: '/admin/users', label: 'Usuários' },
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
      {/* Logo */}
      <div className="p-6 border-b border-samgat-gray flex-shrink-0">
        <h1 className="text-xl font-bold">Samgat Store</h1>
        <p className="text-xs text-samgat-gray-lighter mt-1">Painel Administrativo</p>
      </div>

      {/* Navegação */}
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
      </nav>

      {/* Utilizador + Logout */}
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
