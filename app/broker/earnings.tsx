import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useCallback, useEffect, useState } from 'react';
import { Modal, TextInput } from 'react-native';
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
import { StatusPill } from '../../components/shared/StatusPill';
import { Colors, primary, surface, text, textSecondary } from '../../constants/Colors';
import { theme } from '../../constants/theme';

const { width } = Dimensions.get('window');

type PerDriver = {
    driverId: string; name: string; phone?: string; truckType?: string;
    earned: number; paid: number; pending: number;
};

type Dashboard = {
    totalBrokerEarnings: number;
    driverPool: { totalEarnedByDrivers: number; totalPaidToDrivers: number; totalPendingToDrivers: number };
    perDriver: PerDriver[];
};

export default function BrokerEarnings() {
    const [period, setPeriod] = useState<'today' | 'week' | 'month'>('week');
    const [withdrawing, setWithdrawing] = useState(false);
    const [walletBalance, setWalletBalance] = useState(0);
    const [dashboard, setDashboard] = useState<Dashboard | null>(null);
    const [withdrawVisible, setWithdrawVisible] = useState(false);
    const [withdrawAmt, setWithdrawAmt] = useState('');

    const [payDriverId, setPayDriverId] = useState<string | null>(null);
    const [payAmt, setPayAmt] = useState('');
    const [paying, setPaying] = useState(false);

    const load = useCallback(async () => {
        try {
            const w = await api.wallet();
            setWalletBalance(w.balance);
            const periodKey = period === 'today' ? 'day' : period === 'week' ? 'week' : 'month';
            // Summary dashboard (driver pool + totals) plus period slice for the header figure.
            const [d, periodSlice] = await Promise.all([
                api.brokerEarningsSummary() as Promise<Dashboard>,
                api.brokerEarningsByPeriod(periodKey).catch(() => null),
            ]);
            if (periodSlice && typeof (periodSlice as any).total === 'number') {
                setDashboard({
                    ...d,
                    totalBrokerEarnings: (periodSlice as any).total,
                });
            } else {
                setDashboard(d);
            }
        } catch (e) { console.warn('broker earnings load failed', e); }
    }, [period]);

    useEffect(() => { load(); }, [load]);

    const handleWithdraw = async () => {
        const n = parseFloat(withdrawAmt);
        if (!Number.isFinite(n) || n <= 0) { Alert.alert('Enter a valid amount'); return; }
        if (n > walletBalance) { Alert.alert('Insufficient balance'); return; }
        setWithdrawing(true);
        try {
            const me = await api.me();
            const bank = me.payoutDetails;
            if (!bank || (!bank.upiId && !bank.accountNumber)) {
                Alert.alert('Add payout account', 'Save bank or UPI under Profile → Bank payout account first.');
                setWithdrawing(false);
                return;
            }
            await api.withdraw(n, bank as object);
            Alert.alert('Request sent', 'Admin will review and disburse.');
            setWithdrawVisible(false); setWithdrawAmt('');
            load();
        } catch (e: any) {
            Alert.alert('Failed', e instanceof ApiError ? e.message : (e?.message || 'unknown'));
        } finally { setWithdrawing(false); }
    };

    const recordPayment = async (driverId: string) => {
        const n = parseFloat(payAmt);
        if (!Number.isFinite(n) || n <= 0) { Alert.alert('Enter a valid amount'); return; }
        setPaying(true);
        try {
            await api.brokerRecordDriverPayment({ driverId, amount: n, method: 'cash' });
            Alert.alert('Recorded', `Marked ₹${n} as paid to driver.`);
            setPayDriverId(null); setPayAmt('');
            load();
        } catch (e: any) {
            Alert.alert('Failed', e instanceof ApiError ? e.message : (e?.message || 'unknown'));
        } finally { setPaying(false); }
    };

    const stats = {
        balance: `₹${walletBalance.toLocaleString()}`,
        completed: String(dashboard?.perDriver.reduce((s, d) => s + 0, 0) ?? 0),
        commission: `₹${Math.round(dashboard?.totalBrokerEarnings || 0).toLocaleString()}`,
        volume: `₹${Math.round(dashboard?.driverPool.totalEarnedByDrivers || 0).toLocaleString()}`,
    };

    const renderDriverItem = ({ item }: { item: PerDriver }) => (
        <View style={styles.txnCard}>
            <View style={styles.txnHeader}>
                <View>
                    <Text style={styles.txnRoute}>{item.name}</Text>
                    <Text style={styles.txnMeta}>{item.truckType || '—'} • {item.phone || ''}</Text>
                </View>
                {item.pending > 0 ? (
                    <TouchableOpacity
                        onPress={() => { setPayDriverId(item.driverId); setPayAmt(String(item.pending)); }}
                        style={{ backgroundColor: primary, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10 }}
                    >
                        <Text style={{ color: '#fff', fontWeight: '600' }}>Pay</Text>
                    </TouchableOpacity>
                ) : null}
            </View>
            <View style={styles.txnDivider} />
            <View style={styles.txnDetails}>
                <View>
                    <Text style={styles.txnLabel}>Earned</Text>
                    <Text style={styles.txnValue}>₹{Math.round(item.earned).toLocaleString()}</Text>
                </View>
                <View style={{ alignItems: 'center' }}>
                    <Text style={styles.txnLabel}>Paid</Text>
                    <Text style={styles.txnValue}>₹{Math.round(item.paid).toLocaleString()}</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                    <Text style={styles.txnLabel}>Pending</Text>
                    <Text style={[styles.txnCommission, { color: item.pending > 0 ? '#EF4444' : '#10B981' }]}>
                        ₹{Math.round(item.pending).toLocaleString()}
                    </Text>
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
                                        onPress={() => setWithdrawVisible(true)}
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

                            <Text style={styles.sectionTitle}>Your managed drivers</Text>
                        </View>
                    }
                    data={dashboard?.perDriver || []}
                    keyExtractor={item => item.driverId}
                    renderItem={renderDriverItem}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={
                        <Text style={{ color: textSecondary, textAlign: 'center', marginTop: 24 }}>
                            No managed drivers yet. Add one from the Drivers tab.
                        </Text>
                    }
                />
            </SafeAreaView>

            {/* Withdrawal modal */}
            <Modal visible={withdrawVisible} transparent animationType="fade" onRequestClose={() => setWithdrawVisible(false)}>
                <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', padding: 24 }}>
                    <View style={{ backgroundColor: '#fff', borderRadius: 16, padding: 20 }}>
                        <Text style={{ fontSize: 18, fontWeight: '700', marginBottom: 6 }}>Withdraw</Text>
                        <Text style={{ fontSize: 13, color: textSecondary, marginBottom: 16 }}>
                            Balance: ₹{walletBalance.toLocaleString()}. Sent to admin for approval.
                        </Text>
                        <TextInput
                            keyboardType="numeric"
                            value={withdrawAmt}
                            onChangeText={setWithdrawAmt}
                            placeholder="Amount (₹)"
                            style={{ borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 10, padding: 12, fontSize: 16 }}
                        />
                        <View style={{ flexDirection: 'row', gap: 12, marginTop: 16 }}>
                            <TouchableOpacity
                                style={{ flex: 1, padding: 14, borderRadius: 10, borderWidth: 1, borderColor: '#E2E8F0', alignItems: 'center' }}
                                onPress={() => { setWithdrawVisible(false); setWithdrawAmt(''); }}
                            >
                                <Text style={{ color: text, fontWeight: '600' }}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{ flex: 1, padding: 14, borderRadius: 10, backgroundColor: '#10B981', alignItems: 'center', opacity: withdrawing ? 0.5 : 1 }}
                                onPress={handleWithdraw}
                                disabled={withdrawing}
                            >
                                <Text style={{ color: '#fff', fontWeight: '700' }}>{withdrawing ? 'Sending…' : 'Request'}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Pay driver modal */}
            <Modal visible={!!payDriverId} transparent animationType="fade" onRequestClose={() => setPayDriverId(null)}>
                <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', padding: 24 }}>
                    <View style={{ backgroundColor: '#fff', borderRadius: 16, padding: 20 }}>
                        <Text style={{ fontSize: 18, fontWeight: '700', marginBottom: 6 }}>Record cash payment</Text>
                        <Text style={{ fontSize: 13, color: textSecondary, marginBottom: 16 }}>
                            You paid the driver in cash / UPI offline. Reduces their pending balance.
                        </Text>
                        <TextInput
                            keyboardType="numeric"
                            value={payAmt}
                            onChangeText={setPayAmt}
                            placeholder="Amount (₹)"
                            style={{ borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 10, padding: 12, fontSize: 16 }}
                        />
                        <View style={{ flexDirection: 'row', gap: 12, marginTop: 16 }}>
                            <TouchableOpacity
                                style={{ flex: 1, padding: 14, borderRadius: 10, borderWidth: 1, borderColor: '#E2E8F0', alignItems: 'center' }}
                                onPress={() => { setPayDriverId(null); setPayAmt(''); }}
                            >
                                <Text style={{ color: text, fontWeight: '600' }}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{ flex: 1, padding: 14, borderRadius: 10, backgroundColor: primary, alignItems: 'center', opacity: paying ? 0.5 : 1 }}
                                onPress={() => payDriverId && recordPayment(payDriverId)}
                                disabled={paying}
                            >
                                <Text style={{ color: '#fff', fontWeight: '700' }}>{paying ? 'Saving…' : 'Record'}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
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
