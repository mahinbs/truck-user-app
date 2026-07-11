import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Animated,
    Dimensions,
    Modal,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { api, ApiError } from '../../utils/api';
import { Button } from '../../components/shared/Button';
import { StatusPill } from '../../components/shared/StatusPill';
import { Colors } from '../../constants/Colors';
import { theme } from '../../constants/theme';

const { width, height } = Dimensions.get('window');

type TrackingData = {
    tripId?: string;
    status?: string;
    lastLocation?: { lat: number; lng: number } | null;
    lastLocationAt?: string | null;
    driverName?: string | null;
    driverPhone?: string | null;
    truckNumber?: string | null;
};

type ShipmentData = {
    id: string;
    pickupAddress: string;
    dropAddress: string;
    truckType: string;
    status: string;
};

export default function Tracking() {
    const router = useRouter();
    const params = useLocalSearchParams<{ id?: string }>();
    const shipmentId = params.id || '';
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const pulseAnim = useRef(new Animated.Value(1)).current;
    const [shipment, setShipment] = useState<ShipmentData | null>(null);
    const [tracking, setTracking] = useState<TrackingData | null>(null);
    const [loading, setLoading] = useState(true);
    const [rateOpen, setRateOpen] = useState(false);
    const [stars, setStars] = useState(5);
    const [rateComment, setRateComment] = useState('');
    const [hasRated, setHasRated] = useState(false);

    const refresh = useCallback(async () => {
        if (!shipmentId) return;
        try {
            const [s, t] = await Promise.all([
                api.getShipment(shipmentId) as Promise<ShipmentData>,
                api.tracking(shipmentId) as Promise<TrackingData>,
            ]);
            setShipment(s);
            setTracking(t);
        } catch (e) {
            console.warn('tracking fetch failed', e);
        }
    }, [shipmentId]);

    useEffect(() => {
        (async () => {
            setLoading(true);
            await refresh();
            setLoading(false);
        })();
        const iv = setInterval(refresh, 15000);
        return () => clearInterval(iv);
    }, [refresh]);

    const cancelShipment = () => {
        Alert.alert('Cancel shipment?', 'This refunds your wallet if still active.', [
            { text: 'No', style: 'cancel' },
            {
                text: 'Yes, cancel',
                style: 'destructive',
                onPress: async () => {
                    try {
                        await api.cancelShipment(shipmentId);
                        Alert.alert('Cancelled');
                        router.back();
                    } catch (e: any) {
                        Alert.alert('Failed', e instanceof ApiError ? e.message : (e?.message || 'unknown'));
                    }
                },
            },
        ]);
    };

    const submitRating = async () => {
        try {
            await api.rateShipment(shipmentId, { stars, rateeRole: 'driver', comment: rateComment || undefined });
            setHasRated(true);
            setRateOpen(false);
            Alert.alert('Thanks', 'Your rating was submitted. It updates the driver\'s profile score.');
        } catch (e: any) {
            Alert.alert('Rating failed', e instanceof ApiError ? e.message : (e?.message || 'unknown'));
        }
    };

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
        }).start();

        // Pulsing animation
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1.3,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, []);

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={theme.gradients.background as any}
                style={StyleSheet.absoluteFillObject}
            />

            <SafeAreaView style={styles.safeArea}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
                        <Ionicons name="arrow-back" size={24} color={Colors.light.text} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Track Shipment</Text>
                    <TouchableOpacity style={styles.iconButton} onPress={cancelShipment}>
                        <Ionicons name="close-circle-outline" size={24} color={Colors.light.text} />
                    </TouchableOpacity>
                </View>

                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.content}
                    showsVerticalScrollIndicator={false}
                >
                    <Animated.View style={{ opacity: fadeAnim }}>
                        {loading && !shipment ? (
                            <ActivityIndicator size="large" color={Colors.light.primary} style={{ marginTop: 32 }} />
                        ) : null}
                        {/* Shipment Info Card */}
                        <View style={styles.card}>
                            <View style={styles.cardHeader}>
                                <View style={styles.routeContainer}>
                                    <View style={styles.routeRow}>
                                        <Text style={styles.routeText} numberOfLines={1}>
                                            {shipment?.pickupAddress?.split(',')[0] || 'Pickup'}
                                        </Text>
                                        <Ionicons name="arrow-forward" size={18} color={Colors.light.textSecondary} />
                                        <Text style={styles.routeText} numberOfLines={1}>
                                            {shipment?.dropAddress?.split(',')[0] || 'Drop'}
                                        </Text>
                                    </View>
                                    <Text style={styles.shipmentId}>ID: {shipmentId.slice(0, 8) || '—'}</Text>
                                </View>
                                <StatusPill status={(shipment?.status || tracking?.status || 'active') as any} />
                            </View>

                            <View style={styles.infoDetails}>
                                <View style={styles.infoRow}>
                                    <View style={styles.infoItem}>
                                        <View style={[styles.infoIcon, { backgroundColor: '#EFF6FF' }]}>
                                            <Ionicons name="car-outline" size={20} color={Colors.light.primary} />
                                        </View>
                                        <View>
                                            <Text style={styles.infoLabel}>Vehicle</Text>
                                            <Text style={styles.infoValue}>{shipment?.truckType || '—'}</Text>
                                        </View>
                                    </View>
                                    <View style={styles.infoDivider} />
                                    <View style={styles.infoItem}>
                                        <View style={[styles.infoIcon, { backgroundColor: '#ECFDF5' }]}>
                                            <Ionicons name="person-outline" size={20} color="#10B981" />
                                        </View>
                                        <View>
                                            <Text style={styles.infoLabel}>Driver</Text>
                                            <Text style={styles.infoValue}>{tracking?.driverName || 'Awaiting driver'}</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </View>

                        {/* Live Location Card */}
                        <View style={styles.card}>
                            <View style={styles.locationHeader}>
                                <View style={styles.pulseContainer}>
                                    <Animated.View
                                        style={[
                                            styles.pulseOuter,
                                            {
                                                transform: [{ scale: pulseAnim }],
                                                opacity: pulseAnim.interpolate({
                                                    inputRange: [1, 1.3],
                                                    outputRange: [0.6, 0.2],
                                                }),
                                            },
                                        ]}
                                    />
                                    <View style={styles.pulseInner} />
                                </View>
                                <View>
                                    <Text style={styles.locationTitle}>Live Location</Text>
                                    <Text style={styles.lastUpdate}>
                                        {tracking?.lastLocationAt
                                            ? `Updated ${new Date(tracking.lastLocationAt).toLocaleTimeString()}`
                                            : 'No GPS yet'}
                                    </Text>
                                </View>
                            </View>

                            {/* Map Placeholder */}
                            <View style={styles.mapPlaceholder}>
                                <Ionicons name="map-outline" size={48} color={Colors.light.primary} />
                                <Text style={styles.mapText}>Map View Loading...</Text>
                            </View>

                            <View style={styles.currentLocation}>
                                <Ionicons name="location" size={24} color={Colors.light.primary} />
                                <View style={styles.currentLocationText}>
                                    <Text style={styles.currentLocationLabel}>Current Location</Text>
                                    <Text style={styles.currentLocationValue}>
                                        {tracking?.lastLocation
                                            ? `${tracking.lastLocation.lat.toFixed(4)}, ${tracking.lastLocation.lng.toFixed(4)}`
                                            : 'Waiting for driver location'}
                                    </Text>
                                </View>
                            </View>
                        </View>

                        {/* Progress Timeline */}
                        <Text style={styles.sectionTitle}>Shipment Timeline</Text>
                        <View style={styles.card}>
                            {/* Timeline Item 1 - Completed */}
                            <View style={styles.timelineItem}>
                                <View style={styles.timelineLeft}>
                                    <View style={[styles.timelineDot, { backgroundColor: '#ECFDF5', borderColor: '#10B981' }]}>
                                        <Ionicons name="checkmark" size={14} color="#10B981" />
                                    </View>
                                    <View style={[styles.timelineLine, { backgroundColor: '#10B981' }]} />
                                </View>
                                <View style={styles.timelineContent}>
                                    <Text style={styles.timelineTitle}>Picked Up</Text>
                                    <Text style={styles.timelineLocation}>Mumbai, Maharashtra</Text>
                                    <Text style={styles.timelineTime}>Dec 15, 10:30 AM</Text>
                                </View>
                            </View>

                            {/* Timeline Item 2 - Current */}
                            <View style={styles.timelineItem}>
                                <View style={styles.timelineLeft}>
                                    <View style={[styles.timelineDot, { backgroundColor: '#EFF6FF', borderColor: Colors.light.primary }]}>
                                        <View style={styles.timelineDotInner} />
                                    </View>
                                    <View style={styles.timelineLine} />
                                </View>
                                <View style={styles.timelineContent}>
                                    <Text style={styles.timelineTitle}>In Transit</Text>
                                    <Text style={styles.timelineLocation}>Vadodara, Gujarat</Text>
                                    <Text style={styles.timelineTime}>Dec 15, 6:45 PM</Text>
                                </View>
                            </View>

                            {/* Timeline Item 3 - Pending */}
                            <View style={[styles.timelineItem, styles.timelineItemLast]}>
                                <View style={styles.timelineLeft}>
                                    <View style={[styles.timelineDot, { backgroundColor: '#F1F5F9', borderColor: '#94A3B8' }]}>
                                        <View style={[styles.timelineDotInner, { backgroundColor: '#94A3B8' }]} />
                                    </View>
                                </View>
                                <View style={styles.timelineContent}>
                                    <Text style={[styles.timelineTitle, { color: Colors.light.textSecondary }]}>
                                        Delivery
                                    </Text>
                                    <Text style={styles.timelineLocation}>Delhi, NCR</Text>
                                    <Text style={styles.timelineTime}>Expected: Dec 16, 2:00 AM</Text>
                                </View>
                            </View>
                        </View>

                        {/* Shipment Details */}
                        <Text style={styles.sectionTitle}>Shipment Details</Text>
                        <View style={styles.card}>
                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>Distance</Text>
                                <Text style={styles.detailValue}>1,420 km</Text>
                            </View>
                            <View style={styles.detailDivider} />
                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>Estimated Time</Text>
                                <Text style={styles.detailValue}>16 hours</Text>
                            </View>
                            <View style={styles.detailDivider} />
                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>Freight Charges</Text>
                                <Text style={[styles.detailValue, { color: Colors.light.primary }]}>
                                    ₹24,500
                                </Text>
                            </View>
                        </View>

                        {shipment?.status === 'completed' && !hasRated ? (
                            <Button title="Rate your driver" onPress={() => setRateOpen(true)} fullWidth />
                        ) : null}
                        {shipment?.status === 'completed' && hasRated ? (
                            <Text style={{ textAlign: 'center', color: Colors.light.textSecondary, marginBottom: 12 }}>
                                You rated this driver. Thank you!
                            </Text>
                        ) : null}
                        {tracking?.driverPhone ? (
                            <TouchableOpacity style={styles.contactButton}>
                                <LinearGradient
                                    colors={theme.gradients.primary as any}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    style={styles.contactGradient}
                                >
                                    <Ionicons name="call" size={20} color="#FFFFFF" />
                                    <Text style={styles.contactText}>{tracking.driverPhone}</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        ) : null}
                    </Animated.View>
                </ScrollView>
            </SafeAreaView>

            <Modal visible={rateOpen} transparent animationType="slide">
                <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' }}>
                    <View style={{ backgroundColor: '#fff', padding: 20, borderTopLeftRadius: 16, borderTopRightRadius: 16 }}>
                        <Text style={{ fontSize: 18, fontWeight: '700', marginBottom: 8 }}>Rate your driver</Text>
                        <Text style={{ color: '#64748B', marginBottom: 12, fontSize: 13 }}>
                            Only you can submit this — ratings are not automatic.
                        </Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: 12 }}>
                            {[1, 2, 3, 4, 5].map((n) => (
                                <TouchableOpacity key={n} onPress={() => setStars(n)}>
                                    <Ionicons
                                        name={n <= stars ? 'star' : 'star-outline'}
                                        size={36}
                                        color="#F59E0B"
                                    />
                                </TouchableOpacity>
                            ))}
                        </View>
                        <TextInput
                            value={rateComment}
                            onChangeText={setRateComment}
                            placeholder="Comment (optional)"
                            style={{ borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 10, padding: 12, marginBottom: 12 }}
                        />
                        <Button title="Submit rating" onPress={submitRating} fullWidth />
                        <Button title="Cancel" variant="secondary" onPress={() => setRateOpen(false)} fullWidth style={{ marginTop: 8 }} />
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    safeArea: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: theme.spacing.lg,
        paddingVertical: theme.spacing.md,
    },
    headerTitle: {
        fontSize: 18,
        fontFamily: 'PlusJakartaSans_700Bold',
        color: Colors.light.text,
    },
    iconButton: {
        width: 44,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 14,
        backgroundColor: '#FFFFFF',
        ...theme.shadows.light,
    },
    scrollView: {
        flex: 1,
    },
    content: {
        padding: theme.spacing.lg,
        paddingBottom: 110,
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: theme.spacing.md,
        marginBottom: theme.spacing.lg,
        ...theme.shadows.light,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: theme.spacing.md,
    },
    routeContainer: {
        flex: 1,
        marginRight: theme.spacing.sm,
    },
    routeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 4,
        flexWrap: 'wrap',
    },
    routeText: {
        fontSize: 18,
        fontFamily: 'PlusJakartaSans_700Bold',
        color: Colors.light.text,
        flexShrink: 1,
    },
    shipmentId: {
        fontSize: 12,
        fontFamily: 'PlusJakartaSans_500Medium',
        color: Colors.light.textSecondary,
    },
    infoDetails: {
        paddingTop: theme.spacing.md,
        borderTopWidth: 1,
        borderTopColor: '#F1F5F9',
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    infoItem: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.sm,
    },
    infoDivider: {
        width: 1,
        height: 32,
        backgroundColor: '#F1F5F9',
        marginHorizontal: theme.spacing.sm,
    },
    infoIcon: {
        width: 40,
        height: 40,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    infoLabel: {
        fontSize: 11,
        fontFamily: 'PlusJakartaSans_500Medium',
        color: Colors.light.textSecondary,
    },
    infoValue: {
        fontSize: 13,
        fontFamily: 'PlusJakartaSans_600SemiBold',
        color: Colors.light.text,
    },
    locationHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.sm,
        marginBottom: theme.spacing.md,
    },
    pulseContainer: {
        width: 32,
        height: 32,
        justifyContent: 'center',
        alignItems: 'center',
    },
    pulseOuter: {
        position: 'absolute',
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
    },
    pulseInner: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: Colors.light.primary,
    },
    locationTitle: {
        fontSize: 16,
        fontFamily: 'PlusJakartaSans_700Bold',
        color: Colors.light.text,
    },
    lastUpdate: {
        fontSize: 11,
        fontFamily: 'PlusJakartaSans_500Medium',
        color: Colors.light.textSecondary,
    },
    mapPlaceholder: {
        height: 180,
        backgroundColor: '#F8FAFC',
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: theme.spacing.md,
        borderWidth: 1,
        borderColor: '#F1F5F9',
    },
    mapText: {
        fontSize: 12,
        fontFamily: 'PlusJakartaSans_500Medium',
        color: Colors.light.textSecondary,
        marginTop: 8,
    },
    currentLocation: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.md,
        padding: theme.spacing.sm,
        backgroundColor: '#F0F9FF',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E0F2FE',
    },
    currentLocationText: {
        flex: 1,
    },
    currentLocationLabel: {
        fontSize: 11,
        fontFamily: 'PlusJakartaSans_500Medium',
        color: Colors.light.textSecondary,
    },
    currentLocationValue: {
        fontSize: 13,
        fontFamily: 'PlusJakartaSans_600SemiBold',
        color: Colors.light.text,
    },
    sectionTitle: {
        fontSize: 14,
        fontFamily: 'PlusJakartaSans_700Bold',
        color: Colors.light.textSecondary,
        marginBottom: theme.spacing.sm,
        marginLeft: 4,
        textTransform: 'uppercase',
    },
    timelineItem: {
        flexDirection: 'row',
        gap: theme.spacing.md,
    },
    timelineItemLast: {
        // No dashed line for last item
    },
    timelineLeft: {
        alignItems: 'center',
        width: 24,
    },
    timelineDot: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        zIndex: 1,
    },
    timelineDotInner: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: Colors.light.primary,
    },
    timelineLine: {
        width: 2,
        flex: 1,
        backgroundColor: '#E2E8F0',
        marginVertical: 4,
    },
    timelineContent: {
        flex: 1,
        paddingBottom: theme.spacing.xl,
    },
    timelineTitle: {
        fontSize: 15,
        fontFamily: 'PlusJakartaSans_700Bold',
        color: Colors.light.text,
        marginBottom: 2,
    },
    timelineLocation: {
        fontSize: 13,
        fontFamily: 'PlusJakartaSans_500Medium',
        color: Colors.light.text,
        marginBottom: 2,
    },
    timelineTime: {
        fontSize: 12,
        fontFamily: 'PlusJakartaSans_400Regular',
        color: Colors.light.textSecondary,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: theme.spacing.md,
    },
    detailDivider: {
        height: 1,
        backgroundColor: '#F1F5F9',
    },
    detailLabel: {
        fontSize: 14,
        fontFamily: 'PlusJakartaSans_500Medium',
        color: Colors.light.textSecondary,
    },
    detailValue: {
        fontSize: 15,
        fontFamily: 'PlusJakartaSans_700Bold',
        color: Colors.light.text,
    },
    contactButton: {
        borderRadius: 16,
        overflow: 'hidden',
        ...theme.shadows.medium,
    },
    contactGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 16,
    },
    contactText: {
        fontSize: 16,
        fontFamily: 'PlusJakartaSans_700Bold',
        color: '#FFFFFF',
    },
});
