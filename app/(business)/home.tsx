import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import {
    Animated,
    Dimensions,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { BannerCarousel } from '../../components/shared/BannerCarousel';
import { FloatingHeader } from '../../components/shared/FloatingHeader';
import { StatusPill } from '../../components/shared/StatusPill';
import {
    primary,
    surface,
    text,
    textSecondary
} from '../../constants/Colors';
import { theme } from '../../constants/theme';

const { width } = Dimensions.get('window');

const CAROUSEL_DATA = [
    {
        id: '1',
        title: 'Book a Truck',
        subtitle: 'Reliable transport for your goods',
        image: require('../../assets/truck-image/trucks-driving-highway_37416-1134.jpg'),
        action: () => { },
        buttonText: 'Book Now'
    },
    {
        id: '2',
        title: 'Track Shipments',
        subtitle: 'Real-time location updates',
        image: require('../../assets/truck-image/semi-truck-carrying-blue-shipping-container_23-2151998697.jpg'),
        action: () => { },
        buttonText: 'Track Now'
    },
    {
        id: '3',
        title: 'Manage Fleet',
        subtitle: 'Optimize your logistics',
        image: require('../../assets/truck-image/truck-transport-container-road-port_948233-11928.jpg'),
        action: () => { },
        buttonText: 'View Fleet'
    }
];

export default function BusinessHome() {
    const router = useRouter();
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

        // Pulsing animation for live tracking
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

    const handleBookTruck = () => {
        router.push('/(business)/create-shipment-1');
    };

    const handleViewShipment = (id: string) => {
        router.push(`/(business)/tracking?id=${id}`);
    };

    // Update carousel actions
    CAROUSEL_DATA[0].action = handleBookTruck;
    CAROUSEL_DATA[1].action = () => router.push('/(business)/shipments');
    CAROUSEL_DATA[2].action = () => router.push('/(business)/available-trucks');

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={theme.gradients.background as any}
                style={StyleSheet.absoluteFillObject}
            />

            <SafeAreaView style={styles.safeArea}>
                <FloatingHeader
                    greeting="Good Morning"
                    userName="John Doe"
                    onNotificationPress={() => { }}
                    onProfilePress={() => router.push('/(business)/profile')}

                />

                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.content}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Banner Carousel */}
                    <Animated.View
                        style={{
                            opacity: fadeAnim,
                            transform: [{ translateY: slideAnim }],
                        }}
                    >
                        <BannerCarousel data={CAROUSEL_DATA} />
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
                                onPress={() => router.push('/(business)/shipments')}
                            >
                                <BlurView intensity={20} tint="light" style={styles.glassCard}>
                                    <LinearGradient
                                        colors={['rgba(59, 130, 246, 0.15)', 'rgba(96, 165, 250, 0.1)']}
                                        style={styles.quickActionIconContainer}
                                    >
                                        <Ionicons name="navigate" size={24} color={primary} />
                                    </LinearGradient>
                                    <Text style={styles.quickActionText}>Track</Text>
                                </BlurView>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.quickActionCard}
                                onPress={() => router.push('/(business)/wallet')}
                            >
                                <BlurView intensity={20} tint="light" style={styles.glassCard}>
                                    <LinearGradient
                                        colors={['rgba(16, 185, 129, 0.15)', 'rgba(52, 211, 153, 0.1)']}
                                        style={styles.quickActionIconContainer}
                                    >
                                        <Ionicons name="wallet" size={24} color="#10B981" />
                                    </LinearGradient>
                                    <Text style={styles.quickActionText}>Wallet</Text>
                                </BlurView>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.quickActionCard}
                                onPress={() => router.push('/(business)/shipments')}
                            >
                                <BlurView intensity={20} tint="light" style={styles.glassCard}>
                                    <LinearGradient
                                        colors={['rgba(245, 158, 11, 0.15)', 'rgba(251, 191, 36, 0.1)']}
                                        style={styles.quickActionIconContainer}
                                    >
                                        <Ionicons name="document-text" size={24} color="#F59E0B" />
                                    </LinearGradient>
                                    <Text style={styles.quickActionText}>History</Text>
                                </BlurView>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.quickActionCard}
                                onPress={() => router.push('/(business)/profile')}
                            >
                                <BlurView intensity={20} tint="light" style={styles.glassCard}>
                                    <LinearGradient
                                        colors={['rgba(139, 92, 246, 0.15)', 'rgba(167, 139, 250, 0.1)']}
                                        style={styles.quickActionIconContainer}
                                    >
                                        <Ionicons name="settings" size={24} color="#8B5CF6" />
                                    </LinearGradient>
                                    <Text style={styles.quickActionText}>Settings</Text>
                                </BlurView>
                            </TouchableOpacity>
                        </View>
                    </Animated.View>

                    {/* Live Shipment Tracking - Enhanced */}
                    <Animated.View
                        style={{
                            opacity: fadeAnim,
                            transform: [{ translateY: slideAnim }],
                        }}
                    >
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Live Tracking</Text>
                            <TouchableOpacity
                                activeOpacity={0.9}
                                onPress={() => handleViewShipment('live-1')}
                            >
                                <LinearGradient
                                    colors={['rgba(59, 130, 246, 0.08)', 'rgba(96, 165, 250, 0.04)']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                    style={styles.liveTrackingCard}
                                >
                                    <BlurView intensity={40} tint="light" style={styles.liveTrackingBlur}>
                                        <View style={styles.liveTrackingContent}>
                                            {/* Header */}
                                            <View style={styles.liveHeader}>
                                                <View style={styles.liveHeaderLeft}>
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
                                                        <Text style={styles.liveTitle}>Mumbai → Delhi</Text>
                                                        <Text style={styles.liveSubtitle}>Container Truck • TN 01 AB 1234</Text>
                                                    </View>
                                                </View>
                                                <StatusPill status="in-transit" />
                                            </View>

                                            {/* Progress Section */}
                                            <View style={styles.progressSection}>
                                                <View style={styles.progressInfo}>
                                                    <Text style={styles.progressLabel}>Progress</Text>
                                                    <Text style={styles.progressPercentage}>65%</Text>
                                                </View>
                                                <View style={styles.progressBarContainer}>
                                                    <LinearGradient
                                                        colors={theme.gradients.primary as any}
                                                        start={{ x: 0, y: 0 }}
                                                        end={{ x: 1, y: 0 }}
                                                        style={styles.progressFill}
                                                    />
                                                </View>
                                            </View>

                                            {/* Location & ETA */}
                                            <View style={styles.liveFooter}>
                                                <View style={styles.liveFooterItem}>
                                                    <Ionicons name="location" size={16} color={primary} />
                                                    <View style={styles.liveFooterTextContainer}>
                                                        <Text style={styles.liveFooterLabel}>Current Location</Text>
                                                        <Text style={styles.liveFooterValue}>Vadodara, Gujarat</Text>
                                                    </View>
                                                </View>
                                                <View style={styles.liveFooterItem}>
                                                    <Ionicons name="time" size={16} color="#F59E0B" />
                                                    <View style={styles.liveFooterTextContainer}>
                                                        <Text style={styles.liveFooterLabel}>ETA</Text>
                                                        <Text style={styles.liveFooterValue}>8 hrs</Text>
                                                    </View>
                                                </View>
                                            </View>
                                        </View>
                                    </BlurView>
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                    </Animated.View>

                    {/* Stats Cards - Enhanced with Gradient Spreading */}
                    <Animated.View
                        style={{
                            opacity: fadeAnim,
                            transform: [{ translateY: slideAnim }],
                        }}
                    >
                        <View style={styles.statsContainer}>
                            {/* Active Stat */}
                            <View style={styles.statCard}>
                                <LinearGradient
                                    colors={['rgba(59, 130, 246, 0.15)', 'rgba(96, 165, 250, 0.05)']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                    style={styles.statGradientBg}
                                >
                                    <BlurView intensity={30} tint="light" style={styles.statBlur}>
                                        <LinearGradient
                                            colors={['rgba(59, 130, 246, 0.2)', 'rgba(96, 165, 250, 0.1)']}
                                            style={styles.statIconBg}
                                        >
                                            <Ionicons name="cube-outline" size={22} color={primary} />
                                        </LinearGradient>
                                        <Text style={styles.statValue}>12</Text>
                                        <Text style={styles.statLabel}>Active</Text>
                                    </BlurView>
                                </LinearGradient>
                            </View>

                            {/* Completed Stat */}
                            <View style={styles.statCard}>
                                <LinearGradient
                                    colors={['rgba(16, 185, 129, 0.15)', 'rgba(52, 211, 153, 0.05)']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                    style={styles.statGradientBg}
                                >
                                    <BlurView intensity={30} tint="light" style={styles.statBlur}>
                                        <LinearGradient
                                            colors={['rgba(16, 185, 129, 0.2)', 'rgba(52, 211, 153, 0.1)']}
                                            style={styles.statIconBg}
                                        >
                                            <Ionicons name="checkmark-circle-outline" size={22} color="#10B981" />
                                        </LinearGradient>
                                        <Text style={[styles.statValue, { color: '#10B981' }]}>48</Text>
                                        <Text style={styles.statLabel}>Completed</Text>
                                    </BlurView>
                                </LinearGradient>
                            </View>

                            {/* Pending Stat */}
                            <View style={styles.statCard}>
                                <LinearGradient
                                    colors={['rgba(245, 158, 11, 0.15)', 'rgba(251, 191, 36, 0.05)']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                    style={styles.statGradientBg}
                                >
                                    <BlurView intensity={30} tint="light" style={styles.statBlur}>
                                        <LinearGradient
                                            colors={['rgba(245, 158, 11, 0.2)', 'rgba(251, 191, 36, 0.1)']}
                                            style={styles.statIconBg}
                                        >
                                            <Ionicons name="time-outline" size={22} color="#F59E0B" />
                                        </LinearGradient>
                                        <Text style={[styles.statValue, { color: '#F59E0B' }]}>3</Text>
                                        <Text style={styles.statLabel}>Pending</Text>
                                    </BlurView>
                                </LinearGradient>
                            </View>
                        </View>
                    </Animated.View>

                    {/* Active Shipments - Enhanced */}
                    <Animated.View
                        style={{
                            opacity: fadeAnim,
                            transform: [{ translateY: slideAnim }],
                        }}
                    >
                        <View style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <Text style={styles.sectionTitle}>Active Shipments</Text>
                                <TouchableOpacity onPress={() => router.push('/(business)/shipments')}>
                                    <Text style={styles.seeAllText}>See All</Text>
                                </TouchableOpacity>
                            </View>

                            {/* Shipment Card 1 */}
                            <TouchableOpacity
                                activeOpacity={0.9}
                                onPress={() => handleViewShipment('1')}
                                style={styles.shipmentCardWrapper}
                            >
                                <LinearGradient
                                    colors={['rgba(59, 130, 246, 0.08)', 'rgba(96, 165, 250, 0.04)']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                    style={styles.shipmentCard}
                                >
                                    <BlurView intensity={35} tint="light" style={styles.shipmentBlur}>
                                        <View style={styles.shipmentHeader}>
                                            <Text style={styles.shipmentRoute}>Pune → Bangalore</Text>
                                            <StatusPill status="active" />
                                        </View>

                                        <View style={styles.shipmentDetails}>
                                            <View style={styles.shipmentDetailItem}>
                                                <LinearGradient
                                                    colors={['rgba(59, 130, 246, 0.15)', 'rgba(96, 165, 250, 0.1)']}
                                                    style={styles.shipmentDetailIcon}
                                                >
                                                    <Ionicons name="car-outline" size={14} color={primary} />
                                                </LinearGradient>
                                                <Text style={styles.shipmentDetailText}>Mini Truck</Text>
                                            </View>
                                            <View style={styles.shipmentDetailItem}>
                                                <LinearGradient
                                                    colors={['rgba(245, 158, 11, 0.15)', 'rgba(251, 191, 36, 0.1)']}
                                                    style={styles.shipmentDetailIcon}
                                                >
                                                    <Ionicons name="calendar-outline" size={14} color="#F59E0B" />
                                                </LinearGradient>
                                                <Text style={styles.shipmentDetailText}>Dec 16, 2026</Text>
                                            </View>
                                        </View>

                                        <View style={styles.shipmentFooter}>
                                            <Text style={styles.shipmentPrice}>₹18,200</Text>
                                            <View style={styles.trackButton}>
                                                <Text style={styles.trackButtonText}>Track</Text>
                                                <Ionicons name="arrow-forward" size={14} color={primary} />
                                            </View>
                                        </View>
                                    </BlurView>
                                </LinearGradient>
                            </TouchableOpacity>

                            {/* Shipment Card 2 */}
                            <TouchableOpacity
                                activeOpacity={0.9}
                                onPress={() => handleViewShipment('2')}
                                style={styles.shipmentCardWrapper}
                            >
                                <LinearGradient
                                    colors={['rgba(59, 130, 246, 0.08)', 'rgba(96, 165, 250, 0.04)']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                    style={styles.shipmentCard}
                                >
                                    <BlurView intensity={35} tint="light" style={styles.shipmentBlur}>
                                        <View style={styles.shipmentHeader}>
                                            <Text style={styles.shipmentRoute}>Chennai → Hyderabad</Text>
                                            <StatusPill status="active" />
                                        </View>

                                        <View style={styles.shipmentDetails}>
                                            <View style={styles.shipmentDetailItem}>
                                                <LinearGradient
                                                    colors={['rgba(59, 130, 246, 0.15)', 'rgba(96, 165, 250, 0.1)']}
                                                    style={styles.shipmentDetailIcon}
                                                >
                                                    <Ionicons name="car-outline" size={14} color={primary} />
                                                </LinearGradient>
                                                <Text style={styles.shipmentDetailText}>Pickup Truck</Text>
                                            </View>
                                            <View style={styles.shipmentDetailItem}>
                                                <LinearGradient
                                                    colors={['rgba(245, 158, 11, 0.15)', 'rgba(251, 191, 36, 0.1)']}
                                                    style={styles.shipmentDetailIcon}
                                                >
                                                    <Ionicons name="calendar-outline" size={14} color="#F59E0B" />
                                                </LinearGradient>
                                                <Text style={styles.shipmentDetailText}>Dec 17, 2026</Text>
                                            </View>
                                        </View>

                                        <View style={styles.shipmentFooter}>
                                            <Text style={styles.shipmentPrice}>₹12,500</Text>
                                            <View style={styles.trackButton}>
                                                <Text style={styles.trackButtonText}>Track</Text>
                                                <Ionicons name="arrow-forward" size={14} color={primary} />
                                            </View>
                                        </View>
                                    </BlurView>
                                </LinearGradient>
                            </TouchableOpacity>
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
    seeAllText: {
        fontSize: 14,
        color: primary,
        fontWeight: '600',
    },
    // Live Tracking Styles
    liveTrackingCard: {
        marginHorizontal: theme.spacing.md,
        borderRadius: 20,
        backgroundColor: surface,
        ...theme.shadows.medium,
        elevation: 5,
        shadowColor: 'rgba(59, 130, 246, 0.2)',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.12,
        shadowRadius: 10,
        borderWidth: 1,
        borderColor: 'rgba(59, 130, 246, 0.15)',
    },

    liveTrackingBlur: {
        borderRadius: 22,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.4)',
        overflow: 'hidden',
    },
    liveTrackingContent: {
        padding: theme.spacing.md,
    },
    liveHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing.md,
    },
    liveHeaderLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.xs,
        flex: 1,
    },
    pulseContainer: {
        width: 36,
        height: 36,
        justifyContent: 'center',
        alignItems: 'center',
    },
    pulseOuter: {
        position: 'absolute',
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(37, 99, 235, 0.1)',
    },
    pulseInner: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: primary,
    },
    liveTitle: {
        fontSize: 15,
        color: text,
        fontWeight: '700',
        marginBottom: 2,
        fontFamily: 'PlusJakartaSans_700Bold',
    },
    liveSubtitle: {
        fontSize: 12,
        color: textSecondary,
        fontFamily: 'PlusJakartaSans_500Medium',
    },
    progressSection: {
        marginTop: theme.spacing.md,
    },
    progressInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing.xs,
    },
    progressLabel: {
        fontSize: 11,
        color: textSecondary,
        fontWeight: '500',
    },
    progressPercentage: {
        fontSize: 13,
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
        width: '65%',
        height: '100%',
        borderRadius: 3,
        backgroundColor: primary,
    },
    liveFooter: {
        flexDirection: 'row',
        gap: theme.spacing.lg,
        paddingTop: theme.spacing.md,
        borderTopWidth: 1,
        borderTopColor: '#F1F5F9',
    },
    liveFooterItem: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.xs,
    },
    liveFooterTextContainer: {
        flex: 1,
    },
    liveFooterLabel: {
        fontSize: 10,
        color: textSecondary,
        marginBottom: 2,
    },
    liveFooterValue: {
        fontSize: 13,
        color: text,
        fontWeight: '600',
    },
    // Stats Styles
    statsContainer: {
        flexDirection: 'row',
        paddingHorizontal: theme.spacing.lg,
        gap: theme.spacing.md,
        marginBottom: theme.spacing.xl,
    },
    statCard: {
        flex: 1,
        borderRadius: 18,
        backgroundColor: surface,
        ...theme.shadows.medium,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
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
    // Active Shipments Styles
    shipmentCardWrapper: {
        marginHorizontal: theme.spacing.md,
        marginBottom: theme.spacing.md,
    },
    shipmentCard: {
        borderRadius: 20,
        backgroundColor: surface,
        ...theme.shadows.medium,
        elevation: 5,
        shadowColor: 'rgba(59, 130, 246, 0.2)',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.12,
        shadowRadius: 10,
        borderWidth: 1,
        borderColor: 'rgba(59, 130, 246, 0.15)',
    },
    shipmentBlur: {
        padding: theme.spacing.md,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    shipmentHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing.sm,
    },
    shipmentRoute: {
        fontSize: 14,
        color: text,
        fontWeight: '700',
        fontFamily: 'PlusJakartaSans_700Bold',
    },
    shipmentDetails: {
        flexDirection: 'row',
        gap: theme.spacing.base,
        marginBottom: theme.spacing.sm,
    },
    shipmentDetailItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.xs,
    },
    shipmentDetailIcon: {
        width: 26,
        height: 26,
        borderRadius: 13,
        justifyContent: 'center',
        alignItems: 'center',
    },
    shipmentDetailText: {
        fontSize: 11,
        color: textSecondary,
        fontWeight: '500',
        fontFamily: 'PlusJakartaSans_500Medium',
    },
    shipmentFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: theme.spacing.sm,
        borderTopWidth: 1,
        borderTopColor: 'rgba(226, 232, 240, 0.3)',
    },
    shipmentPrice: {
        fontSize: 15,
        color: primary,
        fontWeight: '700',
        fontFamily: 'PlusJakartaSans_700Bold',
    },
    trackButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.xs,
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderRadius: theme.borderRadius.base,
    },
    trackButtonText: {
        fontSize: 12,
        color: primary,
        fontWeight: '600',
        fontFamily: 'PlusJakartaSans_600SemiBold',
    },
});