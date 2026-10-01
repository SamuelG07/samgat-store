export default function LoadingState({ message = 'Carregando...' }: { message?: string }) {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="text-samgat-gray-light">{message}</div>
    </div>
  );
}
