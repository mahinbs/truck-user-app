import React from 'react';
import { StyleSheet, ViewStyle, Pressable } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring,
  interpolate,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { colors, borderRadius, shadows, spacing } from '@/constants/theme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  padding?: number;
  onPress?: () => void;
  variant?: 'default' | 'elevated' | 'outlined' | 'glass';
  disabled?: boolean;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  style, 
  padding = spacing.md,
  onPress,
  variant = 'default',
  disabled = false,
}) => {
  const scale = useSharedValue(1);
  const pressed = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: interpolate(pressed.value, [0, 1], [1, 0.95]),
  }));

  const handlePressIn = () => {
    if (disabled || !onPress) return;
    scale.value = withSpring(0.98, {
      damping: 15,
      stiffness: 150,
    });
    pressed.value = withSpring(1);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handlePressOut = () => {
    if (disabled || !onPress) return;
    scale.value = withSpring(1, {
      damping: 15,
      stiffness: 150,
    });
    pressed.value = withSpring(0);
  };

  const cardStyle = [
    styles.card,
    styles[`card_${variant}`],
    { padding },
    style
  ];

  if (onPress) {
    return (
      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          onPress();
        }}
        disabled={disabled}
      >
        <Animated.View style={[cardStyle, animatedStyle]}>
          {children}
        </Animated.View>
      </Pressable>
    );
  }

  return (
    <Animated.View style={cardStyle}>
      {children}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.backgroundCard,
    borderRadius: borderRadius.xl,
  },
  card_default: {
    ...shadows.md,
  },
  card_elevated: {
    ...shadows.lg,
  },
  card_outlined: {
    borderWidth: 1,
    borderColor: colors.border,
    shadowOpacity: 0,
    elevation: 0,
  },
  card_glass: {
    backgroundColor: colors.whiteTransparentMedium,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.sm,
  },
});

