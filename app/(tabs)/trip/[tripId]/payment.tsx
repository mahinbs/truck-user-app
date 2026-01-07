import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Divider } from '@/components/ui/Divider';
import { colors, spacing, typography, borderRadius, shadows } from '@/constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PaymentScreen() {
  const { tripId } = useLocalSearchParams();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('upi');

  // Mock data
  const paymentData = {
    invoiceNumber: 'INV-2024-001234',
    issueDate: '2024-01-07',
    dueDate: '2024-01-08',
    status: 'partially-paid',
    breakdown: {
      baseFare: 1200,
      gst: 216,
      toll: 0,
      loading: 0,
      unloading: 0,
      total: 1416,
    },
    payments: [
      {
        id: '1',
        amount: 708,
        method: 'UPI',
        date: '2024-01-07 09:30 AM',
        status: 'success',
        type: 'Advance Payment (50%)',
      },
    ],
    dueAmount: 708,
  };

  const paymentMethods = [
    { id: 'upi', name: 'UPI', icon: 'phone-portrait', color: colors.info },
    { id: 'card', name: 'Debit/Credit Card', icon: 'card', color: colors.secondary },
    { id: 'wallet', name: 'Wallet', icon: 'wallet', color: colors.warning },
    { id: 'netbanking', name: 'Net Banking', icon: 'business', color: colors.success },
  ];

  const handleDownloadInvoice = () => {
    Alert.alert('Download Invoice', 'Invoice will be downloaded as PDF');
  };

  const handlePayNow = () => {
    Alert.alert(
      'Payment Confirmation',
      `Pay ₹${paymentData.dueAmount} using ${paymentMethods.find(m => m.id === selectedPaymentMethod)?.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Pay Now', onPress: () => {
          Alert.alert('Success', 'Payment completed successfully!');
          router.push(`/(tabs)/trip/${tripId}/rating`);
        }},
      ]
    );
  };

  const handleShare = () => {
    Alert.alert('Share Invoice', 'Invoice sharing functionality will be implemented');
  };

  const getStatusBadge = () => {
    switch (paymentData.status) {
      case 'paid':
        return <Badge label="Paid" variant="success" />;
      case 'partially-paid':
        return <Badge label="Partially Paid" variant="warning" />;
      case 'pending':
        return <Badge label="Pending" variant="error" />;
      default:
        return <Badge label={paymentData.status} variant="default" />;
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Payment & Invoice</Text>
        </View>
        <TouchableOpacity style={styles.headerButton} onPress={handleShare}>
          <Ionicons name="share-outline" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Invoice Header */}
        <Card style={styles.invoiceHeader}>
          <View style={styles.invoiceHeaderTop}>
            <View>
              <Text style={styles.invoiceLabel}>Invoice Number</Text>
              <Text style={styles.invoiceNumber}>{paymentData.invoiceNumber}</Text>
            </View>
            {getStatusBadge()}
          </View>

          <View style={styles.invoiceDates}>
            <View style={styles.dateItem}>
              <Ionicons name="calendar" size={16} color={colors.textSecondary} />
              <View style={styles.dateInfo}>
                <Text style={styles.dateLabel}>Issue Date</Text>
                <Text style={styles.dateValue}>{paymentData.issueDate}</Text>
              </View>
            </View>
            <View style={styles.dateItem}>
              <Ionicons name="alarm" size={16} color={colors.textSecondary} />
              <View style={styles.dateInfo}>
                <Text style={styles.dateLabel}>Due Date</Text>
                <Text style={styles.dateValue}>{paymentData.dueDate}</Text>
              </View>
            </View>
          </View>
        </Card>

        {/* Cost Breakdown */}
        <Card style={styles.breakdownCard}>
          <Text style={styles.cardTitle}>Cost Breakdown</Text>

          <View style={styles.breakdownRow}>
            <View style={styles.breakdownLeft}>
              <Ionicons name="cash" size={18} color={colors.textSecondary} />
              <Text style={styles.breakdownLabel}>Base Fare</Text>
            </View>
            <Text style={styles.breakdownValue}>₹{paymentData.breakdown.baseFare}</Text>
          </View>

          <View style={styles.breakdownRow}>
            <View style={styles.breakdownLeft}>
              <Ionicons name="receipt" size={18} color={colors.textSecondary} />
              <Text style={styles.breakdownLabel}>GST (18%)</Text>
            </View>
            <Text style={styles.breakdownValue}>₹{paymentData.breakdown.gst}</Text>
          </View>

          {paymentData.breakdown.toll > 0 && (
            <View style={styles.breakdownRow}>
              <View style={styles.breakdownLeft}>
                <Ionicons name="car" size={18} color={colors.textSecondary} />
                <Text style={styles.breakdownLabel}>Toll Charges</Text>
              </View>
              <Text style={styles.breakdownValue}>₹{paymentData.breakdown.toll}</Text>
            </View>
          )}

          {paymentData.breakdown.loading > 0 && (
            <View style={styles.breakdownRow}>
              <View style={styles.breakdownLeft}>
                <Ionicons name="cube" size={18} color={colors.textSecondary} />
                <Text style={styles.breakdownLabel}>Loading Charges</Text>
              </View>
              <Text style={styles.breakdownValue}>₹{paymentData.breakdown.loading}</Text>
            </View>
          )}

          <Divider style={styles.divider} />

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalValue}>₹{paymentData.breakdown.total}</Text>
          </View>
        </Card>

        {/* Payment History */}
        <Card style={styles.historyCard}>
          <Text style={styles.cardTitle}>Payment History</Text>

          {paymentData.payments.map((payment) => (
            <View key={payment.id} style={styles.paymentItem}>
              <View style={styles.paymentLeft}>
                <View style={[styles.paymentIcon, { backgroundColor: `${colors.success}20` }]}>
                  <Ionicons name="checkmark-circle" size={24} color={colors.success} />
                </View>
                <View style={styles.paymentInfo}>
                  <Text style={styles.paymentType}>{payment.type}</Text>
                  <Text style={styles.paymentDate}>{payment.date}</Text>
                  <Text style={styles.paymentMethod}>{payment.method}</Text>
                </View>
              </View>
              <Text style={styles.paymentAmount}>₹{payment.amount}</Text>
            </View>
          ))}
        </Card>

        {/* Due Amount Card */}
        {paymentData.dueAmount > 0 && (
          <>
            <Card style={styles.dueCard}>
              <View style={styles.dueHeader}>
                <View>
                  <Text style={styles.dueLabel}>Amount Due</Text>
                  <Text style={styles.dueSubtext}>Payment on delivery</Text>
                </View>
                <Text style={styles.dueAmount}>₹{paymentData.dueAmount}</Text>
              </View>
            </Card>

            {/* Payment Methods */}
            <Card style={styles.paymentMethodsCard}>
              <Text style={styles.cardTitle}>Select Payment Method</Text>

              {paymentMethods.map((method) => (
                <TouchableOpacity
                  key={method.id}
                  style={[
                    styles.methodItem,
                    selectedPaymentMethod === method.id && styles.methodItemSelected,
                  ]}
                  onPress={() => setSelectedPaymentMethod(method.id)}
                >
                  <View style={styles.methodLeft}>
                    <View style={[styles.methodIcon, { backgroundColor: `${method.color}20` }]}>
                      <Ionicons name={method.icon as any} size={24} color={method.color} />
                    </View>
                    <Text style={styles.methodName}>{method.name}</Text>
                  </View>
                  <View
                    style={[
                      styles.radioOuter,
                      selectedPaymentMethod === method.id && styles.radioOuterSelected,
                    ]}
                  >
                    {selectedPaymentMethod === method.id && <View style={styles.radioInner} />}
                  </View>
                </TouchableOpacity>
              ))}
            </Card>

            {/* Pay Button */}
            <View style={styles.payButtonContainer}>
              <Button
                title={`Pay ₹${paymentData.dueAmount}`}
                onPress={handlePayNow}
                icon="checkmark-circle"
                iconPosition="right"
                fullWidth
                size="lg"
              />
            </View>
          </>
        )}

        {/* Download Invoice Button */}
        <View style={styles.downloadButtonContainer}>
          <Button
            title="Download Invoice"
            onPress={handleDownloadInvoice}
            variant="outline"
            icon="download"
            fullWidth
          />
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.backgroundCard,
    ...shadows.sm,
  },
  headerButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.text,
  },
  scrollView: {
    flex: 1,
  },
  invoiceHeader: {
    margin: spacing.lg,
  },
  invoiceHeaderTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  invoiceLabel: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  invoiceNumber: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.text,
  },
  invoiceDates: {
    flexDirection: 'row',
    gap: spacing.lg,
  },
  dateItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  dateInfo: {
    flex: 1,
  },
  dateLabel: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
  },
  dateValue: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    color: colors.text,
  },
  breakdownCard: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  cardTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.text,
    marginBottom: spacing.md,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  breakdownLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  breakdownLabel: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
  },
  breakdownValue: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    color: colors.text,
  },
  divider: {
    marginVertical: spacing.sm,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.sm,
  },
  totalLabel: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.text,
  },
  totalValue: {
    fontSize: typography.sizes['2xl'],
    fontWeight: typography.weights.bold,
    color: colors.primary,
  },
  historyCard: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  paymentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  paymentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  paymentIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  paymentInfo: {
    flex: 1,
  },
  paymentType: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    color: colors.text,
    marginBottom: 2,
  },
  paymentDate: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  paymentMethod: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
  },
  paymentAmount: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.success,
  },
  dueCard: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    backgroundColor: `${colors.warning}10`,
    borderWidth: 1,
    borderColor: colors.warning,
  },
  dueHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dueLabel: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  dueSubtext: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
  },
  dueAmount: {
    fontSize: typography.sizes['3xl'],
    fontWeight: typography.weights.bold,
    color: colors.warning,
  },
  paymentMethodsCard: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  methodItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 2,
    borderColor: colors.border,
    marginBottom: spacing.md,
    backgroundColor: colors.backgroundCard,
  },
  methodItemSelected: {
    borderColor: colors.primary,
    backgroundColor: `${colors.primary}08`,
  },
  methodLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  methodIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  methodName: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
    color: colors.text,
  },
  radioOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioOuterSelected: {
    borderColor: colors.primary,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary,
  },
  payButtonContainer: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  downloadButtonContainer: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  bottomSpacer: {
    height: spacing.xl,
  },
});
