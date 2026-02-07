import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { Card } from '../../components/shared/Card';
import { StatusPill } from '../../components/shared/StatusPill';
import { background, primary, surface, text, textSecondary } from '../../constants/Colors';
import { theme } from '../../constants/theme';

const loads = [
    {
        id: '1',
        route: 'Mumbai → Delhi',
        status: 'active' as const,
        distance: '1,450 km',
        weight: '8 Tons',
        earnings: '₹32,500',
        pickupTime: 'Tomorrow, 10:00 AM',
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
];

export default function Loads() {
    const router = useRouter();
    const [activeTab, setActiveTab] = React.useState<'available' | 'accepted' | 'completed'>('available');

    const filteredLoads = loads.filter((l) => {
        if (activeTab === 'available') return l.status === 'pending';
        if (activeTab === 'accepted') return l.status === 'active' || l.status === 'in-transit';
        if (activeTab === 'completed') return l.status === 'completed';
        return false;
    });

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>My Loads</Text>
            </View>

            <View style={styles.tabsContainer}>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'available' && styles.tabActive]}
                    onPress={() => setActiveTab('available')}
                >
                    <Text style={[styles.tabText, activeTab === 'available' && styles.tabTextActive]}>
                        Available
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'accepted' && styles.tabActive]}
                    onPress={() => setActiveTab('accepted')}
                >
                    <Text style={[styles.tabText, activeTab === 'accepted' && styles.tabTextActive]}>
                        Accepted
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'completed' && styles.tabActive]}
                    onPress={() => setActiveTab('completed')}
                >
                    <Text style={[styles.tabText, activeTab === 'completed' && styles.tabTextActive]}>
                        Completed
                    </Text>
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
                {loads.length > 0 ? (
                    loads.map((load) => (
                        <Card key={load.id} style={styles.loadCard}>
                            <View style={styles.loadHeader}>
                                <View style={styles.loadRoute}>
                                    <Text style={styles.loadRouteText}>{load.route}</Text>
                                </View>
                                <StatusPill status={load.status} />
                            </View>

                            <View style={styles.loadDetails}>
                                <View style={styles.loadDetail}>
                                    <Ionicons name="navigate-outline" size={16} color={textSecondary} />
                                    <Text style={styles.loadDetailText}>{load.distance}</Text>
                                </View>
                                <View style={styles.loadDetail}>
                                    <Ionicons name="cube-outline" size={16} color={textSecondary} />
                                    <Text style={styles.loadDetailText}>{load.weight}</Text>
                                </View>
                                <View style={styles.loadDetail}>
                                    <Ionicons name="time-outline" size={16} color={textSecondary} />
                                    <Text style={styles.loadDetailText}>{load.pickupTime}</Text>
                                </View>
                            </View>

                            <View style={styles.loadFooter}>
                                <Text style={styles.loadPrice}>{load.earnings}</Text>
                                <TouchableOpacity onPress={() => router.push(`/(driver)/load-details?id=${load.id}`)}>
                                    <Text style={styles.viewDetailsText}>View Details →</Text>
                                </TouchableOpacity>
                            </View>
                        </Card>
                    ))
                ) : (
                    <View style={styles.emptyState}>
                        <Ionicons name="cube-outline" size={64} color={textSecondary} />
                        <Text style={styles.emptyStateText}>No {activeTab} loads</Text>
                    </View>
                )}
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
        paddingHorizontal: theme.spacing.base,
        paddingVertical: theme.spacing.lg,
        backgroundColor: surface,
    },
    headerTitle: {
        ...theme.typography.h2,
        color: text,
    },
    tabsContainer: {
        flexDirection: 'row',
        paddingHorizontal: theme.spacing.base,
        paddingTop: theme.spacing.base,
        backgroundColor: surface,
        gap: theme.spacing.sm,
    },
    tab: {
        flex: 1,
        paddingVertical: theme.spacing.md,
        alignItems: 'center',
        borderBottomWidth: 2,
        borderBottomColor: 'transparent',
    },
    tabActive: {
        borderBottomColor: primary,
    },
    tabText: {
        ...theme.typography.bodyMedium,
        color: textSecondary,
    },
    tabTextActive: {
        color: primary,
    },
    scrollView: {
        flex: 1,
    },
    content: {
        paddingHorizontal: theme.spacing.base,
        paddingTop: theme.spacing.base,
        paddingBottom: 100,
    },
    loadCard: {
        padding: theme.spacing.base,
        marginBottom: theme.spacing.md,
    },
    loadHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing.md,
    },
    loadRoute: {
        flex: 1,
    },
    loadRouteText: {
        ...theme.typography.h3,
        color: text,
    },
    loadDetails: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: theme.spacing.base,
        marginBottom: theme.spacing.md,
    },
    loadDetail: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.xs,
    },
    loadDetailText: {
        ...theme.typography.caption,
        color: textSecondary,
    },
    loadFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: theme.spacing.md,
        borderTopWidth: 1,
        borderTopColor: '#E2E8F0',
    },
    loadPrice: {
        ...theme.typography.h3,
        color: primary,
    },
    viewDetailsText: {
        ...theme.typography.bodyMedium,
        color: primary,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: theme.spacing.xxxl,
    },
    emptyStateText: {
        ...theme.typography.body,
        color: textSecondary,
        marginTop: theme.spacing.base,
    },
});
