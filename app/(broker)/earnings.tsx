import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
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
import { StatusPill } from '../../components/shared/StatusPill';
import { Colors, primary, surface, text, textSecondary } from '../../constants/Colors';
import { theme } from '../../constants/theme';

const { width } = Dimensions.get('window');

const MOCK_TRANSACTIONS = [
    {
        id: 'TXN-901',
        route: 'Pune → Bangalore',
        date: 'June 3, 2026',
        tripValue: '₹20,000',
        commission: '₹600',
        driverName: 'Amit Sharma',
        status: 'completed'
    },
    {
        id: 'TXN-902',
        route: 'Chennai → Hyderabad',
        date: 'June 2, 2026',
        tripValue: '₹16,000',
        commission: '₹480',
        driverName: 'Suresh Patel',
        status: 'completed'
    },
    {
        id: 'TXN-903',
        route: 'Delhi → Jaipur',
        date: 'May 31, 2026',
        tripValue: '₹22,000',
        commission: '₹660',
        driverName: 'Vikram Singh',
        status: 'completed'
    },
    {
        id: 'TXN-904',
        route: 'Kolkata → Patna',
        date: 'May 28, 2026',
        tripValue: '₹28,000',
        commission: '₹840',
        driverName: 'Rahul Verma',
        status: 'completed'
    }
];

export default function BrokerEarnings() {
    const [period, setPeriod] = useState<'today' | 'week' | 'month'>('week');
    const [withdrawing, setWithdrawing] = useState(false);

    const handleWithdraw = () => {
        setWithdrawing(true);
        setTimeout(() => {
            setWithdrawing(false);
            Alert.alert(
                'Withdrawal Successful',
                '₹15,450 has been successfully transferred to your registered business bank account.',
                [{ text: 'Great!' }]
            );
        }, 1500);
    };

    const getPeriodStats = () => {
        switch (period) {
            case 'today':
                return { balance: '₹15,450', completed: '2', commission: '₹1,080', volume: '₹36,000' };
            case 'week':
                return { balance: '₹15,450', completed: '8', commission: '₹2,580', volume: '₹86,000' };
            case 'month':
                return { balance: '₹15,450', completed: '34', commission: '₹12,450', volume: '₹4,15,000' };
        }
    };

    const stats = getPeriodStats();

    const renderTransactionItem = ({ item }: { item: typeof MOCK_TRANSACTIONS[0] }) => (
        <View style={styles.txnCard}>
            <View style={styles.txnHeader}>
                <View>
                    <Text style={styles.txnRoute}>{item.route}</Text>
                    <Text style={styles.txnMeta}>Driver: {item.driverName} • {item.date}</Text>
                </View>
                <StatusPill status={item.status as any} />
            </View>
            <View style={styles.txnDivider} />
            <View style={styles.txnDetails}>
                <View>
                    <Text style={styles.txnLabel}>Trip Value</Text>
                    <Text style={styles.txnValue}>{item.tripValue}</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                    <Text style={styles.txnLabel}>Your Commission (3%)</Text>
                    <Text style={styles.txnCommission}>{item.commission}</Text>
                </View>
            </View>
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
                    <Text style={styles.headerTitle}>Earnings & Commission</Text>
                </View>

                <FlatList
                    ListHeaderComponent={
                        <View style={styles.headerContainer}>
                            {/* Main Green Balance Card */}
                            <View style={styles.balanceCard}>
                                <LinearGradient
                                    colors={['#10B981', '#059669']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                    style={styles.balanceGradient}
                                >
                                    <Text style={styles.balanceLabel}>Available Balance</Text>
                                    <Text style={styles.balanceValue}>{stats.balance}</Text>

                                    <TouchableOpacity
                                        style={styles.withdrawBtn}
                                        onPress={handleWithdraw}
                                        disabled={withdrawing}
                                    >
                                        {withdrawing ? (
                                            <ActivityIndicator color="#10B981" />
                                        ) : (
                                            <>
                                                <Ionicons name="send" size={16} color="#10B981" />
                                                <Text style={styles.withdrawText}>Withdraw to Bank</Text>
                                            </>
                                        )}
                                    </TouchableOpacity>
                                </LinearGradient>
                            </View>

                            {/* Period Switcher */}
                            <View style={styles.periodTabs}>
                                {(['today', 'week', 'month'] as const).map(p => (
                                    <TouchableOpacity
                                        key={p}
                                        style={[styles.periodTab, period === p && styles.periodTabActive]}
                                        onPress={() => setPeriod(p)}
                                    >
                                        <Text style={[styles.periodTabText, period === p && styles.periodTabTextActive]}>
                                            {p.toUpperCase()}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            {/* Period Stats Grid */}
                            <View style={styles.statsGrid}>
                                <View style={styles.gridCard}>
                                    <Text style={styles.gridValue}>{stats.completed}</Text>
                                    <Text style={styles.gridLabel}>Trips Completed</Text>
                                </View>
                                <View style={styles.gridCard}>
                                    <Text style={styles.gridValue}>{stats.commission}</Text>
                                    <Text style={styles.gridLabel}>Commission Earned</Text>
                                </View>
                                <View style={styles.gridCard}>
                                    <Text style={styles.gridValue}>{stats.volume}</Text>
                                    <Text style={styles.gridLabel}>Business Volume</Text>
                                </View>
                            </View>

                            {/* Commission Model Description Card */}
                            <View style={styles.modelCard}>
                                <View style={styles.modelHeader}>
                                    <Ionicons name="calculator-outline" size={18} color={Colors.light.primary} />
                                    <Text style={styles.modelTitle}>Commission Split Model (Example)</Text>
                                </View>
                                <Text style={styles.modelDescription}>
                                    For a trip valued at <Text style={styles.boldText}>₹10,000</Text>, the platform split operates as:
                                </Text>
                                <View style={styles.splitRow}>
                                    <View style={styles.splitItem}>
                                        <Text style={[styles.splitValue, { color: '#059669' }]}>₹300</Text>
                                        <Text style={styles.splitLabel}>Broker (3%)</Text>
                                    </View>
                                    <View style={styles.splitItem}>
                                        <Text style={[styles.splitValue, { color: Colors.light.primary }]}>₹500</Text>
                                        <Text style={styles.splitLabel}>Platform (5%)</Text>
                                    </View>
                                    <View style={styles.splitItem}>
                                        <Text style={[styles.splitValue, { color: '#475569' }]}>₹9,200</Text>
                                        <Text style={styles.splitLabel}>Driver (92%)</Text>
                                    </View>
                                </View>
                            </View>

                            <Text style={styles.sectionTitle}>Commission History</Text>
                        </View>
                    }
                    data={MOCK_TRANSACTIONS}
                    keyExtractor={item => item.id}
                    renderItem={renderTransactionItem}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                />
            </SafeAreaView>
        </View>
    );
}

// ActivityIndicator import correction
import { ActivityIndicator } from 'react-native';

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
    headerContainer: {
        paddingHorizontal: theme.spacing.lg,
        marginTop: theme.spacing.sm,
    },
    listContent: {
        paddingBottom: 120,
    },
    balanceCard: {
        borderRadius: 24,
        overflow: 'hidden',
        marginBottom: theme.spacing.lg,
        ...theme.shadows.strong,
        elevation: 6,
    },
    balanceGradient: {
        padding: theme.spacing.lg,
        alignItems: 'center',
    },
    balanceLabel: {
        fontSize: 13,
        color: 'rgba(255, 255, 255, 0.8)',
        fontFamily: 'PlusJakartaSans_500Medium',
        marginBottom: 4,
    },
    balanceValue: {
        fontSize: 36,
        fontWeight: '800',
        color: '#FFFFFF',
        fontFamily: 'PlusJakartaSans_800ExtraBold',
        marginBottom: theme.spacing.md,
    },
    withdrawBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: '#FFFFFF',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 14,
    },
    withdrawText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#059669',
        fontFamily: 'PlusJakartaSans_700Bold',
    },
    periodTabs: {
        flexDirection: 'row',
        backgroundColor: '#E2E8F0',
        borderRadius: 14,
        padding: 4,
        gap: 4,
        marginBottom: theme.spacing.lg,
    },
    periodTab: {
        flex: 1,
        paddingVertical: 8,
        alignItems: 'center',
        borderRadius: 10,
    },
    periodTabActive: {
        backgroundColor: '#FFFFFF',
        ...theme.shadows.light,
    },
    periodTabText: {
        fontSize: 11,
        fontWeight: '700',
        color: textSecondary,
        fontFamily: 'PlusJakartaSans_700Bold',
    },
    periodTabTextActive: {
        color: text,
    },
    statsGrid: {
        flexDirection: 'row',
        gap: theme.spacing.sm,
        marginBottom: theme.spacing.lg,
    },
    gridCard: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: theme.spacing.md,
        alignItems: 'center',
        ...theme.shadows.light,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    gridValue: {
        fontSize: 18,
        fontWeight: '800',
        color: text,
        fontFamily: 'PlusJakartaSans_800ExtraBold',
        marginBottom: 4,
    },
    gridLabel: {
        fontSize: 10,
        color: textSecondary,
        textAlign: 'center',
    },
    modelCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: theme.spacing.lg,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        ...theme.shadows.medium,
        marginBottom: theme.spacing.lg,
    },
    modelHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#E2E8F0',
        paddingBottom: 8,
        marginBottom: 10,
    },
    modelTitle: {
        fontSize: 13,
        fontWeight: '700',
        color: text,
    },
    modelDescription: {
        fontSize: 13,
        color: textSecondary,
        lineHeight: 18,
        marginBottom: theme.spacing.md,
    },
    boldText: {
        fontWeight: '700',
        color: text,
    },
    splitRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#F8FAFC',
        borderRadius: 12,
        padding: theme.spacing.md,
    },
    splitItem: {
        alignItems: 'center',
    },
    splitValue: {
        fontSize: 14,
        fontWeight: '800',
        fontFamily: 'PlusJakartaSans_800ExtraBold',
        marginBottom: 2,
    },
    splitLabel: {
        fontSize: 10,
        color: textSecondary,
    },
    sectionTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: text,
        fontFamily: 'PlusJakartaSans_700Bold',
        marginBottom: theme.spacing.md,
    },
    txnCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: theme.spacing.md,
        marginHorizontal: theme.spacing.lg,
        marginBottom: theme.spacing.sm,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        ...theme.shadows.light,
    },
    txnHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: theme.spacing.sm,
    },
    txnRoute: {
        fontSize: 14,
        fontWeight: '700',
        color: text,
        fontFamily: 'PlusJakartaSans_700Bold',
        marginBottom: 2,
    },
    txnMeta: {
        fontSize: 11,
        color: textSecondary,
    },
    txnDivider: {
        height: 1,
        backgroundColor: '#F1F5F9',
        marginBottom: theme.spacing.sm,
    },
    txnDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    txnLabel: {
        fontSize: 9,
        color: textSecondary,
        marginBottom: 2,
    },
    txnValue: {
        fontSize: 13,
        fontWeight: '700',
        color: text,
    },
    txnCommission: {
        fontSize: 14,
        fontWeight: '800',
        color: '#059669',
        fontFamily: 'PlusJakartaSans_800ExtraBold',
    },
});
