// Theme colors and design tokens - Based on modern delivery app design
export const colors = {
  // Primary blue tones from the design
  primary: '#2563EB', // Vibrant blue
  primaryLight: '#60A5FA',
  primaryDark: '#1E40AF',
  secondary: '#8B5CF6', // Purple accent
  
  // Background colors
  background: '#F1F5F9', // Light blue-grey background
  backgroundCard: '#FFFFFF',
  backgroundLight: '#F8FAFC',
  
  // Text colors
  text: '#1E293B', // Dark slate
  textSecondary: '#64748B',
  textLight: '#94A3B8',
  
  // Status colors
  success: '#10B981', // Green for delivered/on-track
  warning: '#F59E0B', // Amber for at-risk
  error: '#EF4444', // Red for delayed
  info: '#3B82F6', // Blue for info
  
  // Map marker colors
  markerGreen: '#22C55E',
  markerYellow: '#EAB308',
  markerBlue: '#3B82F6',
  
  // UI elements
  border: '#E2E8F0',
  borderLight: '#F1F5F9',
  shadow: 'rgba(0, 0, 0, 0.08)',
  overlay: 'rgba(0, 0, 0, 0.5)',
  
  // Interactive states
  disabled: '#CBD5E1',
  hover: '#1E40AF',
  pressed: '#1E3A8A',
};

export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  xxl: '48px',
};

export const borderRadius = {
  sm: '4px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  full: '9999px',
};

export const typography = {
  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  sizes: {
    xs: '12px',
    sm: '14px',
    md: '16px',
    lg: '18px',
    xl: '20px',
    '2xl': '24px',
    '3xl': '30px',
    '4xl': '36px',
  },
  weights: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
};

export const shadows = {
  sm: '0 1px 2px rgba(0, 0, 0, 0.1)',
  md: '0 2px 4px rgba(0, 0, 0, 0.15)',
  lg: '0 4px 8px rgba(0, 0, 0, 0.2)',
};

export const statusColors = {
  'on-track': colors.success,
  'at-risk': colors.warning,
  'delayed': colors.error,
  'pending': colors.textSecondary,
  'completed': colors.success,
  'active': colors.primary,
};

