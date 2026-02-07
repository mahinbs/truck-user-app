import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { BottomSheet } from '../../components/shared/BottomSheet';
import { Button } from '../../components/shared/Button';
import { Card } from '../../components/shared/Card';
import { background, primary, surface, text, textSecondary } from '../../constants/Colors';
import { theme } from '../../constants/theme';

const mockDrivers = [
    {
        id: '1',
        name: 'Rajesh Kumar',
        truckType: 'Container Truck',
        rating: 4.8,
        trips: 245,
        price: '₹24,500',
    },
    {
        id: '2',
        name: 'Amit Singh',
        truckType: 'Container Truck',
        rating: 4.9,
        trips: 312,
        price: '₹23,800',
    },
    {
        id: '3',
        name: 'Suresh Patel',
        truckType: 'Container Truck',
        rating: 4.7,
        trips: 189,
        price: '₹25,200',
    },
];

export default function AvailableTrucks() {
    const router = useRouter();
    const [selectedDriver, setSelectedDriver] = useState<any>(null);
    const [bottomSheetVisible, setBottomSheetVisible] = useState(false);

    const handleSelectDriver = (driver: any) => {
        setSelectedDriver(driver);
        setBottomSheetVisible(true);
    };

    const handleConfirmSelection = () => {
        setBottomSheetVisible(false);
        router.push('/(business)/booking-confirmation');
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Available Trucks</Text>
                <View style={styles.placeholder} />
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                <Text style={styles.resultsText}>
                    {mockDrivers.length} trucks available for your route
                </Text>

                {mockDrivers.map((driver) => (
                    <Card key={driver.id} style={styles.driverCard}>
                        <View style={styles.driverHeader}>
                            <View style={styles.driverAvatar}>
                                <Ionicons name="person" size={32} color={primary} />
                            </View>
                            <View style={styles.driverInfo}>
                                <Text style={styles.driverName}>{driver.name}</Text>
                                <Text style={styles.truckType}>{driver.truckType}</Text>
                                <View style={styles.ratingContainer}>
                                    <Ionicons name="star" size={14} color="#F59E0B" />
                                    <Text style={styles.rating}>{driver.rating}</Text>
                                    <Text style={styles.trips}>• {driver.trips} trips</Text>
                                </View>
                            </View>
                        </View>

                        <View style={styles.driverFooter}>
                            <View>
                                <Text style={styles.priceLabel}>Estimated Price</Text>
                                <Text style={styles.price}>{driver.price}</Text>
                            </View>
                            <Button
                                title="Select"
                                onPress={() => handleSelectDriver(driver)}
                                variant="primary"
                                style={styles.selectButton}
                            />
                        </View>
                    </Card>
                ))}
            </ScrollView>

            <BottomSheet
                visible={bottomSheetVisible}
                onClose={() => setBottomSheetVisible(false)}
                height={400}
            >
                {selectedDriver && (
                    <View style={styles.bottomSheetContent}>
                        <Text style={styles.sheetTitle}>Confirm Selection</Text>

                        <View style={styles.driverSummary}>
                            <View style={styles.driverAvatar}>
                                <Ionicons name="person" size={32} color={primary} />
                            </View>
                            <View>
                                <Text style={styles.driverName}>{selectedDriver.name}</Text>
                                <Text style={styles.truckType}>{selectedDriver.truckType}</Text>
                            </View>
                        </View>

                        <View style={styles.priceSummary}>
                            <View style={styles.priceRow}>
                                <Text style={styles.priceRowLabel}>Base Fare</Text>
                                <Text style={styles.priceRowValue}>₹22,000</Text>
                            </View>
                            <View style={styles.priceRow}>
                                <Text style={styles.priceRowLabel}>Distance Charge</Text>
                                <Text style={styles.priceRowValue}>₹2,000</Text>
                            </View>
                            <View style={styles.priceRow}>
                                <Text style={styles.priceRowLabel}>GST (18%)</Text>
                                <Text style={styles.priceRowValue}>₹500</Text>
                            </View>
                            <View style={[styles.priceRow, styles.totalRow]}>
                                <Text style={styles.totalLabel}>Total</Text>
                                <Text style={styles.totalValue}>{selectedDriver.price}</Text>
                            </View>
                        </View>

                        <Button
                            title="Proceed to Booking"
                            onPress={handleConfirmSelection}
                            fullWidth
                        />
                    </View>
                )}
            </BottomSheet>
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
        padding: theme.spacing.base,
        marginBottom: theme.spacing.md,
    },
    driverHeader: {
        flexDirection: 'row',
        marginBottom: theme.spacing.md,
    },
    driverAvatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#EFF6FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: theme.spacing.md,
    },
    driverInfo: {
        flex: 1,
    },
    driverName: {
        ...theme.typography.h3,
        color: text,
        marginBottom: 2,
    },
    truckType: {
        ...theme.typography.caption,
        color: textSecondary,
        marginBottom: theme.spacing.xs,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    rating: {
        ...theme.typography.caption,
        color: text,
        fontWeight: '600',
    },
    trips: {
        ...theme.typography.caption,
        color: textSecondary,
    },
    driverFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: theme.spacing.md,
        borderTopWidth: 1,
        borderTopColor: '#E2E8F0',
    },
    priceLabel: {
        ...theme.typography.caption,
        color: textSecondary,
        marginBottom: 2,
    },
    price: {
        ...theme.typography.h3,
        color: primary,
    },
    selectButton: {
        paddingHorizontal: theme.spacing.lg,
    },
    bottomSheetContent: {
        flex: 1,
    },
    sheetTitle: {
        ...theme.typography.h2,
        color: text,
        marginBottom: theme.spacing.lg,
    },
    driverSummary: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: theme.spacing.lg,
    },
    priceSummary: {
        backgroundColor: '#F8FAFC',
        borderRadius: theme.borderRadius.base,
        padding: theme.spacing.base,
        marginBottom: theme.spacing.lg,
    },
    priceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: theme.spacing.sm,
    },
    priceRowLabel: {
        ...theme.typography.body,
        color: textSecondary,
    },
    priceRowValue: {
        ...theme.typography.bodyMedium,
        color: text,
    },
    totalRow: {
        paddingTop: theme.spacing.sm,
        borderTopWidth: 1,
        borderTopColor: '#E2E8F0',
        marginBottom: 0,
    },
    totalLabel: {
        ...theme.typography.h3,
        color: text,
    },
    totalValue: {
        ...theme.typography.h3,
        color: primary,
    },
});
