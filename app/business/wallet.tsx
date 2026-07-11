import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    Alert,
    Animated,
    Dimensions,
    Modal,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { primary, surface, text, textSecondary } from '../../constants/Colors';
import { theme } from '../../constants/theme';
import { api, ApiError } from '../../utils/api';

const { width } = Dimensions.get('window');

// Friendly labels for backend ledger `kind` values
const KIND_LABEL: Record<string, string> = {
    topup: 'Wallet top-up',
    shipment_debit: 'Shipment payment',
    shipment_credit: 'Earnings credited',
    shipment_escrow: 'Held in escrow',
    refund: 'Refund',
    withdrawal: 'Withdrawal',
    direct_upi: 'UPI received',
    adjustment: 'Adjustment',
    gst: 'GST',
};

export default function Wallet() {
    const router = useRouter();
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const [balance, setBalance] = useState<number>(0);
    const [txns, setTxns] = useState<any[]>([]);
    const [topupVisible, setTopupVisible] = useState(false);
    const [withdrawVisible, setWithdrawVisible] = useState(false);
    const [topupAmount, setTopupAmount] = useState('');
    const [withdrawAmt, setWithdrawAmt] = useState('');
    const [minBalance, setMinBalance] = useState(0);
    const [busy, setBusy] = useState(false);

    const [credits, setCredits] = useState(0);
    const [debits, setDebits] = useState(0);

    const load = useCallback(async () => {
        try {
            const w = await api.wallet();
            setBalance(w.balance);
            setMinBalance(w.minBalance || 0);
            // Pull a wider slice for "this month" totals
            const all = await api.walletTransactions(undefined, 500);
            setTxns(all.slice(0, 20));
            const startOfMonth = new Date(); startOfMonth.setDate(1); startOfMonth.setHours(0,0,0,0);
            let c = 0, d = 0;
            for (const t of all) {
                const dt = new Date(t.createdAt);
                if (dt < startOfMonth) continue;
                if (t.amount >= 0) c += t.amount; else d += Math.abs(t.amount);
            }
            setCredits(Math.round(c));
            setDebits(Math.round(d));
        } catch (e) {
            console.warn('wallet load failed', e);
        }
    }, []);

    useEffect(() => {
        Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }).start();
        load();
    }, [load]);

    const handleWithdraw = async () => {
        const n = parseFloat(withdrawAmt);
        if (!Number.isFinite(n) || n <= 0) {
            Alert.alert('Enter a valid amount');
            return;
        }
        if (n > balance) {
            Alert.alert('Insufficient balance');
            return;
        }
        if (balance - n < minBalance) {
            Alert.alert('Minimum balance', `You must keep at least ₹${minBalance.toLocaleString()} in your wallet.`);
            return;
        }
        setBusy(true);
        try {
            const me = await api.me();
            const bank = me.payoutDetails;
            if (!bank || (!bank.upiId && !bank.accountNumber)) {
                Alert.alert('Add payout account', 'Save bank or UPI under Profile → Payment Methods first.');
                setBusy(false);
                return;
            }
            await api.withdraw(n, bank as object);
            setWithdrawVisible(false);
            setWithdrawAmt('');
            Alert.alert('Request sent', 'Admin will review and transfer to your saved account.');
            load();
        } catch (e: any) {
            Alert.alert('Withdraw failed', e instanceof ApiError ? e.message : (e?.message || 'unknown'));
        } finally {
            setBusy(false);
        }
    };

    const handleTopup = async () => {
        const n = parseFloat(topupAmount);
        if (!Number.isFinite(n) || n <= 0) {
            Alert.alert('Enter a valid amount');
            return;
        }
        setBusy(true);
        try {
            const res = await api.topupDummy(n);
            setBalance(res.newBalance);
            setTopupVisible(false);
            setTopupAmount('');
            Alert.alert('Top-up successful', `New balance: ₹${res.newBalance.toLocaleString()}`);
            load();
        } catch (e: any) {
            Alert.alert('Top-up failed', e instanceof ApiError ? e.message : (e?.message || 'unknown'));
        } finally {
            setBusy(false);
        }
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
                    <Text style={styles.headerTitle}>Wallet</Text>
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
                        <Text style={styles.balanceSubtext}>
                            Current balance{minBalance > 0 ? ` · min ₹${minBalance.toLocaleString()}` : ''}
                        </Text>

                        {/* Quick Actions */}
                        <View style={styles.quickActions}>
                            <TouchableOpacity style={styles.actionButton} onPress={() => setTopupVisible(true)}>
                                <View style={styles.actionIconContainer}>
                                    <Ionicons name="add" size={20} color={text} />
                                </View>
                                <Text style={styles.actionText}>Add Money</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.actionButton} onPress={() => setWithdrawVisible(true)}>
                                <View style={styles.actionIconContainer}>
                                    <Ionicons name="arrow-up" size={20} color={text} />
                                </View>
                                <Text style={styles.actionText}>Withdraw</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.actionButton} onPress={() => router.push('/business/payment-methods' as any)}>
                                <View style={styles.actionIconContainer}>
                                    <Ionicons name="card-outline" size={20} color={text} />
                                </View>
                                <Text style={styles.actionText}>Bank / UPI</Text>
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
                            <Text style={styles.statLabel}>Credits this month</Text>
                            <Text style={[styles.statValue, { color: '#10B981' }]}>+₹{credits.toLocaleString()}</Text>
                        </LinearGradient>

                        <LinearGradient
                            colors={['rgba(239, 68, 68, 0.1)', 'rgba(248, 113, 113, 0.05)']}
                            style={styles.statCard}
                        >
                            <View style={[styles.statIconContainer, { backgroundColor: 'rgba(239, 68, 68, 0.15)' }]}>
                                <Ionicons name="trending-down" size={18} color="#EF4444" />
                            </View>
                            <Text style={styles.statLabel}>Debits this month</Text>
                            <Text style={[styles.statValue, { color: '#EF4444' }]}>-₹{debits.toLocaleString()}</Text>
                        </LinearGradient>
                    </View>

                    {/* Transactions */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Recent Transactions</Text>
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

            {/* Dummy top-up modal — replaces Razorpay flow until live keys are wired */}
            <Modal visible={topupVisible} transparent animationType="fade" onRequestClose={() => setTopupVisible(false)}>
                <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', padding: 24 }}>
                    <View style={{ backgroundColor: '#fff', borderRadius: 16, padding: 20 }}>
                        <Text style={{ fontSize: 18, fontWeight: '700', marginBottom: 6 }}>Add Money</Text>
                        <Text style={{ fontSize: 13, color: textSecondary, marginBottom: 16 }}>
                            (Dummy mode — money is credited instantly. Replace with Razorpay later.)
                        </Text>
                        <TextInput
                            keyboardType="numeric"
                            value={topupAmount}
                            onChangeText={setTopupAmount}
                            placeholder="Amount (₹)"
                            style={{ borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 10, padding: 12, fontSize: 16 }}
                        />
                        <View style={{ flexDirection: 'row', gap: 12, marginTop: 16 }}>
                            <TouchableOpacity
                                style={{ flex: 1, padding: 14, borderRadius: 10, borderWidth: 1, borderColor: '#E2E8F0', alignItems: 'center' }}
                                onPress={() => { setTopupVisible(false); setTopupAmount(''); }}
                            >
                                <Text style={{ color: text, fontWeight: '600' }}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{ flex: 1, padding: 14, borderRadius: 10, backgroundColor: primary, alignItems: 'center', opacity: busy ? 0.5 : 1 }}
                                onPress={handleTopup}
                                disabled={busy}
                            >
                                <Text style={{ color: '#fff', fontWeight: '700' }}>{busy ? 'Adding…' : 'Add'}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            <Modal visible={withdrawVisible} transparent animationType="fade" onRequestClose={() => setWithdrawVisible(false)}>
                <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', padding: 24 }}>
                    <View style={{ backgroundColor: '#fff', borderRadius: 16, padding: 20 }}>
                        <Text style={{ fontSize: 18, fontWeight: '700', marginBottom: 6 }}>Withdraw</Text>
                        <Text style={{ fontSize: 13, color: textSecondary, marginBottom: 16 }}>
                            Sent to your saved bank/UPI. Balance: ₹{balance.toLocaleString()}
                            {minBalance > 0 ? ` (min keep ₹${minBalance.toLocaleString()})` : ''}
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
                                onPress={handleWithdraw}
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
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        ...theme.shadows.light,
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        ...theme.typography.h3,
        color: text,
        fontWeight: '600',
    },
    moreButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
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
        ...theme.typography.body,
        fontSize: 13,
        color: text,
    },
    walletIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    balanceAmount: {
        ...theme.typography.h1,
        fontSize: 34,
        fontWeight: '700',
        color: text,
        marginBottom: theme.spacing.xs,
    },
    balanceSubtext: {
        ...theme.typography.caption,
        fontSize: 12,
        color: textSecondary,
        marginBottom: theme.spacing.lg,
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
        ...theme.typography.caption,
        fontSize: 11,
        color: text,
        fontWeight: '500',
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
        ...theme.typography.caption,
        fontSize: 11,
        color: textSecondary,
        marginBottom: 2,
    },
    statValue: {
        ...theme.typography.h3,
        fontSize: 18,
        fontWeight: '700',
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
        ...theme.typography.h3,
        color: text,
        fontWeight: '600',
    },
    seeAllText: {
        ...theme.typography.bodyMedium,
        color: primary,
        fontWeight: '600',
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
        ...theme.typography.bodyMedium,
        color: text,
        marginBottom: 2,
    },
    transactionDate: {
        ...theme.typography.caption,
        color: textSecondary,
    },
    transactionAmount: {
        ...theme.typography.bodyMedium,
        fontWeight: '700',
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
