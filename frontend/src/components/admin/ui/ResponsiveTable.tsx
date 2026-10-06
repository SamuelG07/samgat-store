import { ReactNode } from 'react';

export interface Column<T> {
  key: string;
  label: string;
  render?: (item: T) => ReactNode;
  className?: string;
}

export interface MobileCardField<T> {
  label: string;
  render: (item: T) => ReactNode;
}

interface ResponsiveTableProps<T> {
  data: T[];
  columns: Column<T>[];
  mobileTitle: (item: T) => ReactNode;
  mobileFields: MobileCardField<T>[];
  mobileActions?: (item: T) => ReactNode;
  emptyMessage?: string;
  keyExtractor: (item: T) => string | number;
}

export default function ResponsiveTable<T>({
  data,
  columns,
  mobileTitle,
  mobileFields,
  mobileActions,
  emptyMessage = 'Nenhum item encontrado.',
  keyExtractor,
}: ResponsiveTableProps<T>) {
  if (data.length === 0) {
    return (
      <div className="bg-white border border-samgat-gray-lighter rounded-lg p-8 text-center text-sm text-samgat-gray-light">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="bg-white border border-samgat-gray-lighter rounded-lg overflow-hidden">
      {/* Desktop: tabela */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-samgat-off-white border-b border-samgat-gray-lighter">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`text-left px-4 py-3 font-medium text-samgat-gray ${col.className || ''}`}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr
                key={keyExtractor(item)}
                className="border-b border-samgat-gray-lighter last:border-0"
              >
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-3">
                    {col.render
                      ? col.render(item)
                      : String((item as any)[col.key] ?? '-')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile: cards */}
      <div className="md:hidden divide-y divide-samgat-gray-lighter">
        {data.map((item) => (
          <div key={keyExtractor(item)} className="p-4 space-y-2">
            {mobileTitle(item)}

            <div className="space-y-1.5 pt-2">
              {mobileFields.map((field, idx) => (
                <div key={idx} className="flex justify-between gap-3 text-sm">
                  <span className="text-samgat-gray-light flex-shrink-0">
                    {field.label}:
                  </span>
                  <span className="text-samgat-black text-right min-w-0 truncate">
                    {field.render(item)}
                  </span>
                </div>
              ))}
            </div>

            {mobileActions && (
              <div className="pt-3 flex gap-2 border-t border-samgat-gray-lighter mt-3">
                {mobileActions(item)}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
