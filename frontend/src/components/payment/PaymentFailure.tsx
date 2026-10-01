import Button from '../ui/Button';

interface PaymentFailureProps {
  onRetry: () => void;
  isLoading?: boolean;
}

export default function PaymentFailure({ onRetry, isLoading = false }: PaymentFailureProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-20 h-20 rounded-full bg-red-50 border-2 border-red-200 flex items-center justify-center mb-6">
        <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>

      <h2 className="text-2xl font-bold text-samgat-black mb-2">
        Pagamento falhou
      </h2>
      <p className="text-sm text-samgat-gray-light mb-8 max-w-md">
        Não foi possível processar o teu pagamento. Verifica os dados e tenta novamente.
      </p>

      <div className="flex flex-col sm:flex-row gap-3">
        <Button onClick={onRetry} isLoading={isLoading}>
          Tentar Novamente
        </Button>
      </div>

      <p className="text-xs text-samgat-gray-light mt-6 max-w-md">
        Se o problema persistir, contacta o suporte com o número do pedido.
      </p>
    </div>
  );
}
