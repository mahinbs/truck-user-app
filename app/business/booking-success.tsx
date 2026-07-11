import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import {
    SafeAreaView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { Button } from '../../components/shared/Button';
import { background, surface, text, textSecondary } from '../../constants/Colors';
import { theme } from '../../constants/theme';

export default function BookingSuccess() {
    const router = useRouter();
    const { id, driverName } = useLocalSearchParams<{ id?: string; driverName?: string }>();
    const bookingId = id ? String(id).slice(0, 8).toUpperCase() : '—';

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <View style={styles.iconContainer}>
                    <Ionicons name="checkmark-circle" size={100} color="#10B981" />
                </View>

                <Text style={styles.title}>Booking Confirmed!</Text>
                <Text style={styles.subtitle}>
                    {driverName
                        ? `Offer sent to ${driverName}. They'll accept from their app and head to pickup.`
                        : 'Your shipment is booked. The selected driver will accept from their app.'}
                </Text>

                <View style={styles.infoCard}>
                    <Text style={styles.infoLabel}>Booking ID</Text>
                    <Text style={styles.infoValue}>{bookingId}</Text>
                </View>

                <View style={styles.buttonContainer}>
                    <Button
                        title="Track Shipment"
                        onPress={() => router.push({
                            pathname: '/business/tracking',
                            params: id ? { id } : undefined,
                        } as any)}
                        variant="primary"
                        fullWidth
                        style={styles.button}
                    />
                    <Button
                        title="Back to Home"
                        onPress={() => router.push('/business/home')}
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
        ...theme.shadows.glow,
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
    infoCard: {
        backgroundColor: surface,
        padding: theme.spacing.lg,
        borderRadius: theme.borderRadius.md,
        alignItems: 'center',
        width: '100%',
        marginBottom: theme.spacing.xl,
        ...theme.shadows.light,
    },
    infoLabel: {
        fontSize: 14,
        color: textSecondary,
        marginBottom: 4,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    infoValue: {
        fontSize: 20,
        fontWeight: '700',
        color: text,
        fontFamily: 'PlusJakartaSans_700Bold',
    },
    buttonContainer: {
        width: '100%',
        gap: theme.spacing.md,
    },
    button: {
        marginBottom: theme.spacing.sm,
    },
});
