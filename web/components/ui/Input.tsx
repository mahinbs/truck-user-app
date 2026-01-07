import React, { useState } from 'react';
import { colors } from '../../constants/theme';
import { IconType } from 'react-icons';
import { FiMail, FiLock, FiUser, FiPhone, FiMapPin, FiCalendar, FiClock, FiSearch, FiEye, FiEyeOff, FiInfo, FiPackage, FiBarChart2, FiFileText, FiPhone as FiCall, FiNavigation, FiCreditCard, FiMapPin as FiPin } from 'react-icons/fi';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: string;
  rightIcon?: string;
  onRightIconClick?: () => void;
  containerStyle?: React.CSSProperties;
  showPasswordToggle?: boolean;
}

const iconMap: Record<string, IconType> = {
  mail: FiMail,
  'lock-closed': FiLock,
  person: FiUser,
  call: FiPhone,
  location: FiMapPin,
  calendar: FiCalendar,
  time: FiClock,
  search: FiSearch,
  eye: FiEye,
  'eye-off': FiEyeOff,
  'information-circle': FiInfo,
  cube: FiPackage,
  barbell: FiBarChart2,
  'document-text': FiFileText,
  navigate: FiNavigation,
  card: FiCreditCard,
  pin: FiMapPin,
  business: FiUser,
  barcode: FiSearch,
  chatbubbles: FiInfo,
};

export const Input: React.FC<InputProps> = ({
  label,
  error,
  icon,
  rightIcon,
  onRightIconClick,
  containerStyle,
  style,
  showPasswordToggle,
  type,
  ...props
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const IconComponent = icon && iconMap[icon] ? iconMap[icon] : null;
  const RightIconComponent = rightIcon && iconMap[rightIcon] ? iconMap[rightIcon] : null;
  const PasswordIcon = showPasswordToggle ? (isPasswordVisible ? FiEyeOff : FiEye) : null;

  const actualType = showPasswordToggle ? (isPasswordVisible ? 'text' : 'password') : type;

  return (
    <div className="mb-4" style={containerStyle}>
      {label && (
        <label className="text-sm font-semibold text-text mb-2 block">
          {label}
        </label>
      )}
      <div
        className={`relative flex items-center rounded-xl bg-backgroundCard shadow-sm transition-all border-2 ${
          error ? 'border-error' : isFocused ? 'border-primary' : 'border-border'
        }`}
      >
        {IconComponent && typeof IconComponent === 'function' && (
          <div className={`ml-4 ${isFocused ? 'text-primary' : 'text-text-secondary'}`}>
            <IconComponent size={20} />
          </div>
        )}
        <input
          type={actualType}
          className={`flex-1 border-none outline-none text-base text-text bg-transparent box-border ${
            IconComponent ? 'px-2 py-4 pl-0' : 'px-4 py-4'
          }`}
          style={style}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
        {showPasswordToggle && PasswordIcon && (
          <button
            type="button"
            onClick={() => setIsPasswordVisible(!isPasswordVisible)}
            className="border-none bg-transparent cursor-pointer p-4 flex items-center text-text-secondary"
          >
            <PasswordIcon size={20} />
          </button>
        )}
        {RightIconComponent && typeof RightIconComponent === 'function' && !showPasswordToggle && (
          <button
            type="button"
            onClick={onRightIconClick}
            className="border-none bg-transparent cursor-pointer p-4 flex items-center text-text-secondary"
          >
            <RightIconComponent size={20} />
          </button>
        )}
      </div>
      {error && (
        <div className="text-xs text-error mt-1 ml-1">
          {error}
        </div>
      )}
    </div>
  );
};
