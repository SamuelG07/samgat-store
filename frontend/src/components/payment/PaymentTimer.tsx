import { useEffect, useState } from 'react';

interface PaymentTimerProps {
  expiresInMinutes?: number;
  onExpire: () => void;
}

export default function PaymentTimer({ expiresInMinutes = 15, onExpire }: PaymentTimerProps) {
  const [secondsLeft, setSecondsLeft] = useState(expiresInMinutes * 60);

  useEffect(() => {
    if (secondsLeft <= 0) {
      onExpire();
      return;
    }

    const interval = setInterval(() => {
      setSecondsLeft((s) => s - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [secondsLeft, onExpire]);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const isUrgent = secondsLeft < 60;
  const isWarning = secondsLeft < 300 && secondsLeft >= 60;

  const colorClass = isUrgent
    ? 'text-red-600 border-red-200 bg-red-50'
    : isWarning
    ? 'text-yellow-700 border-yellow-200 bg-yellow-50'
    : 'text-samgat-black border-samgat-gray-lighter bg-samgat-off-white';

  return (
    <div className={`flex items-center justify-between px-4 py-3 rounded-lg border ${colorClass}`}>
      <span className="text-sm font-medium flex items-center gap-2">
        ⏱️ Tempo restante
      </span>
      <span className="text-lg font-bold tabular-nums">
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </span>
    </div>
  );
}
