import { useState } from 'react';
import { Calendar, Download } from 'lucide-react';
import { DayPicker } from 'react-day-picker';
import { pt } from 'date-fns/locale';
import 'react-day-picker/dist/style.css';

export interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

interface DashboardHeaderProps {
  dateRange: DateRange;
  onDateRangeChange: (range: DateRange) => void;
}

const PRESETS = [
  { label: 'Hoje', days: 0 },
  { label: 'Ontem', days: 1 },
  { label: 'Últimos 7 dias', days: 7 },
  { label: 'Últimos 30 dias', days: 30 },
  { label: 'Este mês', days: -1 },
  { label: 'Mês passado', days: -2 },
];

export default function DashboardHeader({ dateRange, onDateRangeChange }: DashboardHeaderProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handlePreset = (days: number) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let from: Date;
    let to: Date = new Date(today);

    if (days === 0) from = today;
    else if (days === 1) {
      from = new Date(today);
      from.setDate(from.getDate() - 1);
      to = new Date(from);
    } else if (days === -1) {
      from = new Date(today.getFullYear(), today.getMonth(), 1);
    } else if (days === -2) {
      from = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      to = new Date(today.getFullYear(), today.getMonth(), 0);
    } else {
      from = new Date(today);
      from.setDate(from.getDate() - days + 1);
    }

    onDateRangeChange({ from, to });
    setIsOpen(false);
  };

  const formatDate = (date?: Date) =>
    date ? date.toLocaleDateString('pt-AO', { day: '2-digit', month: 'short' }) : '—';

  const displayText =
    dateRange.from && dateRange.to
      ? `${formatDate(dateRange.from)} — ${formatDate(dateRange.to)}`
      : 'Selecionar período';

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-samgat-black">Dashboard</h1>
        <p className="text-samgat-gray-light text-sm mt-1">Visão geral do desempenho da sua loja</p>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 border border-samgat-gray-lighter rounded-lg bg-white text-sm text-samgat-black hover:border-samgat-black transition-colors"
          >
            <Calendar className="w-4 h-4" />
            <span className="truncate max-w-[140px] sm:max-w-none">{displayText}</span>
          </button>

          {isOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
              <div className="absolute right-0 top-full mt-2 z-50 bg-white border border-samgat-gray-lighter rounded-lg shadow-lg p-4 w-[280px] sm:w-auto">
                <div className="mb-3 flex flex-wrap gap-1">
                  {PRESETS.map((p) => (
                    <button
                      key={p.label}
                      onClick={() => handlePreset(p.days)}
                      className="text-xs px-2 py-1 border border-samgat-gray-lighter rounded hover:bg-samgat-black hover:text-white transition-colors"
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
                <div className="border-t border-samgat-gray-lighter pt-3">
                  <DayPicker
                    mode="range"
                    selected={{ from: dateRange.from, to: dateRange.to }}
                    onSelect={(range) => {
                      onDateRangeChange({ from: range?.from, to: range?.to });
                      if (range?.from && range?.to) setIsOpen(false);
                    }}
                    locale={pt}
                    numberOfMonths={1}
                  />
                </div>
              </div>
            </>
          )}
        </div>

        <button
          onClick={() => alert('Exportação em desenvolvimento')}
          className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-samgat-black text-white rounded-lg text-sm hover:bg-samgat-dark transition-colors"
        >
          <Download className="w-4 h-4" />
          <span className="hidden sm:inline">Exportar</span>
        </button>
      </div>
    </div>
  );
}
