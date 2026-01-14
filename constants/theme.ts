// Theme colors and design tokens - Premium Lighter Blue & White Design
export const colors = {
  // Primary gradient colors - Bright Premium Blue
  primary: '#2563EB', // Brighter Blue (was #1E40AF)
  primaryLight: '#60A5FA', // Light Sky Blue
  primaryDark: '#1D4ED8', // Slightly deeper blue
  primaryGradientStart: '#3B82F6', // Bright Blue start
  primaryGradientEnd: '#2563EB', // Rich Blue end
  
  // Secondary colors - Fresh Blue tones
  secondary: '#0EA5E9', // Sky Blue
  secondaryLight: '#7DD3FC',
  secondaryDark: '#0284C7',
  
  // Blue shades - Lighter Premium palette
  blue: '#3B82F6', // Primary Blue
  blueLight: '#93C5FD', // Very Light Blue
  blueDark: '#1E40AF', // Navy Blue (for contrast)
  blue50: '#F0F9FF', // Alice Blue
  blue100: '#E0F2FE',
  blue200: '#BAE6FD',
  blue300: '#7DD3FC',
  blue400: '#38BDF8',
  blue500: '#0EA5E9',
  blue600: '#0284C7',
  blue700: '#0369A1',
  blue800: '#075985',
  blue900: '#0C4A6E',
  
  // Background colors - Clean White & Very Light Blue
  background: '#F8FAFC', // Slate 50
  backgroundCard: '#FFFFFF', // Pure White
  backgroundLight: '#F1F5F9', // Slate 100
  backgroundBlue: '#F0F9FF', // Sky 50
  
  // Gradient overlays
  gradientOverlay: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
  gradientCard: 'linear-gradient(135deg, #3B82F610 0%, #2563EB10 100%)',
  
  // Text colors - Classic Dark on White
  text: '#0F172A', // Slate 900 - Deep dark
  textSecondary: '#475569', // Slate 600
  textLight: '#94A3B8', // Slate 400
  textWhite: '#FFFFFF',
  textBlue: '#1E40AF', // Royal Blue for accents
  
  // Status colors - Modern & Vibrant
  success: '#10B981', // Emerald Green
  successLight: '#D1FAE5',
  successDark: '#059669',
  warning: '#F59E0B', // Amber
  warningLight: '#FEF3C7',
  warningDark: '#D97706',
  error: '#EF4444', // Red
  errorLight: '#FEE2E2',
  errorDark: '#DC2626',
  info: '#3B82F6', // Blue
  infoLight: '#DBEAFE',
  infoDark: '#2563EB',
  
  // Map marker colors
  markerGreen: '#10B981',
  markerYellow: '#F59E0B',
  markerBlue: '#2563EB',
  markerRed: '#EF4444',
  
  // UI elements - Premium borders & shadows
  border: '#E2E8F0', // Slate 200
  borderLight: '#F1F5F9', // Slate 100
  borderBlue: '#BFDBFE', // Blue 200
  shadow: 'rgba(30, 64, 175, 0.12)', // Blue shadow with opacity
  shadowDark: 'rgba(15, 23, 42, 0.15)', // Dark shadow
  shadowBlue: 'rgba(59, 130, 246, 0.2)', // Blue glow
  overlay: 'rgba(15, 23, 42, 0.6)', // Dark overlay
  
  // Interactive states
  disabled: '#CBD5E1', // Slate 300
  hover: '#2563EB', // Blue 600
  pressed: '#1E40AF', // Blue 800
  focus: '#3B82F6', // Blue 500
  
  // Transparent variations for overlays
  primaryTransparent: 'rgba(30, 64, 175, 0.1)',
  primaryTransparentMedium: 'rgba(30, 64, 175, 0.2)',
  primaryTransparentDark: 'rgba(30, 64, 175, 0.3)',
  whiteTransparent: 'rgba(255, 255, 255, 0.1)',
  whiteTransparentMedium: 'rgba(255, 255, 255, 0.2)',
  whiteTransparentDark: 'rgba(255, 255, 255, 0.3)',
  blueTransparent: 'rgba(59, 130, 246, 0.1)',
  blueTransparentMedium: 'rgba(59, 130, 246, 0.2)',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const borderRadius = {
  sm: 6,
  md: 10,
  lg: 14,
  xl: 18,
  '2xl': 24,
  full: 9999,
};

export const typography = {
  fontFamily: 'System', // Will use Inter/Roboto style
  sizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
  },
  weights: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
};

export const shadows = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  sm: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 3,
    elevation: 2,
  },
  md: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  lg: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 8,
  },
  xl: {
    shadowColor: colors.shadowDark,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 12,
  },
  blue: {
    shadowColor: colors.shadowBlue,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
};

export const statusColors = {
  'on-track': colors.success,
  'at-risk': colors.warning,
  'delayed': colors.error,
  'pending': colors.textSecondary,
  'completed': colors.success,
  'active': colors.primary,
  'in-transit': colors.info,
  'delivered': colors.success,
  'cancelled': colors.error,
};

// Gradient definitions - Premium Blue Gradients
export const gradients = {
  primary: {
    colors: [colors.primaryGradientStart, colors.primaryGradientEnd],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  blue: {
    colors: ['#1E40AF', '#3B82F6', '#60A5FA'],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  navy: {
    colors: ['#1E3A8A', '#1E40AF', '#2563EB'],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  sky: {
    colors: ['#3B82F6', '#60A5FA', '#93C5FD'],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  success: {
    colors: ['#10B981', '#34D399'],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  card: {
    colors: ['rgba(30, 64, 175, 0.05)', 'rgba(59, 130, 246, 0.05)'],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  overlay: {
    colors: ['rgba(30, 64, 175, 0.9)', 'rgba(59, 130, 246, 0.8)'],
    start: { x: 0, y: 0 },
    end: { x: 0, y: 1 },
  },
  subtle: {
    colors: ['rgba(239, 246, 255, 0.8)', 'rgba(255, 255, 255, 0.9)'],
    start: { x: 0, y: 0 },
    end: { x: 0, y: 1 },
  },
};

// Animation timings
export const animation = {
  duration: {
    fast: 150,
    normal: 250,
    slow: 350,
    slower: 500,
  },
  easing: {
    smooth: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },
};

// Layout constants
export const layout = {
  screenPadding: spacing.lg,
  cardPadding: spacing.md,
  maxWidth: 600,
  headerHeight: 60,
  tabBarHeight: 65,
};

