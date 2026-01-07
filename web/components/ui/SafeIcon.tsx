import React from 'react';

interface SafeIconProps {
  Icon: any;
  size?: number;
  color?: string;
  [key: string]: any;
}

export const SafeIcon: React.FC<SafeIconProps> = ({ Icon, ...props }) => {
  if (!Icon || typeof Icon !== 'function') return null;
  return <Icon {...props} />;
};

