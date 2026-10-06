import { Link } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';

interface AdminMobileHeaderProps {
  onOpenMenu: () => void;
}

export default function AdminMobileHeader({ onOpenMenu }: AdminMobileHeaderProps) {
  const { user } = useAuth();

  return (
    <header className="lg:hidden sticky top-0 z-30 bg-white border-b border-samgat-gray-lighter">
      <div className="flex items-center justify-between h-14 sm:h-16 px-3 sm:px-4 gap-3">
        {/* Hamburger */}
        <button
          onClick={onOpenMenu}
          className="p-2 -ml-2 text-samgat-black hover:bg-samgat-off-white rounded-lg flex-shrink-0"
          aria-label="Abrir menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Título clicável → vai para /admin */}
        <Link
          to="/admin"
          className="flex-1 text-center text-base font-bold text-samgat-black truncate hover:opacity-80 transition-opacity"
        >
          Painel Administrativo
        </Link>

        {/* Ir para a loja */}
        <Link
          to="/"
          className="flex-shrink-0 p-2 text-samgat-gray-light hover:text-samgat-black transition-colors"
          title="Ir para a loja"
          aria-label="Ir para a loja"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        </Link>
      </div>
    </header>
  );
}
