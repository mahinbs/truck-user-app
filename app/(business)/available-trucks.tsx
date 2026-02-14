import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { Button } from '../../components/shared/Button';
import { Card } from '../../components/shared/Card';
import { background, primary, surface, text, textSecondary, warning } from '../../constants/Colors';
import { theme } from '../../constants/theme';

import { MOCK_DRIVERS } from '../../constants/data';

export default function AvailableTrucks() {
    const router = useRouter();
    const { urgent } = useLocalSearchParams();
    const isUrgent = urgent === 'true';

    const [selectedDriver, setSelectedDriver] = useState<any>(null);
    const [bottomSheetVisible, setBottomSheetVisible] = useState(false);

    // Calculate prices with surcharge if urgent
    const drivers = useMemo(() => {
        return MOCK_DRIVERS
            .filter(driver => isUrgent ? true : !driver.urgentEnabled)
            .map(driver => {
                const basePrice = parseInt(driver.price.replace(/[^0-9]/g, ''));
                const surcharge = isUrgent ? Math.round(basePrice * 0.12) : 0;
                const totalPrice = basePrice + surcharge;

                return {
                    ...driver,
                    basePrice, // Original price (string parsed)
                    surcharge,
                    totalPriceFormatted: `₹${totalPrice.toLocaleString('en-IN')}`,
                    originalPrice: driver.price
                };
            });
    }, [isUrgent]);

    const handleSelectDriver = (driver: any) => {
        router.push({
            pathname: '/(business)/booking-confirmation',
            params: {
                driverId: driver.id,
                isUrgent: isUrgent.toString()
            }
        });
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>
                    {isUrgent ? 'Urgent Trucks' : 'Available Trucks'}
                </Text>
                <View style={styles.placeholder} />
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                <Text style={styles.resultsText}>
                    {drivers.length} trucks available for your route
                </Text>

                {drivers.map((driver: any) => (
                    <Card
                        key={driver.id}
                        style={[
                            styles.driverCard,
                            isUrgent && styles.urgentDriverCard
                        ]}
                    >
                        <View style={styles.driverHeader}>
                            <View style={styles.driverAvatarContainer}>
                                <View style={styles.driverAvatar}>
                                    <Ionicons name="person" size={28} color={textSecondary} />
                                </View>
                                <View style={styles.verifiedBadge}>
                                    <Ionicons name="checkmark" size={12} color="#FFFFFF" />
                                </View>
                            </View>
                            <View style={styles.driverInfo}>
                                <View style={styles.driverNameRow}>
                                    <Text style={styles.driverName}>{driver.name}</Text>
                                    <Text style={styles.price}>{driver.totalPriceFormatted}</Text>
                                </View>
                                <Text style={styles.truckType}>{driver.truckType}</Text>
                                <View style={styles.ratingContainer}>
                                    <View style={styles.ratingBadge}>
                                        <Ionicons name="star" size={10} color="#D97706" />
                                        <Text style={styles.rating}>{driver.rating}</Text>
                                    </View>
                                    <Text style={styles.trips}>{driver.trips} trips completed</Text>
                                </View>
                            </View>
                        </View>

                        <View style={[styles.driverFooter, isUrgent && styles.urgentFooter]}>
                            <View style={styles.priceContainer}>
                                {isUrgent ? (
                                    <View style={styles.urgentTag}>
                                        <Ionicons name="flash" size={10} color="#FFFFFF" />
                                        <Text style={styles.urgentTagText}>Urgent Priority</Text>
                                    </View>
                                ) : (
                                    <Text style={styles.priceLabel}>Estimated Price</Text>
                                )}
                                <Text style={[styles.price, { fontSize: 16 }]}>
                                    {isUrgent ? 'Premium Driver' : 'Standard Rate'}
                                </Text>
                            </View>
                            <Button
                                title="Select Truck"
                                onPress={() => handleSelectDriver(driver)}
                                variant={isUrgent ? 'warning' : 'primary'}
                                style={styles.selectButton}
                            />
                        </View>
                    </Card>
                ))}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: theme.spacing.base,
        paddingVertical: theme.spacing.md,
        backgroundColor: surface,
        ...theme.shadows.light,
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        ...theme.typography.h3,
        color: text,
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
    resultsText: {
        ...theme.typography.caption,
        color: textSecondary,
        marginBottom: theme.spacing.base,
    },
    driverCard: {
        padding: 0,
        marginBottom: theme.spacing.md,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        backgroundColor: '#FFFFFF',
    },
    urgentDriverCard: {
        borderColor: warning,
        backgroundColor: '#FFFBEB',
    },
    driverHeader: {
        flexDirection: 'row',
        padding: theme.spacing.base,
    },
    driverAvatarContainer: {
        position: 'relative',
        marginRight: theme.spacing.md,
    },
    driverAvatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#F1F5F9',
        justifyContent: 'center',
        alignItems: 'center',
    },
    verifiedBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#10B981',
        borderRadius: 10,
        width: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#FFFFFF',
    },
    driverInfo: {
        flex: 1,
        justifyContent: 'center',
    },
    driverNameRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    driverName: {
        fontSize: 16,
        fontWeight: '700',
        color: text,
        fontFamily: 'PlusJakartaSans_700Bold',
    },
    truckType: {
        fontSize: 13,
        color: textSecondary,
        marginBottom: 8,
        fontFamily: 'Inter_500Medium',
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    ratingBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FEF3C7',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
        gap: 4,
    },
    rating: {
        fontSize: 12,
        fontWeight: '700',
        color: '#D97706',
    },
    trips: {
        fontSize: 12,
        color: textSecondary,
        fontFamily: 'Inter_500Medium',
    },
    driverFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: theme.spacing.base,
        backgroundColor: '#F8FAFC',
        borderTopWidth: 1,
        borderTopColor: '#E2E8F0',
    },
    urgentFooter: {
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        borderTopColor: 'rgba(245, 158, 11, 0.2)',
    },
    priceContainer: {
        flex: 1,
    },
    priceLabel: {
        fontSize: 11,
        color: textSecondary,
        marginBottom: 2,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        fontWeight: '600',
    },
    price: {
        fontSize: 18,
        fontWeight: '700',
        color: primary,
        fontFamily: 'PlusJakartaSans_700Bold',
    },
    selectButton: {
        paddingHorizontal: theme.spacing.xl,
        height: 44,
    },
    urgentTag: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: warning,
        alignSelf: 'flex-start',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        marginBottom: 6,
    },
    urgentTagText: {
        fontSize: 10,
        color: '#FFFFFF',
        fontWeight: '700',
        textTransform: 'uppercase',
    },
    // Bottom Sheet Styles
    bottomSheetContent: {
        flex: 1,
        paddingHorizontal: theme.spacing.base,
    },
    sheetHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: theme.spacing.lg,
    },
    sheetTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: text,
        fontFamily: 'PlusJakartaSans_700Bold',
    },
    driverSummary: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        padding: theme.spacing.base,
        borderRadius: theme.borderRadius.base,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        marginBottom: theme.spacing.lg,
    },
    summaryAvatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#F1F5F9',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: theme.spacing.md,
    },
    priceSummary: {
        backgroundColor: '#F8FAFC',
        borderRadius: theme.borderRadius.base,
        padding: theme.spacing.lg,
        marginBottom: theme.spacing.xl,
    },
    priceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: theme.spacing.sm,
    },
    priceRowLabel: {
        fontSize: 14,
        color: textSecondary,
        fontFamily: 'Inter_500Medium',
    },
    priceRowValue: {
        fontSize: 14,
        color: text,
        fontWeight: '600',
        fontFamily: 'Inter_600SemiBold',
    },
    surchargeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    totalRow: {
        marginTop: theme.spacing.sm,
        paddingTop: theme.spacing.md,
        borderTopWidth: 1,
        borderTopColor: '#E2E8F0',
        marginBottom: 0,
    },
    totalLabel: {
        fontSize: 16,
        fontWeight: '700',
        color: text,
    },
    totalValue: {
        fontSize: 20,
        fontWeight: '700',
        color: primary,
    },
});
