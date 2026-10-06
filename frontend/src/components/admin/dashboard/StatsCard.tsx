import { ReactNode } from 'react';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: ReactNode;
}

export default function StatsCard({ title, value, subtitle, icon }: StatsCardProps) {
  return (
    <div className="bg-white border border-samgat-gray-lighter rounded-lg p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium text-samgat-gray-light uppercase tracking-wide truncate">
            {title}
          </p>
          <p className="text-2xl sm:text-3xl font-bold text-samgat-black mt-2 truncate">
            {value}
          </p>
          {subtitle && (
            <p className="text-xs text-samgat-gray-light mt-1 truncate">
              {subtitle}
            </p>
          )}
        </div>
        {icon && (
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-samgat-off-white flex items-center justify-center text-samgat-black flex-shrink-0">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
