interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export default function ErrorState({ message = 'Erro ao carregar', onRetry }: ErrorStateProps) {
  return (
    <div className="text-center py-12 px-4">
      <p className="text-red-600 mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="bg-samgat-black text-white px-4 py-2 rounded-lg text-sm hover:bg-samgat-dark"
        >
          Tentar novamente
        </button>
      )}
    </div>
  );
}
