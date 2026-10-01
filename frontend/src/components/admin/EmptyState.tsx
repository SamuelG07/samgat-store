import { ReactNode } from 'react';

interface EmptyStateProps {
  title?: string;
  message?: string;
  action?: ReactNode;
}

export default function EmptyState({
  title = 'Nada por aqui',
  message = 'Nenhum item encontrado.',
  action,
}: EmptyStateProps) {
  return (
    <div className="bg-white border border-samgat-gray-lighter rounded-lg p-12 text-center">
      <p className="text-lg font-medium text-samgat-black mb-1">{title}</p>
      {message && <p className="text-sm text-samgat-gray-light mb-4">{message}</p>}
      {action}
    </div>
  );
}
