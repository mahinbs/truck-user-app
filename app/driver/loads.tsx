import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, RefreshControl } from 'react-native';
import { api } from '../../utils/api';
import { useAuth } from '../../contexts/AuthContext';
import {
    Dimensions,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { StatusPill } from '../../components/shared/StatusPill';
import { primary, surface, text, textSecondary } from '../../constants/Colors';
import { theme } from '../../constants/theme';

const { width } = Dimensions.get('window');

type TabType = 'available' | 'active' | 'completed';

type LoadRow = {
    id: string;
    route: string;
    status: string;
    distance: string;
    weight: string;
    earnings: string;
    pickupTime: string;
    isUrgent: boolean;
    offerId?: string;
    raw?: any;
};

export default function Loads() {
    const router = useRouter();
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState<TabType>('available');
    const [isUrgentEnabled, setIsUrgentEnabled] = useState(false);
    const [rows, setRows] = useState<LoadRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const load = useCallback(async () => {
        try {
            if (activeTab === 'available') {
                const offers = await api.driverLoads() as any[];
                setRows(offers.map((o) => ({
                    id: o.id,
                    offerId: o.id,
                    route: `${o.pickupAddress} → ${o.dropAddress}`,
                    status: 'pending',
                    distance: o.distanceKm != null ? `${o.distanceKm.toFixed(1)} km` : '—',
                    weight: `${Math.round(o.weightKg)} kg`,
                    earnings: `₹${Math.round(o.earnings).toLocaleString()}`,
                    pickupTime: o.expiresAt ? `Expires ${new Date(o.expiresAt).toLocaleTimeString()}` : '',
                    isUrgent: !!o.isUrgent,
                    raw: o,
                })));
            } else {
                const status = activeTab === 'active' ? 'en_route_drop' : 'delivered';
                const trips = await api.driverTrips(status) as any[];
                const list = activeTab === 'active'
                    ? trips.filter((t) => t.status !== 'delivered')
                    : trips.filter((t) => t.status === 'delivered');
                setRows(list.map((t) => ({
                    id: t.id,
                    route: `${t.pickupAddress || 'Pickup'} → ${t.dropAddress || 'Drop'}`,
                    status: t.status,
                    distance: '—',
                    weight: '—',
                    earnings: `₹${Math.round(t.earnings || 0).toLocaleString()}`,
                    pickupTime: t.startedAt ? new Date(t.startedAt).toLocaleString() : '',
                    isUrgent: false,
                    raw: t,
                })));
            }
        } catch (e) {
            console.warn('loads fetch failed', e);
            setRows([]);
        }
    }, [activeTab]);

    useEffect(() => {
        (async () => {
            setLoading(true);
            await load();
            setLoading(false);
        })();
    }, [load]);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await load();
        setRefreshing(false);
    }, [load]);

    const filteredLoads = rows.filter((l) => {
        if (activeTab === 'available') {
            return isUrgentEnabled ? true : !l.isUrgent;
        }
        return true;
    });

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
                        <Ionicons name="arrow-back" size={24} color={text} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>My Loads</Text>
                    <View style={styles.headerActions}>
                        <View style={styles.urgentToggleContainer}>
                            <Ionicons name="flash" size={16} color={isUrgentEnabled ? '#F59E0B' : textSecondary} />
                            <Switch
                                value={isUrgentEnabled}
                                onValueChange={setIsUrgentEnabled}
                                trackColor={{ false: '#cbd5e1', true: '#F59E0B' }}
                                thumbColor={'#fff'}
                                style={{ transform: [{ scale: 0.8 }] }}
                            />
                        </View>
                        <TouchableOpacity style={styles.iconButton}>
                            <Ionicons name="filter" size={24} color={primary} />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Tabs */}
                <View style={styles.tabsContainer}>
                    {(['available', 'active', 'completed'] as TabType[]).map((tab) => (
                        <TouchableOpacity
                            key={tab}
                            style={[
                                styles.tab,
                                activeTab === tab && styles.tabActive
                            ]}
                            onPress={() => setActiveTab(tab)}
                        >
                            <Text style={[
                                styles.tabText,
                                activeTab === tab && styles.tabTextActive
                            ]}>
                                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                            </Text>
                            {activeTab === tab && (
                                <View style={styles.activeIndicator} />
                            )}
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Load List */}
                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.content}
                    showsVerticalScrollIndicator={false}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                >
                    {loading ? (
                        <ActivityIndicator size="large" color={primary} style={{ marginTop: 48 }} />
                    ) : filteredLoads.length > 0 ? (
                        filteredLoads.map((load) => (
                            <TouchableOpacity
                                key={load.id}
                                activeOpacity={0.9}
                                onPress={() => {
                                    if (activeTab === 'active') {
                                        router.push('/driver/active-trip' as any);
                                        return;
                                    }
                                    if (!load.raw || activeTab !== 'available') return;
                                    const o = load.raw;
                                    router.push({
                                        pathname: '/driver/load-details',
                                        params: {
                                            offerId: o.id,
                                            pickupAddress: o.pickupAddress,
                                            dropAddress: o.dropAddress,
                                            earnings: String(o.earnings),
                                            weightKg: String(o.weightKg),
                                            truckType: o.truckType,
                                            distanceKm: o.distanceKm != null ? String(o.distanceKm) : '',
                                            isUrgent: o.isUrgent ? '1' : '0',
                                        },
                                    } as any);
                                }}
                                style={styles.loadCardWrapper}
                            >
                                <LinearGradient
                                    colors={['rgba(59, 130, 246, 0.08)', 'rgba(96, 165, 250, 0.04)']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                    style={styles.loadCard}
                                >
                                    <View style={styles.cardHeader}>
                                        <View style={styles.routeContainer}>
                                            <Text style={styles.loadRoute}>{load.route}</Text>
                                            {load.isUrgent && (
                                                <View style={styles.urgentBadge}>
                                                    <Ionicons name="flash" size={10} color="#fff" />
                                                    <Text style={styles.urgentBadgeText}>URGENT</Text>
                                                </View>
                                            )}
                                        </View>
                                        <StatusPill status={load.status as any} />
                                    </View>

                                    <View style={styles.cardBody}>
                                        <View style={styles.infoRow}>
                                            <View style={styles.infoItem}>
                                                <View style={styles.iconBox}>
                                                    <Ionicons name="navigate-outline" size={18} color={primary} />
                                                </View>
                                                <Text style={styles.infoText}>{load.distance}</Text>
                                            </View>
                                            <View style={styles.infoItem}>
                                                <View style={[styles.iconBox, { backgroundColor: '#FFF7ED' }]}>
                                                    <Ionicons name="cube-outline" size={18} color="#F59E0B" />
                                                </View>
                                                <Text style={styles.infoText}>{load.weight}</Text>
                                            </View>
                                            <View style={styles.infoItem}>
                                                <View style={[styles.iconBox, { backgroundColor: '#ECFDF5' }]}>
                                                    <Ionicons name="time-outline" size={18} color="#10B981" />
                                                </View>
                                                <Text style={styles.infoText}>{load.pickupTime}</Text>
                                            </View>
                                        </View>
                                    </View>

                                    <View style={styles.cardFooter}>
                                        <Text style={styles.priceText}>{load.earnings}</Text>
                                        <TouchableOpacity
                                            style={styles.actionButton}
                                            onPress={() => {
                                                if (activeTab === 'active') {
                                                    router.push('/driver/active-trip' as any);
                                                }
                                            }}
                                        >
                                            <Text style={styles.actionButtonText}>View Details</Text>
                                            <Ionicons name="arrow-forward" size={16} color={primary} />
                                        </TouchableOpacity>
                                    </View>
                                </LinearGradient>
                            </TouchableOpacity>
                        ))
                    ) : (
                        <View style={styles.emptyState}>
                            <LinearGradient
                                colors={['rgba(255, 255, 255, 0.8)', 'rgba(255, 255, 255, 0.4)']}
                                style={styles.emptyStateIcon}
                            >
                                <Ionicons name="cube-outline" size={48} color={textSecondary} />
                            </LinearGradient>
                            <Text style={styles.emptyStateText}>No {activeTab} loads found</Text>
                        </View>
                    )}
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
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
        fontSize: 20,
        fontFamily: 'PlusJakartaSans_700Bold',
        color: text,
    },
    headerActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.sm,
    },
    urgentToggleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 8,
        borderRadius: 12,
        height: 44,
        ...theme.shadows.light,
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
    tabsContainer: {
        flexDirection: 'row',
        paddingHorizontal: theme.spacing.lg,
        marginBottom: theme.spacing.md,
        gap: theme.spacing.md,
    },
    tab: {
        paddingVertical: theme.spacing.sm,
        paddingHorizontal: theme.spacing.sm,
        alignItems: 'center',
        position: 'relative',
    },
    tabActive: {
        // Active styling handled by indicator
    },
    tabText: {
        fontSize: 15,
        fontFamily: 'PlusJakartaSans_500Medium',
        color: textSecondary,
    },
    tabTextActive: {
        fontFamily: 'PlusJakartaSans_700Bold',
        color: primary,
    },
    activeIndicator: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        height: 3,
        backgroundColor: primary,
        borderRadius: 2,
    },
    scrollView: {
        flex: 1,
    },
    content: {
        padding: theme.spacing.lg,
        paddingBottom: 110,
    },
    loadCardWrapper: {
        marginBottom: theme.spacing.lg,
    },
    loadCard: {
        padding: theme.spacing.md,
        borderRadius: 20,
        elevation: 5,
        shadowColor: 'rgba(59, 130, 246, 0.2)',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.12,
        shadowRadius: 10,
        borderWidth: 1,
        borderColor: 'rgba(59, 130, 246, 0.15)',
        backgroundColor: surface,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing.md,
    },
    routeContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.xs,
        marginRight: theme.spacing.sm,
    },
    loadRoute: {
        fontSize: 18,
        fontFamily: 'PlusJakartaSans_700Bold',
        color: text,
    },
    urgentBadge: {
        backgroundColor: '#F59E0B',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 6,
        gap: 2,
    },
    urgentBadgeText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: '800',
        fontFamily: 'PlusJakartaSans_800ExtraBold',
    },
    cardBody: {
        paddingBottom: theme.spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(226, 232, 240, 0.5)',
        marginBottom: theme.spacing.md,
    },
    infoRow: {
        flexDirection: 'row',
        gap: theme.spacing.sm,
        flexWrap: 'wrap',
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.xs,
        flex: 1,
    },
    iconBox: {
        width: 32,
        height: 32,
        borderRadius: 10,
        backgroundColor: '#EFF6FF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    infoText: {
        fontSize: 12,
        fontFamily: 'PlusJakartaSans_500Medium',
        color: textSecondary,
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    priceText: {
        fontSize: 22,
        fontFamily: 'PlusJakartaSans_800ExtraBold',
        color: primary,
        fontWeight: '800',
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 12,
    },
    actionButtonText: {
        fontSize: 13,
        fontFamily: 'PlusJakartaSans_600SemiBold',
        color: primary,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: theme.spacing.xxxl,
    },
    emptyStateIcon: {
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: theme.spacing.lg,
    },
    emptyStateText: {
        fontSize: 16,
        fontFamily: 'PlusJakartaSans_500Medium',
        color: textSecondary,
    },
});
