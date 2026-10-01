interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'dark';
}

export default function Badge({ children, variant = 'default' }: BadgeProps) {
  const variants = {
    default: 'bg-samgat-gray-lighter text-samgat-gray',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-700',
    dark: 'bg-samgat-black text-white',
  };

  return (
    <span className={`inline-block px-2 py-1 text-xs rounded font-medium ${variants[variant]}`}>
      {children}
    </span>
  );
}
