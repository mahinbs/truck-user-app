import { withSpring, withTiming, Easing, WithSpringConfig, WithTimingConfig } from 'react-native-reanimated';

// Spring animation presets
export const springPresets = {
  gentle: {
    damping: 20,
    stiffness: 90,
    mass: 0.8,
  } as WithSpringConfig,
  
  bouncy: {
    damping: 15,
    stiffness: 150,
    mass: 0.5,
  } as WithSpringConfig,
  
  smooth: {
    damping: 30,
    stiffness: 120,
    mass: 1,
  } as WithSpringConfig,
  
  snappy: {
    damping: 25,
    stiffness: 180,
    mass: 0.6,
  } as WithSpringConfig,
};

// Timing animation presets
export const timingPresets = {
  fast: {
    duration: 150,
    easing: Easing.out(Easing.cubic),
  } as WithTimingConfig,
  
  normal: {
    duration: 250,
    easing: Easing.out(Easing.cubic),
  } as WithTimingConfig,
  
  slow: {
    duration: 350,
    easing: Easing.out(Easing.cubic),
  } as WithTimingConfig,
  
  smooth: {
    duration: 300,
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  } as WithTimingConfig,
  
  elastic: {
    duration: 400,
    easing: Easing.elastic(1.2),
  } as WithTimingConfig,
};

// Helper functions for common animations
export const fadeIn = (duration = 250) => {
  return withTiming(1, { duration, easing: Easing.out(Easing.ease) });
};

export const fadeOut = (duration = 250) => {
  return withTiming(0, { duration, easing: Easing.in(Easing.ease) });
};

export const scaleIn = (duration = 250) => {
  return withSpring(1, springPresets.bouncy);
};

export const scaleOut = (duration = 150) => {
  return withTiming(0.95, timingPresets.fast);
};

export const slideInRight = (distance: number, duration = 250) => {
  return withTiming(distance, { duration, easing: Easing.out(Easing.cubic) });
};

export const slideInLeft = (distance: number, duration = 250) => {
  return withTiming(-distance, { duration, easing: Easing.out(Easing.cubic) });
};

export const bounceIn = () => {
  return withSpring(1, {
    damping: 8,
    stiffness: 100,
    mass: 0.5,
  });
};

// Haptic feedback patterns
export const hapticPatterns = {
  light: 'light',
  medium: 'medium',
  heavy: 'heavy',
  success: 'notificationSuccess',
  warning: 'notificationWarning',
  error: 'notificationError',
} as const;

