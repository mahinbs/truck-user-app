import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
    SafeAreaView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { Button } from '../../components/shared/Button';
import { background, text, textSecondary } from '../../constants/Colors';
import { theme } from '../../constants/theme';

export default function BookingFailure() {
    const router = useRouter();

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <View style={styles.iconContainer}>
                    <Ionicons name="alert-circle" size={100} color="#EF4444" />
                </View>

                <Text style={styles.title}>Booking Failed</Text>
                <Text style={styles.subtitle}>
                    Something went wrong while processing your payment. Please try again or use a different payment method.
                </Text>

                <View style={styles.buttonContainer}>
                    <Button
                        title="Retry Payment"
                        onPress={() => router.back()}
                        variant="primary"
                        fullWidth
                        style={styles.button}
                    />
                    <Button
                        title="Cancel & Go Home"
                        onPress={() => router.push('/(business)/home')}
                        variant="outline"
                        fullWidth
                        style={styles.button}
                    />
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: background,
        justifyContent: 'center',
    },
    content: {
        padding: theme.spacing.xl,
        alignItems: 'center',
    },
    iconContainer: {
        marginBottom: theme.spacing.xl,
        ...theme.shadows.medium,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: text,
        marginBottom: theme.spacing.md,
        fontFamily: 'PlusJakartaSans_700Bold',
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: textSecondary,
        textAlign: 'center',
        marginBottom: theme.spacing.xl,
        lineHeight: 24,
        fontFamily: 'Inter_400Regular',
    },
    buttonContainer: {
        width: '100%',
        gap: theme.spacing.md,
    },
    button: {
        marginBottom: theme.spacing.sm,
    },
});
