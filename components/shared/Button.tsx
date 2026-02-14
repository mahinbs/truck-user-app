import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import {
    ActivityIndicator,
    StyleProp,
    StyleSheet,
    Text,
    TextStyle,
    TouchableOpacity,
    ViewStyle,
} from 'react-native';
import { primary, surface } from '../../constants/Colors';
import { theme } from '../../constants/theme';

interface ButtonProps {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary' | 'outline' | 'gradient' | 'warning';
    disabled?: boolean;
    loading?: boolean;
    fullWidth?: boolean;
    style?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
}

export function Button({
    title,
    onPress,
    variant = 'primary',
    disabled = false,
    loading = false,
    fullWidth = false,
    style,
    textStyle,
}: ButtonProps) {
    const buttonStyle = [
        styles.button,
        fullWidth && styles.fullWidth,
        variant === 'primary' && styles.primaryButton,
        variant === 'secondary' && styles.secondaryButton,
        variant === 'outline' && styles.outlineButton,
        variant === 'warning' && styles.warningButton,
        disabled && styles.disabled,
        style,
    ];

    const textStyles = [
        styles.text,
        variant === 'primary' && styles.primaryText,
        variant === 'gradient' && styles.gradientText,
        variant === 'secondary' && styles.secondaryText,
        variant === 'outline' && styles.outlineText,
        variant === 'warning' && styles.warningText,
        textStyle,
    ];

    if (variant === 'gradient') {
        return (
            <TouchableOpacity
                onPress={onPress}
                disabled={disabled || loading}
                activeOpacity={0.8}
                style={[styles.button, fullWidth && styles.fullWidth, style]}
            >
                <LinearGradient
                    colors={theme.gradients.primary as any}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={[styles.gradientButton, disabled && styles.disabled]}
                >
                    {loading ? (
                        <ActivityIndicator color={surface} />
                    ) : (
                        <Text style={textStyles}>{title}</Text>
                    )}
                </LinearGradient>
            </TouchableOpacity>
        );
    }

    return (
        <TouchableOpacity
            style={buttonStyle}
            onPress={onPress}
            disabled={disabled || loading}
            activeOpacity={0.7}
        >
            {loading ? (
                <ActivityIndicator color={variant === 'outline' ? primary : surface} />
            ) : (
                <Text style={textStyles}>{title}</Text>
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        height: 56,
        borderRadius: theme.borderRadius.button,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: theme.spacing.lg,
    },
    fullWidth: {
        width: '100%',
    },
    primaryButton: {
        backgroundColor: primary,
        ...theme.shadows.medium,
    },
    secondaryButton: {
        backgroundColor: '#EFF6FF',
    },
    outlineButton: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: primary,
    },
    warningButton: {
        backgroundColor: '#F59E0B',
        ...theme.shadows.medium,
    },
    gradientButton: {
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: theme.borderRadius.button,
        ...theme.shadows.glow,
    },
    disabled: {
        opacity: 0.5,
    },
    text: {
        ...theme.typography.bodyMedium,
        fontWeight: '600',
    },
    primaryText: {
        color: surface,
    },
    gradientText: {
        color: surface,
        fontWeight: '700',
    },
    secondaryText: {
        color: primary,
    },
    outlineText: {
        color: primary,
    },
    warningText: {
        color: surface,
        fontWeight: '700',
    },
});
