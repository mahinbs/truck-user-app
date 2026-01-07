import React from 'react';
import { IconType } from 'react-icons';
import { FiClock, FiZap, FiTrendingUp, FiCalendar, FiCalendar as FiCalendarOutline, FiCpu, FiHome, FiCoffee, FiPackage, FiAlertTriangle, FiGrid, FiMessageCircle, FiShield, FiBriefcase, FiCheckCircle, FiSmile, FiXCircle } from 'react-icons/fi';

interface ChipProps {
  label: string;
  selected?: boolean;
  onClick?: () => void;
  icon?: string;
  style?: React.CSSProperties;
}

const iconMap: Record<string, IconType> = {
  time: FiClock,
  flash: FiZap,
  rocket: FiTrendingUp,
  calendar: FiCalendar,
  'calendar-outline': FiCalendarOutline,
  'time-outline': FiClock,
  'hardware-chip': FiCpu,
  bed: FiHome,
  'fast-food': FiCoffee,
  cube: FiPackage,
  warning: FiAlertTriangle,
  apps: FiGrid,
  chatbubbles: FiMessageCircle,
  'shield-checkmark': FiShield,
  briefcase: FiBriefcase,
  'checkmark-circle': FiCheckCircle,
  happy: FiSmile,
  'close-circle': FiXCircle,
};

export const Chip: React.FC<ChipProps> = ({ label, selected = false, onClick, icon, style }) => {
  const IconComponent = icon ? iconMap[icon] : null;

  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center px-4 py-2 rounded-full border-[1.5px] transition-all mr-2 mb-2 ${
        selected
          ? 'border-primary bg-primary/20 text-primary font-semibold'
          : 'border-border bg-backgroundCard text-text-secondary font-medium'
      } ${onClick ? 'cursor-pointer' : 'cursor-default'}`}
      style={style}
    >
      {IconComponent && (
        <span className="mr-1 flex items-center">
          <IconComponent size={16} />
        </span>
      )}
      {label}
    </button>
  );
};

