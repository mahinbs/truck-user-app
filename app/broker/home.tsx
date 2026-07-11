import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { api } from '../../utils/api';
import { useAuth } from '../../contexts/AuthContext';
import {
    Animated,
    Dimensions,
    RefreshControl,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { FloatingHeader } from '../../components/shared/FloatingHeader';
import { StatusPill } from '../../components/shared/StatusPill';
import {
    primary,
    surface,
    text,
    textSecondary,
    warning,
} from '../../constants/Colors';
import { theme } from '../../constants/theme';

const { width } = Dimensions.get('window');

type ActiveTrip = {
    tripId: string;
    shipmentId: string;
    status: string;
    pickupAddress: string;
    dropAddress: string;
};

export default function BrokerHome() {
    const router = useRouter();
    const { user } = useAuth();
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(30)).current;
    const pulseAnim = useRef(new Animated.Value(1)).current;
    const [refreshing, setRefreshing] = React.useState(false);
    const [driverCount, setDriverCount] = useState(0);
    const [activeTrips, setActiveTrips] = useState<ActiveTrip[]>([]);
    const [earningsTotal, setEarningsTotal] = useState(0);

    const loadDashboard = useCallback(async () => {
        try {
            const [drivers, trips, dash] = await Promise.all([
                api.brokerMyDrivers() as Promise<any[]>,
                api.brokerActiveTrips() as Promise<ActiveTrip[]>,
                api.brokerEarningsSummary() as Promise<{ totalBrokerEarnings: number }>,
            ]);
            setDriverCount(drivers.length);
            setActiveTrips(trips);
            setEarningsTotal(dash.totalBrokerEarnings || 0);
        } catch (e) {
            console.warn('broker home load failed', e);
        }
    }, []);

    useEffect(() => {
        animateScreen();
        loadDashboard();
    }, [loadDashboard]);

    const animateScreen = () => {
        fadeAnim.setValue(0);
        slideAnim.setValue(30);
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
    };

    const onRefresh = React.useCallback(async () => {
        setRefreshing(true);
        await loadDashboard();
        setRefreshing(false);
        animateScreen();
    }, [loadDashboard]);

    const handleTrackTrip = (id: string) => {
        router.push(`/broker/trip-details?id=${id}` as any);
    };

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={theme.gradients.background as any}
                style={StyleSheet.absoluteFillObject}
            />

            <SafeAreaView style={styles.safeArea}>
                <FloatingHeader
                    greeting="Welcome Back,"
                    userName={user?.name || 'Broker'}
                    onNotificationPress={() => { }}
                    onProfilePress={() => router.push('/broker/profile' as any)}
                />

                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.content}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={primary} />
                    }
                >
                    {/* Stats Section */}
                    <Animated.View
                        style={{
                            opacity: fadeAnim,
                            transform: [{ translateY: slideAnim }],
                        }}
                    >
                        <View style={styles.statsContainer}>
                            {/* Stat 1: Fleet */}
                            <TouchableOpacity
                                style={styles.statCard}
                                onPress={() => router.push('/broker/drivers' as any)}
                            >
                                <LinearGradient
                                    colors={['rgba(59, 130, 246, 0.15)', 'rgba(96, 165, 250, 0.05)']}
                                    style={styles.statGradientBg}
                                >
                                    <BlurView intensity={30} tint="light" style={styles.statBlur}>
                                        <LinearGradient
                                            colors={['rgba(59, 130, 246, 0.2)', 'rgba(96, 165, 250, 0.1)']}
                                            style={styles.statIconBg}
                                        >
                                            <Ionicons name="people-outline" size={22} color={primary} />
                                        </LinearGradient>
                                        <Text style={styles.statValue}>{driverCount}</Text>
                                        <Text style={styles.statLabel}>Drivers</Text>
                                    </BlurView>
                                </LinearGradient>
                            </TouchableOpacity>

                            {/* Stat 2: Active Trips */}
                            <View style={styles.statCard}>
                                <LinearGradient
                                    colors={['rgba(16, 185, 129, 0.15)', 'rgba(52, 211, 153, 0.05)']}
                                    style={styles.statGradientBg}
                                >
                                    <BlurView intensity={30} tint="light" style={styles.statBlur}>
                                        <LinearGradient
                                            colors={['rgba(16, 185, 129, 0.2)', 'rgba(52, 211, 153, 0.1)']}
                                            style={styles.statIconBg}
                                        >
                                            <Ionicons name="navigate-outline" size={22} color="#10B981" />
                                        </LinearGradient>
                                        <Text style={[styles.statValue, { color: '#10B981' }]}>{activeTrips.length}</Text>
                                        <Text style={styles.statLabel}>Active Trips</Text>
                                    </BlurView>
                                </LinearGradient>
                            </View>

                            {/* Stat 3: Earnings */}
                            <TouchableOpacity
                                style={styles.statCard}
                                onPress={() => router.push('/broker/earnings' as any)}
                            >
                                <LinearGradient
                                    colors={['rgba(245, 158, 11, 0.15)', 'rgba(251, 191, 36, 0.05)']}
                                    style={styles.statGradientBg}
                                >
                                    <BlurView intensity={30} tint="light" style={styles.statBlur}>
                                        <LinearGradient
                                            colors={['rgba(245, 158, 11, 0.2)', 'rgba(251, 191, 36, 0.1)']}
                                            style={styles.statIconBg}
                                        >
                                            <Ionicons name="wallet-outline" size={22} color="#F59E0B" />
                                        </LinearGradient>
                                        <Text style={[styles.statValue, { color: '#F59E0B' }]}>
                                            ₹{Math.round(earningsTotal).toLocaleString()}
                                        </Text>
                                        <Text style={styles.statLabel}>Earnings</Text>
                                    </BlurView>
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                    </Animated.View>

                    {/* Simulation Alerts */}
                    <Animated.View
                        style={{
                            opacity: fadeAnim,
                            transform: [{ translateY: slideAnim }],
                        }}
                    >
                        <View style={styles.alertsContainer}>
                            <View style={styles.alertHeader}>
                                <Ionicons name="alert-circle" size={20} color={warning} />
                                <Text style={styles.alertTitle}>Control Center Alerts</Text>
                            </View>
                            <View style={styles.alertItem}>
                                <View style={styles.alertIndicatorOffline} />
                                <Text style={styles.alertText}>
                                    <Text style={styles.alertBold}>Rajesh Kumar</Text> went offline (Check availability).
                                </Text>
                            </View>
                            <View style={styles.alertItem}>
                                <View style={styles.alertIndicatorReject} />
                                <Text style={styles.alertText}>
                                    Driver rejected assignment on load <Text style={styles.alertBold}>#TRK-8821</Text>. Reassigning.
                                </Text>
                            </View>
                        </View>
                    </Animated.View>

                    {/* Quick Actions */}
                    <Animated.View
                        style={{
                            opacity: fadeAnim,
                            transform: [{ translateY: slideAnim }],
                        }}
                    >
                        <Text style={styles.sectionTitle}>Quick Actions</Text>
                        <View style={styles.quickActionsContainer}>
                            <TouchableOpacity
                                style={styles.quickActionCard}
                                onPress={() => router.push('/broker/add-driver' as any)}
                            >
                                <BlurView intensity={20} tint="light" style={styles.glassCard}>
                                    <LinearGradient
                                        colors={['rgba(59, 130, 246, 0.15)', 'rgba(96, 165, 250, 0.1)']}
                                        style={styles.quickActionIconContainer}
                                    >
                                        <Ionicons name="person-add" size={24} color={primary} />
                                    </LinearGradient>
                                    <Text style={styles.quickActionText}>Add Driver</Text>
                                </BlurView>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.quickActionCard}
                                onPress={() => router.push('/broker/loads' as any)}
                            >
                                <BlurView intensity={20} tint="light" style={styles.glassCard}>
                                    <LinearGradient
                                        colors={['rgba(16, 185, 129, 0.15)', 'rgba(52, 211, 153, 0.1)']}
                                        style={styles.quickActionIconContainer}
                                    >
                                        <Ionicons name="cube" size={24} color="#10B981" />
                                    </LinearGradient>
                                    <Text style={styles.quickActionText}>Assign Load</Text>
                                </BlurView>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.quickActionCard}
                                onPress={() => router.push('/broker/drivers' as any)}
                            >
                                <BlurView intensity={20} tint="light" style={styles.glassCard}>
                                    <LinearGradient
                                        colors={['rgba(139, 92, 246, 0.15)', 'rgba(167, 139, 250, 0.1)']}
                                        style={styles.quickActionIconContainer}
                                    >
                                        <Ionicons name="car-sport" size={24} color="#8B5CF6" />
                                    </LinearGradient>
                                    <Text style={styles.quickActionText}>My Fleet</Text>
                                </BlurView>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.quickActionCard}
                                onPress={() => router.push('/broker/earnings' as any)}
                            >
                                <BlurView intensity={20} tint="light" style={styles.glassCard}>
                                    <LinearGradient
                                        colors={['rgba(245, 158, 11, 0.15)', 'rgba(251, 191, 36, 0.1)']}
                                        style={styles.quickActionIconContainer}
                                    >
                                        <Ionicons name="stats-chart" size={24} color="#F59E0B" />
                                    </LinearGradient>
                                    <Text style={styles.quickActionText}>Commissions</Text>
                                </BlurView>
                            </TouchableOpacity>
                        </View>
                    </Animated.View>

                    {/* Active Trips Monitor */}
                    <Animated.View
                        style={{
                            opacity: fadeAnim,
                            transform: [{ translateY: slideAnim }],
                        }}
                    >
                        <View style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <Text style={styles.sectionTitle}>Active Trips Monitor</Text>
                            </View>

                            {activeTrips.length === 0 ? (
                                <Text style={{ color: textSecondary, paddingVertical: 12 }}>
                                    No active trips. Accept a load opportunity to get started.
                                </Text>
                            ) : activeTrips.map((trip) => (
                                <TouchableOpacity
                                    key={trip.tripId}
                                    activeOpacity={0.9}
                                    onPress={() => handleTrackTrip(trip.tripId)}
                                    style={styles.tripCardWrapper}
                                >
                                    <LinearGradient
                                        colors={['rgba(59, 130, 246, 0.08)', 'rgba(96, 165, 250, 0.04)']}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 1 }}
                                        style={styles.tripCard}
                                    >
                                        <BlurView intensity={35} tint="light" style={styles.tripBlur}>
                                            <View style={styles.tripHeader}>
                                                <View>
                                                    <Text style={styles.tripRoute} numberOfLines={1}>
                                                        {trip.pickupAddress} → {trip.dropAddress}
                                                    </Text>
                                                    <Text style={styles.tripIdText}>
                                                        Trip {trip.tripId.slice(0, 8)}
                                                    </Text>
                                                </View>
                                                <StatusPill status={trip.status as any} />
                                            </View>
                                            <View style={styles.tripFooter}>
                                                <Text style={styles.tripCommissionText}>Status: {trip.status}</Text>
                                                <View style={styles.trackButton}>
                                                    <Text style={styles.trackButtonText}>Details</Text>
                                                    <Ionicons name="arrow-forward" size={14} color={primary} />
                                                </View>
                                            </View>
                                        </BlurView>
                                    </LinearGradient>
                                </TouchableOpacity>
                            ))}
                        </View>
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
    scrollView: {
        flex: 1,
    },
    content: {
        paddingBottom: 120,
    },
    // Stats Styles
    statsContainer: {
        flexDirection: 'row',
        paddingHorizontal: theme.spacing.lg,
        gap: theme.spacing.md,
        marginTop: theme.spacing.md,
        marginBottom: theme.spacing.base,
    },
    statCard: {
        flex: 1,
        borderRadius: 18,
        backgroundColor: surface,
        ...theme.shadows.medium,
        elevation: 4,
    },
    statGradientBg: {
        borderRadius: 18,
    },
    statBlur: {
        padding: theme.spacing.md,
        alignItems: 'center',
        borderRadius: 18,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.4)',
    },
    statIconBg: {
        width: 44,
        height: 44,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: theme.spacing.sm,
    },
    statValue: {
        fontSize: 18,
        color: text,
        fontWeight: '700',
        marginBottom: 2,
        fontFamily: 'PlusJakartaSans_700Bold',
    },
    statLabel: {
        fontSize: 11,
        color: textSecondary,
        fontWeight: '500',
    },
    // Control Alerts
    alertsContainer: {
        marginHorizontal: theme.spacing.lg,
        padding: theme.spacing.md,
        backgroundColor: '#FFFBEB',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#FDE68A',
        marginBottom: theme.spacing.lg,
        gap: theme.spacing.sm,
        ...theme.shadows.light,
    },
    alertHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#FDE047',
        paddingBottom: 6,
    },
    alertTitle: {
        fontSize: 13,
        fontWeight: '700',
        color: '#D97706',
        fontFamily: 'PlusJakartaSans_700Bold',
    },
    alertItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    alertIndicatorOffline: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#DC2626',
    },
    alertIndicatorReject: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#EF4444',
    },
    alertText: {
        fontSize: 12,
        color: '#78350F',
        fontFamily: 'PlusJakartaSans_500Medium',
        flex: 1,
    },
    alertBold: {
        fontWeight: '700',
    },
    // Quick Actions
    sectionTitle: {
        fontSize: 16,
        color: text,
        fontWeight: '600',
        marginBottom: theme.spacing.md,
        paddingHorizontal: theme.spacing.lg,
        fontFamily: 'PlusJakartaSans_600SemiBold',
    },
    quickActionsContainer: {
        flexDirection: 'row',
        paddingHorizontal: theme.spacing.lg,
        gap: theme.spacing.md,
        marginBottom: theme.spacing.xl,
    },
    quickActionCard: {
        flex: 1,
    },
    glassCard: {
        padding: theme.spacing.md,
        alignItems: 'center',
        borderRadius: 18,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    quickActionIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: theme.spacing.xs,
    },
    quickActionText: {
        fontSize: 11,
        color: text,
        fontWeight: '600',
        fontFamily: 'PlusJakartaSans_600SemiBold',
    },
    section: {
        marginBottom: theme.spacing.xl,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: theme.spacing.xs,
        paddingRight: theme.spacing.lg,
        marginBottom: theme.spacing.md,
    },
    // Trip Cards
    tripCardWrapper: {
        marginHorizontal: theme.spacing.lg,
        marginBottom: theme.spacing.md,
    },
    tripCard: {
        borderRadius: 20,
        backgroundColor: surface,
        ...theme.shadows.medium,
        borderWidth: 1,
        borderColor: 'rgba(59, 130, 246, 0.15)',
    },
    tripBlur: {
        padding: theme.spacing.md,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    tripHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: theme.spacing.md,
    },
    tripRoute: {
        fontSize: 15,
        color: text,
        fontWeight: '700',
        fontFamily: 'PlusJakartaSans_700Bold',
        marginBottom: 2,
    },
    tripIdText: {
        fontSize: 11,
        color: textSecondary,
        fontFamily: 'PlusJakartaSans_500Medium',
    },
    progressSection: {
        marginBottom: theme.spacing.md,
    },
    progressInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    progressLabel: {
        fontSize: 11,
        color: textSecondary,
    },
    progressPercentage: {
        fontSize: 12,
        color: primary,
        fontWeight: '700',
    },
    progressBarContainer: {
        height: 6,
        backgroundColor: '#F1F5F9',
        borderRadius: 3,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        borderRadius: 3,
        backgroundColor: primary,
    },
    tripDetails: {
        gap: 6,
        paddingBottom: theme.spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(226, 232, 240, 0.3)',
        marginBottom: theme.spacing.sm,
    },
    detailItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    detailText: {
        fontSize: 12,
        color: textSecondary,
        fontFamily: 'PlusJakartaSans_500Medium',
    },
    tripFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    tripCommissionText: {
        fontSize: 13,
        color: text,
        fontFamily: 'PlusJakartaSans_500Medium',
    },
    highlightText: {
        color: primary,
        fontWeight: '700',
    },
    trackButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 8,
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
    },
    trackButtonText: {
        fontSize: 12,
        color: primary,
        fontWeight: '600',
    },
});
