import { ReactNode, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
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

  return (
    <div className="min-h-screen bg-samgat-off-white">
      {/* Sidebar desktop */}
      <aside className="hidden lg:block fixed top-0 left-0 h-screen w-64 xl:w-72 z-20">
        <AdminSidebar />
      </aside>

      {/* Conteúdo principal */}
      <div className="lg:pl-64 xl:pl-72">
        {/* Header mobile */}
        <AdminMobileHeader onOpenMenu={() => setIsDrawerOpen(true)} />

        {/* Drawer mobile */}
        <AdminMobileDrawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
        />

        {/* Área de conteúdo */}
        <main className="p-4 sm:p-6 lg:p-8">
          <div className="max-w-full overflow-x-hidden">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
