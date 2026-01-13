import { borderRadius, colors, shadows, spacing, typography } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'gradient';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  style?: ViewStyle;
  width?: number | string;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  width,
  style,
}) => {
  const scale = useSharedValue(1);
  const pressed = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: interpolate(pressed.value, [0, 1], [1, 0.9]),
  }));

  const handlePressIn = () => {
    if (disabled || loading) return;
    scale.value = withSpring(0.96, {
      damping: 15,
      stiffness: 150,
    });
    pressed.value = withSpring(1);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handlePressOut = () => {
    if (disabled || loading) return;
    scale.value = withSpring(1, {
      damping: 15,
      stiffness: 150,
    });
    pressed.value = withSpring(0);
  };

  const handlePress = () => {
    if (disabled || loading) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onPress();
  };

  const buttonStyle = [
    styles.button,
    styles[`button_${size}`],
    fullWidth && styles.buttonFullWidth,
    (disabled || loading) && styles.buttonDisabled,
    width !== undefined && { width },
  ];

  const textStyle = [
    styles.text,
    styles[`text_${variant}`],
    styles[`text_${size}`],
  ];

  const iconColor = variant === 'primary' || variant === 'secondary' || variant === 'gradient' 
    ? colors.textWhite 
    : colors.primary;
  const iconSize = size === 'sm' ? 16 : size === 'lg' ? 24 : 20;

  // Get minHeight based on size
  const getMinHeight = () => {
    if (size === 'sm') return 44;
    if (size === 'lg') return 64;
    return 56; // md
  };

  const renderContent = () => (
    <View style={styles.content}>
      {loading ? (
        <ActivityIndicator color={iconColor} size={iconSize} />
      ) : (
        <>
          {icon && iconPosition === 'left' && (
            <Ionicons name={icon} size={iconSize} color={iconColor} style={styles.iconLeft} />
          )}
          <Text style={textStyle} numberOfLines={1} ellipsizeMode="tail">
            {title}
          </Text>
          {icon && iconPosition === 'right' && (
            <Ionicons name={icon} size={iconSize} color={iconColor} style={styles.iconRight} />
          )}
        </>
      )}
    </View>
  );

  if (variant === 'gradient') {
    return (
      <AnimatedPressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}
        disabled={disabled || loading}
        style={[buttonStyle, animatedStyle, style]}
      >
        <LinearGradient
          colors={[colors.primaryGradientStart, colors.primaryGradientEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.gradient, styles.gradientContainer, { minHeight: getMinHeight() }]}
        >
          {renderContent()}
        </LinearGradient>
      </AnimatedPressable>
    );
  }

  return (
    <AnimatedPressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      disabled={disabled || loading}
      style={[buttonStyle, styles[`button_${variant}`], animatedStyle, style]}
    >
      {renderContent()}
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: borderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    overflow: 'hidden',
    minWidth: 80, // Minimum width for small buttons
  },
  button_primary: {
    backgroundColor: colors.primary,
    ...shadows.md,
  },
  button_secondary: {
    backgroundColor: colors.secondary,
    ...shadows.md,
  },
  button_gradient: {
    ...shadows.lg,
  },
  button_outline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.primary,
  },
  button_ghost: {
    backgroundColor: 'transparent',
  },
  button_sm: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    minHeight: 44,
    minWidth: 100, // Increased minimum width for sm
  },
  button_md: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    minHeight: 56,
    minWidth: 120, // Increased minimum width for md
  },
  button_lg: {
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xxl,
    minHeight: 64,
    minWidth: 140, // Increased minimum width for lg
  },
  buttonFullWidth: {
    width: '100%',
    minWidth: '100%', // Ensure full width buttons take all space
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  gradient: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.xl,
  },
  gradientContainer: {
    flexDirection: 'row',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1, // Make content take available space
    paddingHorizontal: spacing.sm, // Add horizontal padding inside
  },
  iconLeft: {
    marginRight: spacing.sm,
  },
  iconRight: {
    marginLeft: spacing.sm,
  },
  text: {
    fontWeight: typography.weights.semibold,
    textAlign: 'center',
    flexShrink: 1, // Allow text to shrink if needed
    flexGrow: 0, // Don't let text grow too much
  },
  text_primary: {
    color: colors.textWhite,
  },
  text_secondary: {
    color: colors.textWhite,
  },
  text_gradient: {
    color: colors.textWhite,
  },
  text_outline: {
    color: colors.primary,
  },
  text_ghost: {
    color: colors.primary,
  },
  text_sm: {
    fontSize: typography.sizes.sm,
    lineHeight: typography.sizes.sm * 1.3,
  },
  text_md: {
    fontSize: typography.sizes.md,
    lineHeight: typography.sizes.md * 1.3,
  },
  text_lg: {
    fontSize: typography.sizes.lg,
    lineHeight: typography.sizes.lg * 1.3,
  },
});