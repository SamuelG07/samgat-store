interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export default function ErrorState({ message = 'Erro ao carregar dados', onRetry }: ErrorStateProps) {
  return (
    <div className="bg-white border border-red-200 rounded-lg p-6 text-center">
      <p className="text-red-600 mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="bg-samgat-black text-white px-4 py-2 rounded-lg text-sm hover:bg-samgat-dark transition-colors"
        >
          Tentar novamente
        </button>
      )}
    </div>
  );
}
