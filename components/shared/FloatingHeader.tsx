import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native';
import { primary, text, textSecondary } from '../../constants/Colors';
import { theme } from '../../constants/theme';

interface FloatingHeaderProps {
    greeting: string;
    userName: string;
    onNotificationPress?: () => void;
    onProfilePress?: () => void;
    avatarUrl?: string;
}

export const FloatingHeader: React.FC<FloatingHeaderProps> = ({
    greeting,
    userName,
    onNotificationPress,
    onProfilePress,
    avatarUrl,
}) => {
    return (
        <BlurView intensity={12} style={styles.container} tint="light">
            <LinearGradient
                colors={['rgba(59, 130, 246, 0.08)', 'rgba(96, 165, 250, 0.04)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.content as ViewStyle}
            >
                <View style={styles.leftSection}>
                    <Text style={styles.greeting}>{greeting}</Text>
                    <Text style={styles.userName}>{userName}</Text>
                </View>

                <View style={styles.rightSection}>
                    <TouchableOpacity
                        style={styles.iconButton}
                        onPress={onNotificationPress}
                    >
                        <Ionicons name="notifications-outline" size={24} color={text} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.avatar}
                        onPress={onProfilePress}
                    >
                        {avatarUrl ? (
                            <Image source={{ uri: avatarUrl }} style={styles.avatarImage} />
                        ) : (
                            <View style={styles.avatarPlaceholder}>
                                <Text style={styles.avatarText}>
                                    {userName.charAt(0).toUpperCase()}
                                </Text>
                            </View>
                        )}
                    </TouchableOpacity>
                </View>
            </LinearGradient>
        </BlurView>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'rgba(245, 158, 11, 0.15)',
        borderRadius: theme.borderRadius.md,
        marginHorizontal: theme.spacing.base,
        marginTop: theme.spacing.base,
        overflow: 'hidden',
        ...theme.shadows.medium,
        elevation: 5,
        shadowColor: 'rgba(59, 130, 246, 0.2)',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.12,
        shadowRadius: 10,
        borderWidth: 0.2,
        borderColor: 'rgba(59, 131, 246, 0.17)',
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: theme.spacing.base,
        paddingVertical: theme.spacing.md,
        borderRadius: theme.borderRadius.md,
    },
    leftSection: {
        flex: 1,
    },
    rightSection: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.md,
    },
    greeting: {
        ...theme.typography.caption,
        color: textSecondary,
    },
    userName: {
        ...theme.typography.h3,
        color: text,
    },
    iconButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatar: {
        width: theme.sizes.avatarSize.md,
        height: theme.sizes.avatarSize.md,
        borderRadius: theme.sizes.avatarSize.md / 2,
    },
    avatarImage: {
        width: '100%',
        height: '100%',
        borderRadius: theme.sizes.avatarSize.md / 2,
    },
    avatarPlaceholder: {
        width: '100%',
        height: '100%',
        borderRadius: theme.sizes.avatarSize.md / 2,
        backgroundColor: primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: {
        ...theme.typography.h3,
        color: '#FFFFFF',
    },
});
