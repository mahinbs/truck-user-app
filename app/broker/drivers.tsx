import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { api } from '../../utils/api';
import {
    Animated,
    Dimensions,
    FlatList,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { StatusPill } from '../../components/shared/StatusPill';
import {
    border,
    primary,
    surface,
    text,
    textSecondary,
} from '../../constants/Colors';
import { theme } from '../../constants/theme';

type ManagedDriver = {
    id: string;
    name: string;
    phone?: string | null;
    truckType?: string | null;
    truckNumber?: string | null;
    ratingAvg: number;
    tripsCount: number;
    status: 'active' | 'busy' | 'offline';
};

export default function DriverNetwork() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedFilter, setSelectedFilter] = useState<'all' | 'active' | 'offline' | 'busy'>('all');
    const [drivers, setDrivers] = useState<ManagedDriver[]>([]);
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(20)).current;

    const load = useCallback(async () => {
        try {
            const list = await api.brokerMyDrivers() as ManagedDriver[];
            setDrivers(list);
        } catch (e) { console.warn('drivers load failed', e); }
    }, []);

    useEffect(() => {
        load();
        Animated.parallel([
            Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
            Animated.timing(slideAnim, { toValue: 0, duration: 600, useNativeDriver: true }),
        ]).start();
    }, [selectedFilter, load]);

    const filteredDrivers = drivers.filter(driver => {
        const q = searchQuery.toLowerCase();
        const matchesSearch = !q ||
            driver.name.toLowerCase().includes(q) ||
            (driver.truckNumber || '').toLowerCase().includes(q) ||
            (driver.truckType || '').toLowerCase().includes(q);
        if (selectedFilter === 'all') return matchesSearch;
        return driver.status === selectedFilter && matchesSearch;
    });

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'active':
                return 'Online';
            case 'offline':
                return 'Offline';
            case 'busy':
                return 'Busy';
            default:
                return status;
        }
    };

    const getStatusBadgeColor = (status: string) => {
        switch (status) {
            case 'active':
                return '#10B981'; // Green
            case 'offline':
                return '#64748B'; // Gray
            case 'busy':
                return '#3B82F6'; // Blue
            default:
                return '#64748B';
        }
    };

    const renderDriverItem = ({ item }: { item: ManagedDriver }) => (
        <View style={styles.driverCard}>
            <LinearGradient
                colors={['rgba(255,255,255,0.95)', 'rgba(255,255,255,0.85)']}
                style={styles.cardGradient}
            >
                <View style={styles.cardHeader}>
                    <View style={styles.driverMeta}>
                        <Text style={styles.driverName}>{item.name}</Text>
                        <Text style={styles.vehicleInfo}>
                            {item.truckType || '—'} • {item.truckNumber || '—'}
                        </Text>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusBadgeColor(item.status) + '15' }]}>
                        <View style={[styles.statusDot, { backgroundColor: getStatusBadgeColor(item.status) }]} />
                        <Text style={[styles.statusText, { color: getStatusBadgeColor(item.status) }]}>
                            {getStatusLabel(item.status)}
                        </Text>
                    </View>
                </View>

                <View style={styles.cardDetails}>
                    <View style={styles.detailStat}>
                        <Ionicons name="star" size={16} color="#F59E0B" />
                        <Text style={styles.statValue}>{(item.ratingAvg || 0).toFixed(1)}</Text>
                        <Text style={styles.statLabel}>Rating</Text>
                    </View>
                    <View style={styles.detailDivider} />
                    <View style={styles.detailStat}>
                        <Ionicons name="navigate-outline" size={16} color={primary} />
                        <Text style={styles.statValue}>{item.tripsCount}</Text>
                        <Text style={styles.statLabel}>Trips</Text>
                    </View>
                </View>

                <View style={styles.cardFooter}>
                    <TouchableOpacity style={[styles.contactBtn, styles.callBtn]}>
                        <Ionicons name="call" size={16} color={primary} />
                        <Text style={styles.callBtnText}>Call</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.contactBtn, styles.chatBtn]}>
                        <Ionicons name="chatbubble" size={16} color="#475569" />
                        <Text style={styles.chatBtnText}>Chat</Text>
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
                    <Text style={styles.headerTitle}>Driver Network</Text>
                    <TouchableOpacity
                        style={styles.addButton}
                        onPress={() => router.push('/broker/add-driver' as any)}
                    >
                        <Ionicons name="person-add" size={20} color="#FFFFFF" />
                        <Text style={styles.addButtonText}>Add</Text>
                    </TouchableOpacity>
                </View>

                {/* Search Bar */}
                <View style={styles.searchContainer}>
                    <BlurView intensity={10} tint="light" style={styles.searchBlur}>
                        <Ionicons name="search" size={20} color={textSecondary} />
                        <TextInput
                            placeholder="Search by name, truck type, or number..."
                            placeholderTextColor={textSecondary}
                            style={styles.searchInput}
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                        {searchQuery.length > 0 && (
                            <TouchableOpacity onPress={() => setSearchQuery('')}>
                                <Ionicons name="close-circle" size={18} color={textSecondary} />
                            </TouchableOpacity>
                        )}
                    </BlurView>
                </View>

                {/* Filter Tabs */}
                <View style={styles.filterTabs}>
                    {(['all', 'active', 'busy', 'offline'] as const).map(filter => (
                        <TouchableOpacity
                            key={filter}
                            style={[
                                styles.filterTab,
                                selectedFilter === filter && styles.filterTabActive
                            ]}
                            onPress={() => setSelectedFilter(filter)}
                        >
                            <Text
                                style={[
                                    styles.filterTabText,
                                    selectedFilter === filter && styles.filterTabTextActive
                                ]}
                            >
                                {filter === 'active' ? 'Online' : filter.toUpperCase()}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Drivers List */}
                <Animated.View style={[styles.listContainer, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
                    <FlatList
                        data={filteredDrivers}
                        keyExtractor={item => item.id}
                        renderItem={renderDriverItem}
                        contentContainerStyle={styles.listContent}
                        showsVerticalScrollIndicator={false}
                        ListEmptyComponent={
                            <View style={styles.emptyContainer}>
                                <Ionicons name="people-outline" size={48} color={textSecondary} />
                                <Text style={styles.emptyTitle}>No Drivers Found</Text>
                                <Text style={styles.emptySubtitle}>Try searching for a different name or status filter.</Text>
                            </View>
                        }
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
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: theme.spacing.lg,
        paddingVertical: theme.spacing.md,
    },
    headerTitle: {
        fontSize: 22,
        fontFamily: 'PlusJakartaSans_700Bold',
        color: text,
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: primary,
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 12,
        ...theme.shadows.glow,
    },
    addButtonText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '700',
        fontFamily: 'PlusJakartaSans_700Bold',
    },
    searchContainer: {
        paddingHorizontal: theme.spacing.lg,
        marginBottom: theme.spacing.md,
    },
    searchBlur: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: theme.spacing.md,
        height: 50,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.4)',
        backgroundColor: 'rgba(255,255,255,0.6)',
        gap: 8,
        overflow: 'hidden',
    },
    searchInput: {
        flex: 1,
        fontSize: 14,
        fontFamily: 'PlusJakartaSans_500Medium',
        color: text,
    },
    filterTabs: {
        flexDirection: 'row',
        paddingHorizontal: theme.spacing.lg,
        gap: theme.spacing.xs,
        marginBottom: theme.spacing.md,
    },
    filterTab: {
        flex: 1,
        paddingVertical: 8,
        alignItems: 'center',
        borderRadius: 10,
        backgroundColor: '#F1F5F9',
    },
    filterTabActive: {
        backgroundColor: primary,
    },
    filterTabText: {
        fontSize: 11,
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
    driverCard: {
        marginBottom: theme.spacing.md,
        borderRadius: 20,
        backgroundColor: surface,
        ...theme.shadows.light,
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
        marginBottom: theme.spacing.md,
    },
    driverMeta: {
        flex: 1,
        marginRight: theme.spacing.sm,
    },
    driverName: {
        fontSize: 16,
        fontWeight: '700',
        color: text,
        fontFamily: 'PlusJakartaSans_700Bold',
        marginBottom: 2,
    },
    vehicleInfo: {
        fontSize: 12,
        color: textSecondary,
        fontFamily: 'PlusJakartaSans_500Medium',
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 100,
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    statusText: {
        fontSize: 11,
        fontWeight: '700',
        fontFamily: 'PlusJakartaSans_700Bold',
    },
    cardDetails: {
        flexDirection: 'row',
        backgroundColor: '#F8FAFC',
        borderRadius: 12,
        padding: theme.spacing.sm,
        marginBottom: theme.spacing.md,
        gap: theme.spacing.md,
    },
    detailStat: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    detailDivider: {
        width: 1,
        backgroundColor: '#E2E8F0',
    },
    statValue: {
        fontSize: 14,
        fontWeight: '700',
        color: text,
        fontFamily: 'PlusJakartaSans_700Bold',
    },
    statLabel: {
        fontSize: 11,
        color: textSecondary,
        fontFamily: 'PlusJakartaSans_500Medium',
    },
    cardFooter: {
        flexDirection: 'row',
        gap: theme.spacing.sm,
    },
    contactBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        height: 40,
        borderRadius: 10,
        borderWidth: 1,
    },
    callBtn: {
        borderColor: primary,
        backgroundColor: 'rgba(59, 130, 246, 0.05)',
    },
    callBtnText: {
        fontSize: 13,
        fontWeight: '700',
        color: primary,
        fontFamily: 'PlusJakartaSans_700Bold',
    },
    chatBtn: {
        borderColor: '#CBD5E1',
        backgroundColor: 'transparent',
    },
    chatBtnText: {
        fontSize: 13,
        fontWeight: '700',
        color: '#475569',
        fontFamily: 'PlusJakartaSans_700Bold',
    },
    emptyContainer: {
        alignItems: 'center',
        paddingVertical: 60,
        gap: theme.spacing.xs,
    },
    emptyTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: text,
        fontFamily: 'PlusJakartaSans_700Bold',
    },
    emptySubtitle: {
        fontSize: 13,
        color: textSecondary,
        textAlign: 'center',
        paddingHorizontal: 40,
    },
});
