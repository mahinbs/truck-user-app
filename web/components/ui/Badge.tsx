import React from 'react';

interface BadgeProps {
  label: string;
  variant?: 'success' | 'warning' | 'error' | 'info' | 'default';
  style?: React.CSSProperties;
}

export const Badge: React.FC<BadgeProps> = ({ label, variant = 'default', style }) => {
  const variantClasses = {
    success: 'bg-success/20 text-success',
    warning: 'bg-warning/20 text-warning',
    error: 'bg-error/20 text-error',
    info: 'bg-info/20 text-info',
    default: 'bg-borderLight text-text-secondary',
  };

  return (
    <span
      className={`px-4 py-1 rounded-full text-xs font-semibold inline-block ${variantClasses[variant]}`}
      style={style}
    >
      {label}
    </span>
  );
};

