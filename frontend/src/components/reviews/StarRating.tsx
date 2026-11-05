import { Star } from 'lucide-react';

interface StarRatingProps {
  value: number;
  onChange?: (value: number) => void;
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
  total?: number;
}

const SIZES = {
  sm: 'w-3.5 h-3.5',
  md: 'w-4 h-4',
  lg: 'w-5 h-5',
};

export default function StarRating({
  value,
  onChange,
  size = 'md',
  showValue = false,
  total,
}: StarRatingProps) {
  const isInteractive = !!onChange;

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= Math.round(value);
        return (
          <button
            key={star}
            type="button"
            onClick={() => onChange?.(star)}
            disabled={!isInteractive}
            className={isInteractive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'}
            aria-label={`${star} estrela${star > 1 ? 's' : ''}`}
          >
            <Star
              className={`${SIZES[size]} ${
                filled ? 'fill-samgat-black text-samgat-black' : 'fill-transparent text-samgat-gray-lighter'
              }`}
            />
          </button>
        );
      })}
      {showValue && (
        <span className="text-sm text-samgat-gray-light ml-1">
          {value.toFixed(1)}
          {total !== undefined && ` (${total})`}
        </span>
      )}
    </div>
  );
}
