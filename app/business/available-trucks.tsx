import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    RefreshControl,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { Button } from '../../components/shared/Button';
import { Card } from '../../components/shared/Card';
import { draftToShipmentPayload, useShipmentDraft } from '../../contexts/CreateShipmentContext';
import { background, primary, primaryLighter, text, textSecondary, warning } from '../../constants/Colors';
import { theme } from '../../constants/theme';
import { api, ApiError } from '../../utils/api';
import { resolvePickupCoords } from '../../utils/geo';

type NearbyDriver = {
    id: string;
    name: string;
    ratingAvg: number;
    truckType?: string | null;
    truckNumber?: string | null;
    distanceKm: number;
};

export default function AvailableTrucks() {
    const router = useRouter();
    const { urgent } = useLocalSearchParams();
    const isUrgent = urgent === 'true';
    const { draft, set, reset } = useShipmentDraft();

    const [drivers, setDrivers] = useState<NearbyDriver[]>([]);
    const [selectedDriverId, setSelectedDriverId] = useState<string | null>(null);
    const [locationErr, setLocationErr] = useState<string | null>(null);
    const [searchCoords, setSearchCoords] = useState<{ lat: number; lng: number } | null>(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [booking, setBooking] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const truckType = draft.truckType || 'mini_1_2t';
    const selectedDriver = useMemo(
        () => drivers.find((d) => d.id === selectedDriverId) ?? null,
        [drivers, selectedDriverId],
    );

    const load = useCallback(async () => {
        setLocationErr(null);
        try {
            const coords = await resolvePickupCoords({
                pickupLat: draft.pickupLat,
                pickupLng: draft.pickupLng,
                truckType: draft.truckType || truckType,
            });
            setSearchCoords(coords);
            set({ pickupLat: coords.lat, pickupLng: coords.lng });
            const list = await api.nearbyDrivers(coords.lat, coords.lng, truckType) as NearbyDriver[];
            setDrivers(list);
            setSelectedDriverId((prev) => {
                if (prev && list.some((d) => d.id === prev)) return prev;
                return list.length === 1 ? list[0].id : null;
            });
        } catch (e: any) {
            console.warn('nearby drivers failed', e);
            setDrivers([]);
            setSelectedDriverId(null);
            setLocationErr(e?.message || 'Could not get pickup location');
        }
    }, [draft.pickupLat, draft.pickupLng, draft.truckType, truckType, set]);

    useEffect(() => {
        (async () => {
            setLoading(true);
            await load();
            setLoading(false);
        })();
    }, [load]);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await load();
        setRefreshing(false);
    }, [load]);

    const handleBook = async () => {
        setErrorMsg(null);
        if (!selectedDriverId) {
            setErrorMsg('Tap a driver to select them before booking.');
            return;
        }
        if (!draft.truckType) {
            setErrorMsg('Select a truck type first.');
            return;
        }
        if (!draft.pickupAddress || !draft.dropoffAddress || !draft.weightKg) {
            setErrorMsg('Complete the shipment wizard (route + load details).');
            return;
        }
        setBooking(true);
        try {
            const created: any = await api.createShipment({
                ...draftToShipmentPayload(draft),
                preferredDriverId: selectedDriverId,
            });
            reset();
            router.replace({
                pathname: '/business/booking-success',
                params: {
                    id: created.id,
                    driverName: selectedDriver?.name || 'Driver',
                },
            } as any);
        } catch (e: any) {
            if (e instanceof ApiError && e.status === 402) {
                Alert.alert(
                    'Wallet balance too low',
                    'Top up your wallet from the Wallet tab and try again.',
                );
            } else {
                setErrorMsg(e instanceof ApiError ? e.message : (e?.message || 'Booking failed'));
            }
        } finally {
            setBooking(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>
                    {isUrgent ? 'Urgent Trucks' : 'Nearby Drivers'}
                </Text>
                <View style={styles.placeholder} />
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            >
                <Text style={styles.resultsText}>
                    {loading ? 'Loading…' : `${drivers.length} drivers within 25 km · tap to select`}
                </Text>
                {searchCoords && !loading ? (
                    <Text style={styles.coordsText}>
                        Pickup synced to online driver · {searchCoords.lat.toFixed(4)}, {searchCoords.lng.toFixed(4)}
                    </Text>
                ) : null}
                {locationErr && !loading ? (
                    <Text style={styles.hintText}>{locationErr}</Text>
                ) : null}

                {loading ? (
                    <ActivityIndicator size="large" color={primary} style={{ marginTop: 32 }} />
                ) : drivers.length === 0 ? (
                    <Text style={{ textAlign: 'center', color: textSecondary, marginTop: 24, paddingHorizontal: 16 }}>
                        No online drivers within 25 km for this truck type.{'\n'}
                        Ask the driver to toggle online (with location) and match the same truck category.
                    </Text>
                ) : drivers.map((driver) => {
                    const selected = selectedDriverId === driver.id;
                    return (
                        <TouchableOpacity
                            key={driver.id}
                            activeOpacity={0.8}
                            onPress={() => setSelectedDriverId(driver.id)}
                        >
                            <Card style={[styles.driverCard, selected && styles.driverCardSelected]}>
                                <View style={styles.driverHeader}>
                                    <View style={styles.driverTitleRow}>
                                        {selected ? (
                                            <Ionicons name="checkmark-circle" size={22} color={primary} style={{ marginRight: 8 }} />
                                        ) : (
                                            <View style={styles.radioOuter}>
                                                <View style={styles.radioInner} />
                                            </View>
                                        )}
                                        <Text style={styles.driverName}>{driver.name}</Text>
                                    </View>
                                    <Text style={styles.rating}>★ {driver.ratingAvg.toFixed(1)}</Text>
                                </View>
                                <Text style={[styles.meta, { marginLeft: 30 }]}>
                                    {driver.truckType || truckType} · {driver.distanceKm.toFixed(1)} km away
                                </Text>
                                {driver.truckNumber ? (
                                    <Text style={[styles.meta, { marginLeft: 30 }]}>{driver.truckNumber}</Text>
                                ) : null}
                                {selected ? (
                                    <Text style={styles.selectedLabel}>Selected for this booking</Text>
                                ) : null}
                            </Card>
                        </TouchableOpacity>
                    );
                })}

                {errorMsg ? (
                    <Text style={{ color: '#EF4444', marginTop: 16, textAlign: 'center' }}>{errorMsg}</Text>
                ) : null}
            </ScrollView>

            <View style={styles.footer}>
                {selectedDriver ? (
                    <Text style={styles.footerHint}>
                        Booking with <Text style={{ fontWeight: '700' }}>{selectedDriver.name}</Text>
                    </Text>
                ) : (
                    <Text style={styles.footerHint}>Select a driver above</Text>
                )}
                <Button
                    title={booking ? 'Booking…' : 'Confirm & Book'}
                    onPress={handleBook}
                    fullWidth
                    loading={booking}
                    disabled={booking || !selectedDriverId}
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: background },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: theme.spacing.lg,
        paddingVertical: theme.spacing.md,
    },
    backButton: { padding: 8 },
    headerTitle: { fontSize: 18, fontWeight: '700', color: text },
    placeholder: { width: 40 },
    scrollView: { flex: 1 },
    content: { padding: theme.spacing.lg, paddingBottom: 120 },
    resultsText: { color: textSecondary, marginBottom: theme.spacing.sm },
    coordsText: {
        color: textSecondary,
        fontSize: 11,
        marginBottom: theme.spacing.sm,
    },
    hintText: {
        color: '#EF4444',
        fontSize: 12,
        marginBottom: theme.spacing.md,
    },
    driverCard: { marginBottom: theme.spacing.md, padding: theme.spacing.md },
    driverCardSelected: {
        borderColor: primary,
        borderWidth: 2,
        backgroundColor: primaryLighter,
    },
    driverHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    driverTitleRow: { flexDirection: 'row', alignItems: 'center', flex: 1 },
    driverName: { fontSize: 16, fontWeight: '700', color: text },
    rating: { color: warning, fontWeight: '600' },
    meta: { color: textSecondary, marginTop: 4, fontSize: 13 },
    radioOuter: {
        width: 22,
        height: 22,
        borderRadius: 11,
        borderWidth: 2,
        borderColor: '#CBD5E1',
        marginRight: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    radioInner: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: 'transparent',
    },
    selectedLabel: {
        marginTop: 8,
        marginLeft: 30,
        color: primary,
        fontSize: 12,
        fontWeight: '600',
    },
    footer: {
        paddingHorizontal: theme.spacing.lg,
        paddingTop: theme.spacing.md,
        paddingBottom: 100,
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#F1F5F9',
    },
    footerHint: {
        color: textSecondary,
        fontSize: 13,
        marginBottom: theme.spacing.sm,
        textAlign: 'center',
    },
});
