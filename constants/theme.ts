/**
 * Trukx Design System Theme
 * Typography, Spacing, Shadows, and Premium Effects
 */

import { Colors } from './Colors';

export const theme = {
  // Modern gradient system
  gradients: {
    primary: ['#1E40AF', '#3B82F6'], // Deep blue gradient
    secondary: ['#0EA5E9', '#38BDF8'],
    accent: ['#3B82F6', '#6366F1'],
    background: ['#FFFFFF', '#F8FAFC'], // Very subtle background gradient
    card: ['#FFFFFF', '#FFFFFF'], // Solid card background
    cardHover: ['#F8FAFC', '#FFFFFF'],
    overlay: ['rgba(30, 64, 175, 0.8)', 'rgba(30, 64, 175, 0.4)'], // For image overlays
    darkOverlay: ['rgba(0,0,0,0.7)', 'rgba(0,0,0,0.3)'], // Dark overlay for text readability on images
  },

  // Gradient text colors for LinearGradient
  gradientColors: {
    blue: ['#1E40AF', '#3B82F6', '#60A5FA'],
    cyan: ['#0EA5E9', '#06B6D4', '#22D3EE'],
    purple: ['#3B82F6', '#8B5CF6', '#A78BFA'],
  },
  colors: Colors.light,

  // Typography Scale
  typography: {
    display: {
      fontSize: 36,
      fontWeight: '700' as const,
      lineHeight: 44,
      fontFamily: 'PlusJakartaSans_700Bold',
    },
    h1: {
      fontSize: 28,
      fontWeight: '700' as const,
      lineHeight: 36,
      fontFamily: 'PlusJakartaSans_700Bold',
    },
    h2: {
      fontSize: 24,
      fontWeight: '600' as const,
      lineHeight: 32,
      fontFamily: 'PlusJakartaSans_600SemiBold',
    },
    h3: {
      fontSize: 20,
      fontWeight: '600' as const,
      lineHeight: 28,
      fontFamily: 'PlusJakartaSans_600SemiBold',
    },
    body: {
      fontSize: 16,
      fontWeight: '400' as const,
      lineHeight: 24,
      fontFamily: 'PlusJakartaSans_400Regular',
    },
    bodyMedium: {
      fontSize: 16,
      fontWeight: '500' as const,
      lineHeight: 24,
      fontFamily: 'PlusJakartaSans_500Medium',
    },
    bodySmall: {
      fontSize: 14,
      fontWeight: '400' as const,
      lineHeight: 20,
      fontFamily: 'PlusJakartaSans_400Regular',
    },
    caption: {
      fontSize: 12,
      fontWeight: '400' as const,
      lineHeight: 16,
      fontFamily: 'PlusJakartaSans_400Regular',
    },
    captionMedium: {
      fontSize: 12,
      fontWeight: '500' as const,
      lineHeight: 16,
      fontFamily: 'PlusJakartaSans_500Medium',
    },
  },

  // Spacing System (4px base grid)
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    base: 16,
    lg: 24,
    xl: 32,
    xxl: 40,
    xxxl: 48,
  },

  // Border Radius
  borderRadius: {
    sm: 8,
    base: 12,
    md: 16,
    lg: 20,
    xl: 24,
    full: 9999,
    button: 14, // Slightly rounder buttons
    card: 24,   // Higher border radius for cards
  },

  // Shadows for Cards
  shadows: {
    light: {
      shadowColor: '#64748B',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 2,
    },
    medium: {
      shadowColor: '#64748B',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 12,
      elevation: 4,
    },
    strong: {
      shadowColor: '#0F172A',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.15,
      shadowRadius: 24,
      elevation: 8,
    },
    glow: {
      shadowColor: '#3B82F6',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.25,
      shadowRadius: 16,
      elevation: 6,
    },
    card: {
      shadowColor: '#64748B',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.06,
      shadowRadius: 16,
      elevation: 3,
    },
    glowStrong: {
      shadowColor: '#3B82F6',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.4,
      shadowRadius: 20,
      elevation: 10,
    },
  },

  // Premium Effects
  effects: {
    glass: {
      backgroundColor: 'rgba(255, 255, 255, 0.7)',
      backdropBlur: 10,
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.5)',
    },
    glassStrong: {
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      backdropBlur: 16,
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.8)',
    },
  },

  // Common Sizes
  sizes: {
    buttonHeight: 56, // Taller buttons
    inputHeight: 56,  // Taller inputs
    iconSize: {
      sm: 16,
      base: 20,
      md: 24,
      lg: 32,
    },
    avatarSize: {
      sm: 32,
      base: 40,
      md: 48,
      lg: 64,
    },
  },
};

// Type exports for TypeScript
export type Theme = typeof theme;
export type Typography = keyof typeof theme.typography;
export type Spacing = keyof typeof theme.spacing;
export type BorderRadius = keyof typeof theme.borderRadius;
