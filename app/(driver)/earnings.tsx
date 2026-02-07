import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
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
    surface,
    text,
    textSecondary
} from '../../constants/Colors';
import { theme } from '../../constants/theme';

const { width } = Dimensions.get('window');

const transactions = [
    { id: '1', type: 'credit', title: 'Trip Completed', amount: 24500, date: 'Dec 15, 2026' },
    { id: '2', type: 'debit', title: 'Fuel', amount: -3000, date: 'Dec 14, 2026' },
    { id: '3', type: 'credit', title: 'Trip Completed', amount: 18200, date: 'Dec 12, 2026' },
];

export default function Earnings() {
    const router = useRouter();
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 800,
                useNativeDriver: true,
            }),
        ]).start();
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
                    <View style={styles.placeholderButton} />
                </View>

                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.content}
                    showsVerticalScrollIndicator={false}
                >
                    <Animated.View
                        style={{
                            opacity: fadeAnim,
                            transform: [{ translateY: slideAnim }],
                        }}
                    >
                        {/* Total Earnings Card */}
                        <LinearGradient
                            colors={theme.gradients.primary as any}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.earningsCard}
                        >
                            <View style={styles.earningsContent}>
                                <Text style={styles.earningsLabel}>Total Earnings (This Month)</Text>
                                <Text style={styles.earningsAmount}>₹1,42,750</Text>

                                <View style={styles.statsContainer}>
                                    <View style={styles.statItem}>
                                        <View style={styles.statIconContainer}>
                                            <Ionicons name="map-outline" size={20} color={surface} />
                                        </View>
                                        <Text style={styles.statValue}>28</Text>
                                        <Text style={styles.statLabel}>Trips</Text>
                                    </View>
                                    <View style={styles.statDivider} />
                                    <View style={styles.statItem}>
                                        <View style={styles.statIconContainer}>
                                            <Ionicons name="trending-up-outline" size={20} color={surface} />
                                        </View>
                                        <Text style={styles.statValue}>₹5,098</Text>
                                        <Text style={styles.statLabel}>Avg/Trip</Text>
                                    </View>
                                </View>
                            </View>
                        </LinearGradient>

                        {/* Recent Transactions */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Transaction History</Text>

                            <LinearGradient
                                colors={['rgba(255, 255, 255, 0.8)', 'rgba(255, 255, 255, 0.5)']}
                                style={styles.transactionsCard}
                            >
                                <BlurView intensity={20} tint="light" style={styles.transactionsBlur}>
                                    {transactions.map((transaction, index) => (
                                        <View
                                            key={transaction.id}
                                            style={[
                                                styles.transaction,
                                                index < transactions.length - 1 && styles.transactionBorder,
                                            ]}
                                        >
                                            <View style={styles.transactionLeft}>
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
                                                        size={18}
                                                        color={transaction.type === 'credit' ? '#10B981' : '#EF4444'}
                                                    />
                                                </LinearGradient>
                                                <View>
                                                    <Text style={styles.transactionTitle}>{transaction.title}</Text>
                                                    <Text style={styles.transactionDate}>{transaction.date}</Text>
                                                </View>
                                            </View>
                                            <Text
                                                style={[
                                                    styles.transactionAmount,
                                                    transaction.type === 'credit' ? styles.amountCredit : styles.amountDebit,
                                                ]}
                                            >
                                                {transaction.amount > 0 ? '+' : ''}₹{Math.abs(transaction.amount).toLocaleString()}
                                            </Text>
                                        </View>
                                    ))}
                                </BlurView>
                            </LinearGradient>
                        </View>
                    </Animated.View>
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
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
    },
    placeholderButton: {
        width: 40,
    },
    headerTitle: {
        ...theme.typography.h2,
        fontSize: 20,
        color: text,
        fontWeight: '700',
    },
    scrollView: {
        flex: 1,
    },
    content: {
        paddingHorizontal: theme.spacing.base,
        paddingTop: theme.spacing.base,
        paddingBottom: 100,
    },
    earningsCard: {
        borderRadius: theme.borderRadius.card,
        padding: theme.spacing.lg,
        marginBottom: theme.spacing.lg,
        ...theme.shadows.glow,
    },
    earningsContent: {
        alignItems: 'center',
    },
    earningsLabel: {
        ...theme.typography.body,
        color: 'rgba(255, 255, 255, 0.9)',
        marginBottom: theme.spacing.xs,
    },
    earningsAmount: {
        ...theme.typography.h1,
        fontSize: 36,
        color: surface,
        fontWeight: '700',
        marginBottom: theme.spacing.xl,
    },
    statsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        borderRadius: theme.borderRadius.md,
        padding: theme.spacing.md,
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
    },
    statIconContainer: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: theme.spacing.xs,
    },
    statValue: {
        ...theme.typography.h3,
        fontSize: 18,
        color: surface,
        fontWeight: '700',
        marginBottom: 2,
    },
    statLabel: {
        ...theme.typography.caption,
        color: 'rgba(255, 255, 255, 0.8)',
    },
    statDivider: {
        width: 1,
        height: 40,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
    section: {
        marginBottom: theme.spacing.xl,
    },
    sectionTitle: {
        ...theme.typography.h3,
        fontSize: 18,
        color: text,
        marginBottom: theme.spacing.md,
        fontWeight: '600',
    },
    transactionsCard: {
        borderRadius: theme.borderRadius.card,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
        ...theme.shadows.card,
    },
    transactionsBlur: {
        padding: theme.spacing.base,
    },
    transaction: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: theme.spacing.md,
    },
    transactionBorder: {
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(226, 232, 240, 0.5)',
    },
    transactionLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    transactionIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: theme.spacing.md,
    },
    transactionTitle: {
        ...theme.typography.bodyMedium,
        fontSize: 14,
        color: text,
        fontWeight: '600',
        marginBottom: 2,
    },
    transactionDate: {
        ...theme.typography.caption,
        fontSize: 12,
        color: textSecondary,
    },
    transactionAmount: {
        ...theme.typography.bodyMedium,
        fontSize: 16,
        fontWeight: '700',
    },
    amountCredit: {
        color: '#10B981',
    },
    amountDebit: {
        color: '#EF4444',
    },
});
