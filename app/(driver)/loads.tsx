import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Dimensions,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { StatusPill } from '../../components/shared/StatusPill';
import { primary, surface, text, textSecondary } from '../../constants/Colors';
import { theme } from '../../constants/theme';

const { width } = Dimensions.get('window');

const loads = [
    {
        id: '1',
        route: 'Mumbai → Delhi',
        status: 'pending' as const,
        distance: '1,450 km',
        weight: '8 Tons',
        earnings: '₹32,500',
        pickupTime: 'Today, 10:00 AM',
    },
    {
        id: '2',
        route: 'Pune → Bangalore',
        status: 'completed' as const,
        distance: '850 km',
        weight: '5 Tons',
        earnings: '₹22,000',
        pickupTime: 'Dec 10, 2026',
    },
    {
        id: '3',
        route: 'Chennai → Hyderabad',
        status: 'active' as const,
        distance: '650 km',
        weight: '12 Tons',
        earnings: '₹18,500',
        pickupTime: 'Today, 2:00 PM',
    },
    {
        id: '4',
        route: 'Kolkata → Mumbai',
        status: 'in-transit' as const,
        distance: '1,800 km',
        weight: '15 Tons',
        earnings: '₹42,000',
        pickupTime: 'Yesterday, 8:00 AM',
    },
];

type TabType = 'available' | 'active' | 'completed';

export default function Loads() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<TabType>('available');

    const filteredLoads = loads.filter((l) => {
        if (activeTab === 'available') return l.status === 'pending';
        if (activeTab === 'active') return l.status === 'active' || l.status === 'in-transit';
        if (activeTab === 'completed') return l.status === 'completed';
        return false;
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
                    <TouchableOpacity style={styles.iconButton}>
                        <Ionicons name="filter" size={24} color={primary} />
                    </TouchableOpacity>
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
                >
                    {filteredLoads.length > 0 ? (
                        filteredLoads.map((load) => (
                            <TouchableOpacity
                                key={load.id}
                                activeOpacity={0.9}
                                onPress={() => router.push(`/(driver)/load-details?id=${load.id}`)}
                                style={styles.loadCardWrapper}
                            >
                                <LinearGradient
                                    colors={['rgba(59, 130, 246, 0.08)', 'rgba(96, 165, 250, 0.04)']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                    style={styles.loadCard}
                                >
                                    <View style={styles.cardHeader}>
                                        <Text style={styles.loadRoute}>{load.route}</Text>
                                        <StatusPill status={load.status} />
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
                                        <View style={styles.actionButton}>
                                            <Text style={styles.actionButtonText}>View Details</Text>
                                            <Ionicons name="arrow-forward" size={16} color={primary} />
                                        </View>
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
    loadRoute: {
        fontSize: 18,
        fontFamily: 'PlusJakartaSans_700Bold',
        color: text,
        flex: 1,
        marginRight: theme.spacing.sm,
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
        fontSize: 20,
        fontFamily: 'PlusJakartaSans_700Bold',
        color: primary,
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
