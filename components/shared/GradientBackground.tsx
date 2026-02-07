import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { theme } from '../../constants/theme';

interface GradientBackgroundProps {
    children: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'accent' | 'background' | 'backgroundSubtle' | 'overlay';
    style?: ViewStyle;
    start?: { x: number; y: number };
    end?: { x: number; y: number };
}

export function GradientBackground({
    children,
    variant = 'background',
    style,
    start = { x: 0, y: 0 },
    end = { x: 0, y: 1 },
}: GradientBackgroundProps) {
    const colors = theme.gradients[variant];

    return (
        <LinearGradient
            colors={colors}
            start={start}
            end={end}
            style={[styles.container, style]}
        >
            {children}
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
