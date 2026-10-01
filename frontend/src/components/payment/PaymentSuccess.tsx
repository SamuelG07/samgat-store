import { Link } from 'react-router-dom';
import Button from '../ui/Button';

interface PaymentSuccessProps {
  orderId: number;
  total: number;
  formatKz: (v: number) => string;
}

export default function PaymentSuccess({ orderId, total, formatKz }: PaymentSuccessProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-20 h-20 rounded-full bg-samgat-black flex items-center justify-center mb-6">
        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <h2 className="text-2xl font-bold text-samgat-black mb-2">
        Pagamento confirmado!
      </h2>
      <p className="text-sm text-samgat-gray-light mb-6 max-w-md">
        O teu pagamento foi processado com sucesso. Vais receber uma confirmação por email em breve.
      </p>

      <div className="bg-samgat-off-white border border-samgat-gray-lighter rounded-lg px-6 py-4 mb-8">
        <p className="text-xs text-samgat-gray-light uppercase tracking-wider mb-1">
          Pedido #{orderId}
        </p>
        <p className="text-2xl font-bold text-samgat-black">
          {formatKz(total)}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Link to={`/pedidos/${orderId}`}>
          <Button>Ver Detalhes do Pedido</Button>
        </Link>
        <Link to="/produtos">
          <Button variant="outline">Continuar a Comprar</Button>
        </Link>
      </div>
    </div>
  );
}
