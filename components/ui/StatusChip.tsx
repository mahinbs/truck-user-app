import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, typography } from '@/constants/theme';

type StatusType = 'active' | 'pending' | 'completed' | 'in-transit' | 'delivered' | 'cancelled' | 'delayed' | 'at-risk';

interface StatusChipProps {
  status: StatusType;
  size?: 'sm' | 'md';
  showIcon?: boolean;
  style?: ViewStyle;
}

const statusConfig: Record<StatusType, {
  label: string;
  color: string;
  backgroundColor: string;
  icon: keyof typeof Ionicons.glyphMap;
}> = {
  'active': {
    label: 'Active',
    color: colors.primary,
    backgroundColor: colors.primaryTransparent,
    icon: 'radio-button-on',
  },
  'pending': {
    label: 'Pending',
    color: colors.warning,
    backgroundColor: colors.warningLight,
    icon: 'time',
  },
  'completed': {
    label: 'Completed',
    color: colors.success,
    backgroundColor: colors.successLight,
    icon: 'checkmark-circle',
  },
  'in-transit': {
    label: 'In Transit',
    color: colors.info,
    backgroundColor: colors.infoLight,
    icon: 'car',
  },
  'delivered': {
    label: 'Delivered',
    color: colors.success,
    backgroundColor: colors.successLight,
    icon: 'checkmark-done-circle',
  },
  'cancelled': {
    label: 'Cancelled',
    color: colors.error,
    backgroundColor: colors.errorLight,
    icon: 'close-circle',
  },
  'delayed': {
    label: 'Delayed',
    color: colors.error,
    backgroundColor: colors.errorLight,
    icon: 'alert-circle',
  },
  'at-risk': {
    label: 'At Risk',
    color: colors.warning,
    backgroundColor: colors.warningLight,
    icon: 'warning',
  },
};

export const StatusChip: React.FC<StatusChipProps> = ({
  status,
  size = 'md',
  showIcon = true,
  style,
}) => {
  const config = statusConfig[status];
  const chipSize = size === 'sm' ? styles.chipSm : styles.chipMd;
  const textSize = size === 'sm' ? styles.textSm : styles.textMd;
  const iconSize = size === 'sm' ? 12 : 14;

  return (
    <View 
      style={[
        styles.chip, 
        chipSize,
        { backgroundColor: config.backgroundColor },
        style,
      ]}
    >
      {showIcon && (
        <Ionicons 
          name={config.icon} 
          size={iconSize} 
          color={config.color}
          style={styles.icon}
        />
      )}
      <Text style={[styles.text, textSize, { color: config.color }]}>
        {config.label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: borderRadius.full,
    alignSelf: 'flex-start',
  },
  chipSm: {
    paddingVertical: spacing.xs - 2,
    paddingHorizontal: spacing.sm,
  },
  chipMd: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
  },
  icon: {
    marginRight: spacing.xs - 2,
  },
  text: {
    fontWeight: typography.weights.semibold,
  },
  textSm: {
    fontSize: typography.sizes.xs,
  },
  textMd: {
    fontSize: typography.sizes.sm,
  },
});

