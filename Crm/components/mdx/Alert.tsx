import React from 'react';
import { AlertCircle } from 'lucide-react';
import clsx from 'clsx';

export interface AlertProps {
  children: React.ReactNode;
  variant?: 'info' | 'warning' | 'success' | 'error';
  className?: string;
}

const variantStyles = {
  info: 'bg-blue-50 border-blue-300 text-blue-900',
  warning: 'bg-yellow-50 border-yellow-300 text-yellow-900',
  success: 'bg-green-50 border-green-300 text-green-900',
  error: 'bg-red-50 border-red-300 text-red-900',
};

export const Alert: React.FC<AlertProps> = ({ children, variant = 'info', className }) => (
  <div className={clsx(
    'flex items-start gap-3 border-l-4 px-4 py-3 rounded-md shadow-sm',
    variantStyles[variant],
    className
  )}>
    <AlertCircle className="mt-0.5 w-5 h-5 shrink-0 opacity-70" />
    <div className="flex-1">{children}</div>
  </div>
);
