interface PaymentMethod {
  id: string;
  label: string;
  description: string;
  icon: string;
  available: boolean;
}

const METHODS: PaymentMethod[] = [
  {
    id: 'multicaixa',
    label: 'Multicaixa Express',
    description: 'Pagamento via app Multicaixa',
    icon: '📱',
    available: true,
  },
  {
    id: 'card',
    label: 'Cartão de Crédito/Débito',
    description: 'Visa, Mastercard',
    icon: '💳',
    available: true,
  },
  {
    id: 'transfer',
    label: 'Transferência Bancária',
    description: 'BAI, BFA, BIC, Standard Bank',
    icon: '🏦',
    available: true,
  },
  {
    id: 'cash',
    label: 'Pagamento na Entrega',
    description: 'Paga em dinheiro ao receber',
    icon: '💵',
    available: true,
  },
];

interface PaymentMethodSelectorProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export default function PaymentMethodSelector({ value, onChange, disabled = false }: PaymentMethodSelectorProps) {
  return (
    <div className="space-y-3">
      {METHODS.map((method) => {
        const isSelected = value === method.id;
        const isDisabled = disabled || !method.available;

        return (
          <button
            key={method.id}
            type="button"
            onClick={() => !isDisabled && onChange(method.id)}
            disabled={isDisabled}
            className={`w-full flex items-center gap-4 p-4 rounded-lg border-2 transition-all text-left ${
              isSelected
                ? 'border-samgat-black bg-samgat-off-white'
                : 'border-samgat-gray-lighter bg-white hover:border-samgat-gray'
            } ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            <span className="text-2xl flex-shrink-0">{method.icon}</span>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-samgat-black text-sm">{method.label}</p>
              <p className="text-xs text-samgat-gray-light mt-0.5">{method.description}</p>
            </div>
            <div
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                isSelected ? 'border-samgat-black' : 'border-samgat-gray-lighter'
              }`}
            >
              {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-samgat-black" />}
            </div>
          </button>
        );
      })}
    </div>
  );
}
