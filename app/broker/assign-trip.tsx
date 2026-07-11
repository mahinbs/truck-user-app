import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { api, ApiError } from '../../utils/api';
import {
    Alert,
    Dimensions,
    FlatList,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { Button } from '../../components/shared/Button';
import { Colors } from '../../constants/Colors';
import { theme } from '../../constants/theme';

const { width } = Dimensions.get('window');

type ManagedDriver = {
    id: string;
    name: string;
    phone?: string | null;
    truckType?: string | null;
    truckNumber?: string | null;
    ratingAvg: number;
    tripsCount: number;
    status: string;
};

export default function AssignTrip() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const shipmentId = String(params.shipmentId || '');
    const [selectedDriverId, setSelectedDriverId] = useState<string | null>(null);
    const [drivers, setDrivers] = useState<ManagedDriver[]>([]);
    const [loading, setLoading] = useState(false);

    const ONLINE_DRIVERS = drivers; // alias to match existing JSX below

    const loadDrivers = useCallback(async () => {
        try {
            // Only drivers that are not currently busy are eligible
            const all = await api.brokerMyDrivers() as ManagedDriver[];
            setDrivers(all.filter(d => d.status !== 'busy'));
        } catch (e) { console.warn('drivers fetch failed', e); }
    }, []);

    useEffect(() => { loadDrivers(); }, [loadDrivers]);

    const handleAssign = async () => {
        if (!selectedDriverId) {
            Alert.alert('No Driver Selected', 'Please select a driver to assign this load.');
            return;
        }
        if (!shipmentId) {
            Alert.alert('Missing shipmentId', 'Open this screen from the loads board.');
            return;
        }
        const driver = drivers.find(d => d.id === selectedDriverId);
        setLoading(true);
        try {
            await api.brokerAssignDriver(shipmentId, selectedDriverId);
            Alert.alert(
                'Trip Assigned',
                `${driver?.name} is now on the trip. Track from Active Trips.`,
                [{ text: 'Go to Dashboard', onPress: () => router.replace('/broker/home' as any) }],
            );
        } catch (e: any) {
            Alert.alert('Failed', e instanceof ApiError ? e.message : (e?.message || 'unknown'));
        } finally {
            setLoading(false);
        }
    };

    const renderDriverItem = ({ item }: { item: ManagedDriver }) => {
        const isSelected = selectedDriverId === item.id;
        return (
            <TouchableOpacity
                activeOpacity={0.9}
                style={[
                    styles.driverCard,
                    isSelected && styles.driverCardSelected
                ]}
                onPress={() => setSelectedDriverId(item.id)}
            >
                <View style={styles.driverInfo}>
                    <View style={styles.driverLeft}>
                        <View style={[styles.avatar, isSelected && styles.avatarSelected]}>
                            <Text style={[styles.avatarText, isSelected && styles.avatarTextSelected]}>
                                {item.name.charAt(0)}
                            </Text>
                        </View>
                        <View>
                            <Text style={styles.driverName}>{item.name}</Text>
                            <Text style={styles.vehicleText}>
                                {item.truckType || '—'} • {item.truckNumber || '—'}
                            </Text>
                        </View>
                    </View>
                    <View style={[styles.radioCircle, isSelected && styles.radioActive]}>
                        {isSelected && <View style={styles.radioInner} />}
                    </View>
                </View>

                <View style={styles.driverStats}>
                    <View style={styles.stat}>
                        <Ionicons name="star" size={14} color="#F59E0B" />
                        <Text style={styles.statText}>{(item.ratingAvg || 0).toFixed(1)} Rating</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.stat}>
                        <Ionicons name="car" size={14} color={Colors.light.primary} />
                        <Text style={styles.statText}>{item.tripsCount} Trips Completed</Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

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
                    <Text style={styles.headerTitle}>Assign Trip</Text>
                    <View style={styles.placeholder} />
                </View>

                <FlatList
                    ListHeaderComponent={
                        <View style={styles.headerContainer}>
                            {/* Load Summary Card */}
                            <View style={styles.loadSummaryCard}>
                                <View style={styles.loadHeader}>
                                    <Text style={styles.loadIdText}>ID: {String(params.shipmentId || '')}</Text>
                                    <Text style={styles.shipperName}>Truck: {String(params.truckRequired || '')}</Text>
                                </View>
                                <Text style={styles.routeText}>{String(params.route || '')}</Text>
                                <View style={styles.loadStats}>
                                    <Text style={styles.loadStatText}>Truck Required: {String(params.truckRequired || '')}</Text>
                                </View>
                                <View style={styles.cardDivider} />
                                <View style={styles.pricingRow}>
                                    <View>
                                        <Text style={styles.pricingLabel}>Trip Value</Text>
                                        <Text style={styles.pricingValue}>₹{Number(params.price || 0).toLocaleString()}</Text>
                                    </View>
                                    <View>
                                        <Text style={styles.pricingLabel}>Your Commission (3%)</Text>
                                        <Text style={[styles.pricingValue, { color: Colors.light.primary }]}>₹{Number(params.commission || 0).toLocaleString()}</Text>
                                    </View>
                                </View>
                            </View>

                            <Text style={styles.sectionTitle}>Select Available Driver</Text>
                        </View>
                    }
                    data={ONLINE_DRIVERS}
                    keyExtractor={item => item.id}
                    renderItem={renderDriverItem}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    ListFooterComponent={
                        <View style={styles.footerContainer}>
                            <Button
                                title="Confirm Assignment"
                                onPress={handleAssign}
                                variant="gradient"
                                fullWidth
                                loading={loading}
                                disabled={!selectedDriverId}
                                style={styles.submitBtn}
                            />
                        </View>
                    }
                />
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
    placeholder: {
        width: 44,
    },
    headerContainer: {
        paddingHorizontal: theme.spacing.lg,
        marginTop: theme.spacing.sm,
    },
    listContent: {
        paddingBottom: 40,
    },
    loadSummaryCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        padding: theme.spacing.lg,
        marginBottom: theme.spacing.md,
        ...theme.shadows.medium,
    },
    loadHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    loadIdText: {
        fontSize: 12,
        fontWeight: '700',
        color: Colors.light.textSecondary,
    },
    shipperName: {
        fontSize: 13,
        fontWeight: '600',
        color: Colors.light.primary,
        fontFamily: 'PlusJakartaSans_600SemiBold',
    },
    routeText: {
        fontSize: 20,
        fontWeight: '800',
        color: Colors.light.text,
        fontFamily: 'PlusJakartaSans_800ExtraBold',
        marginBottom: theme.spacing.md,
    },
    loadStats: {
        gap: 4,
        marginBottom: theme.spacing.md,
    },
    loadStatText: {
        fontSize: 13,
        color: Colors.light.textSecondary,
        fontFamily: 'PlusJakartaSans_500Medium',
    },
    cardDivider: {
        height: 1,
        backgroundColor: '#F1F5F9',
        marginBottom: theme.spacing.md,
    },
    pricingRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    pricingLabel: {
        fontSize: 10,
        color: Colors.light.textSecondary,
        marginBottom: 2,
    },
    pricingValue: {
        fontSize: 16,
        fontWeight: '800',
        color: Colors.light.text,
        fontFamily: 'PlusJakartaSans_800ExtraBold',
    },
    simulationCard: {
        backgroundColor: '#FFFBEB',
        borderColor: '#FDE68A',
        borderWidth: 1,
        borderRadius: 16,
        padding: theme.spacing.md,
        marginBottom: theme.spacing.lg,
    },
    simulationHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#FDE047',
        paddingBottom: 6,
        marginBottom: 8,
    },
    simulationTitle: {
        fontSize: 13,
        fontWeight: '700',
        color: '#D97706',
    },
    toggleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    toggleText: {
        fontSize: 13,
        color: '#78350F',
        fontWeight: '600',
    },
    checkbox: {
        width: 22,
        height: 22,
        borderRadius: 6,
        borderWidth: 2,
        borderColor: '#D97706',
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkboxActive: {
        backgroundColor: '#D97706',
    },
    sectionTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: Colors.light.text,
        fontFamily: 'PlusJakartaSans_700Bold',
        marginBottom: theme.spacing.md,
    },
    driverCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: theme.spacing.md,
        marginHorizontal: theme.spacing.lg,
        marginBottom: theme.spacing.sm,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        ...theme.shadows.light,
    },
    driverCardSelected: {
        borderColor: Colors.light.primary,
        borderWidth: 2,
        backgroundColor: '#F8FAFC',
    },
    driverInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing.sm,
    },
    driverLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.md,
    },
    avatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#F1F5F9',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarSelected: {
        backgroundColor: Colors.light.primary,
    },
    avatarText: {
        fontSize: 16,
        fontWeight: '700',
        color: Colors.light.text,
    },
    avatarTextSelected: {
        color: '#FFFFFF',
    },
    driverName: {
        fontSize: 15,
        fontWeight: '700',
        color: Colors.light.text,
        fontFamily: 'PlusJakartaSans_700Bold',
        marginBottom: 2,
    },
    vehicleText: {
        fontSize: 11,
        color: Colors.light.textSecondary,
        fontFamily: 'PlusJakartaSans_500Medium',
    },
    radioCircle: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#CBD5E1',
        justifyContent: 'center',
        alignItems: 'center',
    },
    radioActive: {
        borderColor: Colors.light.primary,
    },
    radioInner: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: Colors.light.primary,
    },
    driverStats: {
        flexDirection: 'row',
        gap: theme.spacing.md,
        paddingTop: theme.spacing.sm,
        borderTopWidth: 1,
        borderTopColor: '#F1F5F9',
    },
    stat: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    statDivider: {
        width: 1,
        backgroundColor: '#F1F5F9',
    },
    statText: {
        fontSize: 11,
        color: Colors.light.textSecondary,
        fontFamily: 'PlusJakartaSans_500Medium',
    },
    footerContainer: {
        paddingHorizontal: theme.spacing.lg,
        marginTop: theme.spacing.lg,
    },
    submitBtn: {
        borderRadius: 16,
    },
});
