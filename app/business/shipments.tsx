import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    RefreshControl,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { ApiError } from '../../utils/api';
import { StatusPill } from '../../components/shared/StatusPill';
import { Colors } from '../../constants/Colors';
import { theme } from '../../constants/theme';
import { api } from '../../utils/api';

const { width } = Dimensions.get('window');

// Backend tab statuses → label. Backend uses "in-transit" for shipments that have a driver assigned.
type TabType = 'active' | 'completed' | 'cancelled';

// Backend statuses we treat as "active" in the UI tab:
//   active = waiting for driver
//   in-transit = driver assigned, trip in flight
const ACTIVE_BACKEND_STATUSES = ['active', 'in-transit'];

type Shipment = {
    id: string;
    pickupAddress: string;
    dropAddress: string;
    truckType: string;
    createdAt: string;
    price: number;
    status: string;
};

function formatDate(iso: string) {
    try {
        const d = new Date(iso);
        return d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
    } catch { return ''; }
}

export default function Shipments() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<TabType>('active');
    const [items, setItems] = useState<Shipment[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const load = useCallback(async () => {
        setError(null);
        try {
            const res = await api.listMyShipments(); // fetch all; filter client-side per tab
            setItems(res.items as any);
        } catch (e: any) {
            setError(e?.message || 'Failed to load shipments');
        }
    }, []);

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

    const visible = items.filter(s => {
        if (activeTab === 'active') return ACTIVE_BACKEND_STATUSES.includes(s.status);
        return s.status === activeTab;
    });

    const handleViewShipment = (id: string) => {
        router.push(`/business/tracking?id=${id}` as any);
    };

    const handleCancel = (id: string) => {
        Alert.alert('Cancel shipment?', 'Wallet will be refunded if eligible.', [
            { text: 'No', style: 'cancel' },
            {
                text: 'Cancel shipment',
                style: 'destructive',
                onPress: async () => {
                    try {
                        await api.cancelShipment(id);
                        await load();
                    } catch (e: any) {
                        Alert.alert('Failed', e instanceof ApiError ? e.message : (e?.message || 'unknown'));
                    }
                },
            },
        ]);
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
                    <Text style={styles.headerTitle}>My Shipments</Text>
                    <TouchableOpacity style={styles.iconButton}>
                        <Ionicons name="filter" size={24} color={Colors.light.primary} />
                    </TouchableOpacity>
                </View>

                {/* Tabs */}
                <View style={styles.tabsContainer}>
                    {(['active', 'completed', 'cancelled'] as TabType[]).map((tab) => (
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

                {/* Shipment List */}
                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.content}
                    showsVerticalScrollIndicator={false}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                >
                    {loading ? (
                        <ActivityIndicator size="large" color={Colors.light.primary} style={{ marginTop: 64 }} />
                    ) : error ? (
                        <Text style={{ color: '#EF4444', textAlign: 'center', marginTop: 32 }}>{error}</Text>
                    ) : visible.length === 0 ? (
                        <Text style={{ color: Colors.light.textSecondary, textAlign: 'center', marginTop: 48 }}>
                            No {activeTab} shipments yet.
                        </Text>
                    ) : visible.map((shipment) => (
                        <TouchableOpacity
                            key={shipment.id}
                            activeOpacity={0.9}
                            onPress={() => handleViewShipment(shipment.id)}
                            onLongPress={() => {
                                if (ACTIVE_BACKEND_STATUSES.includes(shipment.status)) {
                                    handleCancel(shipment.id);
                                }
                            }}
                            style={styles.shipmentCardWrapper}
                        >
                            <LinearGradient
                                colors={['rgba(59, 130, 246, 0.08)', 'rgba(96, 165, 250, 0.04)']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={styles.shipmentCard}
                            >
                                <View style={styles.cardHeader} >
                                    <View style={styles.routeContainer}>
                                        <Text style={styles.routeText} numberOfLines={1}>{shipment.pickupAddress}</Text>
                                        <Ionicons name="arrow-forward" size={16} color={Colors.light.textSecondary} style={{ marginHorizontal: 8 }} />
                                        <Text style={styles.routeText} numberOfLines={1}>{shipment.dropAddress}</Text>
                                    </View>
                                    <StatusPill status={shipment.status as any} />
                                </View>

                                <View style={styles.cardBody}>
                                    <View style={styles.infoRow}>
                                        <View style={styles.infoItem}>
                                            <View style={styles.iconBox}>
                                                <Ionicons name="cube-outline" size={18} color={Colors.light.primary} />
                                            </View>
                                            <Text style={styles.infoText}>{shipment.truckType}</Text>
                                        </View>
                                        <View style={styles.infoItem}>
                                            <View style={[styles.iconBox, { backgroundColor: '#FFF7ED' }]}>
                                                <Ionicons name="calendar-outline" size={18} color="#F59E0B" />
                                            </View>
                                            <Text style={styles.infoText}>{formatDate(shipment.createdAt)}</Text>
                                        </View>
                                    </View>
                                </View>

                                <View style={styles.cardFooter}>
                                    <Text style={styles.priceText}>₹{Math.round(shipment.price).toLocaleString()}</Text>
                                    <TouchableOpacity style={styles.actionButton} onPress={() => handleViewShipment(shipment.id)}>
                                        <Text style={styles.actionButtonText}>
                                            {activeTab === 'active' ? 'Track' : 'View Details'}
                                        </Text>
                                        <Ionicons name="arrow-forward" size={16} color={Colors.light.primary} />
                                    </TouchableOpacity>
                                </View>
                            </LinearGradient>
                        </TouchableOpacity>
                    ))}
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
        // Active state styling if needed
    },
    tabText: {
        fontSize: 15,
        fontFamily: 'PlusJakartaSans_500Medium',
        color: Colors.light.textSecondary,
    },
    tabTextActive: {
        fontFamily: 'PlusJakartaSans_700Bold',
        color: Colors.light.primary,
    },
    activeIndicator: {
        position: 'absolute',
        bottom: 0,
        width: '50%',
        height: 3,
        backgroundColor: Colors.light.primary,
        borderRadius: 2,
    },
    scrollView: {
        flex: 1,
    },
    content: {
        padding: theme.spacing.lg,
        paddingBottom: 110,
    },
    shipmentCardWrapper: {
        marginBottom: theme.spacing.lg,
    },
    shipmentCard: {
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.md,
        borderRadius: 20,
        elevation: 5,
        shadowColor: 'rgba(59, 130, 246, 0.2)',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.12,
        shadowRadius: 10,
        borderWidth: 1,
        borderColor: 'rgba(59, 130, 246, 0.15)',

    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing.md,
    },
    routeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        marginRight: theme.spacing.sm,
    },
    routeText: {
        fontSize: 16,
        fontFamily: 'PlusJakartaSans_700Bold',
        color: Colors.light.text,
        flexShrink: 1, // Prevent overflow
    },
    cardBody: {
        paddingBottom: theme.spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
    infoRow: {
        flexDirection: 'row',
        gap: theme.spacing.md,
        flexWrap: 'wrap', // Allow wrapping
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.xs,
        marginBottom: 4,
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
        fontSize: 14,
        fontFamily: 'PlusJakartaSans_500Medium',
        color: Colors.light.textSecondary,
        flexShrink: 1,
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    priceText: {
        fontSize: 18,
        fontFamily: 'PlusJakartaSans_700Bold',
        color: Colors.light.text,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: '#EFF6FF',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 12,
    },
    actionButtonText: {
        fontSize: 13,
        fontFamily: 'PlusJakartaSans_600SemiBold',
        color: Colors.light.primary,
    },
});
