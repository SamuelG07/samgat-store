import { useAuth } from '../../../contexts/AuthContext';

interface AdminMobileHeaderProps {
  onOpenMenu: () => void;
}

export default function AdminMobileHeader({ onOpenMenu }: AdminMobileHeaderProps) {
  const { user } = useAuth();

  return (
    <header className="lg:hidden sticky top-0 z-30 bg-white border-b border-samgat-gray-lighter">
      <div className="flex items-center justify-between h-16 px-4">
        {/* Hamburger */}
        <button
          onClick={onOpenMenu}
          className="p-2 -ml-2 text-samgat-black hover:bg-samgat-off-white rounded-lg"
          aria-label="Abrir menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Título */}
        <h1 className="text-base font-bold text-samgat-black truncate">
          Samgat Store
        </h1>

        {/* Avatar */}
        <div className="w-9 h-9 rounded-full bg-samgat-black text-white flex items-center justify-center text-sm font-semibold flex-shrink-0">
          {user?.name?.charAt(0).toUpperCase() || 'A'}
        </div>
      </div>
    </header>
  );
}
