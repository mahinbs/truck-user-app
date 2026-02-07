import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef } from 'react';
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

const transactions = [
    { id: '1', type: 'credit', title: 'Trip Completed', amount: 24500, date: 'Today, 2:30 PM' },
    { id: '2', type: 'debit', title: 'Fuel', amount: 3000, date: 'Yesterday, 4:15 PM' },
    { id: '3', type: 'credit', title: 'Trip Completed', amount: 18200, date: 'Dec 10, 11:20 AM' },
    { id: '4', type: 'debit', title: 'Maintenance', amount: 5000, date: 'Dec 9, 3:45 PM' },
];

export default function Earnings() {
    const router = useRouter();
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
        }).start();
    }, []);

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
                        <Text style={styles.balanceAmount}>₹1,42,750</Text>
                        <Text style={styles.balanceSubtext}>Available to withdraw</Text>

                        {/* Quick Actions */}
                        <View style={styles.quickActions}>
                            <TouchableOpacity style={styles.actionButton}>
                                <View style={styles.actionIconContainer}>
                                    <Ionicons name="add" size={20} color={text} />
                                </View>
                                <Text style={styles.actionText}>Add Money</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.actionButton}>
                                <View style={styles.actionIconContainer}>
                                    <Ionicons name="arrow-up" size={20} color={text} />
                                </View>
                                <Text style={styles.actionText}>Withdraw</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.actionButton}>
                                <View style={styles.actionIconContainer}>
                                    <Ionicons name="swap-horizontal" size={20} color={text} />
                                </View>
                                <Text style={styles.actionText}>Transfer</Text>
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
                            <Text style={[styles.statValue, { color: '#10B981' }]}>+₹89,500</Text>
                        </LinearGradient>

                        <LinearGradient
                            colors={['rgba(239, 68, 68, 0.1)', 'rgba(248, 113, 113, 0.05)']}
                            style={styles.statCard}
                        >
                            <View style={[styles.statIconContainer, { backgroundColor: 'rgba(239, 68, 68, 0.15)' }]}>
                                <Ionicons name="trending-down" size={18} color="#EF4444" />
                            </View>
                            <Text style={styles.statLabel}>Expenses</Text>
                            <Text style={[styles.statValue, { color: '#EF4444' }]}>-₹8,200</Text>
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
                            {transactions.map((transaction, index) => (
                                <View key={transaction.id}>
                                    <View style={styles.transactionItem}>
                                        <LinearGradient
                                            colors={
                                                transaction.type === 'credit'
                                                    ? ['rgba(16, 185, 129, 0.2)', 'rgba(16, 185, 129, 0.1)']
                                                    : ['rgba(239, 68, 68, 0.2)', 'rgba(239, 68, 68, 0.1)']
                                            }
                                            style={styles.transactionIcon}
                                        >
                                            <Ionicons
                                                name={transaction.type === 'credit' ? 'arrow-down' : 'arrow-up'}
                                                size={20}
                                                color={transaction.type === 'credit' ? '#10B981' : '#EF4444'}
                                            />
                                        </LinearGradient>
                                        <View style={styles.transactionDetails}>
                                            <Text style={styles.transactionDescription}>{transaction.title}</Text>
                                            <Text style={styles.transactionDate}>{transaction.date}</Text>
                                        </View>
                                        <Text
                                            style={[
                                                styles.transactionAmount,
                                                transaction.type === 'credit' ? styles.creditAmount : styles.debitAmount,
                                            ]}
                                        >
                                            {transaction.type === 'credit' ? '+' : '-'}₹{transaction.amount.toLocaleString()}
                                        </Text>
                                    </View>
                                    {index < transactions.length - 1 && <View style={styles.transactionDivider} />}
                                </View>
                            ))}
                        </LinearGradient>
                    </View>
                </ScrollView>
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
