import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
    Animated,
    Dimensions,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Switch,
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
    textSecondary
} from '../../constants/Colors';
import { theme } from '../../constants/theme';

const { width } = Dimensions.get('window');

const availableLoads = [
    {
        id: '1',
        route: 'Mumbai → Delhi',
        distance: '1,450 km',
        weight: '8 Tons',
        earnings: '₹32,500',
        pickupTime: 'Tomorrow, 10:00 AM',
    },
    {
        id: '2',
        route: 'Pune → Bangalore',
        distance: '850 km',
        weight: '5 Tons',
        earnings: '₹22,000',
        pickupTime: 'Today, 6:00 PM',
    },
];

export default function DriverHome() {
    const router = useRouter();
    const [isOnline, setIsOnline] = useState(false);
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

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={theme.gradients.background as any}
                style={StyleSheet.absoluteFillObject}
            />

            <SafeAreaView style={styles.safeArea}>
                <FloatingHeader
                    greeting="Good Morning"
                    userName="Rajesh Kumar"
                    onNotificationPress={() => { }}
                    onProfilePress={() => router.push('/(driver)/profile')}
                />

                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.content}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Status Toggle Card */}
                    <Animated.View
                        style={{
                            opacity: fadeAnim,
                            transform: [{ translateY: slideAnim }],
                        }}
                    >
                        <LinearGradient
                            colors={isOnline
                                ? ['rgba(16, 185, 129, 0.15)', 'rgba(52, 211, 153, 0.05)']
                                : ['rgba(255, 255, 255, 0.6)', 'rgba(255, 255, 255, 0.3)']
                            }
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.toggleCard}
                        >
                            <BlurView intensity={20} tint="light" style={styles.toggleBlur}>
                                <View style={styles.toggleContent}>
                                    <View style={styles.toggleLeft}>
                                        <View style={styles.statusContainer}>
                                            <Animated.View
                                                style={[
                                                    styles.pulseOuter,
                                                    {
                                                        backgroundColor: isOnline ? 'rgba(16, 185, 129, 0.2)' : 'transparent',
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
                                            <Text style={styles.toggleTitle}>
                                                {isOnline ? 'You are Online' : 'You are Offline'}
                                            </Text>
                                            <Text style={styles.toggleSubtitle}>
                                                {isOnline ? 'Ready to accept loads' : 'Switch on to receive loads'}
                                            </Text>
                                        </View>
                                    </View>
                                    <Switch
                                        value={isOnline}
                                        onValueChange={setIsOnline}
                                        trackColor={{ false: '#E2E8F0', true: '#10B981' }}
                                        thumbColor={surface}
                                        ios_backgroundColor="#E2E8F0"
                                    />
                                </View>
                            </BlurView>
                        </LinearGradient>
                    </Animated.View>

                    {/* Stats Cards - Quick Actions Style */}
                    <Animated.View
                        style={{
                            opacity: fadeAnim,
                            transform: [{ translateY: slideAnim }],
                        }}
                    >
                        <View style={styles.statsContainer}>
                            {/* Today's Earnings */}
                            <TouchableOpacity
                                style={styles.statCard}
                                onPress={() => router.push('/(driver)/earnings')}
                            >
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
                                            <Ionicons name="wallet-outline" size={22} color="#10B981" />
                                        </LinearGradient>
                                        <Text style={[styles.statValue, { color: '#10B981' }]}>₹8,450</Text>
                                        <Text style={styles.statLabel}>Today's Earnings</Text>
                                    </BlurView>
                                </LinearGradient>
                            </TouchableOpacity>

                            {/* Active Trips */}
                            <TouchableOpacity
                                style={styles.statCard}
                                onPress={() => router.push('/(driver)/active-trip')}
                            >
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
                                            <Ionicons name="navigate-outline" size={22} color={primary} />
                                        </LinearGradient>
                                        <Text style={styles.statValue}>2</Text>
                                        <Text style={styles.statLabel}>Active Trips</Text>
                                    </BlurView>
                                </LinearGradient>
                            </TouchableOpacity>

                            {/* Rating */}
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
                                            <Ionicons name="star-outline" size={22} color="#F59E0B" />
                                        </LinearGradient>
                                        <Text style={[styles.statValue, { color: '#F59E0B' }]}>4.8</Text>
                                        <Text style={styles.statLabel}>Rating</Text>
                                    </BlurView>
                                </LinearGradient>
                            </View>
                        </View>
                    </Animated.View>

                    {/* Available Loads */}
                    {isOnline && (
                        <Animated.View
                            style={{
                                opacity: fadeAnim,
                                transform: [{ translateY: slideAnim }],
                            }}
                        >
                            <View style={styles.section}>
                                <View style={styles.sectionHeader}>
                                    <Text style={styles.sectionTitle}>Available Loads</Text>
                                    <TouchableOpacity onPress={() => router.push('/(driver)/loads')}>
                                        <Text style={styles.seeAllText}>See All</Text>
                                    </TouchableOpacity>
                                </View>

                                {availableLoads.map((load, index) => (
                                    <TouchableOpacity
                                        key={load.id}
                                        activeOpacity={0.9}
                                        onPress={() => router.push(`/(driver)/load-details?id=${load.id}`)}
                                        style={styles.loadCardWrapper}
                                    >
                                        <LinearGradient
                                            colors={['rgba(59, 130, 246, 0.08)', 'rgba(96, 165, 250, 0.04)']}
                                            start={{ x: 0, y: 0 }}
                                            end={{ x: 1, y: 1 }}
                                            style={styles.loadCard}
                                        >
                                            <BlurView intensity={35} tint="light" style={styles.loadBlur}>
                                                <View style={styles.loadHeader}>
                                                    <Text style={styles.loadRoute}>{load.route}</Text>
                                                    <StatusPill status="pending" />
                                                </View>

                                                <View style={styles.loadDetails}>
                                                    <View style={styles.loadDetailItem}>
                                                        <LinearGradient
                                                            colors={['rgba(59, 130, 246, 0.15)', 'rgba(96, 165, 250, 0.1)']}
                                                            style={styles.loadDetailIcon}
                                                        >
                                                            <Ionicons name="navigate-outline" size={14} color={primary} />
                                                        </LinearGradient>
                                                        <Text style={styles.loadDetailText}>{load.distance}</Text>
                                                    </View>
                                                    <View style={styles.loadDetailItem}>
                                                        <LinearGradient
                                                            colors={['rgba(245, 158, 11, 0.15)', 'rgba(251, 191, 36, 0.1)']}
                                                            style={styles.loadDetailIcon}
                                                        >
                                                            <Ionicons name="cube-outline" size={14} color="#F59E0B" />
                                                        </LinearGradient>
                                                        <Text style={styles.loadDetailText}>{load.weight}</Text>
                                                    </View>
                                                    <View style={styles.loadDetailItem}>
                                                        <LinearGradient
                                                            colors={['rgba(16, 185, 129, 0.15)', 'rgba(52, 211, 153, 0.1)']}
                                                            style={styles.loadDetailIcon}
                                                        >
                                                            <Ionicons name="time-outline" size={14} color="#10B981" />
                                                        </LinearGradient>
                                                        <Text style={styles.loadDetailText}>{load.pickupTime}</Text>
                                                    </View>
                                                </View>

                                                <View style={styles.loadFooter}>
                                                    <Text style={styles.loadPrice}>{load.earnings}</Text>
                                                    <View style={styles.viewButton}>
                                                        <Text style={styles.viewButtonText}>View Details</Text>
                                                        <Ionicons name="arrow-forward" size={14} color={primary} />
                                                    </View>
                                                </View>
                                            </BlurView>
                                        </LinearGradient>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </Animated.View>
                    )}

                    {/* Offline Message */}
                    {!isOnline && (
                        <Animated.View
                            style={{
                                opacity: fadeAnim,
                                transform: [{ translateY: slideAnim }],
                            }}
                        >
                            <View style={styles.offlineMessage}>
                                <LinearGradient
                                    colors={['rgba(255, 255, 255, 0.6)', 'rgba(255, 255, 255, 0.2)']}
                                    style={styles.offlineIcon}
                                >
                                    <Ionicons name="cloud-offline-outline" size={48} color={textSecondary} />
                                </LinearGradient>
                                <Text style={styles.offlineTitle}>You are currently offline</Text>
                                <Text style={styles.offlineText}>
                                    Go online to start receiving new load offers and track your earnings.
                                </Text>
                            </View>
                        </Animated.View>
                    )}
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
    // Toggle Card
    toggleCard: {
        marginHorizontal: theme.spacing.lg,
        borderRadius: 20,
        marginBottom: theme.spacing.md,
        marginTop: theme.spacing.md,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
        ...theme.shadows.medium,
        elevation: 5,
    },
    toggleBlur: {
        padding: theme.spacing.md,
        borderRadius: 20,
    },
    toggleContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    toggleLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        gap: theme.spacing.md,
    },
    statusContainer: {
        width: 36,
        height: 36,
        justifyContent: 'center',
        alignItems: 'center',
    },
    statusDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
    },
    pulseOuter: {
        position: 'absolute',
        width: 36,
        height: 36,
        borderRadius: 18,
    },
    toggleTitle: {
        fontSize: 16,
        color: text,
        fontWeight: '700',
        marginBottom: 2,
        fontFamily: 'PlusJakartaSans_700Bold',
    },
    toggleSubtitle: {
        fontSize: 12,
        color: textSecondary,
        fontFamily: 'PlusJakartaSans_500Medium',
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
        fontSize: 16,
        color: text,
        fontWeight: '700',
        marginBottom: 2,
        fontFamily: 'PlusJakartaSans_700Bold',
        textAlign: 'center',
    },
    statLabel: {
        fontSize: 10,
        color: textSecondary,
        fontWeight: '500',
        textAlign: 'center',
    },
    // Available Loads Styles
    section: {
        marginBottom: theme.spacing.xl,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: theme.spacing.lg,
        marginBottom: theme.spacing.md,
    },
    sectionTitle: {
        fontSize: 16,
        color: text,
        fontWeight: '600',
        fontFamily: 'PlusJakartaSans_600SemiBold',
    },
    seeAllText: {
        fontSize: 14,
        color: primary,
        fontWeight: '600',
    },
    loadCardWrapper: {
        marginHorizontal: theme.spacing.lg,
        marginBottom: theme.spacing.md,
    },
    loadCard: {
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
    loadBlur: {
        padding: theme.spacing.md,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    loadHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing.sm,
    },
    loadRoute: {
        fontSize: 16,
        color: text,
        fontWeight: '700',
        fontFamily: 'PlusJakartaSans_700Bold',
    },
    loadDetails: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: theme.spacing.sm,
        marginBottom: theme.spacing.md,
    },
    loadDetailItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.xs,
    },
    loadDetailIcon: {
        width: 24,
        height: 24,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadDetailText: {
        fontSize: 12,
        color: textSecondary,
        fontWeight: '500',
        fontFamily: 'PlusJakartaSans_500Medium',
    },
    loadFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: theme.spacing.sm,
        borderTopWidth: 1,
        borderTopColor: 'rgba(226, 232, 240, 0.3)',
    },
    loadPrice: {
        fontSize: 18,
        color: primary,
        fontWeight: '700',
        fontFamily: 'PlusJakartaSans_700Bold',
    },
    viewButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    viewButtonText: {
        fontSize: 13,
        color: primary,
        fontWeight: '600',
        fontFamily: 'PlusJakartaSans_600SemiBold',
    },
    // Offline Message
    offlineMessage: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: theme.spacing.xxxl,
        paddingHorizontal: theme.spacing.xxl,
    },
    offlineIcon: {
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: theme.spacing.lg,
    },
    offlineTitle: {
        fontSize: 18,
        color: text,
        fontWeight: '600',
        marginBottom: theme.spacing.xs,
        textAlign: 'center',
        fontFamily: 'PlusJakartaSans_600SemiBold',
    },
    offlineText: {
        fontSize: 14,
        color: textSecondary,
        textAlign: 'center',
        lineHeight: 20,
        fontFamily: 'PlusJakartaSans_400Regular',
    },
});
