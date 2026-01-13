import React, { ReactNode } from 'react';
import { StyleSheet, ViewStyle, Pressable } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { colors, spacing, borderRadius, shadows } from '@/constants/theme';

interface AnimatedCardProps {
  children: ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  disabled?: boolean;
  variant?: 'elevated' | 'flat' | 'outlined';
}

export const AnimatedCard: React.FC<AnimatedCardProps> = ({
  children,
  onPress,
  style,
  disabled = false,
  variant = 'elevated',
}) => {
  const scale = useSharedValue(1);
  const elevation = useSharedValue(variant === 'elevated' ? 1 : 0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    ...shadows.md,
    shadowOpacity: elevation.value * 0.15,
  }));

  const handlePressIn = () => {
    if (disabled || !onPress) return;
    scale.value = withSpring(0.97, {
      damping: 15,
      stiffness: 150,
    });
    elevation.value = withTiming(0.5, { duration: 100 });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handlePressOut = () => {
    if (disabled || !onPress) return;
    scale.value = withSpring(1, {
      damping: 15,
      stiffness: 150,
    });
    elevation.value = withTiming(variant === 'elevated' ? 1 : 0, { duration: 100 });
  };

  const getVariantStyle = () => {
    switch (variant) {
      case 'flat':
        return styles.flatCard;
      case 'outlined':
        return styles.outlinedCard;
      default:
        return styles.elevatedCard;
    }
  };

  if (!onPress) {
    return (
      <Animated.View style={[styles.card, getVariantStyle(), style]}>
        {children}
      </Animated.View>
    );
  }

  return (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
      disabled={disabled}
    >
      <Animated.View style={[styles.card, getVariantStyle(), animatedStyle, style]}>
        {children}
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: borderRadius.lg,
    padding: spacing.md,
  },
  elevatedCard: {
    backgroundColor: colors.backgroundCard,
    ...shadows.md,
  },
  flatCard: {
    backgroundColor: colors.backgroundCard,
  },
  outlinedCard: {
    backgroundColor: colors.backgroundCard,
    borderWidth: 1,
    borderColor: colors.border,
  },
});

