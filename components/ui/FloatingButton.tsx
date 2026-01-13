import React from 'react';
import { StyleSheet, Pressable, ViewStyle } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring,
  interpolate,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { colors, shadows } from '@/constants/theme';

interface FloatingButtonProps {
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  variant?: 'primary' | 'gradient';
  size?: 'md' | 'lg';
  style?: ViewStyle;
  disabled?: boolean;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const FloatingButton: React.FC<FloatingButtonProps> = ({
  icon,
  onPress,
  variant = 'gradient',
  size = 'md',
  style,
  disabled = false,
}) => {
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { rotate: `${rotation.value}deg` },
    ],
  }));

  const handlePressIn = () => {
    if (disabled) return;
    scale.value = withSpring(0.9, {
      damping: 15,
      stiffness: 150,
    });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const handlePressOut = () => {
    if (disabled) return;
    scale.value = withSpring(1, {
      damping: 15,
      stiffness: 150,
    });
  };

  const buttonSize = size === 'lg' ? 68 : 60;
  const iconSize = size === 'lg' ? 32 : 28;

  if (variant === 'gradient') {
    return (
      <AnimatedPressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
          onPress();
        }}
        disabled={disabled}
        style={[
          styles.button,
          { width: buttonSize, height: buttonSize, borderRadius: buttonSize / 2 },
          animatedStyle,
          style,
        ]}
      >
        <LinearGradient
          colors={[colors.primaryGradientStart, colors.primaryGradientEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.gradient, { borderRadius: buttonSize / 2 }]}
        >
          <Ionicons name={icon} size={iconSize} color={colors.textWhite} />
        </LinearGradient>
      </AnimatedPressable>
    );
  }

  return (
    <AnimatedPressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        onPress();
      }}
      disabled={disabled}
      style={[
        styles.button,
        styles.primaryButton,
        { width: buttonSize, height: buttonSize, borderRadius: buttonSize / 2 },
        animatedStyle,
        style,
      ]}
    >
      <Ionicons name={icon} size={iconSize} color={colors.textWhite} />
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.lg,
  },
  primaryButton: {
    backgroundColor: colors.primary,
  },
  gradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

