export default function PaymentProcessing() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="relative mb-8">
        <div className="w-20 h-20 border-4 border-samgat-gray-lighter border-t-samgat-black rounded-full animate-spin" />
      </div>
      <h2 className="text-xl font-bold text-samgat-black mb-2">
        A processar pagamento
      </h2>
      <p className="text-sm text-samgat-gray-light max-w-sm">
        Por favor, aguarda enquanto confirmamos o teu pagamento. Não feches esta página.
      </p>
      <div className="mt-8 w-full max-w-xs h-1.5 bg-samgat-gray-lighter rounded-full overflow-hidden">
        <div className="h-full bg-samgat-black rounded-full animate-pulse" style={{ width: '60%' }} />
      </div>
    </div>
  );
}
