import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
    Dimensions,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '../../components/shared/Button';
import { Card } from '../../components/shared/Card';
import { background, primary, surface, text, textSecondary, warning } from '../../constants/Colors';
import { MOCK_DRIVERS } from '../../constants/data';
import { theme } from '../../constants/theme';

const { width } = Dimensions.get('window');

export default function BookingConfirmation() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const insets = useSafeAreaInsets();

    // Retrieve driver ID and find driver data
    const { driverId, isUrgent: urgentParam } = params;
    const isUrgent = urgentParam === 'true';

    const driverData = useMemo(() => {
        const driver = MOCK_DRIVERS.find(d => d.id === driverId);
        if (!driver) return null;

        const basePrice = parseInt(driver.price.replace(/[^0-9]/g, ''));
        const surcharge = isUrgent ? Math.round(basePrice * 0.12) : 0;
        const totalPrice = basePrice + surcharge;

        return {
            ...driver,
            basePrice,
            surcharge,
            totalPriceFormatted: `₹${totalPrice.toLocaleString('en-IN')}`,
            originalPrice: driver.price
        };
    }, [driverId, isUrgent]);

    const [selectedPayment, setSelectedPayment] = useState('wallet');
    const [loading, setLoading] = useState(false);

    const handlePayment = () => {
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            const isSuccess = Math.random() > 0.2; // 80% success rate

            if (isSuccess) {
                router.push('/(business)/booking-success');
            } else {
                router.push('/(business)/booking-failure');
            }
        }, 2000);
    };

    if (!driverData) {
        return (
            <View style={[styles.container, { paddingTop: insets.top }]}>
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>Driver data not found</Text>
                    <Button title="Go Back" onPress={() => router.back()} />
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={[styles.header, { paddingTop: insets.top }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Confirm Booking</Text>
                <View style={styles.placeholder} />
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={[
                    styles.content,
                    { paddingBottom: Platform.OS === 'ios' ? 180 : 160 }
                ]}
                showsVerticalScrollIndicator={false}
            >
                {/* Route Details */}
                <Card style={styles.sectionCard}>
                    <Text style={styles.sectionTitle}>Route Details</Text>
                    <View style={styles.timelineContainer}>
                        <View style={styles.timelineItem}>
                            <View style={[styles.timelineDotOuter, { borderColor: 'rgba(16, 185, 129, 0.2)' }]}>
                                <View style={[styles.timelineDot, { backgroundColor: '#10B981' }]} />
                            </View>
                            <View style={styles.timelineContent}>
                                <Text style={styles.timelineLabel}>Pickup</Text>
                                <Text style={styles.timelineValue}>123, Industrial Area, Okhla Phase III</Text>
                                <Text style={styles.timelineTime}>Today, 2:30 PM</Text>
                            </View>
                        </View>
                        <View style={styles.timelineLineContainer}>
                            <View style={styles.timelineLine} />
                        </View>
                        <View style={styles.timelineItem}>
                            <View style={[styles.timelineDotOuter, { borderColor: 'rgba(239, 68, 68, 0.2)' }]}>
                                <View style={[styles.timelineDot, { backgroundColor: '#EF4444' }]} />
                            </View>
                            <View style={styles.timelineContent}>
                                <Text style={styles.timelineLabel}>Drop Off</Text>
                                <Text style={styles.timelineValue}>Sector 62, Noida, Uttar Pradesh</Text>
                                <Text style={styles.timelineTime}>Today, 4:45 PM</Text>
                            </View>
                        </View>
                    </View>
                </Card>

                {/* Driver Details */}
                <Card style={[
                    styles.sectionCard,
                    isUrgent && styles.urgentCard
                ]}>
                    <View style={styles.cardHeader}>
                        <Text style={styles.sectionTitle}>Driver Details</Text>
                        {isUrgent && (
                            <View style={styles.urgentBadge}>
                                <Ionicons name="flash" size={12} color="#FFFFFF" />
                                <Text style={styles.urgentBadgeText}>PREMIUM</Text>
                            </View>
                        )}
                    </View>

                    <View style={styles.driverContainer}>
                        <View style={styles.driverAvatarContainer}>
                            <LinearGradient
                                colors={['#F1F5F9', '#E2E8F0']}
                                style={styles.driverAvatar}
                            >
                                <Ionicons name="person" size={30} color={textSecondary} />
                            </LinearGradient>
                            <View style={styles.verifiedBadge}>
                                <Ionicons name="checkmark" size={10} color="#FFFFFF" />
                            </View>
                        </View>
                        <View style={styles.driverInfo}>
                            <Text style={styles.driverName}>{driverData.name}</Text>
                            <Text style={styles.truckType}>{driverData.truckType}</Text>
                            <View style={styles.ratingRow}>
                                <View style={styles.ratingContainer}>
                                    <Ionicons name="star" size={12} color="#D97706" />
                                    <Text style={styles.ratingText}>{driverData.rating}</Text>
                                </View>
                                <Text style={styles.tripsText}>{driverData.trips} Trips</Text>
                            </View>
                        </View>
                        <TouchableOpacity style={styles.callButton}>
                            <Ionicons name="call" size={20} color={primary} />
                        </TouchableOpacity>
                    </View>
                </Card>

                {/* Bill Details */}
                <Card style={styles.sectionCard}>
                    <Text style={styles.sectionTitle}>Bill Details</Text>
                    <View style={styles.billRow}>
                        <Text style={styles.billLabel}>Base Fare</Text>
                        <Text style={styles.billValue}>{driverData.originalPrice}</Text>
                    </View>

                    {isUrgent && (
                        <View style={styles.billRow}>
                            <View style={styles.surchargeLabel}>
                                <Ionicons name="flash" size={14} color={warning} />
                                <Text style={[styles.billLabel, { color: warning }]}>Urgent Surcharge (12%)</Text>
                            </View>
                            <Text style={[styles.billValue, { color: warning }]}>
                                +₹{driverData.surcharge?.toLocaleString('en-IN')}
                            </Text>
                        </View>
                    )}

                    <View style={styles.billRow}>
                        <Text style={styles.billLabel}>Distance Charge</Text>
                        <Text style={styles.billValue}>₹2,000</Text>
                    </View>
                    <View style={styles.billRow}>
                        <Text style={styles.billLabel}>GST (18%)</Text>
                        <Text style={styles.billValue}>₹500</Text>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>Total Amount</Text>
                        <Text style={styles.totalValue}>{driverData.totalPriceFormatted}</Text>
                    </View>
                </Card>

                {/* Payment Method */}
                <Text style={styles.sectionHeader}>Payment Method</Text>

                <TouchableOpacity
                    style={[styles.paymentOption, selectedPayment === 'wallet' && styles.paymentOptionSelected]}
                    onPress={() => setSelectedPayment('wallet')}
                    activeOpacity={0.8}
                >
                    <View style={[styles.paymentIconContainer, selectedPayment === 'wallet' && styles.paymentIconContainerSelected]}>
                        <Ionicons name="wallet" size={24} color={selectedPayment === 'wallet' ? primary : textSecondary} />
                    </View>
                    <View style={styles.paymentInfo}>
                        <Text style={styles.paymentTitle}>Trukx Wallet</Text>
                        <Text style={styles.paymentSubtitle}>Balance: ₹45,000</Text>
                    </View>
                    <View style={[styles.radioButton, selectedPayment === 'wallet' && styles.radioButtonSelected]}>
                        {selectedPayment === 'wallet' && <View style={styles.radioButtonInner} />}
                    </View>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.paymentOption, selectedPayment === 'upi' && styles.paymentOptionSelected]}
                    onPress={() => setSelectedPayment('upi')}
                    activeOpacity={0.8}
                >
                    <View style={[styles.paymentIconContainer, selectedPayment === 'upi' && styles.paymentIconContainerSelected]}>
                        <MaterialCommunityIcons name="bank-transfer" size={24} color={selectedPayment === 'upi' ? primary : textSecondary} />
                    </View>
                    <View style={styles.paymentInfo}>
                        <Text style={styles.paymentTitle}>UPI</Text>
                        <Text style={styles.paymentSubtitle}>GPay, PhonePe, Paytm</Text>
                    </View>
                    <View style={[styles.radioButton, selectedPayment === 'upi' && styles.radioButtonSelected]}>
                        {selectedPayment === 'upi' && <View style={styles.radioButtonInner} />}
                    </View>
                </TouchableOpacity>

            </ScrollView>

            {/* Footer */}
            <View style={[
                styles.footer,
                { paddingBottom: Math.max(insets.bottom + 20, 34) }
            ]}>
                <View style={styles.footerTotal}>
                    <Text style={styles.footerLabel}>Total to Pay</Text>
                    <Text style={styles.footerAmount}>{driverData.totalPriceFormatted}</Text>
                </View>
                <Button
                    title={loading ? "Processing..." : "Confirm Payment"}
                    onPress={handlePayment}
                    variant={isUrgent ? 'warning' : 'primary'}
                    style={styles.payButton}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: background,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: theme.spacing.xl,
    },
    errorText: {
        fontSize: 16,
        color: textSecondary,
        marginBottom: theme.spacing.lg,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: theme.spacing.base,
        paddingBottom: theme.spacing.md,
        backgroundColor: surface,
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
        ...theme.shadows.light,
        zIndex: 10,
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: text,
        fontFamily: 'PlusJakartaSans_700Bold',
    },
    placeholder: {
        width: 40,
    },
    scrollView: {
        flex: 1,
    },
    content: {
        padding: theme.spacing.base,
    },
    sectionCard: {
        padding: theme.spacing.md,
        marginBottom: theme.spacing.md,
        backgroundColor: surface,
        borderRadius: 16,
        ...theme.shadows.light,
        borderWidth: 1,
        borderColor: '#F8FAFC',
    },
    urgentCard: {
        backgroundColor: '#FFFBEB',
        borderColor: warning,
        borderWidth: 1,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing.md,
    },
    sectionTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: text,
        fontFamily: 'PlusJakartaSans_700Bold',
        marginBottom: theme.spacing.md,
        letterSpacing: 0.3,
    },
    urgentBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: warning,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        gap: 4,
    },
    urgentBadgeText: {
        fontSize: 10,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    timelineContainer: {
        paddingLeft: 4,
    },
    timelineItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    timelineLineContainer: {
        width: 20,
        alignItems: 'center',
        height: 30,
    },
    timelineLine: {
        width: 2,
        height: '100%',
        backgroundColor: '#E2E8F0',
    },
    timelineDotOuter: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 2,
        marginRight: theme.spacing.md,
        backgroundColor: '#fff',
    },
    timelineDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    timelineContent: {
        flex: 1,
        paddingBottom: 4,
    },
    timelineLabel: {
        fontSize: 11,
        color: textSecondary,
        marginBottom: 2,
        fontFamily: 'Inter_500Medium',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    timelineValue: {
        fontSize: 14,
        color: text,
        fontWeight: '600',
        marginBottom: 4,
        fontFamily: 'Inter_600SemiBold',
        lineHeight: 20,
    },
    timelineTime: {
        fontSize: 12,
        color: textSecondary,
        fontFamily: 'Inter_400Regular',
    },
    driverContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    driverAvatarContainer: {
        position: 'relative',
        marginRight: theme.spacing.md,
    },
    driverAvatar: {
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
    },
    verifiedBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#10B981',
        borderRadius: 8,
        width: 18,
        height: 18,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#FFFFFF',
    },
    driverInfo: {
        flex: 1,
    },
    driverName: {
        fontSize: 16,
        fontWeight: '700',
        color: text,
        marginBottom: 2,
        fontFamily: 'PlusJakartaSans_700Bold',
    },
    truckType: {
        fontSize: 13,
        color: textSecondary,
        marginBottom: 6,
        fontFamily: 'Inter_500Medium',
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FEF3C7',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
        gap: 4,
    },
    ratingText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#D97706',
    },
    tripsText: {
        fontSize: 12,
        color: textSecondary,
    },
    callButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#EFF6FF',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#DBEAFE',
    },
    billRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    billLabel: {
        fontSize: 14,
        color: textSecondary,
        fontFamily: 'Inter_500Medium',
    },
    billValue: {
        fontSize: 14,
        color: text,
        fontWeight: '600',
        fontFamily: 'Inter_600SemiBold',
    },
    surchargeLabel: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    divider: {
        height: 1,
        backgroundColor: '#E2E8F0',
        marginVertical: theme.spacing.md,
        borderStyle: 'dashed',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 4,
    },
    totalLabel: {
        fontSize: 16,
        fontWeight: '700',
        color: text,
        fontFamily: 'PlusJakartaSans_700Bold',
    },
    totalValue: {
        fontSize: 20,
        fontWeight: '700',
        color: primary,
        fontFamily: 'PlusJakartaSans_700Bold',
    },
    sectionHeader: {
        fontSize: 14,
        fontWeight: '700',
        color: textSecondary,
        marginBottom: theme.spacing.sm,
        marginTop: theme.spacing.sm,
        marginLeft: 4,
        textTransform: 'uppercase',
        letterSpacing: 0.8,
    },
    paymentOption: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: theme.spacing.md,
        backgroundColor: surface,
        borderRadius: 16,
        marginBottom: theme.spacing.md,
        paddingBottom: theme.spacing.xl,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    paymentOptionSelected: {
        borderColor: primary,
        backgroundColor: '#EFF6FF',
    },
    paymentIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: '#F1F5F9',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: theme.spacing.md,
    },
    paymentIconContainerSelected: {
        backgroundColor: '#DBEAFE',
    },
    paymentInfo: {
        flex: 1,
    },
    paymentTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: text,
        marginBottom: 2,
        fontFamily: 'PlusJakartaSans_700Bold',
    },
    paymentSubtitle: {
        fontSize: 13,
        color: textSecondary,
        fontFamily: 'Inter_500Medium',
    },
    radioButton: {
        width: 22,
        height: 22,
        borderRadius: 11,
        borderWidth: 2,
        borderColor: '#CBD5E1',
        justifyContent: 'center',
        alignItems: 'center',
    },
    radioButtonSelected: {
        borderColor: primary,
    },
    radioButtonInner: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: primary,
    },
    footer: {
        position: 'absolute',
        bottom: 70, // Raised to clear the floating tab bar (65 + 20 + 5 buffer)
        left: 0,
        right: 0,
        backgroundColor: surface,
        paddingHorizontal: theme.spacing.md,
        paddingTop: theme.spacing.md,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderTopWidth: 1,
        borderTopColor: '#F1F5F9',
        ...theme.shadows.medium,
        shadowOffset: { width: 0, height: -4 },
    },
    footerTotal: {
        flex: 1,
    },
    footerLabel: {
        fontSize: 12,
        color: textSecondary,
        marginBottom: 4,
        fontFamily: 'Inter_500Medium',
    },
    footerAmount: {
        fontSize: 22,
        fontWeight: '700',
        color: text,
        fontFamily: 'PlusJakartaSans_700Bold',
    },
    payButton: {
        width: '50%',
        borderRadius: 14,
        height: 52,
    },
});
