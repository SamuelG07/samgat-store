import { HTMLAttributes, ReactNode } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export default function Card({ children, className = '', ...props }: CardProps) {
  return (
    <div className={`bg-white border border-samgat-gray-lighter rounded-lg ${className}`} {...props}>
      {children}
    </div>
  );
}
