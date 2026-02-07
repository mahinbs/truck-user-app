/**
 * Trukx Color System
 * Light Mode Only - Premium Blue + Off-White Palette
 */

export const Colors = {
    light: {
        // Backgrounds
        background: '#FFFFFF',        // Pure white for cleaner look
        surface: '#FFFFFF',           // Card surface
        surfaceHighlight: '#F8FAFC',  // Subtle highlight for sections

        // Primary Blue - Deep & Premium
        primary: '#1E40AF',           // Deep Blue for primary actions
        primaryLight: '#3B82F6',      // Brighter Blue for accents
        primaryLighter: '#EFF6FF',    // Very light blue for backgrounds
        primaryDark: '#1E3A8A',       // Darker shade for text/contrast

        // Text Colors
        text: '#0F172A',              // Dark slate for primary text
        textSecondary: '#64748B',     // Slate for secondary text
        textTertiary: '#94A3B8',      // Lighter slate
        textInverse: '#FFFFFF',       // Text on dark backgrounds

        // Borders & Dividers
        border: '#E2E8F0',            // Standard border
        borderLight: '#F1F5F9',       // Light border

        // Status Colors
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        info: '#3B82F6',

        // Semantic Status
        active: '#10B981',
        completed: '#64748B',
        cancelled: '#EF4444',
        pending: '#F59E0B',

        // Glassmorphism
        glassBackground: 'rgba(255, 255, 255, 0.85)',
        glassBackgroundStrong: 'rgba(255, 255, 255, 0.95)',
        glassBorder: 'rgba(255, 255, 255, 0.5)',

        // Shadows
        shadowLight: 'rgba(15, 23, 42, 0.04)',
        shadowMedium: 'rgba(15, 23, 42, 0.08)',
        shadowStrong: 'rgba(15, 23, 42, 0.12)',
    }
};

// Export flattened for easier access
export const {
    background,
    surface,
    surfaceHighlight,
    primary,
    primaryLight,
    primaryLighter,
    primaryDark,
    text,
    textSecondary,
    textTertiary,
    textInverse,
    border,
    borderLight,
    success,
    warning,
    error,
    info,
    active,
    completed,
    cancelled,
    pending,
    glassBackground,
    glassBackgroundStrong,
    glassBorder,
    shadowLight,
    shadowMedium,
    shadowStrong,
} = Colors.light;
