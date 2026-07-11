import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, Modal, TextInput } from 'react-native';
import { api, ApiError } from '../../utils/api';
import {
    Animated,
    Dimensions,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import {
    primary,
    surface,
    text,
    textSecondary
} from '../../constants/Colors';
import { theme } from '../../constants/theme';

const { width } = Dimensions.get('window');

const KIND_LABEL: Record<string, string> = {
    topup: 'Top-up',
    shipment_credit: 'Trip earnings',
    shipment_escrow: 'Held in escrow',
    withdrawal: 'Withdrawal',
    direct_upi: 'UPI received',
    refund: 'Refund',
    adjustment: 'Adjustment',
};

export default function Earnings() {
    const router = useRouter();
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const [balance, setBalance] = useState(0);
    const [today, setToday] = useState<any | null>(null);
    const [month, setMonth] = useState<any | null>(null);
    const [txns, setTxns] = useState<any[]>([]);
    const [withdrawVisible, setWithdrawVisible] = useState(false);
    const [withdrawAmt, setWithdrawAmt] = useState('');
    const [busy, setBusy] = useState(false);

    const load = useCallback(async () => {
        try {
            const w = await api.wallet();
            setBalance(w.balance);
            const d = await api.driverEarnings('day');
            const m = await api.driverEarnings('month');
            setToday(d); setMonth(m);
            const t = await api.walletTransactions(undefined, 20);
            setTxns(t);
        } catch (e) { console.warn('earnings load failed', e); }
    }, []);

    useEffect(() => {
        Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }).start();
        load();
    }, [load]);

    const submitWithdraw = async () => {
        const n = parseFloat(withdrawAmt);
        if (!Number.isFinite(n) || n <= 0) { Alert.alert('Enter a valid amount'); return; }
        if (n > balance) { Alert.alert('Insufficient balance'); return; }
        setBusy(true);
        try {
            const me = await api.me();
            const bank = me.payoutDetails;
            if (!bank || (!bank.upiId && !bank.accountNumber)) {
                Alert.alert(
                    'Add payout account',
                    'Save your bank or UPI details in Profile → Bank Account first.',
                );
                setBusy(false);
                return;
            }
            await api.withdraw(n, bank as object);
            setWithdrawVisible(false);
            setWithdrawAmt('');
            Alert.alert('Request sent', 'Admin will review and disburse.');
        } catch (e: any) {
            Alert.alert('Failed', e instanceof ApiError ? e.message : (e?.message || 'unknown'));
        } finally { setBusy(false); }
    };

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={theme.gradients.background as any}
                style={StyleSheet.absoluteFillObject}
            />

            <SafeAreaView style={styles.safeArea}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color={text} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Earnings</Text>
                    <TouchableOpacity style={styles.moreButton}>
                        <Ionicons name="ellipsis-vertical" size={24} color={text} />
                    </TouchableOpacity>
                </View>

                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.content}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Balance Card with Gradient */}
                    <LinearGradient
                        colors={['rgba(59, 130, 246, 0.20)', 'rgba(96, 165, 250, 0.10)']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.balanceCard}
                    >
                        <View style={styles.balanceHeader}>
                            <Text style={styles.balanceLabel}>Total Balance</Text>
                            <LinearGradient
                                colors={['rgba(255, 255, 255, 0.2)', 'rgba(255, 255, 255, 0.1)']}
                                style={styles.walletIcon}
                            >
                                <Ionicons name="wallet" size={20} color={text} />
                            </LinearGradient>
                        </View>
                        <Text style={styles.balanceAmount}>₹{balance.toLocaleString()}</Text>
                        <Text style={styles.balanceSubtext}>Wallet balance</Text>

                        <View style={styles.quickActions}>
                            <TouchableOpacity style={styles.actionButton} onPress={load}>
                                <View style={styles.actionIconContainer}>
                                    <Ionicons name="refresh" size={20} color={text} />
                                </View>
                                <Text style={styles.actionText}>Refresh</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.actionButton} onPress={() => setWithdrawVisible(true)}>
                                <View style={styles.actionIconContainer}>
                                    <Ionicons name="arrow-up" size={20} color={text} />
                                </View>
                                <Text style={styles.actionText}>Withdraw</Text>
                            </TouchableOpacity>
                        </View>
                    </LinearGradient>

                    {/* Stats Cards */}
                    <View style={styles.statsContainer}>
                        <LinearGradient
                            colors={['rgba(16, 185, 129, 0.1)', 'rgba(52, 211, 153, 0.05)']}
                            style={styles.statCard}
                        >
                            <View style={[styles.statIconContainer, { backgroundColor: 'rgba(16, 185, 129, 0.15)' }]}>
                                <Ionicons name="trending-up" size={18} color="#10B981" />
                            </View>
                            <Text style={styles.statLabel}>This Month</Text>
                            <Text style={[styles.statValue, { color: '#10B981' }]}>
                                +₹{Math.round(month?.total || 0).toLocaleString()}
                            </Text>
                        </LinearGradient>

                        <LinearGradient
                            colors={['rgba(245, 158, 11, 0.1)', 'rgba(251, 191, 36, 0.05)']}
                            style={styles.statCard}
                        >
                            <View style={[styles.statIconContainer, { backgroundColor: 'rgba(245, 158, 11, 0.15)' }]}>
                                <Ionicons name="today-outline" size={18} color="#F59E0B" />
                            </View>
                            <Text style={styles.statLabel}>Today ({today?.tripsCount ?? 0} trips)</Text>
                            <Text style={[styles.statValue, { color: '#F59E0B' }]}>
                                ₹{Math.round(today?.total || 0).toLocaleString()}
                            </Text>
                        </LinearGradient>
                    </View>

                    {/* Transactions */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Transaction History</Text>
                            <TouchableOpacity>
                                <Text style={styles.seeAllText}>See All</Text>
                            </TouchableOpacity>
                        </View>

                        <LinearGradient
                            colors={['rgba(255, 255, 255, 0.95)', 'rgba(255, 255, 255, 0.85)']}
                            style={styles.transactionsCard}
                        >
                            {txns.length === 0 ? (
                                <Text style={{ color: textSecondary, textAlign: 'center', padding: 24 }}>
                                    No transactions yet.
                                </Text>
                            ) : txns.map((t, index) => {
                                const isCredit = t.amount >= 0;
                                const label = KIND_LABEL[t.kind] || t.kind;
                                const dateStr = new Date(t.createdAt).toLocaleString('en-IN', {
                                    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
                                });
                                return (
                                    <View key={t.id}>
                                        <View style={styles.transactionItem}>
                                            <LinearGradient
                                                colors={
                                                    isCredit
                                                        ? ['rgba(16, 185, 129, 0.2)', 'rgba(16, 185, 129, 0.1)']
                                                        : ['rgba(239, 68, 68, 0.2)', 'rgba(239, 68, 68, 0.1)']
                                                }
                                                style={styles.transactionIcon}
                                            >
                                                <Ionicons
                                                    name={isCredit ? 'arrow-down' : 'arrow-up'}
                                                    size={20}
                                                    color={isCredit ? '#10B981' : '#EF4444'}
                                                />
                                            </LinearGradient>
                                            <View style={styles.transactionDetails}>
                                                <Text style={styles.transactionDescription}>{label}</Text>
                                                <Text style={styles.transactionDate}>{dateStr}</Text>
                                            </View>
                                            <Text
                                                style={[
                                                    styles.transactionAmount,
                                                    isCredit ? styles.creditAmount : styles.debitAmount,
                                                ]}
                                            >
                                                {isCredit ? '+' : ''}₹{Math.abs(Math.round(t.amount)).toLocaleString()}
                                            </Text>
                                        </View>
                                        {index < txns.length - 1 && <View style={styles.transactionDivider} />}
                                    </View>
                                );
                            })}
                        </LinearGradient>
                    </View>
                </ScrollView>
            </SafeAreaView>

            <Modal visible={withdrawVisible} transparent animationType="fade" onRequestClose={() => setWithdrawVisible(false)}>
                <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', padding: 24 }}>
                    <View style={{ backgroundColor: '#fff', borderRadius: 16, padding: 20 }}>
                        <Text style={{ fontSize: 18, fontWeight: '700', marginBottom: 6 }}>Withdraw</Text>
                        <Text style={{ fontSize: 13, color: textSecondary, marginBottom: 16 }}>
                            Goes to admin for approval. Balance: ₹{balance.toLocaleString()}
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
                                style={{ flex: 1, padding: 14, borderRadius: 10, backgroundColor: primary, alignItems: 'center', opacity: busy ? 0.5 : 1 }}
                                onPress={submitWithdraw}
                                disabled={busy}
                            >
                                <Text style={{ color: '#fff', fontWeight: '700' }}>{busy ? 'Sending…' : 'Request'}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
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
        paddingHorizontal: theme.spacing.base,
        paddingVertical: theme.spacing.md,
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        backgroundColor: '#FFFFFF',
        ...theme.shadows.light,
    },
    headerTitle: {
        fontSize: 18,
        fontFamily: 'PlusJakartaSans_700Bold',
        color: text,
    },
    moreButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        backgroundColor: '#FFFFFF',
        ...theme.shadows.light,
    },
    scrollView: {
        flex: 1,
    },
    content: {
        paddingHorizontal: theme.spacing.base,
        paddingTop: theme.spacing.lg,
        paddingBottom: 100,
    },
    balanceCard: {
        borderRadius: theme.borderRadius.card,
        padding: theme.spacing.lg,
        marginBottom: theme.spacing.base,
        elevation: 5,
        shadowColor: 'rgba(59, 130, 246, 0.2)',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.12,
        shadowRadius: 10,
        borderWidth: 1,
        borderColor: 'rgba(59, 130, 246, 0.15)',
    },
    balanceHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing.md,
    },
    balanceLabel: {
        fontSize: 13,
        color: text,
        fontFamily: 'PlusJakartaSans_500Medium',
    },
    walletIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    balanceAmount: {
        fontSize: 34,
        fontWeight: '700',
        color: text,
        marginBottom: theme.spacing.xs,
        fontFamily: 'PlusJakartaSans_700Bold',
    },
    balanceSubtext: {
        fontSize: 12,
        color: textSecondary,
        marginBottom: theme.spacing.lg,
        fontFamily: 'PlusJakartaSans_500Medium',
    },
    quickActions: {
        flexDirection: 'row',
        gap: theme.spacing.base,
        marginTop: theme.spacing.base,
    },
    actionButton: {
        flex: 1,
        alignItems: 'center',
    },
    actionIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: surface,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: theme.spacing.sm,
    },
    actionText: {
        fontSize: 11,
        color: text,
        fontWeight: '500',
        fontFamily: 'PlusJakartaSans_500Medium',
    },
    statsContainer: {
        flexDirection: 'row',
        gap: theme.spacing.md,
        marginBottom: theme.spacing.lg,
    },
    statCard: {
        flex: 1,
        borderRadius: theme.borderRadius.md,
        padding: theme.spacing.base,
        ...theme.shadows.light,
    },
    statIconContainer: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: theme.spacing.sm,
    },
    statLabel: {
        fontSize: 11,
        color: textSecondary,
        marginBottom: 2,
        fontFamily: 'PlusJakartaSans_500Medium',
    },
    statValue: {
        fontSize: 18,
        fontWeight: '700',
        fontFamily: 'PlusJakartaSans_700Bold',
    },
    section: {
        marginTop: theme.spacing.base,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing.base,
    },
    sectionTitle: {
        fontSize: 18,
        color: text,
        fontWeight: '600',
        fontFamily: 'PlusJakartaSans_600SemiBold',
    },
    seeAllText: {
        color: primary,
        fontWeight: '600',
        fontFamily: 'PlusJakartaSans_600SemiBold',
    },
    transactionsCard: {
        borderRadius: theme.borderRadius.card,
        padding: theme.spacing.base,
        ...theme.shadows.card,
    },
    transactionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: theme.spacing.md,
    },
    transactionIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: theme.spacing.md,
    },
    transactionDetails: {
        flex: 1,
    },
    transactionDescription: {
        fontSize: 14,
        color: text,
        marginBottom: 2,
        fontFamily: 'PlusJakartaSans_600SemiBold',
    },
    transactionDate: {
        fontSize: 12,
        color: textSecondary,
        fontFamily: 'PlusJakartaSans_500Medium',
    },
    transactionAmount: {
        fontSize: 14,
        fontWeight: '700',
        fontFamily: 'PlusJakartaSans_700Bold',
    },
    creditAmount: {
        color: '#10B981',
    },
    debitAmount: {
        color: '#EF4444',
    },
    transactionDivider: {
        height: 1,
        backgroundColor: 'rgba(226, 232, 240, 0.5)',
    },
});
