import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Card } from '@/components/ui/Card';
import { StatusChip } from '@/components/ui/StatusChip';
import { colors, spacing, typography, borderRadius, shadows } from '@/constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const mockPayments = [
  {
    id: '1',
    tripId: 'TRK2024001',
    route: 'Mumbai → Delhi',
    date: '2024-01-12',
    amount: 12500,
    platformFee: 500,
    total: 13000,
    status: 'paid' as const,
    paymentMethod: 'UPI',
    invoiceUrl: '#',
  },
  {
    id: '2',
    tripId: 'TRK2024002',
    route: 'Bangalore → Chennai',
    date: '2024-01-10',
    amount: 4500,
    platformFee: 200,
    total: 4700,
    status: 'paid' as const,
    paymentMethod: 'Card',
    invoiceUrl: '#',
  },
  {
    id: '3',
    tripId: 'TRK2024003',
    route: 'Pune → Hyderabad',
    date: '2024-01-08',
    amount: 8200,
    platformFee: 350,
    total: 8550,
    status: 'pending' as const,
    paymentMethod: 'Cash',
    invoiceUrl: '#',
  },
];

const totalStats = {
  totalSpent: 45230,
  thisMonth: 26250,
  pending: 8550,
  transactions: mockPayments.length,
};

export default function PaymentsScreen() {
  const [selectedFilter, setSelectedFilter] = useState('all');

  const handleDownloadInvoice = (payment: typeof mockPayments[0]) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // TODO: Download invoice
    console.log('Download invoice:', payment.id);
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colors.primaryGradientStart, colors.primaryGradientEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
      >
        <View style={[styles.decorCircle, styles.decorCircle1]} />
      </LinearGradient>

      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Payments & Invoices</Text>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Stats Cards */}
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <LinearGradient
                colors={[colors.primary, colors.primaryDark]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.statGradient}
              >
                <Ionicons name="wallet" size={24} color={colors.textWhite} />
                <Text style={styles.statValue}>₹{(totalStats.totalSpent / 1000).toFixed(1)}K</Text>
                <Text style={styles.statLabel}>Total Spent</Text>
              </LinearGradient>
            </View>

            <View style={styles.statCard}>
              <LinearGradient
                colors={[colors.success, '#059669']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.statGradient}
              >
                <Ionicons name="checkmark-circle" size={24} color={colors.textWhite} />
                <Text style={styles.statValue}>₹{(totalStats.thisMonth / 1000).toFixed(1)}K</Text>
                <Text style={styles.statLabel}>This Month</Text>
              </LinearGradient>
            </View>

            <View style={styles.statCard}>
              <LinearGradient
                colors={[colors.warning, '#D97706']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.statGradient}
              >
                <Ionicons name="time" size={24} color={colors.textWhite} />
                <Text style={styles.statValue}>₹{(totalStats.pending / 1000).toFixed(1)}K</Text>
                <Text style={styles.statLabel}>Pending</Text>
              </LinearGradient>
            </View>
          </View>

          {/* Filter Tabs */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.filterTabs}
            contentContainerStyle={styles.filterTabsContent}
          >
            {['all', 'paid', 'pending'].map((filter) => (
              <TouchableOpacity
                key={filter}
                style={[
                  styles.filterTab,
                  selectedFilter === filter && styles.filterTabActive,
                ]}
                onPress={() => {
                  setSelectedFilter(filter);
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }}
              >
                <Text
                  style={[
                    styles.filterTabText,
                    selectedFilter === filter && styles.filterTabTextActive,
                  ]}
                >
                  {filter.charAt(0).toUpperCase() + filter.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Payments List */}
          <View style={styles.paymentsList}>
            {mockPayments.map((payment) => (
              <Card key={payment.id} style={styles.paymentCard}>
                <View style={styles.paymentHeader}>
                  <View>
                    <Text style={styles.tripId}>{payment.tripId}</Text>
                    <Text style={styles.route}>{payment.route}</Text>
                  </View>
                  {payment.status === 'paid' ? (
                    <View style={styles.paidBadge}>
                      <Ionicons name="checkmark-circle" size={16} color={colors.success} />
                      <Text style={styles.paidText}>Paid</Text>
                    </View>
                  ) : (
                    <View style={styles.pendingBadge}>
                      <Ionicons name="time" size={16} color={colors.warning} />
                      <Text style={styles.pendingText}>Pending</Text>
                    </View>
                  )}
                </View>

                <View style={styles.paymentDetails}>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Trip Cost</Text>
                    <Text style={styles.detailValue}>₹{payment.amount.toLocaleString()}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Platform Fee</Text>
                    <Text style={styles.detailValue}>₹{payment.platformFee}</Text>
                  </View>
                  <View style={styles.divider} />
                  <View style={styles.detailRow}>
                    <Text style={styles.totalLabel}>Total Amount</Text>
                    <Text style={styles.totalValue}>₹{payment.total.toLocaleString()}</Text>
                  </View>
                </View>

                <View style={styles.paymentFooter}>
                  <View style={styles.paymentMeta}>
                    <Ionicons name="calendar" size={14} color={colors.textSecondary} />
                    <Text style={styles.metaText}>{payment.date}</Text>
                    <Text style={styles.metaSeparator}>•</Text>
                    <Ionicons name="card" size={14} color={colors.textSecondary} />
                    <Text style={styles.metaText}>{payment.paymentMethod}</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.downloadButton}
                    onPress={() => handleDownloadInvoice(payment)}
                  >
                    <Ionicons name="download" size={16} color={colors.primary} />
                    <Text style={styles.downloadText}>Invoice</Text>
                  </TouchableOpacity>
                </View>
              </Card>
            ))}
          </View>

          <View style={styles.bottomSpacer} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 200,
    overflow: 'hidden',
  },
  decorCircle1: {
    position: 'absolute',
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: 9999,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    top: -width * 0.4,
    right: -width * 0.3,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  headerTitle: {
    fontSize: typography.sizes['2xl'],
    fontWeight: typography.weights.bold,
    color: colors.textWhite,
  },
  scrollView: {
    flex: 1,
  },
  statsGrid: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  statCard: {
    flex: 1,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    ...shadows.lg,
  },
  statGradient: {
    padding: spacing.md,
    alignItems: 'center',
    minHeight: 100,
    justifyContent: 'center',
  },
  statValue: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.textWhite,
    marginTop: spacing.xs,
  },
  statLabel: {
    fontSize: typography.sizes.xs,
    color: colors.textWhite,
    opacity: 0.9,
    marginTop: spacing.xs - 2,
  },
  filterTabs: {
    marginBottom: spacing.md,
  },
  filterTabsContent: {
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  filterTab: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.full,
    backgroundColor: colors.backgroundCard,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  filterTabActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterTabText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    color: colors.textSecondary,
  },
  filterTabTextActive: {
    color: colors.textWhite,
  },
  paymentsList: {
    paddingHorizontal: spacing.lg,
  },
  paymentCard: {
    marginBottom: spacing.md,
  },
  paymentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  tripId: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
    color: colors.text,
    marginBottom: spacing.xs - 2,
  },
  route: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
  },
  paidBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs - 2,
    backgroundColor: colors.successLight,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs - 2,
    borderRadius: borderRadius.full,
  },
  paidText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
    color: colors.success,
  },
  pendingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs - 2,
    backgroundColor: colors.warningLight,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs - 2,
    borderRadius: borderRadius.full,
  },
  pendingText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
    color: colors.warning,
  },
  paymentDetails: {
    marginBottom: spacing.md,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  detailLabel: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
  },
  detailValue: {
    fontSize: typography.sizes.sm,
    color: colors.text,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.sm,
  },
  totalLabel: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    color: colors.text,
  },
  totalValue: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
    color: colors.primary,
  },
  paymentFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  paymentMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs - 2,
  },
  metaText: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
  },
  metaSeparator: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    marginHorizontal: spacing.xs - 2,
  },
  downloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs - 2,
    backgroundColor: colors.primaryTransparent,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  downloadText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
    color: colors.primary,
  },
  bottomSpacer: {
    height: 80,
  },
});

