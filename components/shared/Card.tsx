import { BlurView } from 'expo-blur';
import React, { ReactNode } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { border, surface } from '../../constants/Colors';
import { theme } from '../../constants/theme';

interface CardProps {
    children: ReactNode;
    variant?: 'default' | 'glass' | 'outlined';
    style?: ViewStyle;
    padding?: number;
}

export const Card: React.FC<CardProps> = ({
    children,
    variant = 'default',
    style,
    padding = theme.spacing.base,
}) => {
    if (variant === 'glass') {
        return (
            <BlurView
                intensity={10}
                style={[
                    styles.cardBase,
                    styles.glassCard,
                    { padding },
                    style,
                ]}
                tint="light"
            >
                {children}
            </BlurView>
        );
    }

    const cardStyle = variant === 'outlined' ? styles.outlinedCard : styles.defaultCard;

    return (
        <View style={[styles.cardBase, cardStyle, { padding }, style]}>
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    cardBase: {
        borderRadius: theme.borderRadius.md,
    },
    defaultCard: {
        backgroundColor: surface,
        ...theme.shadows.light,
    },
    outlinedCard: {
        backgroundColor: surface,
        borderWidth: 1,
        borderColor: border,
    },
    glassCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.75)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
        ...theme.shadows.medium,
    },
});
