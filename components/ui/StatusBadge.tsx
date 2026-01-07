import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, typography, statusColors } from '@/constants/theme';

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
    <View style={[styles.badge, { backgroundColor }]}>
      <View style={[styles.dot, { backgroundColor: textColor }]} />
      <Text style={[styles.text, { color: textColor }]}>
        {label || statusLabels[status]}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    alignSelf: 'flex-start',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: spacing.xs,
  },
  text: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.medium,
  },
});

