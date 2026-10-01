import { ReactNode } from 'react';

interface EmptyStateProps {
  title: string;
  message?: string;
  action?: ReactNode;
}

export default function EmptyState({ title, message, action }: EmptyStateProps) {
  return (
    <div className="text-center py-12 px-4">
      <h3 className="text-lg font-medium text-samgat-black mb-2">{title}</h3>
      {message && <p className="text-sm text-samgat-gray-light mb-6">{message}</p>}
      {action}
    </div>
  );
}
