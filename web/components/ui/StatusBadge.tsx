import React from 'react';
import { colors, spacing, borderRadius, typography, statusColors } from '../../constants/theme';

type StatusType = 'on-track' | 'at-risk' | 'delayed' | 'pending' | 'completed' | 'active';

interface StatusBadgeProps {
  status: StatusType;
  label?: string;
}

const statusLabels: Record<StatusType, string> = {
  'on-track': 'On Track',
  'at-risk': 'At Risk',
  'delayed': 'Delayed',
  'pending': 'Pending',
  'completed': 'Completed',
  'active': 'Active',
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, label }) => {
  const backgroundColor = statusColors[status] + '15'; // 15% opacity
  const textColor = statusColors[status];

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: `${spacing.xs} ${spacing.sm}`,
        borderRadius: borderRadius.full,
        backgroundColor,
        alignSelf: 'flex-start',
      }}
    >
      <div
        style={{
          width: '6px',
          height: '6px',
          borderRadius: '3px',
          backgroundColor: textColor,
          marginRight: spacing.xs,
        }}
      />
      <span
        style={{
          fontSize: typography.sizes.xs,
          fontWeight: typography.weights.medium,
          color: textColor,
        }}
      >
        {label || statusLabels[status]}
      </span>
    </div>
  );
};

