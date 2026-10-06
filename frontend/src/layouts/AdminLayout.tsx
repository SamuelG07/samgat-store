import { ReactNode, useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import AdminSidebar from '../components/admin/layout/AdminSidebar';
import AdminMobileHeader from '../components/admin/layout/AdminMobileHeader';
import AdminMobileDrawer from '../components/admin/layout/AdminMobileDrawer';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const location = useLocation();

  // Fechar drawer ao mudar de rota
  useEffect(() => {
    setIsDrawerOpen(false);
  }, [location.pathname]);

  // Garantir scroll mobile
  useEffect(() => {
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.height = '';
    document.documentElement.style.overflow = '';

    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.height = '';
      document.documentElement.style.overflow = '';
    };
  }, []);

  return (
    <div className="min-h-screen bg-samgat-off-white">
      {/* Sidebar desktop */}
      <aside className="hidden lg:flex fixed top-0 left-0 h-screen w-64 xl:w-72 z-20 flex-col">
        <AdminSidebar />
      </aside>

      {/* Conteúdo principal */}
      <div className="lg:pl-64 xl:pl-72">
        {/* Header mobile */}
        <AdminMobileHeader onOpenMenu={() => setIsDrawerOpen(true)} />

        {/* ✅ Header desktop — com botão "Ver Loja" */}
        <header className="hidden lg:block sticky top-0 z-30 bg-white border-b border-samgat-gray-lighter">
          <div className="flex items-center justify-between h-16 px-6 lg:px-8">
            <h2 className="text-base font-semibold text-samgat-black">
              Painel Administrativo
            </h2>

            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm font-medium text-samgat-gray-light hover:text-samgat-black transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Ver Loja
            </Link>
          </div>
        </header>

        {/* Drawer mobile */}
        <AdminMobileDrawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
        />

        {/* Área de conteúdo */}
        <main className="p-4 sm:p-6 lg:p-8">
          <div className="w-full max-w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
