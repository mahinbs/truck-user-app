import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Animated,
    Dimensions,
    FlatList,
    RefreshControl,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { api, ApiError } from '../../utils/api';
import {
    border,
    primary,
    surface,
    text,
    textSecondary,
} from '../../constants/Colors';
import { theme } from '../../constants/theme';

type Opportunity = {
    id: string;
    pickupAddress: string;
    dropAddress: string;
    weightKg: number;
    truckType: string;
    priceTotal: number;
    brokerCommission: number;
    isUrgent: boolean;
    createdAt: string;
};

export default function LoadBoard() {
    const router = useRouter();
    const [filter, setFilter] = useState<'all' | 'high' | 'urgent' | 'near'>('all');
    const [opps, setOpps] = useState<Opportunity[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [busyId, setBusyId] = useState<string | null>(null);
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(20)).current;

    const load = useCallback(async () => {
        try {
            const list = await api.brokerOpportunities() as Opportunity[];
            setOpps(list);
        } catch (e) { console.warn('opps load failed', e); }
    }, []);

    useEffect(() => {
        (async () => { setLoading(true); await load(); setLoading(false); })();
        Animated.parallel([
            Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
            Animated.timing(slideAnim, { toValue: 0, duration: 600, useNativeDriver: true }),
        ]).start();
    }, [filter, load]);

    const onRefresh = useCallback(async () => {
        setRefreshing(true); await load(); setRefreshing(false);
    }, [load]);

    const handleAssign = async (item: Opportunity) => {
        // Two-step: accept the opportunity (claim it as broker), then go pick a driver.
        setBusyId(item.id);
        try {
            await api.brokerAcceptOpportunity(item.id);
            router.push({
                pathname: '/broker/assign-trip' as any,
                params: {
                    shipmentId: item.id,
                    route: `${item.pickupAddress} → ${item.dropAddress}`,
                    price: String(item.priceTotal),
                    commission: String(item.brokerCommission),
                    truckRequired: item.truckType,
                },
            });
        } catch (e: any) {
            const msg = e instanceof ApiError ? e.message : (e?.message || 'unknown');
            if (/verification/i.test(msg)) {
                Alert.alert('Complete verification first', 'Submit your docs to accept opportunities.',
                    [{ text: 'Submit documents', onPress: () => router.push('/(onboarding)/verification' as any) },
                     { text: 'Later', style: 'cancel' }]);
            } else {
                Alert.alert('Failed', msg);
            }
        } finally {
            setBusyId(null);
        }
    };

    const getFilteredLoads = () => {
        if (filter === 'all') return opps;
        if (filter === 'high') return opps.filter(o => o.brokerCommission >= 500);
        // "Near Me" / urgent tab: show urgent opportunities (no geo radius from API yet)
        return opps.filter(o => o.isUrgent);
    };

    const renderLoadItem = ({ item }: { item: Opportunity }) => (
        <View style={styles.loadCard}>
            <LinearGradient
                colors={['rgba(255,255,255,0.95)', 'rgba(255,255,255,0.85)']}
                style={styles.cardGradient}
            >
                <View style={styles.cardHeader}>
                    <View style={styles.routeContainer}>
                        <Text style={styles.routeText} numberOfLines={1}>
                            {item.pickupAddress} → {item.dropAddress}
                        </Text>
                        <Text style={styles.shipperText}>Weight: {Math.round(item.weightKg)} kg</Text>
                    </View>
                    {item.isUrgent && (
                        <View style={[styles.idContainer, { backgroundColor: '#FEF3C7' }]}>
                            <Text style={[styles.idText, { color: '#92400E' }]}>URGENT</Text>
                        </View>
                    )}
                </View>

                <View style={styles.loadDetails}>
                    <View style={styles.detailRow}>
                        <View style={styles.detailItem}>
                            <Ionicons name="bus-outline" size={16} color="#10B981" />
                            <Text style={styles.detailText}>{item.truckType}</Text>
                        </View>
                        <View style={styles.detailItem}>
                            <Ionicons name="calendar-outline" size={16} color="#F59E0B" />
                            <Text style={styles.detailText}>
                                {new Date(item.createdAt).toLocaleDateString()}
                            </Text>
                        </View>
                    </View>
                </View>

                <View style={styles.cardDivider} />

                <View style={styles.cardFooter}>
                    <View style={styles.priceContainer}>
                        <Text style={styles.priceLabel}>Trip Value</Text>
                        <Text style={styles.priceValue}>₹{Math.round(item.priceTotal).toLocaleString()}</Text>
                    </View>
                    <View style={styles.priceContainer}>
                        <Text style={styles.commissionLabel}>Your commission</Text>
                        <Text style={styles.commissionValue}>₹{Math.round(item.brokerCommission).toLocaleString()}</Text>
                    </View>
                    <TouchableOpacity
                        style={[styles.assignBtn, busyId === item.id && { opacity: 0.5 }]}
                        onPress={() => handleAssign(item)}
                        disabled={busyId === item.id}
                    >
                        <Text style={styles.assignBtnText}>{busyId === item.id ? 'Working…' : 'Accept'}</Text>
                        <Ionicons name="arrow-forward" size={14} color="#FFFFFF" />
                    </TouchableOpacity>
                </View>
            </LinearGradient>
        </View>
    );

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={theme.gradients.background as any}
                style={StyleSheet.absoluteFillObject}
            />

            <SafeAreaView style={styles.safeArea}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Available Loads</Text>
                </View>

                {/* Filter Tabs */}
                <View style={styles.filterTabs}>
                    <TouchableOpacity
                        style={[styles.filterTab, filter === 'all' && styles.filterTabActive]}
                        onPress={() => setFilter('all')}
                    >
                        <Text style={[styles.filterTabText, filter === 'all' && styles.filterTabTextActive]}>
                            All Loads
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.filterTab, filter === 'high' && styles.filterTabActive]}
                        onPress={() => setFilter('high')}
                    >
                        <Text style={[styles.filterTabText, filter === 'high' && styles.filterTabTextActive]}>
                            High Yield
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.filterTab, filter === 'near' && styles.filterTabActive]}
                        onPress={() => setFilter('near')}
                    >
                        <Text style={[styles.filterTabText, filter === 'near' && styles.filterTabTextActive]}>
                            Urgent
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Loads List */}
                <Animated.View style={[styles.listContainer, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
                    <FlatList
                        data={getFilteredLoads()}
                        keyExtractor={item => item.id}
                        renderItem={renderLoadItem}
                        contentContainerStyle={styles.listContent}
                        showsVerticalScrollIndicator={false}
                        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                        ListEmptyComponent={loading ? (
                            <ActivityIndicator color={primary} style={{ marginTop: 64 }} />
                        ) : (
                            <Text style={{ color: textSecondary, textAlign: 'center', marginTop: 48 }}>
                                No load opportunities right now. Pull to refresh.
                            </Text>
                        )}
                    />
                </Animated.View>
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
        paddingHorizontal: theme.spacing.lg,
        paddingVertical: theme.spacing.md,
    },
    headerTitle: {
        fontSize: 22,
        fontFamily: 'PlusJakartaSans_700Bold',
        color: text,
    },
    filterTabs: {
        flexDirection: 'row',
        paddingHorizontal: theme.spacing.lg,
        gap: theme.spacing.sm,
        marginBottom: theme.spacing.md,
    },
    filterTab: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        borderRadius: 12,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        ...theme.shadows.light,
    },
    filterTabActive: {
        backgroundColor: primary,
        borderColor: primary,
    },
    filterTabText: {
        fontSize: 12,
        fontWeight: '700',
        color: textSecondary,
        fontFamily: 'PlusJakartaSans_700Bold',
    },
    filterTabTextActive: {
        color: '#FFFFFF',
    },
    listContainer: {
        flex: 1,
    },
    listContent: {
        paddingHorizontal: theme.spacing.lg,
        paddingBottom: 120,
    },
    loadCard: {
        marginBottom: theme.spacing.md,
        borderRadius: 20,
        backgroundColor: surface,
        ...theme.shadows.medium,
        borderWidth: 1,
        borderColor: border,
        overflow: 'hidden',
    },
    cardGradient: {
        padding: theme.spacing.md,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: theme.spacing.sm,
    },
    routeContainer: {
        flex: 1,
        marginRight: theme.spacing.sm,
    },
    routeText: {
        fontSize: 16,
        fontWeight: '700',
        color: text,
        fontFamily: 'PlusJakartaSans_700Bold',
        marginBottom: 2,
    },
    shipperText: {
        fontSize: 12,
        color: textSecondary,
        fontFamily: 'PlusJakartaSans_500Medium',
    },
    idContainer: {
        backgroundColor: '#F1F5F9',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    idText: {
        fontSize: 11,
        fontWeight: '700',
        color: '#475569',
        fontFamily: 'PlusJakartaSans_700Bold',
    },
    loadDetails: {
        backgroundColor: '#F8FAFC',
        borderRadius: 12,
        padding: theme.spacing.sm,
        marginBottom: theme.spacing.md,
    },
    detailRow: {
        flexDirection: 'row',
        gap: theme.spacing.md,
    },
    detailItem: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    detailText: {
        fontSize: 12,
        color: textSecondary,
        fontFamily: 'PlusJakartaSans_500Medium',
    },
    cardDivider: {
        height: 1,
        backgroundColor: 'rgba(226, 232, 240, 0.5)',
        marginBottom: theme.spacing.sm,
    },
    cardFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    priceContainer: {
        flex: 1,
    },
    priceLabel: {
        fontSize: 10,
        color: textSecondary,
        marginBottom: 2,
    },
    priceValue: {
        fontSize: 15,
        fontWeight: '800',
        color: text,
        fontFamily: 'PlusJakartaSans_800ExtraBold',
    },
    commissionLabel: {
        fontSize: 10,
        color: textSecondary,
        marginBottom: 2,
    },
    commissionValue: {
        fontSize: 15,
        fontWeight: '800',
        color: primary,
        fontFamily: 'PlusJakartaSans_800ExtraBold',
    },
    assignBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: primary,
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 10,
        ...theme.shadows.glow,
    },
    assignBtnText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '700',
        fontFamily: 'PlusJakartaSans_700Bold',
    },
});
