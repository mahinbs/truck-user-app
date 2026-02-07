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
import { Button } from '../../components/shared/Button';
import { FloatingHeader } from '../../components/shared/FloatingHeader';
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
    const slideAnim = useRef(new Animated.Value(50)).current;

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
    }, []);

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
                    <Animated.View
                        style={{
                            opacity: fadeAnim,
                            transform: [{ translateY: slideAnim }],
                        }}
                    >
                        {/* Earnings Summary Card */}
                        <LinearGradient
                            colors={['rgba(255, 255, 255, 0.8)', 'rgba(255, 255, 255, 0.5)']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.summaryCard}
                        >
                            <BlurView intensity={20} tint="light" style={styles.summaryBlur}>
                                <View style={styles.summaryRow}>
                                    <View style={styles.summaryItem}>
                                        <Text style={styles.summaryLabel}>Today's Earnings</Text>
                                        <Text style={styles.summaryValue}>₹8,450</Text>
                                    </View>
                                    <View style={styles.summaryItem}>
                                        <View style={styles.ratingContainer}>
                                            <LinearGradient
                                                colors={['rgba(245, 158, 11, 0.2)', 'rgba(251, 191, 36, 0.1)']}
                                                style={styles.ratingIcon}
                                            >
                                                <Ionicons name="star" size={16} color="#F59E0B" />
                                            </LinearGradient>
                                            <View>
                                                <Text style={[styles.ratingValue, { color: '#F59E0B' }]}>4.8</Text>
                                                <Text style={styles.summaryLabel}>Rating</Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                                <View style={styles.divider} />
                                <View style={styles.summaryRow}>
                                    <View style={styles.summaryItem}>
                                        <Text style={styles.summaryLabel}>Active Trips</Text>
                                        <Text style={styles.summaryValue}>2</Text>
                                    </View>
                                    <View style={styles.summaryItem}>
                                        <Text style={styles.summaryLabel}>Total Trips</Text>
                                        <Text style={styles.summaryValue}>245</Text>
                                    </View>
                                </View>
                            </BlurView>
                        </LinearGradient>

                        {/* Go Online Toggle */}
                        <LinearGradient
                            colors={isOnline
                                ? ['rgba(16, 185, 129, 0.1)', 'rgba(52, 211, 153, 0.05)']
                                : ['rgba(255, 255, 255, 0.6)', 'rgba(255, 255, 255, 0.3)']
                            }
                            style={styles.toggleCard}
                        >
                            <BlurView intensity={20} tint="light" style={styles.toggleBlur}>
                                <View style={styles.toggleContent}>
                                    <View style={styles.toggleLeft}>
                                        <View style={[styles.statusDot, isOnline && styles.statusDotOnline]}>
                                            {isOnline && <View style={styles.statusDotPulse} />}
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

                        {/* Available Loads */}
                        {isOnline && (
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
                                    >
                                        <LinearGradient
                                            colors={['rgba(59, 130, 246, 0.08)', 'rgba(96, 165, 250, 0.04)']}
                                            start={{ x: 0, y: 0 }}
                                            end={{ x: 1, y: 1 }}
                                            style={styles.loadCard}
                                        >
                                            <BlurView intensity={40} tint="light" style={styles.loadBlur}>
                                                <View style={styles.loadHeader}>
                                                    <View style={styles.routeContainer}>
                                                        <Text style={styles.loadRoute}>{load.route}</Text>
                                                        <Text style={styles.loadEarnings}>{load.earnings}</Text>
                                                    </View>
                                                </View>

                                                <View style={styles.loadDetails}>
                                                    <View style={styles.loadDetailItem}>
                                                        <LinearGradient
                                                            colors={['rgba(255, 255, 255, 0.8)', 'rgba(255, 255, 255, 0.4)']}
                                                            style={styles.detailIcon}
                                                        >
                                                            <Ionicons name="navigate-outline" size={16} color={textSecondary} />
                                                        </LinearGradient>
                                                        <Text style={styles.loadDetailText}>{load.distance}</Text>
                                                    </View>
                                                    <View style={styles.loadDetailItem}>
                                                        <LinearGradient
                                                            colors={['rgba(255, 255, 255, 0.8)', 'rgba(255, 255, 255, 0.4)']}
                                                            style={styles.detailIcon}
                                                        >
                                                            <Ionicons name="cube-outline" size={16} color={textSecondary} />
                                                        </LinearGradient>
                                                        <Text style={styles.loadDetailText}>{load.weight}</Text>
                                                    </View>
                                                    <View style={styles.loadDetailItem}>
                                                        <LinearGradient
                                                            colors={['rgba(255, 255, 255, 0.8)', 'rgba(255, 255, 255, 0.4)']}
                                                            style={styles.detailIcon}
                                                        >
                                                            <Ionicons name="time-outline" size={16} color={textSecondary} />
                                                        </LinearGradient>
                                                        <Text style={styles.loadDetailText}>{load.pickupTime}</Text>
                                                    </View>
                                                </View>

                                                <Button
                                                    title="View Details"
                                                    onPress={() => router.push(`/(driver)/load-details?id=${load.id}`)}
                                                    variant="secondary"
                                                    style={styles.viewButton}
                                                />
                                            </BlurView>
                                        </LinearGradient>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}

                        {/* Offline Message */}
                        {!isOnline && (
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
    scrollView: {
        flex: 1,
    },
    content: {
        paddingBottom: 100,
        paddingTop: 10,
    },
    summaryCard: {
        margin: theme.spacing.base,
        borderRadius: theme.borderRadius.card,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
        ...theme.shadows.card,
    },
    summaryBlur: {
        padding: theme.spacing.lg,
    },
    summaryRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    summaryItem: {
        flex: 1,
    },
    summaryLabel: {
        ...theme.typography.caption,
        fontSize: 11,
        color: textSecondary,
        marginBottom: 2,
    },
    summaryValue: {
        ...theme.typography.h2,
        fontSize: 24,
        color: text,
        fontWeight: '700',
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(226, 232, 240, 0.5)',
        marginVertical: theme.spacing.md,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.sm,
    },
    ratingIcon: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
    },
    ratingValue: {
        ...theme.typography.h3,
        fontSize: 18,
        fontWeight: '700',
    },
    toggleCard: {
        marginHorizontal: theme.spacing.base,
        borderRadius: theme.borderRadius.card,
        marginBottom: theme.spacing.base,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
        overflow: 'hidden',
    },
    toggleBlur: {
        padding: theme.spacing.base,
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
    statusDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#CBD5E1',
        justifyContent: 'center',
        alignItems: 'center',
    },
    statusDotOnline: {
        backgroundColor: '#10B981',
        ...theme.shadows.glow,
        shadowColor: '#10B981',
    },
    statusDotPulse: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: 'rgba(16, 185, 129, 0.3)',
        position: 'absolute',
    },
    toggleTitle: {
        ...theme.typography.bodyMedium,
        fontSize: 16,
        color: text,
        fontWeight: '600',
        marginBottom: 2,
    },
    toggleSubtitle: {
        ...theme.typography.caption,
        fontSize: 12,
        color: textSecondary,
    },
    section: {
        marginTop: theme.spacing.md,
        paddingHorizontal: theme.spacing.base,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing.base,
    },
    sectionTitle: {
        ...theme.typography.h3,
        fontSize: 18,
        color: text,
        fontWeight: '600',
    },
    seeAllText: {
        ...theme.typography.bodyMedium,
        fontSize: 14,
        color: primary,
        fontWeight: '500',
    },
    loadCard: {
        borderRadius: theme.borderRadius.card,
        overflow: 'hidden',
        marginBottom: theme.spacing.base,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.4)',
        ...theme.shadows.card,
    },
    loadBlur: {
        padding: theme.spacing.base,
    },
    loadHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: theme.spacing.base,
    },
    routeContainer: {
        flex: 1,
    },
    loadRoute: {
        ...theme.typography.h3,
        fontSize: 18,
        color: text,
        fontWeight: '600',
        marginBottom: 4,
    },
    loadEarnings: {
        ...theme.typography.h3,
        fontSize: 20,
        color: primary,
        fontWeight: '700',
    },
    loadDetails: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: theme.spacing.base,
        marginBottom: theme.spacing.base,
    },
    loadDetailItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.xs,
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 8,
    },
    detailIcon: {
        width: 24,
        height: 24,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadDetailText: {
        ...theme.typography.caption,
        fontSize: 12,
        color: text,
        fontWeight: '500',
    },
    viewButton: {
        borderRadius: theme.borderRadius.button,
    },
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
        ...theme.typography.h3,
        fontSize: 18,
        color: text,
        fontWeight: '600',
        marginBottom: theme.spacing.xs,
        textAlign: 'center',
    },
    offlineText: {
        ...theme.typography.body,
        fontSize: 14,
        color: textSecondary,
        textAlign: 'center',
        lineHeight: 20,
    },
});
