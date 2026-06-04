import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
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
import { StatusPill } from '../../components/shared/StatusPill';
import { Colors } from '../../constants/Colors';
import { theme } from '../../constants/theme';

const { width } = Dimensions.get('window');

export default function TripDetails() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const pulseAnim = useRef(new Animated.Value(1)).current;

    const isTrip2 = params.id === 'active-2';
    const tripId = isTrip2 ? '#TRK-1005' : '#TRK-1002';
    const route = isTrip2 ? 'Pune → Delhi' : 'Mumbai → Bangalore';
    const driverName = isTrip2 ? 'Vikram Singh' : 'Amit Sharma';
    const vehicle = isTrip2 ? 'Mahindra Bolero (MH-14-AA-9988)' : 'Tata Ace (MH-12-QP-1122)';
    const shipper = isTrip2 ? 'Tata Steel Ltd' : 'Reliance Digital Ltd';
    const currentLocation = isTrip2 ? 'Indore, MP' : 'Davangere, Karnataka';
    const progress = isTrip2 ? '15%' : '72%';
    const totalAmount = isTrip2 ? '₹35,000' : '₹20,000';
    const commission = isTrip2 ? '₹1,050' : '₹600';
    const platformFee = isTrip2 ? '₹1,750' : '₹1,000';
    const driverPayout = isTrip2 ? '₹32,200' : '₹18,400';

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
        }).start();

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
                    <Text style={styles.headerTitle}>Trip Details</Text>
                    <TouchableOpacity style={styles.iconButton}>
                        <Ionicons name="ellipsis-vertical" size={24} color={Colors.light.text} />
                    </TouchableOpacity>
                </View>

                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.content}
                    showsVerticalScrollIndicator={false}
                >
                    <Animated.View style={{ opacity: fadeAnim }}>
                        {/* Route Summary */}
                        <View style={styles.card}>
                            <View style={styles.cardHeader}>
                                <View>
                                    <Text style={styles.routeText}>{route}</Text>
                                    <Text style={styles.tripIdText}>Trip ID: {tripId}</Text>
                                </View>
                                <StatusPill status={isTrip2 ? 'active' : 'in-transit'} />
                            </View>

                            <View style={styles.infoDetails}>
                                <View style={styles.infoRow}>
                                    <View style={styles.infoItem}>
                                        <Ionicons name="person-circle-outline" size={20} color={Colors.light.primary} />
                                        <View>
                                            <Text style={styles.infoLabel}>Driver</Text>
                                            <Text style={styles.infoValue}>{driverName}</Text>
                                        </View>
                                    </View>
                                    <View style={styles.infoDivider} />
                                    <View style={styles.infoItem}>
                                        <Ionicons name="business-outline" size={20} color="#10B981" />
                                        <View>
                                            <Text style={styles.infoLabel}>Shipper</Text>
                                            <Text style={styles.infoValue}>{shipper}</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </View>

                        {/* Live Tracking Map */}
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
                                    <Text style={styles.locationTitle}>Live Tracking Map</Text>
                                    <Text style={styles.lastUpdate}>Driver is moving • {progress} complete</Text>
                                </View>
                            </View>

                            {/* Map Placeholder */}
                            <View style={styles.mapPlaceholder}>
                                <Ionicons name="map-outline" size={48} color={Colors.light.primary} />
                                <Text style={styles.mapText}>Live GPS Tracking View</Text>
                            </View>

                            <View style={styles.currentLocation}>
                                <Ionicons name="location" size={24} color={Colors.light.primary} />
                                <View style={styles.currentLocationText}>
                                    <Text style={styles.currentLocationLabel}>Current Location</Text>
                                    <Text style={styles.currentLocationValue}>{currentLocation}</Text>
                                </View>
                            </View>
                        </View>

                        {/* Financial Splits */}
                        <Text style={styles.sectionTitle}>Commission & Payout Split</Text>
                        <View style={styles.card}>
                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>Total Freight Value</Text>
                                <Text style={styles.detailValue}>{totalAmount}</Text>
                            </View>
                            <View style={styles.detailDivider} />
                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>Platform Fee (5%)</Text>
                                <Text style={styles.detailValue}>{platformFee}</Text>
                            </View>
                            <View style={styles.detailDivider} />
                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>Your Commission (3%)</Text>
                                <Text style={[styles.detailValue, { color: '#10B981' }]}>+{commission}</Text>
                            </View>
                            <View style={styles.detailDivider} />
                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>Driver Payout</Text>
                                <Text style={[styles.detailValue, { color: Colors.light.primary }]}>{driverPayout}</Text>
                            </View>
                        </View>

                        {/* Timeline */}
                        <Text style={styles.sectionTitle}>Trip Progress Timeline</Text>
                        <View style={styles.card}>
                            {/* Milestone 1 */}
                            <View style={styles.timelineItem}>
                                <View style={styles.timelineLeft}>
                                    <View style={[styles.timelineDot, { backgroundColor: '#ECFDF5', borderColor: '#10B981' }]}>
                                        <Ionicons name="checkmark" size={14} color="#10B981" />
                                    </View>
                                    <View style={[styles.timelineLine, { backgroundColor: '#10B981' }]} />
                                </View>
                                <View style={styles.timelineContent}>
                                    <Text style={styles.timelineTitle}>Trip Confirmed & Assigned</Text>
                                    <Text style={styles.timelineTime}>Dec 18, 9:00 AM</Text>
                                </View>
                            </View>

                            {/* Milestone 2 */}
                            <View style={styles.timelineItem}>
                                <View style={styles.timelineLeft}>
                                    <View style={[styles.timelineDot, { backgroundColor: '#ECFDF5', borderColor: '#10B981' }]}>
                                        <Ionicons name="checkmark" size={14} color="#10B981" />
                                    </View>
                                    <View style={[styles.timelineLine, { backgroundColor: isTrip2 ? '#E2E8F0' : '#10B981' }]} />
                                </View>
                                <View style={styles.timelineContent}>
                                    <Text style={styles.timelineTitle}>Goods Loaded & Dispatched</Text>
                                    <Text style={styles.timelineLocation}>Pickup: {route.split(' → ')[0]}</Text>
                                    <Text style={styles.timelineTime}>Dec 18, 11:30 AM</Text>
                                </View>
                            </View>

                            {/* Milestone 3 */}
                            <View style={styles.timelineItem}>
                                <View style={styles.timelineLeft}>
                                    <View style={[
                                        styles.timelineDot,
                                        isTrip2
                                            ? { backgroundColor: '#FFFFFF', borderColor: '#94A3B8' }
                                            : { backgroundColor: '#EFF6FF', borderColor: Colors.light.primary }
                                    ]}>
                                        {!isTrip2 && <View style={styles.timelineDotInner} />}
                                    </View>
                                    <View style={styles.timelineLine} />
                                </View>
                                <View style={styles.timelineContent}>
                                    <Text style={[
                                        styles.timelineTitle,
                                        isTrip2 && { color: Colors.light.textSecondary }
                                    ]}>In Transit</Text>
                                    <Text style={styles.timelineLocation}>Current Checkpoint: {currentLocation}</Text>
                                    <Text style={styles.timelineTime}>{isTrip2 ? 'Pending check-in' : 'Dec 19, 2:15 PM'}</Text>
                                </View>
                            </View>

                            {/* Milestone 4 */}
                            <View style={[styles.timelineItem, styles.timelineItemLast]}>
                                <View style={styles.timelineLeft}>
                                    <View style={[styles.timelineDot, { backgroundColor: '#FFFFFF', borderColor: '#94A3B8' }]} />
                                </View>
                                <View style={styles.timelineContent}>
                                    <Text style={[styles.timelineTitle, { color: Colors.light.textSecondary }]}>Delivery Confirmation</Text>
                                    <Text style={styles.timelineLocation}>Destination: {route.split(' → ')[1]}</Text>
                                    <Text style={styles.timelineTime}>Expected in 4 hrs</Text>
                                </View>
                            </View>
                        </View>

                        {/* Contacts */}
                        <View style={styles.buttonRow}>
                            <TouchableOpacity style={[styles.contactButton, { backgroundColor: Colors.light.primary }]}>
                                <Ionicons name="call" size={18} color="#FFFFFF" />
                                <Text style={styles.buttonText}>Call Driver</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.contactButton, { backgroundColor: '#475569' }]}>
                                <Ionicons name="chatbubble" size={18} color="#FFFFFF" />
                                <Text style={styles.buttonText}>Chat Shipper</Text>
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
    routeText: {
        fontSize: 18,
        fontFamily: 'PlusJakartaSans_700Bold',
        color: Colors.light.text,
        marginBottom: 2,
    },
    tripIdText: {
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
    infoLabel: {
        fontSize: 11,
        color: Colors.light.textSecondary,
    },
    infoValue: {
        fontSize: 13,
        fontWeight: '700',
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
        color: Colors.light.textSecondary,
    },
    currentLocationValue: {
        fontSize: 13,
        fontWeight: '600',
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
        color: Colors.light.textSecondary,
    },
    detailValue: {
        fontSize: 15,
        fontWeight: '700',
        color: Colors.light.text,
    },
    timelineItem: {
        flexDirection: 'row',
        gap: theme.spacing.md,
    },
    timelineItemLast: {},
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
        color: Colors.light.text,
        marginBottom: 2,
    },
    timelineTime: {
        fontSize: 12,
        color: Colors.light.textSecondary,
    },
    buttonRow: {
        flexDirection: 'row',
        gap: theme.spacing.md,
    },
    contactButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        height: 56,
        borderRadius: 16,
        ...theme.shadows.medium,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#FFFFFF',
    },
});
