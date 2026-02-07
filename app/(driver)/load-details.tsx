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
import { Button } from '../../components/shared/Button';
import {
    primary,
    surface,
    text,
    textSecondary
} from '../../constants/Colors';
import { theme } from '../../constants/theme';

const { width } = Dimensions.get('window');

export default function LoadDetails() {
    const router = useRouter();
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

    const handleAccept = () => {
        router.push('/(driver)/active-trip');
    };

    const renderDetailRow = (label: string, value: string, last: boolean = false) => (
        <View style={[styles.detailRow, last && styles.noBorder]}>
            <Text style={styles.detailLabel}>{label}</Text>
            <Text style={styles.detailValue}>{value}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={theme.gradients.background as any}
                style={StyleSheet.absoluteFillObject}
            />

            <SafeAreaView style={styles.safeArea}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color={text} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Load Details</Text>
                    <View style={styles.placeholder} />
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
                        {/* Expected Earnings */}
                        <LinearGradient
                            colors={theme.gradients.primary as any}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.earningsCard}
                        >
                            <Text style={styles.earningsLabel}>Expected Earnings</Text>
                            <Text style={styles.earningsAmount}>₹32,500</Text>
                            <View style={styles.paymentTag}>
                                <Ionicons name="flash" size={12} color={primary} />
                                <Text style={styles.paymentTagText}>Instant Payment</Text>
                            </View>
                        </LinearGradient>

                        {/* Route Information */}
                        <LinearGradient
                            colors={['rgba(255, 255, 255, 0.8)', 'rgba(255, 255, 255, 0.5)']}
                            style={styles.detailsCard}
                        >
                            <BlurView intensity={20} tint="light" style={styles.cardBlur}>
                                <Text style={styles.sectionTitle}>Route Information</Text>

                                <View style={styles.routeContainer}>
                                    <View style={styles.routePoint}>
                                        <View style={styles.pointIconContainer}>
                                            <View style={styles.pickupDot} />
                                        </View>
                                        <View style={styles.pointContent}>
                                            <Text style={styles.locationLabel}>Pickup</Text>
                                            <Text style={styles.locationText}>Mumbai, Maharashtra</Text>
                                            <Text style={styles.timeText}>Tomorrow, 10:00 AM</Text>
                                        </View>
                                    </View>

                                    <View style={styles.routeLineContainer}>
                                        <View style={styles.routeLine} />
                                    </View>

                                    <View style={styles.routePoint}>
                                        <View style={styles.pointIconContainer}>
                                            <View style={styles.dropDot} />
                                        </View>
                                        <View style={styles.pointContent}>
                                            <Text style={styles.locationLabel}>Drop</Text>
                                            <Text style={styles.locationText}>Delhi, NCR</Text>
                                            <Text style={styles.timeText}>Est. Dec 17, 8:00 PM</Text>
                                        </View>
                                    </View>
                                </View>

                                <View style={styles.divider} />

                                <View style={styles.infoRow}>
                                    <View style={styles.infoItem}>
                                        <LinearGradient
                                            colors={['rgba(255, 255, 255, 0.8)', 'rgba(255, 255, 255, 0.4)']}
                                            style={styles.infoIcon}
                                        >
                                            <Ionicons name="navigate-outline" size={20} color={textSecondary} />
                                        </LinearGradient>
                                        <View>
                                            <Text style={styles.infoLabel}>Distance</Text>
                                            <Text style={styles.infoValue}>1,450 km</Text>
                                        </View>
                                    </View>
                                    <View style={styles.infoItem}>
                                        <LinearGradient
                                            colors={['rgba(255, 255, 255, 0.8)', 'rgba(255, 255, 255, 0.4)']}
                                            style={styles.infoIcon}
                                        >
                                            <Ionicons name="cube-outline" size={20} color={textSecondary} />
                                        </LinearGradient>
                                        <View>
                                            <Text style={styles.infoLabel}>Weight</Text>
                                            <Text style={styles.infoValue}>8 Tons</Text>
                                        </View>
                                    </View>
                                </View>
                            </BlurView>
                        </LinearGradient>

                        {/* Load Information */}
                        <LinearGradient
                            colors={['rgba(255, 255, 255, 0.8)', 'rgba(255, 255, 255, 0.5)']}
                            style={styles.detailsCard}
                        >
                            <BlurView intensity={20} tint="light" style={styles.cardBlur}>
                                <Text style={styles.sectionTitle}>Load Information</Text>

                                {renderDetailRow('Load Type', 'Electronics')}
                                {renderDetailRow('Truck Type Needed', 'Container Truck')}
                                {renderDetailRow('Insurance', 'Included', true)}
                            </BlurView>
                        </LinearGradient>
                    </Animated.View>
                </ScrollView>

                <BlurView intensity={20} tint="light" style={styles.footer}>
                    <Button
                        title="Accept Load"
                        onPress={handleAccept}
                        fullWidth
                    />
                </BlurView>
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
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: theme.spacing.base,
        paddingVertical: theme.spacing.md,
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
    },
    headerTitle: {
        ...theme.typography.h2,
        fontSize: 20,
        color: text,
        fontWeight: '700',
    },
    placeholder: {
        width: 40,
    },
    scrollView: {
        flex: 1,
    },
    content: {
        paddingHorizontal: theme.spacing.base,
        paddingTop: theme.spacing.base,
        paddingBottom: theme.spacing.xl,
    },
    earningsCard: {
        borderRadius: theme.borderRadius.card,
        padding: theme.spacing.lg,
        alignItems: 'center',
        marginBottom: theme.spacing.lg,
        ...theme.shadows.glow,
    },
    earningsLabel: {
        ...theme.typography.body,
        color: 'rgba(255, 255, 255, 0.9)',
        marginBottom: theme.spacing.xs,
    },
    earningsAmount: {
        ...theme.typography.h1,
        fontSize: 36,
        color: surface,
        fontWeight: '700',
        marginBottom: theme.spacing.md,
    },
    paymentTag: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: surface,
        paddingVertical: 4,
        paddingHorizontal: 12,
        borderRadius: 12,
        gap: 4,
    },
    paymentTagText: {
        ...theme.typography.caption,
        color: primary,
        fontWeight: '600',
        fontSize: 12,
    },
    detailsCard: {
        borderRadius: theme.borderRadius.card,
        overflow: 'hidden',
        marginBottom: theme.spacing.base,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.4)',
        ...theme.shadows.card,
    },
    cardBlur: {
        padding: theme.spacing.lg,
    },
    sectionTitle: {
        ...theme.typography.h3,
        fontSize: 18,
        color: text,
        marginBottom: theme.spacing.lg,
        fontWeight: '600',
    },
    routeContainer: {
        marginBottom: theme.spacing.lg,
    },
    routePoint: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    pointIconContainer: {
        width: 24,
        alignItems: 'center',
        marginRight: theme.spacing.md,
        paddingTop: 6,
    },
    pointContent: {
        flex: 1,
        paddingBottom: theme.spacing.base,
    },
    pickupDot: {
        width: 14,
        height: 14,
        borderRadius: 7,
        backgroundColor: primary,
        borderWidth: 2,
        borderColor: surface,
        ...theme.shadows.light,
    },
    dropDot: {
        width: 14,
        height: 14,
        borderRadius: 7,
        backgroundColor: '#10B981',
        borderWidth: 2,
        borderColor: surface,
        ...theme.shadows.light,
    },
    routeLineContainer: {
        position: 'absolute',
        left: 11,
        top: 20,
        bottom: 40,
        width: 2,
        alignItems: 'center',
    },
    routeLine: {
        width: 2,
        height: '100%',
        backgroundColor: 'rgba(226, 232, 240, 0.8)',
    },
    locationLabel: {
        ...theme.typography.caption,
        fontSize: 12,
        color: textSecondary,
        marginBottom: 2,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    locationText: {
        ...theme.typography.bodyMedium,
        fontSize: 16,
        color: text,
        fontWeight: '600',
        marginBottom: 2,
    },
    timeText: {
        ...theme.typography.caption,
        color: textSecondary,
        fontSize: 13,
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(226, 232, 240, 0.6)',
        marginVertical: theme.spacing.lg,
    },
    infoRow: {
        flexDirection: 'row',
        gap: theme.spacing.xl,
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.md,
        flex: 1,
    },
    infoIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    infoLabel: {
        ...theme.typography.caption,
        fontSize: 12,
        color: textSecondary,
        marginBottom: 2,
    },
    infoValue: {
        ...theme.typography.bodyMedium,
        fontSize: 15,
        color: text,
        fontWeight: '600',
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: theme.spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(226, 232, 240, 0.5)',
    },
    noBorder: {
        borderBottomWidth: 0,
    },
    detailLabel: {
        ...theme.typography.body,
        color: textSecondary,
        fontSize: 15,
    },
    detailValue: {
        ...theme.typography.bodyMedium,
        color: text,
        fontWeight: '600',
        fontSize: 15,
    },
    footer: {
        paddingHorizontal: theme.spacing.base,
        paddingVertical: theme.spacing.lg,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255, 255, 255, 0.3)',
    },
});
