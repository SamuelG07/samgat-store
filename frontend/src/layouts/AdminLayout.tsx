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

  // ✅ Garantir que o scroll do body NUNCA fica bloqueado
  useEffect(() => {
    // Limpar qualquer overflow forçado ao montar/desmontar
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
      {/* Sidebar desktop — fixa, apenas em desktop */}
      <aside className="hidden lg:flex fixed top-0 left-0 h-screen w-64 xl:w-72 z-20 flex-col">
        <AdminSidebar />
      </aside>

      {/* Conteúdo principal */}
      <div className="lg:pl-64 xl:pl-72">
        {/* Header mobile — sticky no topo */}
        <AdminMobileHeader onOpenMenu={() => setIsDrawerOpen(true)} />

        {/* Drawer mobile */}
        <AdminMobileDrawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
        />

        {/* Área de conteúdo — scroll natural do body */}
        <main className="p-4 sm:p-6 lg:p-8">
          <div className="w-full max-w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
