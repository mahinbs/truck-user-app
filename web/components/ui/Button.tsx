import React from 'react';
import { colors } from '../../constants/theme';
import { IconType } from 'react-icons';
import { FiArrowRight, FiArrowLeft, FiCheck, FiSend, FiDownload, FiHeadphones, FiAlertCircle, FiLogOut, FiPlus, FiSearch, FiEye, FiEyeOff, FiUserPlus, FiUser, FiMail, FiPhone, FiMapPin, FiCalendar, FiClock, FiInfo, FiPackage, FiBarChart2, FiFileText, FiNavigation, FiCheckCircle } from 'react-icons/fi';

interface ButtonProps {
  title: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  icon?: string;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const iconMap: Record<string, IconType> = {
  'arrow-forward': FiArrowRight,
  'arrow-back': FiArrowLeft,
  'checkmark': FiCheck,
  'checkmark-circle': FiCheckCircle,
  'send': FiSend,
  'download': FiDownload,
  'headset': FiHeadphones,
  'alert-circle': FiAlertCircle,
  'log-out': FiLogOut,
  'add': FiPlus,
  'search': FiSearch,
  'eye': FiEye,
  'eye-off': FiEyeOff,
  'person-add': FiUserPlus,
  'person': FiUser,
  'mail': FiMail,
  'call': FiPhone,
  'location': FiMapPin,
  'calendar': FiCalendar,
  'time': FiClock,
  'information-circle': FiInfo,
  'cube': FiPackage,
  'barbell': FiBarChart2,
  'document-text': FiFileText,
  'navigate': FiNavigation,
};

export const Button: React.FC<ButtonProps> = ({
  title,
  onClick,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  className = '',
  style,
}) => {
  const IconComponent = icon && iconMap[icon] ? iconMap[icon] : null;
  const iconColor = variant === 'primary' || variant === 'secondary' ? '#FFFFFF' : colors.primary;
  const iconSize = size === 'sm' ? 16 : size === 'lg' ? 24 : 20;

  const variantClasses = {
    primary: 'bg-primary text-white shadow-sm',
    secondary: 'bg-secondary text-white shadow-sm',
    outline: 'bg-transparent border-2 border-primary text-primary shadow-none',
    ghost: 'bg-transparent text-primary shadow-none',
  };

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm min-h-[36px]',
    md: 'px-6 py-4 text-base min-h-[48px]',
    lg: 'px-8 py-6 text-lg min-h-[56px]',
  };

  const baseClasses = `rounded-xl border-none font-semibold transition-all inline-flex items-center justify-center gap-2 ${
    disabled || loading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
  } ${variantClasses[variant]} ${sizeClasses[size]} ${fullWidth ? 'w-full' : 'w-auto'} ${className}`;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!disabled && !loading) {
      onClick();
    }
  };

  return (
    <button
      className={baseClasses}
      style={style}
      onClick={handleClick}
      disabled={disabled || loading}
    >
      {loading ? (
        <span>Loading...</span>
      ) : (
        <>
          {IconComponent && typeof IconComponent === 'function' && iconPosition === 'left' && (
            <IconComponent size={iconSize} color={iconColor} />
          )}
          <span>{title}</span>
          {IconComponent && typeof IconComponent === 'function' && iconPosition === 'right' && (
            <IconComponent size={iconSize} color={iconColor} />
          )}
        </>
      )}
    </button>
  );
};
