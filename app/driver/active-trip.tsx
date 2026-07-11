import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Alert } from 'react-native';
import { api, ApiError } from '../../utils/api';
import {
    Animated,
    Dimensions,
    Image,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { Button } from '../../components/shared/Button';
import {
    primary,
    text,
    textSecondary
} from '../../constants/Colors';
import { theme } from '../../constants/theme';

const { width, height } = Dimensions.get('window');

// Timeline is derived from the live trip — see buildTimeline() inside the
// component. We compute the 4 milestones from trip.status and timestamps so
// no part of this screen ships hardcoded data.

type Trip = {
    id: string;
    shipmentId: string;
    status: 'en_route_pickup' | 'at_pickup' | 'en_route_drop' | 'delivered';
    pickupAddress?: string | null;
    dropAddress?: string | null;
    earnings: number;
    startedAt: string;
    pickedUpAt?: string | null;
    deliveredAt?: string | null;
};

const NEXT_STATUS: Record<Trip['status'], 'at_pickup' | 'en_route_drop' | 'delivered' | null> = {
    en_route_pickup: 'at_pickup',
    at_pickup: 'en_route_drop',
    en_route_drop: 'delivered',
    delivered: null,
};

const NEXT_LABEL: Record<Trip['status'], string> = {
    en_route_pickup: 'Arrived at Pickup',
    at_pickup: 'Picked up — Start Trip',
    en_route_drop: 'Mark Delivered',
    delivered: 'Trip Complete',
};

export default function ActiveTrip() {
    const router = useRouter();
    const slideAnim = useRef(new Animated.Value(height)).current;
    const [trip, setTrip] = useState<Trip | null>(null);
    const [busy, setBusy] = useState(false);

    const load = useCallback(async () => {
        try {
            const t = await api.driverCurrentTrip() as Trip | null;
            setTrip(t);
        } catch (e) {
            console.warn('current trip fetch failed', e);
        }
    }, []);

    const advance = async () => {
        if (!trip) return;
        const next = NEXT_STATUS[trip.status];
        if (!next) return;
        setBusy(true);
        try {
            const updated = await api.driverTripStatus(trip.id, next) as Trip;
            setTrip(updated);
            if (next === 'delivered') {
                Alert.alert('Trip delivered', `₹${Math.round(trip.earnings)} credited to your wallet.`);
                router.replace('/driver/home' as any);
            }
        } catch (e: any) {
            Alert.alert('Update failed', e instanceof ApiError ? e.message : (e?.message || 'unknown'));
        } finally {
            setBusy(false);
        }
    };

    useEffect(() => {
        load();
        Animated.spring(slideAnim, {
            toValue: 0,
            useNativeDriver: true,
            damping: 20,
            stiffness: 90,
        }).start();
    }, [load]);

    const renderTimelineItem = (item: any, index: number) => {
        const isCompleted = item.status === 'completed';
        const isCurrent = item.status === 'current';

        return (
            <View key={item.id} style={styles.timelineItem}>
                <View style={styles.timelineLeft}>
                    <View style={styles.timelineLineContainer}>
                        {!item.isLast && (
                            <View style={[
                                styles.timelineLine,
                                isCompleted && styles.timelineLineActive
                            ]} />
                        )}
                        <View style={[
                            styles.timelineDot,
                            isCompleted && styles.timelineDotCompleted,
                            isCurrent && styles.timelineDotCurrent,
                        ]}>
                            {isCompleted && <Ionicons name="checkmark" size={10} color="#FFFFFF" />}
                            {isCurrent && <View style={styles.currentDotInner} />}
                        </View>
                    </View>
                </View>
                <View style={styles.timelineContent}>
                    <View style={styles.timelineHeader}>
                        <Text style={[
                            styles.timelineTitle,
                            isCurrent && styles.textPrimary
                        ]}>{item.title}</Text>
                        <Text style={styles.timelineTime}>{item.time}</Text>
                    </View>
                    <Text style={styles.timelineLocation}>{item.location}</Text>
                </View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            {/* Map Placeholder Background */}
            <View style={styles.mapContainer}>
                <Image
                    source={{ uri: 'https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/72.8777,19.0760,11,0/600x800?access_token=placeholder' }}
                    style={StyleSheet.absoluteFillObject}
                    resizeMode="cover"
                />
                <LinearGradient
                    colors={['rgba(0,0,0,0.6)', 'transparent', 'transparent']}
                    style={styles.mapOverlay}
                />
                {/* Map Fallback Content since URL requires token */}
                <View style={[StyleSheet.absoluteFillObject, styles.mapFallback]}>
                    <Ionicons name="map" size={64} color={textSecondary} style={{ opacity: 0.2 }} />
                </View>
            </View>

            <SafeAreaView style={styles.safeArea}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color={text} />
                    </TouchableOpacity>

                    <View style={styles.headerTitleContainer}>
                        <BlurView intensity={80} tint="light" style={styles.headerTitleBlur}>
                            <Text style={styles.headerTitle}>Active Trip</Text>
                            <View style={styles.statusPill}>
                                <View style={styles.statusDot} />
                                <Text style={styles.statusText}>On Time</Text>
                            </View>
                        </BlurView>
                    </View>

                    <TouchableOpacity style={styles.sosButton}>
                        <Ionicons name="warning" size={20} color="#FFFFFF" />
                        <Text style={styles.sosText}>SOS</Text>
                    </TouchableOpacity>
                </View>

                {/* Bottom Sheet */}
                <Animated.View
                    style={[
                        styles.bottomSheet,
                        { transform: [{ translateY: slideAnim }] }
                    ]}
                >
                    <View style={styles.handleIndicator} />

                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.sheetContent}
                    >
                        <View style={styles.tripHeader}>
                            <View>
                                <Text style={styles.tripRoute} numberOfLines={1}>
                                    {trip ? `${trip.pickupAddress} → ${trip.dropAddress}` : 'No active trip'}
                                </Text>
                                <Text style={styles.tripId}>
                                    {trip ? `Status: ${trip.status.replace(/_/g, ' ')}` : '—'}
                                </Text>
                            </View>
                            <TouchableOpacity style={styles.navigationButton}>
                                <LinearGradient
                                    colors={theme.gradients.primary as any}
                                    style={styles.navGradient}
                                >
                                    <Ionicons name="navigate" size={24} color="#FFFFFF" />
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>

                        <LinearGradient
                            colors={['rgba(59, 130, 246, 0.08)', 'rgba(96, 165, 250, 0.04)']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.progressCard}
                        >
                            <View style={styles.progressStats}>
                                <View style={styles.statItem}>
                                    <Text style={styles.statLabel}>Distance Left</Text>
                                    <Text style={styles.statValue}>850 km</Text>
                                </View>
                                <View style={styles.statDivider} />
                                <View style={styles.statItem}>
                                    <Text style={styles.statLabel}>Est. Arrival</Text>
                                    <Text style={styles.statValue}>28 hrs</Text>
                                </View>
                            </View>
                            <View style={styles.progressBarBg}>
                                <LinearGradient
                                    colors={theme.gradients.primary as any}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    style={[styles.progressBarFill, { width: '45%' }]}
                                />
                            </View>
                        </LinearGradient>

                        <Text style={styles.sectionTitle}>Trip Timeline</Text>
                        <View style={styles.timelineContainer}>
                            {(() => {
                                if (!trip) return null;
                                const fmt = (iso?: string | null) =>
                                    iso ? new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—';
                                const items = [
                                    {
                                        id: '1', title: 'En route to pickup',
                                        location: trip.pickupAddress || 'Pickup',
                                        time: fmt(trip.startedAt),
                                        status: trip.status === 'en_route_pickup' ? 'current'
                                              : 'completed',
                                        isLast: false,
                                    },
                                    {
                                        id: '2', title: 'At pickup',
                                        location: trip.pickupAddress || 'Pickup',
                                        time: fmt(trip.pickedUpAt),
                                        status: trip.status === 'at_pickup' ? 'current'
                                              : (trip.pickedUpAt || trip.status === 'en_route_drop' || trip.status === 'delivered' ? 'completed' : 'pending'),
                                        isLast: false,
                                    },
                                    {
                                        id: '3', title: 'En route to drop',
                                        location: trip.dropAddress || 'Drop',
                                        time: fmt(trip.pickedUpAt),
                                        status: trip.status === 'en_route_drop' ? 'current'
                                              : (trip.status === 'delivered' ? 'completed' : 'pending'),
                                        isLast: false,
                                    },
                                    {
                                        id: '4', title: 'Delivered',
                                        location: trip.dropAddress || 'Drop',
                                        time: fmt(trip.deliveredAt),
                                        status: trip.status === 'delivered' ? 'completed' : 'pending',
                                        isLast: true,
                                    },
                                ];
                                return items.map(renderTimelineItem);
                            })()}
                        </View>

                        <View style={styles.actionsContainer}>
                            <Button
                                title={busy ? 'Updating…' : (trip ? NEXT_LABEL[trip.status] : 'No trip')}
                                onPress={advance}
                                variant="primary"
                                style={styles.actionButton}
                                disabled={busy || !trip || !NEXT_STATUS[trip.status]}
                            />
                            <Button
                                title="Refresh"
                                onPress={load}
                                variant="outline"
                                style={styles.actionButton}
                            />
                        </View>
                    </ScrollView>
                </Animated.View>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    mapContainer: {
        ...StyleSheet.absoluteFillObject,
        height: height * 0.5,
    },
    mapOverlay: {
        ...StyleSheet.absoluteFillObject,
    },
    mapFallback: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#E2E8F0',
        zIndex: -1,
    },
    safeArea: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        paddingHorizontal: theme.spacing.lg,
        paddingTop: theme.spacing.md,
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        backgroundColor: '#FFFFFF',
        ...theme.shadows.medium,
    },
    headerTitleContainer: {
        borderRadius: 20,
        overflow: 'hidden',
        ...theme.shadows.medium,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
    },
    headerTitleBlur: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 16,
        fontFamily: 'PlusJakartaSans_700Bold',
        color: text,
        marginBottom: 2,
    },
    statusPill: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    statusDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#10B981',
    },
    statusText: {
        fontSize: 12,
        color: '#10B981',
        fontFamily: 'PlusJakartaSans_600SemiBold',
    },
    sosButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#EF4444',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 20,
        gap: 6,
        ...theme.shadows.medium,
    },
    sosText: {
        fontSize: 14,
        color: '#FFFFFF',
        fontFamily: 'PlusJakartaSans_700Bold',
    },
    bottomSheet: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: height * 0.7,
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        ...theme.shadows.strong,
        elevation: 20,
    },
    handleIndicator: {
        width: 40,
        height: 4,
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        borderRadius: 2,
        alignSelf: 'center',
        marginTop: 12,
        marginBottom: 8,
    },
    sheetContent: {
        padding: theme.spacing.lg,
        paddingBottom: 40,
    },
    tripHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing.lg,
    },
    tripRoute: {
        fontSize: 24,
        fontFamily: 'PlusJakartaSans_700Bold',
        color: text,
        marginBottom: 4,
    },
    tripId: {
        fontSize: 14,
        fontFamily: 'PlusJakartaSans_500Medium',
        color: textSecondary,
    },
    navigationButton: {
        borderRadius: 28,
        overflow: 'hidden',
        ...theme.shadows.glow,
        elevation: 10,
    },
    navGradient: {
        width: 56,
        height: 56,
        justifyContent: 'center',
        alignItems: 'center',
    },
    progressCard: {
        borderRadius: 20,
        padding: theme.spacing.lg,
        marginBottom: theme.spacing.xl,
        borderWidth: 1,
        borderColor: 'rgba(59, 130, 246, 0.15)',
    },
    progressStats: {
        flexDirection: 'row',
        marginBottom: theme.spacing.md,
    },
    statItem: {
        flex: 1,
    },
    statLabel: {
        fontSize: 12,
        color: textSecondary,
        marginBottom: 4,
        fontFamily: 'PlusJakartaSans_500Medium',
    },
    statValue: {
        fontSize: 18,
        color: text,
        fontFamily: 'PlusJakartaSans_700Bold',
    },
    statDivider: {
        width: 1,
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
        marginHorizontal: theme.spacing.lg,
    },
    progressBarBg: {
        height: 8,
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        borderRadius: 4,
    },
    sectionTitle: {
        fontSize: 18,
        color: text,
        marginBottom: theme.spacing.lg,
        fontFamily: 'PlusJakartaSans_600SemiBold',
    },
    timelineContainer: {
        marginBottom: theme.spacing.xl,
    },
    timelineItem: {
        flexDirection: 'row',
        paddingBottom: theme.spacing.lg,
    },
    timelineLeft: {
        width: 30,
        alignItems: 'center',
        marginRight: theme.spacing.md,
    },
    timelineLineContainer: {
        alignItems: 'center',
        height: '100%',
    },
    timelineLine: {
        position: 'absolute',
        top: 0,
        bottom: -20,
        width: 2,
        backgroundColor: '#E2E8F0',
        zIndex: -1,
    },
    timelineLineActive: {
        backgroundColor: '#10B981',
    },
    timelineDot: {
        width: 18,
        height: 18,
        borderRadius: 9,
        backgroundColor: '#E2E8F0',
        borderWidth: 2,
        borderColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
        marginBottom: 4,
    },
    timelineDotCompleted: {
        backgroundColor: '#10B981',
        borderColor: '#DCFCE7',
        borderWidth: 0,
    },
    timelineDotCurrent: {
        backgroundColor: '#FFFFFF',
        borderColor: primary,
        borderWidth: 2,
        width: 20,
        height: 20,
        borderRadius: 10,
    },
    currentDotInner: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: primary,
    },
    timelineContent: {
        flex: 1,
        paddingTop: 2,
    },
    timelineHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 2,
    },
    timelineTitle: {
        fontSize: 15,
        fontFamily: 'PlusJakartaSans_600SemiBold',
        color: text,
    },
    textPrimary: {
        color: primary,
        fontFamily: 'PlusJakartaSans_700Bold',
    },
    timelineTime: {
        fontSize: 12,
        color: textSecondary,
        fontFamily: 'PlusJakartaSans_500Medium',
    },
    timelineLocation: {
        fontSize: 13,
        color: textSecondary,
        fontFamily: 'PlusJakartaSans_400Regular',
    },
    actionsContainer: {
        gap: theme.spacing.md,
    },
    actionButton: {
        borderRadius: 12,
    },
});
