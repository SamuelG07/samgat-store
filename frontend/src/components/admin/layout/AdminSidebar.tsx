import { NavLink, Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Tags,
  Warehouse,
  ShoppingBag,
  CreditCard,
  Users,
  Shield,
  ArrowLeftRight,
  Store,
  LogOut,
  Star,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../../contexts/AuthContext';

interface AdminSidebarProps {
  onNavigate?: () => void;
}

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/products', label: 'Produtos', icon: Package },
  { to: '/admin/categories', label: 'Categorias', icon: Tags },
  { to: '/admin/inventory', label: 'Stock', icon: Warehouse },
  { to: '/admin/orders', label: 'Pedidos', icon: ShoppingBag },
  { to: '/admin/payments', label: 'Pagamentos', icon: CreditCard },
  { to: '/admin/reviews', label: 'Reviews', icon: Star },
  { to: '/admin/customers', label: 'Clientes', icon: Users },
  { to: '/admin/admins', label: 'Administradores', icon: Shield },
  { to: '/admin/stock-movements', label: 'Movimentações', icon: ArrowLeftRight },
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
        <div className="flex items-center gap-2">
          <Store className="w-5 h-5" />
          <h1 className="text-xl font-bold">Samgat Store</h1>
        </div>
        <p className="text-xs text-samgat-gray-lighter mt-1">Painel Administrativo</p>
      </Link>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={onNavigate}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-white text-samgat-black'
                    : 'text-samgat-gray-lighter hover:bg-samgat-dark hover:text-white'
                }`
              }
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">{item.label}</span>
            </NavLink>
          );
        })}

        <div className="pt-3 mt-3 border-t border-samgat-gray">
          <Link
            to="/"
            onClick={onNavigate}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-samgat-gray-lighter hover:bg-samgat-dark hover:text-white transition-colors"
          >
            <Store className="w-4 h-4 flex-shrink-0" />
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
          className="flex items-center justify-center gap-2 w-full bg-samgat-dark text-white text-sm py-2 rounded-lg hover:bg-samgat-gray transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sair
        </button>
      </div>
    </div>
  );
}
