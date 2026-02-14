import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
    Animated,
    Dimensions,
    Image,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
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

const availableLoads = [
    {
        id: '1',
        route: 'Mumbai → Delhi',
        distance: '1,450 km',
        weight: '8 Tons',
        earnings: '₹36,400', // Surcharge included
        pickupTime: 'Urgent: Pickup in 2 hrs',
        isUrgent: true,
        expiresIn: '00:45:00'
    },
    {
        id: '2',
        route: 'Pune → Bangalore',
        distance: '850 km',
        weight: '5 Tons',
        earnings: '₹22,000',
        pickupTime: 'Today, 6:00 PM',
        isUrgent: false,
    },
    {
        id: '3',
        route: 'Nashik → Surat',
        distance: '240 km',
        weight: '3 Tons',
        earnings: '₹15,000',
        pickupTime: 'Urgent: Pickup ASAP',
        isUrgent: true,
        expiresIn: '00:30:00'
    },
];

export default function DriverHome() {
    const router = useRouter();
    const [isOnline, setIsOnline] = useState(false);
    const [isUrgentEnabled, setIsUrgentEnabled] = useState(false);
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(30)).current;
    const pulseAnim = useRef(new Animated.Value(1)).current;

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

    const renderCurrentTrip = () => (
        <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => router.push('/(driver)/active-trip')}
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
                    <Text style={styles.tripId}>#TRK-8821</Text>
                </View>

                <View style={styles.tripRouteRow}>
                    <View style={styles.tripLocation}>
                        <Text style={styles.tripLabel}>Pickup</Text>
                        <Text style={styles.tripCity}>Mumbai</Text>
                    </View>
                    <View style={styles.tripArrow}>
                        <Ionicons name="arrow-forward" size={16} color="#94a3b8" />
                        <View style={styles.tripDottedLine} />
                    </View>
                    <View style={styles.tripLocation}>
                        <Text style={[styles.tripLabel, { textAlign: 'right' }]}>Drop</Text>
                        <Text style={[styles.tripCity, { textAlign: 'right' }]}>Pune</Text>
                    </View>
                </View>

                <View style={styles.tripAction}>
                    <Text style={styles.tripStatus}>En route to Pickup • 15 mins</Text>
                    <View style={styles.navButton}>
                        <Ionicons name="navigate" size={16} color="#fff" />
                    </View>
                </View>
            </LinearGradient>
        </TouchableOpacity>
    );

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
                        userName="Rajesh Kumar"
                        onNotificationPress={() => { }}
                        onProfilePress={() => router.push('/(driver)/profile')}
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
                                            onValueChange={setIsOnline}
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
                        {isOnline && (
                            renderCurrentTrip()
                        )}

                        {/* 3. Earnings Summary */}
                        <View style={styles.earningsSection}>
                            <View style={styles.sectionHeader}>
                                <Text style={styles.sectionTitle}>Performance</Text>
                                <TouchableOpacity onPress={() => router.push('/(driver)/earnings')}>
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
                                        <Text style={styles.earningsValueNew}>₹8,450</Text>
                                        <Text style={styles.earningsLabelNew}>Today's Earnings</Text>
                                    </LinearGradient>
                                </TouchableOpacity>

                                <View style={styles.earningsGridRight}>
                                    <View style={styles.earningsItemNewSmall}>
                                        <LinearGradient
                                            colors={['rgba(16, 185, 129, 0.1)', 'rgba(16, 185, 129, 0.05)']}
                                            style={styles.earningsItemGradient}
                                        >
                                            <Text style={[styles.earningsValueNew, { color: '#10B981' }]}>2</Text>
                                            <Text style={styles.earningsLabelNew}>Trips</Text>
                                        </LinearGradient>
                                    </View>
                                    <View style={styles.earningsItemNewSmall}>
                                        <LinearGradient
                                            colors={['rgba(245, 158, 11, 0.1)', 'rgba(245, 158, 11, 0.05)']}
                                            style={styles.earningsItemGradient}
                                        >
                                            <Text style={[styles.earningsValueNew, { color: warning }]}>5.5h</Text>
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
                                    <Text style={styles.sectionTitle}>Available Loads ({availableLoads.length})</Text>
                                    <TouchableOpacity onPress={() => router.push('/(driver)/loads')}>
                                        <Text style={styles.seeAllText}>View All</Text>
                                    </TouchableOpacity>
                                </View>

                                {availableLoads
                                    .filter(load => isUrgentEnabled ? true : !load.isUrgent)
                                    .sort((a, b) => (b.isUrgent ? 1 : 0) - (a.isUrgent ? 1 : 0))
                                    .map((load) => (
                                        <TouchableOpacity
                                            key={load.id}
                                            activeOpacity={0.9}
                                            onPress={() => router.push(`/(driver)/load-details?id=${load.id}`)}
                                            style={[
                                                styles.loadCard,
                                                load.isUrgent && styles.urgentLoadCard
                                            ]}
                                        >
                                            {load.isUrgent && (
                                                <View style={styles.urgentBanner}>
                                                    <Ionicons name="flash" size={12} color="#fff" />
                                                    <Text style={styles.urgentBannerText}>URGENT • HIGH PAY</Text>
                                                    {load.expiresIn && (
                                                        <Text style={styles.urgentTimer}>{load.expiresIn}</Text>
                                                    )}
                                                </View>
                                            )}

                                            <View style={styles.loadCardContent}>
                                                <View style={styles.loadMainRow}>
                                                    <View style={styles.loadRouteInfo}>
                                                        <Text style={styles.loadRouteText}>{load.route}</Text>
                                                        <View style={styles.loadBadges}>
                                                            <View style={styles.badge}>
                                                                <Ionicons name="resize-outline" size={12} color={textSecondary} />
                                                                <Text style={styles.badgeText}>{load.weight}</Text>
                                                            </View>
                                                            <View style={styles.badge}>
                                                                <Ionicons name="map-outline" size={12} color={textSecondary} />
                                                                <Text style={styles.badgeText}>{load.distance}</Text>
                                                            </View>
                                                        </View>
                                                    </View>
                                                    <Text style={styles.loadPriceText}>{load.earnings}</Text>
                                                </View>

                                                <View style={styles.loadFooterRow}>
                                                    <Text style={[
                                                        styles.loadTimeText,
                                                        load.isUrgent && { color: warning, fontWeight: '600' }
                                                    ]}>
                                                        {load.pickupTime}
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
