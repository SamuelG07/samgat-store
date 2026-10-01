import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
  requireAdmin?: boolean;
}

export default function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-samgat-off-white">
        <div className="text-samgat-black">Carregando...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireAdmin && !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-samgat-off-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-samgat-black mb-2">Acesso Negado</h1>
          <p className="text-samgat-gray-light mb-4">
            Você não tem permissão para acessar esta área.
          </p>
          <a href="/" className="text-samgat-black underline">
            Voltar para a loja
          </a>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
