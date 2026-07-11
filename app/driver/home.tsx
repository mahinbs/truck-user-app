import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Animated,
    Dimensions,
    Image,
    RefreshControl,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { api, ApiError } from '../../utils/api';
import { getFreshDeviceLocation, pushDriverLocationHeartbeat } from '../../utils/geo';
import { FloatingHeader } from '../../components/shared/FloatingHeader';
import {
    primary,
    surface,
    text,
    textSecondary,
    warning
} from '../../constants/Colors';
import { theme } from '../../constants/theme';

const { width } = Dimensions.get('window');

type Load = {
    id: string;
    shipmentId: string;
    pickupAddress: string;
    dropAddress: string;
    distanceKm?: number | null;
    weightKg: number;
    truckType: string;
    isUrgent: boolean;
    earnings: number;
    expiresAt: string;
};

export default function DriverHome() {
    const router = useRouter();
    const { user, toggleDriverStatus } = useAuth();
    const [isOnline, setIsOnline] = useState<boolean>(!!user?.isOnline);
    const [isUrgentEnabled, setIsUrgentEnabled] = useState(false);
    const [loads, setLoads] = useState<Load[]>([]);
    const [currentTrip, setCurrentTrip] = useState<any | null>(null);
    const [dayEarnings, setDayEarnings] = useState<{ total: number; tripsCount: number } | null>(null);
    const [loadingLoads, setLoadingLoads] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [statusErr, setStatusErr] = useState<string | null>(null);
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(30)).current;
    const pulseAnim = useRef(new Animated.Value(1)).current;

    // Hit backend when driver flips the switch. If backend rejects (e.g. verification not approved),
    // revert UI and show the message.
    const handleOnlineToggle = async (next: boolean) => {
        setStatusErr(null);
        try {
            if (next) {
                const loc = await getFreshDeviceLocation();
                await toggleDriverStatus(true, loc);
            } else {
                await toggleDriverStatus(false);
            }
            setIsOnline(next);
        } catch (e: any) {
            const msg = e instanceof ApiError ? e.message : (e?.message || 'Failed');
            setStatusErr(msg);
            if (/location/i.test(msg)) {
                Alert.alert(
                    'Location required',
                    'Allow location access to go online and receive nearby loads.',
                );
            }
            if (/verification/i.test(msg)) {
                Alert.alert(
                    'Complete verification first',
                    'Submit your documents to start receiving loads.',
                    [{ text: 'Submit documents', onPress: () => router.push('/(onboarding)/verification' as any) },
                     { text: 'Later', style: 'cancel' }],
                );
            }
            setIsOnline(false);
        }
    };

    const fetchLoads = useCallback(async () => {
        if (!isOnline) { setLoads([]); return; }
        setLoadingLoads(true);
        try {
            const offers = await api.driverLoads() as Load[];
            setLoads(offers);
            try {
                const trip = await api.driverCurrentTrip();
                setCurrentTrip(trip);
            } catch { setCurrentTrip(null); }
            try {
                const e = await api.driverEarnings('day') as { total: number; tripsCount: number };
                setDayEarnings(e);
            } catch { setDayEarnings(null); }
        } catch (e) {
            console.warn('fetch loads failed', e);
        } finally {
            setLoadingLoads(false);
        }
    }, [isOnline]);

    useEffect(() => { fetchLoads(); }, [fetchLoads]);

    // Refresh GPS on screen focus + every minute while online (fixes stale DB location).
    useFocusEffect(
        useCallback(() => {
            if (!isOnline) return;
            pushDriverLocationHeartbeat(toggleDriverStatus).catch(() => {});
        }, [isOnline, toggleDriverStatus]),
    );

    useEffect(() => {
        if (!isOnline) return;
        const id = setInterval(() => {
            pushDriverLocationHeartbeat(toggleDriverStatus).catch(() => {});
        }, 60_000);
        return () => clearInterval(id);
    }, [isOnline, toggleDriverStatus]);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        if (isOnline) {
            await pushDriverLocationHeartbeat(toggleDriverStatus);
        }
        await fetchLoads();
        setRefreshing(false);
    }, [fetchLoads, isOnline, toggleDriverStatus]);

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 800,
                useNativeDriver: true,
            }),
        ]).start();

        // Pulsing animation for online status
        if (isOnline) {
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
        } else {
            pulseAnim.setValue(1);
        }
    }, [isOnline]);

    const renderCurrentTrip = () => {
        if (!currentTrip) return null;
        const pickup = currentTrip.pickupAddress || 'Pickup';
        const drop = currentTrip.dropAddress || 'Drop';
        return (
        <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => router.push('/driver/active-trip')}
            style={styles.currentTripCard}
        >
            <LinearGradient
                colors={['#1e293b', '#0f172a']}
                style={styles.currentTripGradient}
            >
                <View style={styles.currentTripHeader}>
                    <View style={styles.liveTag}>
                        <View style={styles.liveDot} />
                        <Text style={styles.liveText}>LIVE TRIP</Text>
                    </View>
                    <Text style={styles.tripId}>#{String(currentTrip.id).slice(0, 8)}</Text>
                </View>

                <View style={styles.tripRouteRow}>
                    <View style={styles.tripLocation}>
                        <Text style={styles.tripLabel}>Pickup</Text>
                        <Text style={styles.tripCity} numberOfLines={1}>{pickup}</Text>
                    </View>
                    <View style={styles.tripArrow}>
                        <Ionicons name="arrow-forward" size={16} color="#94a3b8" />
                        <View style={styles.tripDottedLine} />
                    </View>
                    <View style={styles.tripLocation}>
                        <Text style={[styles.tripLabel, { textAlign: 'right' }]}>Drop</Text>
                        <Text style={[styles.tripCity, { textAlign: 'right' }]} numberOfLines={1}>{drop}</Text>
                    </View>
                </View>

                <View style={styles.tripAction}>
                    <Text style={styles.tripStatus}>{currentTrip.status?.replace(/_/g, ' ') || 'In progress'}</Text>
                    <View style={styles.navButton}>
                        <Ionicons name="navigate" size={16} color="#fff" />
                    </View>
                </View>
            </LinearGradient>
        </TouchableOpacity>
    );
    };

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={theme.gradients.background as any}
                style={StyleSheet.absoluteFillObject}
            />

            <SafeAreaView style={styles.safeArea}>
                <View style={styles.headerContainer}>
                    <FloatingHeader
                        greeting="Good Morning"
                        userName={user?.name || 'Driver'}
                        onNotificationPress={() => { }}
                        onProfilePress={() => router.push('/driver/profile')}
                    />
                </View>

                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.content}
                    showsVerticalScrollIndicator={false}
                >
                    <Animated.View
                        style={{
                            opacity: fadeAnim,
                            transform: [{ translateY: slideAnim }],
                        }}
                    >
                        {/* 1. Status Toggle */}
                        <View style={styles.statusSection}>
                            <LinearGradient
                                colors={isOnline
                                    ? ['rgba(16, 185, 129, 0.15)', 'rgba(52, 211, 153, 0.05)']
                                    : ['rgba(255, 255, 255, 0.6)', 'rgba(255, 255, 255, 0.3)']
                                }
                                style={styles.statusCard}
                            >
                                <View style={styles.statusContent}>
                                    <View style={styles.statusLeft}>
                                        <View style={styles.statusIndicator}>
                                            <Animated.View
                                                style={[
                                                    styles.pulseRing,
                                                    {
                                                        borderColor: isOnline ? '#10B981' : 'transparent',
                                                        transform: [{ scale: pulseAnim }],
                                                    }
                                                ]}
                                            />
                                            <View style={[
                                                styles.statusDot,
                                                { backgroundColor: isOnline ? '#10B981' : textSecondary }
                                            ]} />
                                        </View>
                                        <View>
                                            <Text style={styles.statusTitle}>
                                                {isOnline ? 'You are Online' : 'You are Offline'}
                                            </Text>
                                            <Text style={styles.statusSubtitle}>
                                                {isOnline ? 'Receiving new loads' : 'Go online to work'}
                                            </Text>
                                        </View>
                                    </View>
                                    <View style={styles.statusRight}>
                                        <Switch
                                            value={isOnline}
                                            onValueChange={handleOnlineToggle}
                                            trackColor={{ false: '#cbd5e1', true: '#10B981' }}
                                            thumbColor={'#fff'}
                                        />
                                    </View>
                                </View>
                            </LinearGradient>

                            {isOnline && (
                                <LinearGradient
                                    colors={['rgba(245, 158, 11, 0.15)', 'rgba(251, 191, 36, 0.05)']}
                                    style={[styles.statusCard, { marginTop: theme.spacing.sm }]}
                                >
                                    <View style={styles.statusContent}>
                                        <View style={styles.statusLeft}>
                                            <View style={styles.statusIndicator}>
                                                <Ionicons name="flash" size={24} color={warning} />
                                            </View>
                                            <View>
                                                <Text style={styles.statusTitle}>Urgent Loads</Text>
                                                <Text style={styles.statusSubtitle}>Enable to receive high-pay urgent requests</Text>
                                            </View>
                                        </View>
                                        <Switch
                                            value={isUrgentEnabled}
                                            onValueChange={setIsUrgentEnabled}
                                            trackColor={{ false: '#cbd5e1', true: warning }}
                                            thumbColor={'#fff'}
                                        />
                                    </View>
                                </LinearGradient>
                            )}
                        </View>

                        {/* 2. Current Trip (Mocked as if active for demo, or hidden) */}
                        {isOnline && currentTrip && renderCurrentTrip()}

                        {/* 3. Earnings Summary */}
                        <View style={styles.earningsSection}>
                            <View style={styles.sectionHeader}>
                                <Text style={styles.sectionTitle}>Performance</Text>
                                <TouchableOpacity onPress={() => router.push('/driver/earnings')}>
                                    <Text style={styles.seeAllText}>More Stats</Text>
                                </TouchableOpacity>
                            </View>

                            <View style={styles.earningsGrid}>
                                <TouchableOpacity style={styles.earningsItemNew}>
                                    <LinearGradient
                                        colors={['rgba(59, 130, 246, 0.1)', 'rgba(59, 130, 246, 0.05)']}
                                        style={styles.earningsItemGradient}
                                    >
                                        <Ionicons name="wallet-outline" size={20} color={primary} />
                                        <Text style={styles.earningsValueNew}>
                                            ₹{Math.round(dayEarnings?.total || 0).toLocaleString()}
                                        </Text>
                                        <Text style={styles.earningsLabelNew}>Today's Earnings</Text>
                                    </LinearGradient>
                                </TouchableOpacity>

                                <View style={styles.earningsGridRight}>
                                    <View style={styles.earningsItemNewSmall}>
                                        <LinearGradient
                                            colors={['rgba(16, 185, 129, 0.1)', 'rgba(16, 185, 129, 0.05)']}
                                            style={styles.earningsItemGradient}
                                        >
                                            <Text style={[styles.earningsValueNew, { color: '#10B981' }]}>
                                                {dayEarnings?.tripsCount ?? 0}
                                            </Text>
                                            <Text style={styles.earningsLabelNew}>Trips</Text>
                                        </LinearGradient>
                                    </View>
                                    <View style={styles.earningsItemNewSmall}>
                                        <LinearGradient
                                            colors={['rgba(245, 158, 11, 0.1)', 'rgba(245, 158, 11, 0.05)']}
                                            style={styles.earningsItemGradient}
                                        >
                                            <Text style={[styles.earningsValueNew, { color: warning }]}>0h</Text>
                                            <Text style={styles.earningsLabelNew}>Hours</Text>
                                        </LinearGradient>
                                    </View>
                                </View>
                            </View>
                        </View>

                        {/* 4. Available Loads */}
                        {isOnline ? (
                            <View style={styles.loadsSection}>
                                <View style={styles.sectionHeader}>
                                    <Text style={styles.sectionTitle}>Available Loads ({loads.length})</Text>
                                    <TouchableOpacity onPress={onRefresh}>
                                        <Text style={styles.seeAllText}>Refresh</Text>
                                    </TouchableOpacity>
                                </View>

                                {statusErr ? <Text style={{ color: '#EF4444', marginBottom: 8 }}>{statusErr}</Text> : null}
                                {loadingLoads ? (
                                    <ActivityIndicator color={primary} style={{ marginVertical: 24 }} />
                                ) : loads.length === 0 ? (
                                    <Text style={{ color: textSecondary, textAlign: 'center', marginVertical: 24 }}>
                                        No loads nearby. Stay online — new offers will arrive.
                                    </Text>
                                ) : loads
                                    .filter(load => isUrgentEnabled ? true : !load.isUrgent)
                                    .sort((a, b) => (b.isUrgent ? 1 : 0) - (a.isUrgent ? 1 : 0))
                                    .map((load) => (
                                        <TouchableOpacity
                                            key={load.id}
                                            activeOpacity={0.9}
                                            onPress={() => router.push({
                                                pathname: '/driver/load-details',
                                                params: {
                                                    offerId: load.id,
                                                    pickupAddress: load.pickupAddress,
                                                    dropAddress: load.dropAddress,
                                                    earnings: String(load.earnings),
                                                    weightKg: String(load.weightKg),
                                                    truckType: load.truckType,
                                                    distanceKm: load.distanceKm != null ? String(load.distanceKm) : '',
                                                    isUrgent: load.isUrgent ? '1' : '0',
                                                },
                                            } as any)}
                                            style={[
                                                styles.loadCard,
                                                load.isUrgent && styles.urgentLoadCard
                                            ]}
                                        >
                                            {load.isUrgent && (
                                                <View style={styles.urgentBanner}>
                                                    <Ionicons name="flash" size={12} color="#fff" />
                                                    <Text style={styles.urgentBannerText}>URGENT • HIGH PAY</Text>
                                                </View>
                                            )}

                                            <View style={styles.loadCardContent}>
                                                <View style={styles.loadMainRow}>
                                                    <View style={styles.loadRouteInfo}>
                                                        <Text style={styles.loadRouteText} numberOfLines={1}>
                                                            {load.pickupAddress} → {load.dropAddress}
                                                        </Text>
                                                        <View style={styles.loadBadges}>
                                                            <View style={styles.badge}>
                                                                <Ionicons name="resize-outline" size={12} color={textSecondary} />
                                                                <Text style={styles.badgeText}>{Math.round(load.weightKg)} kg</Text>
                                                            </View>
                                                            {load.distanceKm != null && (
                                                                <View style={styles.badge}>
                                                                    <Ionicons name="map-outline" size={12} color={textSecondary} />
                                                                    <Text style={styles.badgeText}>{load.distanceKm.toFixed(1)} km</Text>
                                                                </View>
                                                            )}
                                                            <View style={styles.badge}>
                                                                <Ionicons name="cube-outline" size={12} color={textSecondary} />
                                                                <Text style={styles.badgeText}>{load.truckType}</Text>
                                                            </View>
                                                        </View>
                                                    </View>
                                                    <Text style={styles.loadPriceText}>₹{Math.round(load.earnings).toLocaleString()}</Text>
                                                </View>

                                                <View style={styles.loadFooterRow}>
                                                    <Text style={[
                                                        styles.loadTimeText,
                                                        load.isUrgent && { color: warning, fontWeight: '600' }
                                                    ]}>
                                                        Expires {new Date(load.expiresAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </Text>
                                                    <Ionicons name="chevron-forward" size={18} color={textSecondary} />
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                    ))}
                            </View>
                        ) : (
                            <View style={styles.offlineContainer}>
                                <Image
                                    source={{ uri: 'https://cdn-icons-png.flaticon.com/512/7486/7486747.png' }}
                                    style={styles.offlineImage}
                                />
                                <Text style={styles.offlineTitle}>You are Offline</Text>
                                <Text style={styles.offlineSubtitle}>
                                    Go online to see available loads and start earning.
                                </Text>
                            </View>
                        )}
                    </Animated.View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    safeArea: {
        flex: 1,
    },
    headerContainer: {
        paddingHorizontal: theme.spacing.md,
        paddingTop: theme.spacing.sm,
        zIndex: 10,
    },
    scrollView: {
        flex: 1,
        marginTop: theme.spacing.sm,
    },
    content: {
        paddingBottom: 100,
    },
    // Status Toggle
    statusSection: {
        paddingHorizontal: theme.spacing.lg,
        marginBottom: theme.spacing.lg,
        marginTop: theme.spacing.xs,
    },
    statusCard: {
        borderRadius: 16,
        padding: theme.spacing.md,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.5)',
    },
    statusContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    statusRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.sm,
    },
    statusLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.md,
    },
    statusIndicator: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    statusDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
    },
    pulseRing: {
        position: 'absolute',
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 2,
    },
    statusTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: text,
        fontFamily: 'PlusJakartaSans_700Bold',
    },
    statusSubtitle: {
        fontSize: 13,
        color: textSecondary,
        fontFamily: 'Inter_400Regular',
    },
    // Current Trip
    currentTripCard: {
        marginHorizontal: theme.spacing.lg,
        marginBottom: theme.spacing.xl,
        borderRadius: 20,
        overflow: 'hidden',
        ...theme.shadows.medium,
    },
    currentTripGradient: {
        padding: theme.spacing.lg,
    },
    currentTripHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing.lg,
    },
    liveTag: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(16, 185, 129, 0.2)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 100,
        gap: 6,
    },
    liveDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#4ade80',
    },
    liveText: {
        color: '#4ade80',
        fontSize: 10,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    tripId: {
        color: '#94a3b8',
        fontSize: 12,
        fontFamily: 'Inter_500Medium',
    },
    tripRouteRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing.lg,
    },
    tripLocation: {
        flex: 1,
    },
    tripLabel: {
        color: '#94a3b8',
        fontSize: 11,
        marginBottom: 2,
        textTransform: 'uppercase',
    },
    tripCity: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '700',
        fontFamily: 'PlusJakartaSans_700Bold',
    },
    tripArrow: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    tripDottedLine: {
        height: 1,
        width: '100%',
        backgroundColor: '#475569',
        position: 'absolute',
        zIndex: -1,
        top: '50%',
    },
    tripAction: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.1)',
        padding: theme.spacing.md,
        borderRadius: 12,
    },
    tripStatus: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '500',
    },
    navButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    // Earnings Section
    earningsSection: {
        paddingHorizontal: theme.spacing.lg,
        marginBottom: theme.spacing.xl,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing.md,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: text,
        fontFamily: 'PlusJakartaSans_700Bold',
    },
    seeAllText: {
        fontSize: 13,
        color: primary,
        fontWeight: '600',
    },
    // Earnings Grid Styles
    earningsGrid: {
        flexDirection: 'row',
        gap: theme.spacing.md,
    },
    earningsGridRight: {
        flex: 1,
        gap: theme.spacing.md,
    },
    earningsItemNew: {
        flex: 1.2,
        borderRadius: 20,
        overflow: 'hidden',
        backgroundColor: '#fff',
        ...theme.shadows.light,
    },
    earningsItemNewSmall: {
        flex: 1,
        borderRadius: 16,
        overflow: 'hidden',
        backgroundColor: '#fff',
        ...theme.shadows.light,
    },
    earningsItemGradient: {
        padding: theme.spacing.lg,
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
    },
    earningsValueNew: {
        fontSize: 24,
        fontWeight: '800',
        color: text,
        fontFamily: 'PlusJakartaSans_800ExtraBold',
        marginVertical: 4,
    },
    earningsLabelNew: {
        fontSize: 12,
        color: textSecondary,
        fontFamily: 'Inter_500Medium',
    },
    // Loads Section
    loadsSection: {
        paddingBottom: theme.spacing.xl,
        paddingHorizontal: theme.spacing.lg,
    },
    loadCard: {
        marginBottom: theme.spacing.md,
        backgroundColor: surface,
        borderRadius: 16,
        ...theme.shadows.light,
        overflow: 'hidden',
    },
    urgentLoadCard: {
        borderWidth: 1,
        borderColor: warning,
        backgroundColor: '#fffdf5',
    },
    urgentBanner: {
        backgroundColor: warning,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: theme.spacing.md,
        paddingVertical: 6,
        gap: 6,
    },
    urgentBannerText: {
        color: '#fff',
        fontSize: 11,
        fontWeight: '700',
        flex: 1,
    },
    urgentTimer: {
        color: '#fff',
        fontSize: 11,
        fontWeight: '600',
    },
    loadCardContent: {
        padding: theme.spacing.md,
    },
    loadMainRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing.sm,
    },
    loadRouteInfo: {
        flex: 1,
    },
    loadRouteText: {
        fontSize: 16,
        fontWeight: '700',
        color: text,
        marginBottom: 6,
        fontFamily: 'PlusJakartaSans_700Bold',
    },
    loadBadges: {
        flexDirection: 'row',
        gap: 8,
    },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: '#f1f5f9',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    badgeText: {
        fontSize: 11,
        color: textSecondary,
        fontWeight: '500',
    },
    loadPriceText: {
        fontSize: 20,
        fontWeight: '800',
        color: primary,
        fontFamily: 'PlusJakartaSans_800ExtraBold',
    },
    loadFooterRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: theme.spacing.sm,
        borderTopWidth: 1,
        borderTopColor: '#f1f5f9',
    },
    loadTimeText: {
        fontSize: 13,
        color: textSecondary,
    },
    // Offline State
    offlineContainer: {
        alignItems: 'center',
        marginTop: 40,
        paddingHorizontal: 40,
    },
    offlineImage: {
        width: 120,
        height: 120,
        marginBottom: theme.spacing.lg,
        opacity: 0.5,
    },
    offlineTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: text,
        marginBottom: theme.spacing.xs,
    },
    offlineSubtitle: {
        fontSize: 14,
        color: textSecondary,
        textAlign: 'center',
        lineHeight: 22,
    },
});
