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
import { Colors } from '../../constants/Colors';
import { theme } from '../../constants/theme';

const { width } = Dimensions.get('window');

type TabType = 'active' | 'completed' | 'cancelled';

const shipments = {
    active: [
        { id: '1', from: 'Mumbai', to: 'Delhi', truck: 'Container Truck', date: 'Dec 15', price: 24500, status: 'in-transit' },
        { id: '2', from: 'Pune', to: 'Bangalore', truck: 'Mini Truck', date: 'Dec 16', price: 18200, status: 'active' },
    ],
    completed: [
        { id: '3', from: 'Chennai', to: 'Hyderabad', truck: 'Pickup Truck', date: 'Dec 10', price: 12500, status: 'completed' },
        { id: '4', from: 'Kolkata', to: 'Mumbai', truck: 'Container Truck', date: 'Dec 8', price: 28000, status: 'completed' },
    ],
    cancelled: [
        { id: '5', from: 'Delhi', to: 'Jaipur', truck: 'Mini Truck', date: 'Dec 5', price: 8500, status: 'cancelled' },
    ],
};

export default function Shipments() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<TabType>('active');

    const handleViewShipment = (id: string) => {
        router.push(`/(business)/tracking?id=${id}`);
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
                >
                    {shipments[activeTab].map((shipment, index) => (
                        <TouchableOpacity
                            key={shipment.id}
                            activeOpacity={0.9}
                            onPress={() => handleViewShipment(shipment.id)}
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
                                        <Text style={styles.routeText}>{shipment.from}</Text>
                                        <Ionicons name="arrow-forward" size={16} color={Colors.light.textSecondary} style={{ marginHorizontal: 8 }} />
                                        <Text style={styles.routeText}>{shipment.to}</Text>
                                    </View>
                                    <StatusPill status={shipment.status as any} />
                                </View>

                                <View style={styles.cardBody}>
                                    <View style={styles.infoRow}>
                                        <View style={styles.infoItem}>
                                            <View style={styles.iconBox}>
                                                <Ionicons name="cube-outline" size={18} color={Colors.light.primary} />
                                            </View>
                                            <Text style={styles.infoText}>{shipment.truck}</Text>
                                        </View>
                                        <View style={styles.infoItem}>
                                            <View style={[styles.iconBox, { backgroundColor: '#FFF7ED' }]}>
                                                <Ionicons name="calendar-outline" size={18} color="#F59E0B" />
                                            </View>
                                            <Text style={styles.infoText}>{shipment.date}, 2026</Text>
                                        </View>
                                    </View>
                                </View>

                                <View style={styles.cardFooter}>
                                    <Text style={styles.priceText}>₹{shipment.price.toLocaleString()}</Text>
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
