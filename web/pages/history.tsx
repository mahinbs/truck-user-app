import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { FiArrowLeft, FiFilter, FiPackage, FiCheckCircle, FiDollarSign, FiStar, FiCalendar, FiBarChart2, FiFileText, FiChevronRight } from 'react-icons/fi';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Chip } from '../components/ui/Chip';
import { SafeIcon } from '../components/ui/SafeIcon';
import { colors, spacing, typography } from '../constants/theme';

const historyData = [
  {
    id: '1',
    trackingId: 'TRK2024001',
    from: 'Mumbai, Maharashtra',
    to: 'Delhi, Delhi',
    status: 'delivered',
    date: '2024-01-05',
    material: 'Electronics',
    weight: '1200 kg',
    price: 1416,
    driverName: 'Raj Kumar',
    rating: 5,
  },
  {
    id: '2',
    trackingId: 'TRK2024002',
    from: 'Bangalore, Karnataka',
    to: 'Chennai, Tamil Nadu',
    status: 'delivered',
    date: '2024-01-03',
    material: 'Furniture',
    weight: '2500 kg',
    price: 2800,
    driverName: 'Suresh Patel',
    rating: 4,
  },
];

export default function HistoryPage() {
  const router = useRouter();
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'this-month' | 'last-month' | 'older'>('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'delivered' | 'cancelled'>('all');

  const filteredHistory = historyData.filter((item) => {
    if (selectedStatus !== 'all' && item.status !== selectedStatus) return false;
    return true;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'delivered':
        return <Badge label="Delivered" variant="success" />;
      case 'cancelled':
        return <Badge label="Cancelled" variant="error" />;
      default:
        return <Badge label={status} variant="default" />;
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div style={{ display: 'flex', gap: '2px' }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <SafeIcon
            key={star}
            Icon={FiStar}
            size={14}
            color={star <= rating ? colors.warning : colors.border}
          />
        ))}
      </div>
    );
  };

  const totalSpent = historyData.reduce((sum, item) => sum + item.price, 0);
  const totalShipments = historyData.length;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: colors.background }}>
      <div style={{ padding: spacing.lg }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.lg }}>
          <button
            onClick={() => router.back()}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: spacing.sm }}
          >
            <SafeIcon Icon={FiArrowLeft} size={24} color={colors.text} />
          </button>
          <h1 style={{ fontSize: typography.sizes.xl, fontWeight: typography.weights.bold, color: colors.text }}>
            Shipment History
          </h1>
          <button
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '20px',
              backgroundColor: colors.background,
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <SafeIcon Icon={FiFilter} size={20} color={colors.text} />
          </button>
        </div>

        <div style={{ display: 'flex', gap: spacing.sm, marginBottom: spacing.md }}>
          <Card style={{ flex: 1, textAlign: 'center', padding: spacing.md }}>
            <SafeIcon Icon={FiPackage} size={24} color={colors.primary} style={{ marginBottom: spacing.xs }} />
            <div style={{ fontSize: typography.sizes.xl, fontWeight: typography.weights.bold, color: colors.text, marginBottom: '2px' }}>
              {totalShipments}
            </div>
            <div style={{ fontSize: typography.sizes.xs, color: colors.textSecondary }}>Total Shipments</div>
          </Card>
          <Card style={{ flex: 1, textAlign: 'center', padding: spacing.md }}>
            <SafeIcon Icon={FiCheckCircle} size={24} color={colors.success} style={{ marginBottom: spacing.xs }} />
            <div style={{ fontSize: typography.sizes.xl, fontWeight: typography.weights.bold, color: colors.success, marginBottom: '2px' }}>
              {totalShipments}
            </div>
            <div style={{ fontSize: typography.sizes.xs, color: colors.textSecondary }}>Delivered</div>
          </Card>
          <Card style={{ flex: 1, textAlign: 'center', padding: spacing.md }}>
            <SafeIcon Icon={FiDollarSign} size={24} color={colors.secondary} style={{ marginBottom: spacing.xs }} />
            <div style={{ fontSize: typography.sizes.xl, fontWeight: typography.weights.bold, color: colors.primary, marginBottom: '2px' }}>
              ₹{(totalSpent / 1000).toFixed(1)}K
            </div>
            <div style={{ fontSize: typography.sizes.xs, color: colors.textSecondary }}>Total</div>
          </Card>
        </div>

        <div style={{ marginBottom: spacing.md }}>
          <div style={{ fontSize: typography.sizes.sm, fontWeight: typography.weights.semibold, color: colors.text, marginBottom: spacing.sm, marginTop: spacing.md }}>
            Filter by Status
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: spacing.sm }}>
            <Chip label="All" selected={selectedStatus === 'all'} onClick={() => setSelectedStatus('all')} />
            <Chip label="Delivered" icon="checkmark-circle" selected={selectedStatus === 'delivered'} onClick={() => setSelectedStatus('delivered')} />
            <Chip label="Cancelled" icon="close-circle" selected={selectedStatus === 'cancelled'} onClick={() => setSelectedStatus('cancelled')} />
          </div>
        </div>

        <div>
          <h2 style={{ fontSize: typography.sizes.lg, fontWeight: typography.weights.bold, color: colors.text, marginBottom: spacing.md }}>
            {filteredHistory.length} Shipment{filteredHistory.length !== 1 ? 's' : ''}
          </h2>

          {filteredHistory.map((item) => (
            <Card
              key={item.id}
              onClick={() => router.push(`/trip/${item.id}`)}
              style={{ marginBottom: spacing.md, cursor: 'pointer' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm, flex: 1 }}>
                  <span style={{ fontSize: typography.sizes.md, fontWeight: typography.weights.semibold, color: colors.text }}>
                    {item.trackingId}
                  </span>
                  {getStatusBadge(item.status)}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/trip/${item.id}/payment`);
                  }}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: spacing.sm }}
                >
                  <SafeIcon Icon={FiFileText} size={20} color={colors.primary} />
                </button>
              </div>

              <div style={{ marginBottom: spacing.md }}>
                <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '5px', backgroundColor: colors.primary, marginTop: '4px' }} />
                  <div style={{ marginLeft: spacing.md, flex: 1 }}>
                    <div style={{ fontSize: typography.sizes.xs, color: colors.textSecondary, marginBottom: '2px' }}>From</div>
                    <div style={{ fontSize: typography.sizes.sm, color: colors.text, fontWeight: typography.weights.medium }}>{item.from}</div>
                  </div>
                </div>
                 <div style={{ width: '2px', height: '20px', backgroundColor: colors.border, marginLeft: '4px', marginTop: spacing.xs, marginBottom: spacing.xs }} />
                <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '5px', backgroundColor: colors.success, marginTop: '4px' }} />
                  <div style={{ marginLeft: spacing.md, flex: 1 }}>
                    <div style={{ fontSize: typography.sizes.xs, color: colors.textSecondary, marginBottom: '2px' }}>To</div>
                    <div style={{ fontSize: typography.sizes.sm, color: colors.text, fontWeight: typography.weights.medium }}>{item.to}</div>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: spacing.md, marginBottom: spacing.md }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: spacing.xs }}>
                  <SafeIcon Icon={FiPackage} size={14} color={colors.textSecondary} />
                  <span style={{ fontSize: typography.sizes.xs, color: colors.textSecondary }}>{item.material}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: spacing.xs }}>
                  <SafeIcon Icon={FiBarChart2} size={14} color={colors.textSecondary} />
                  <span style={{ fontSize: typography.sizes.xs, color: colors.textSecondary }}>{item.weight}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: spacing.xs }}>
                  <FiCalendar size={14} color={colors.textSecondary} />
                  <span style={{ fontSize: typography.sizes.xs, color: colors.textSecondary }}>{item.date}</span>
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingTop: spacing.md,
                  borderTop: `1px solid ${colors.border}`,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: spacing.xs }}>
                  <span style={{ fontSize: typography.sizes.sm, color: colors.textSecondary }}>{item.driverName}</span>
                  {renderStars(item.rating)}
                </div>
                <div style={{ fontSize: typography.sizes.lg, fontWeight: typography.weights.bold, color: colors.primary }}>₹{item.price}</div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

