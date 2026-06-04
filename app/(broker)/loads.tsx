import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
    Animated,
    Dimensions,
    FlatList,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import {
    border,
    primary,
    surface,
    text,
    textSecondary,
} from '../../constants/Colors';
import { theme } from '../../constants/theme';

const MOCK_LOADS = [
    {
        id: 'LOAD-201',
        route: 'Chennai → Hyderabad',
        material: 'Electronics Goods',
        weight: '4 Tons',
        truckRequired: 'Pickup Truck',
        price: '₹16,000',
        commission: '₹480',
        shipper: 'Reliance Digital Ltd',
        date: 'June 4, 10:00 AM'
    },
    {
        id: 'LOAD-202',
        route: 'Mumbai → Pune',
        material: 'FMCG Packages',
        weight: '2 Tons',
        truckRequired: 'Mini Truck',
        price: '₹10,000',
        commission: '₹300',
        shipper: 'Hindustan Unilever',
        date: 'June 4, 1:00 PM'
    },
    {
        id: 'LOAD-203',
        route: 'Delhi → Jaipur',
        material: 'Steel Rods',
        weight: '7 Tons',
        truckRequired: 'Container Truck',
        price: '₹22,000',
        commission: '₹660',
        shipper: 'Tata Steel Ltd',
        date: 'June 5, 8:00 AM'
    },
    {
        id: 'LOAD-204',
        route: 'Kolkata → Patna',
        material: 'Cement Bags',
        weight: '9 Tons',
        truckRequired: 'Container Truck',
        price: '₹28,000',
        commission: '₹840',
        shipper: 'UltraTech Cement',
        date: 'June 5, 11:30 AM'
    }
];

export default function LoadBoard() {
    const router = useRouter();
    const [filter, setFilter] = useState<'all' | 'high' | 'near'>('all');
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(20)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 600,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 600,
                useNativeDriver: true,
            }),
        ]).start();
    }, [filter]);

    const handleAssign = (load: typeof MOCK_LOADS[0]) => {
        router.push({
            pathname: '/(broker)/assign-trip' as any,
            params: {
                loadId: load.id,
                route: load.route,
                material: load.material,
                weight: load.weight,
                price: load.price,
                commission: load.commission,
                truckRequired: load.truckRequired,
                shipper: load.shipper
            }
        });
    };

    const getFilteredLoads = () => {
        if (filter === 'all') return MOCK_LOADS;
        if (filter === 'high') {
            // Filter commission > 500
            return MOCK_LOADS.filter(l => parseInt(l.commission.replace(/[₹,]/g, '')) >= 500);
        }
        // Near me mock: first two
        return MOCK_LOADS.slice(0, 2);
    };

    const renderLoadItem = ({ item }: { item: typeof MOCK_LOADS[0] }) => (
        <View style={styles.loadCard}>
            <LinearGradient
                colors={['rgba(255,255,255,0.95)', 'rgba(255,255,255,0.85)']}
                style={styles.cardGradient}
            >
                <View style={styles.cardHeader}>
                    <View style={styles.routeContainer}>
                        <Text style={styles.routeText}>{item.route}</Text>
                        <Text style={styles.shipperText}>Shipper: {item.shipper}</Text>
                    </View>
                    <View style={styles.idContainer}>
                        <Text style={styles.idText}>{item.id}</Text>
                    </View>
                </View>

                <View style={styles.loadDetails}>
                    <View style={styles.detailRow}>
                        <View style={styles.detailItem}>
                            <Ionicons name="cube-outline" size={16} color={primary} />
                            <Text style={styles.detailText}>{item.material} ({item.weight})</Text>
                        </View>
                        <View style={styles.detailItem}>
                            <Ionicons name="bus-outline" size={16} color="#10B981" />
                            <Text style={styles.detailText}>{item.truckRequired}</Text>
                        </View>
                    </View>
                    <View style={[styles.detailRow, { marginTop: 6 }]}>
                        <View style={styles.detailItem}>
                            <Ionicons name="calendar-outline" size={16} color="#F59E0B" />
                            <Text style={styles.detailText}>{item.date}</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.cardDivider} />

                <View style={styles.cardFooter}>
                    <View style={styles.priceContainer}>
                        <Text style={styles.priceLabel}>Trip Value</Text>
                        <Text style={styles.priceValue}>{item.price}</Text>
                    </View>
                    <View style={styles.priceContainer}>
                        <Text style={styles.commissionLabel}>Commission (3%)</Text>
                        <Text style={styles.commissionValue}>{item.commission}</Text>
                    </View>
                    <TouchableOpacity
                        style={styles.assignBtn}
                        onPress={() => handleAssign(item)}
                    >
                        <Text style={styles.assignBtnText}>Assign Driver</Text>
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
                            Near Me
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
