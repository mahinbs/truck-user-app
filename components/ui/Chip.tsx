import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, typography } from '@/constants/theme';

interface ChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
  style?: ViewStyle;
}

export const Chip: React.FC<ChipProps> = ({ 
  label, 
  selected = false,
  onPress,
  icon,
  style 
}) => {
  return (
    <TouchableOpacity 
      style={[
        styles.chip, 
        selected && styles.chipSelected,
        style
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {icon && (
        <Ionicons 
          name={icon} 
          size={16} 
          color={selected ? colors.primary : colors.textSecondary}
          style={styles.icon}
        />
      )}
      <Text style={[styles.text, selected && styles.textSelected]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.backgroundCard,
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
  },
  chipSelected: {
    backgroundColor: `${colors.primary}15`,
    borderColor: colors.primary,
  },
  icon: {
    marginRight: spacing.xs,
  },
  text: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    color: colors.textSecondary,
  },
  textSelected: {
    color: colors.primary,
    fontWeight: typography.weights.semibold,
  },
});

