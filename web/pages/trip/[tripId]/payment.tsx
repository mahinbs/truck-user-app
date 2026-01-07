import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { FiArrowLeft, FiShare2, FiCalendar, FiClock, FiCheckCircle, FiDownload, FiCreditCard, FiPhone, FiCreditCard as FiWallet, FiBriefcase, FiPhone as FiSmartphone } from 'react-icons/fi';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Divider } from '../../../components/ui/Divider';
import { SafeIcon } from '../../../components/ui/SafeIcon';
import { colors, spacing, typography, borderRadius } from '../../../constants/theme';

const paymentMethods = [
  { id: 'upi', name: 'UPI', icon: FiSmartphone, color: colors.info },
  { id: 'card', name: 'Debit/Credit Card', icon: FiCreditCard, color: colors.secondary },
  { id: 'wallet', name: 'Wallet', icon: FiCreditCard, color: colors.warning },
  { id: 'netbanking', name: 'Net Banking', icon: FiBriefcase, color: colors.success },
];

export default function PaymentPage() {
  const router = useRouter();
  const { tripId } = router.query;
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('upi');

  const paymentData = {
    invoiceNumber: 'INV-2024-001234',
    issueDate: '2024-01-07',
    dueDate: '2024-01-08',
    status: 'partially-paid',
    breakdown: { baseFare: 1200, gst: 216, toll: 0, loading: 0, unloading: 0, total: 1416 },
    payments: [{ id: '1', amount: 708, method: 'UPI', date: '2024-01-07 09:30 AM', status: 'success', type: 'Advance Payment (50%)' }],
    dueAmount: 708,
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

  const handlePayNow = () => {
    if (confirm(`Pay ₹${paymentData.dueAmount} using ${paymentMethods.find((m) => m.id === selectedPaymentMethod)?.name}?`)) {
      alert('Payment completed successfully!');
      router.push(`/trip/${tripId}/rating`);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: colors.background }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: `${spacing.md} ${spacing.lg}`, backgroundColor: colors.backgroundCard, boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)' }}>
        <button onClick={() => router.back()} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: spacing.sm }}>
          <SafeIcon Icon={FiArrowLeft} size={24} color={colors.text} />
        </button>
        <div style={{ fontSize: typography.sizes.lg, fontWeight: typography.weights.bold, color: colors.text }}>Payment & Invoice</div>
        <button onClick={() => alert('Share invoice')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: spacing.sm }}>
          <SafeIcon Icon={FiShare2} size={24} color={colors.text} />
        </button>
      </div>

      <div style={{ padding: spacing.lg, maxWidth: '800px', margin: '0 auto' }}>
        <Card style={{ marginBottom: spacing.md }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: spacing.md }}>
            <div>
              <div style={{ fontSize: typography.sizes.sm, color: colors.textSecondary, marginBottom: spacing.xs }}>Invoice Number</div>
              <div style={{ fontSize: typography.sizes.xl, fontWeight: typography.weights.bold, color: colors.text }}>{paymentData.invoiceNumber}</div>
            </div>
            {getStatusBadge()}
          </div>
          <div style={{ display: 'flex', gap: spacing.lg }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
              <SafeIcon Icon={FiCalendar} size={16} color={colors.textSecondary} />
              <div>
                <div style={{ fontSize: typography.sizes.xs, color: colors.textSecondary }}>Issue Date</div>
                <div style={{ fontSize: typography.sizes.sm, fontWeight: typography.weights.medium, color: colors.text }}>{paymentData.issueDate}</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
              <SafeIcon Icon={FiClock} size={16} color={colors.textSecondary} />
              <div>
                <div style={{ fontSize: typography.sizes.xs, color: colors.textSecondary }}>Due Date</div>
                <div style={{ fontSize: typography.sizes.sm, fontWeight: typography.weights.medium, color: colors.text }}>{paymentData.dueDate}</div>
              </div>
            </div>
          </div>
        </Card>

        <Card style={{ marginBottom: spacing.md }}>
          <h2 style={{ fontSize: typography.sizes.lg, fontWeight: typography.weights.bold, color: colors.text, marginBottom: spacing.md }}>Cost Breakdown</h2>
          {[
            { icon: 'cash', label: 'Base Fare', value: paymentData.breakdown.baseFare },
            { icon: 'receipt', label: 'GST (18%)', value: paymentData.breakdown.gst },
          ].map((item, idx) => (
            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: spacing.md }}>
              <span style={{ fontSize: typography.sizes.sm, color: colors.textSecondary }}>{item.label}</span>
              <span style={{ fontSize: typography.sizes.sm, fontWeight: typography.weights.semibold, color: colors.text }}>₹{item.value}</span>
            </div>
          ))}
          <Divider />
          <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: spacing.sm }}>
            <span style={{ fontSize: typography.sizes.lg, fontWeight: typography.weights.bold, color: colors.text }}>Total Amount</span>
            <span style={{ fontSize: typography.sizes['2xl'], fontWeight: typography.weights.bold, color: colors.primary }}>₹{paymentData.breakdown.total}</span>
          </div>
        </Card>

        <Card style={{ marginBottom: spacing.md }}>
          <h2 style={{ fontSize: typography.sizes.lg, fontWeight: typography.weights.bold, color: colors.text, marginBottom: spacing.md }}>Payment History</h2>
          {paymentData.payments.map((payment) => (
            <div key={payment.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: `${spacing.md} 0`, borderBottom: `1px solid ${colors.border}` }}>
              <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '24px', backgroundColor: `${colors.success}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: spacing.md }}>
                  <SafeIcon Icon={FiCheckCircle} size={24} color={colors.success} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: typography.sizes.sm, fontWeight: typography.weights.semibold, color: colors.text, marginBottom: '2px' }}>{payment.type}</div>
                  <div style={{ fontSize: typography.sizes.xs, color: colors.textSecondary, marginBottom: '2px' }}>{payment.date}</div>
                  <div style={{ fontSize: typography.sizes.xs, color: colors.textSecondary }}>{payment.method}</div>
                </div>
              </div>
              <div style={{ fontSize: typography.sizes.lg, fontWeight: typography.weights.bold, color: colors.success }}>₹{payment.amount}</div>
            </div>
          ))}
        </Card>

        {paymentData.dueAmount > 0 && (
          <>
            <Card style={{ marginBottom: spacing.md, backgroundColor: `${colors.warning}10`, border: `1px solid ${colors.warning}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: typography.sizes.md, fontWeight: typography.weights.semibold, color: colors.text, marginBottom: spacing.xs }}>Amount Due</div>
                  <div style={{ fontSize: typography.sizes.sm, color: colors.textSecondary }}>Payment on delivery</div>
                </div>
                <div style={{ fontSize: typography.sizes['3xl'], fontWeight: typography.weights.bold, color: colors.warning }}>₹{paymentData.dueAmount}</div>
              </div>
            </Card>

            <Card style={{ marginBottom: spacing.md }}>
              <h2 style={{ fontSize: typography.sizes.lg, fontWeight: typography.weights.bold, color: colors.text, marginBottom: spacing.md }}>Select Payment Method</h2>
              {paymentMethods.map((method) => {
                const Icon = method.icon;
                return (
                  <button
                    key={method.id}
                    onClick={() => setSelectedPaymentMethod(method.id)}
                    style={{
                      width: '100%',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: spacing.md,
                      borderRadius: borderRadius.md,
                      border: `2px solid ${selectedPaymentMethod === method.id ? colors.primary : colors.border}`,
                      backgroundColor: selectedPaymentMethod === method.id ? `${colors.primary}08` : colors.backgroundCard,
                      marginBottom: spacing.md,
                      cursor: 'pointer',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <div style={{ width: '48px', height: '48px', borderRadius: '24px', backgroundColor: `${method.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: spacing.md }}>
                        <Icon size={24} color={method.color} />
                      </div>
                      <span style={{ fontSize: typography.sizes.md, fontWeight: typography.weights.medium, color: colors.text }}>{method.name}</span>
                    </div>
                    <div
                      style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '12px',
                        border: `2px solid ${selectedPaymentMethod === method.id ? colors.primary : colors.border}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {selectedPaymentMethod === method.id && <div style={{ width: '12px', height: '12px', borderRadius: '6px', backgroundColor: colors.primary }} />}
                    </div>
                  </button>
                );
              })}
            </Card>

            <Button title={`Pay ₹${paymentData.dueAmount}`} onClick={handlePayNow} icon="checkmark-circle" iconPosition="right" fullWidth size="lg" style={{ marginBottom: spacing.md }} />
          </>
        )}

        <Button title="Download Invoice" onClick={() => alert('Download invoice')} variant="outline" icon="download" fullWidth />
      </div>
    </div>
  );
}
