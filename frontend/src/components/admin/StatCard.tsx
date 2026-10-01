interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  highlight?: boolean;
}

export default function StatCard({ title, value, subtitle, highlight = false }: StatCardProps) {
  return (
    <div
      className={`rounded-lg p-6 border ${
        highlight
          ? 'bg-samgat-black text-white border-samgat-black'
          : 'bg-white text-samgat-black border-samgat-gray-lighter'
      }`}
    >
      <p className={`text-sm font-medium ${highlight ? 'text-samgat-gray-lighter' : 'text-samgat-gray-light'}`}>
        {title}
      </p>
      <p className="text-3xl font-bold mt-2">{value}</p>
      {subtitle && (
        <p className={`text-xs mt-2 ${highlight ? 'text-samgat-gray-lighter' : 'text-samgat-gray-light'}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
