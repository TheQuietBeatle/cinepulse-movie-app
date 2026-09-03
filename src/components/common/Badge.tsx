import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'accent' | 'secondary' | 'outline' | 'warning' | 'success';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'secondary',
  className = ''
}) => {
  const variantStyles = {
    primary: 'bg-red-600/20 text-red-400 border border-red-500/30',
    accent: 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30',
    secondary: 'bg-gray-800 text-gray-300 border border-gray-700',
    outline: 'bg-transparent text-gray-400 border border-gray-600',
    warning: 'bg-amber-500/20 text-amber-300 border border-amber-500/30',
    success: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium tracking-wide uppercase ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
};
