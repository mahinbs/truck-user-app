import React from 'react';
import { colors, spacing } from '../../constants/theme';

interface DividerProps {
  style?: React.CSSProperties;
  vertical?: boolean;
}

export const Divider: React.FC<DividerProps> = ({ style, vertical = false }) => {
  return (
    <div
      style={{
        [vertical ? 'width' : 'height']: '1px',
        [vertical ? 'height' : 'width']: '100%',
        backgroundColor: colors.border,
        margin: vertical ? `0 ${spacing.md}` : `${spacing.md} 0`,
        ...style,
      }}
    />
  );
};

