/**
 * Legacy screen — no longer on the booking flow.
 *
 * The 3-step create-shipment wizard now goes directly to /booking-success
 * after POST /shipments succeeds, so we never land here. Kept as a route
 * so existing deep links don't 404; it just bounces to shipments.
 *
 * If you want a real confirmation step (e.g. show the quote breakdown
 * before charging the wallet), wire `api.quoteShipment(payload)` here and
 * call `api.createShipment(payload)` on the confirm button.
 */
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { primary } from '../../constants/Colors';

export default function BookingConfirmation() {
    const router = useRouter();
    useEffect(() => {
        const t = setTimeout(() => router.replace('/business/shipments' as any), 0);
        return () => clearTimeout(t);
    }, [router]);

    return (
        <View style={styles.container}>
            <ActivityIndicator size="large" color={primary} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8FAFC' },
});
