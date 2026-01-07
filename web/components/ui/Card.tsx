import React from 'react';

interface CardProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
  padding?: number;
  onClick?: () => void;
  variant?: 'default' | 'elevated' | 'outlined';
  className?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  padding,
  onClick,
  variant = 'default',
  className = '',
}) => {
  const variantClasses = {
    default: 'shadow-sm',
    elevated: 'shadow-lg',
    outlined: 'border border-border shadow-none',
  };

  const baseClasses = `bg-backgroundCard rounded-xl ${variantClasses[variant]} ${
    onClick ? 'cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-md' : ''
  } ${!padding ? 'p-4' : ''} ${className}`;

  const paddingStyle = padding ? { padding: `${padding}px` } : {};

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  if (onClick) {
    return (
      <div
        className={baseClasses}
        style={{ ...paddingStyle, ...style }}
        onClick={handleClick}
      >
        {children}
      </div>
    );
  }

  return (
    <div className={baseClasses} style={{ ...paddingStyle, ...style }}>
      {children}
    </div>
  );
};
