import React from 'react';
import { useRouter } from 'next/router';
import { FiArrowLeft, FiShare2, FiMap, FiMapPin, FiNavigation, FiPhone, FiUser, FiStar, FiTruck, FiCalendar, FiPackage, FiBarChart2, FiCheckCircle, FiAlertCircle, FiHeadphones, FiChevronRight } from 'react-icons/fi';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Divider } from '../../components/ui/Divider';
import { SafeIcon } from '../../components/ui/SafeIcon';
import { colors, spacing, typography, borderRadius, shadows } from '../../constants/theme';

const milestones = [
  { id: '1', label: 'Booking Confirmed', status: 'completed', timestamp: '2024-01-07 08:30 AM', location: 'Mumbai' },
  { id: '2', label: 'Driver Assigned', status: 'completed', timestamp: '2024-01-07 08:45 AM' },
  { id: '3', label: 'Reached Pickup', status: 'completed', timestamp: '2024-01-07 09:15 AM', location: 'Mumbai' },
  { id: '4', label: 'Loaded & Started', status: 'completed', timestamp: '2024-01-07 10:00 AM', location: 'Mumbai' },
  { id: '5', label: 'In Transit', status: 'current', timestamp: '2024-01-07 02:30 PM', location: 'Approaching Vadodara' },
  { id: '6', label: 'Delivered', status: 'pending' },
];

export default function TripDetailPage() {
  const router = useRouter();
  const { tripId } = router.query;

  const tripData = {
    trackingId: 'TRK2024001',
    status: 'in-transit',
    from: { address: 'ABC Warehouse, Andheri East', city: 'Mumbai, Maharashtra', contact: 'Raj Sharma', phone: '+91 98765 43210' },
    to: { address: 'XYZ Distribution Center, Connaught Place', city: 'Delhi, Delhi', contact: 'Priya Singh', phone: '+91 98765 43211' },
    material: 'Electronics - Laptops & Accessories',
    weight: '1200 kg',
    truckType: 'Medium Truck (20ft)',
    driver: { name: 'Raj Kumar', phone: '+91 98765 43212', rating: 4.8, trips: 245 },
    truck: { number: 'MH 02 AB 1234', model: 'Tata 1109' },
    schedule: { pickupDate: '2024-01-07', pickupTime: '09:00 AM', expectedDelivery: '2024-01-08', estimatedTime: '14:30 PM' },
    pricing: { baseFare: 1200, gst: 216, total: 1416, paid: 708, due: 708 },
    progress: 65,
  };

  const getStatusBadge = () => {
    switch (tripData.status) {
      case 'in-transit':
        return <Badge label="In Transit" variant="info" />;
      case 'pending':
        return <Badge label="Pending" variant="warning" />;
      case 'delivered':
        return <Badge label="Delivered" variant="success" />;
      default:
        return <Badge label={tripData.status} variant="default" />;
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: colors.background }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: `${spacing.md} ${spacing.lg}`, backgroundColor: colors.backgroundCard, boxShadow: shadows.sm }}>
        <button onClick={() => router.back()} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: spacing.sm }}>
          <SafeIcon Icon={FiArrowLeft} size={24} color={colors.text} />
        </button>
        <div style={{ textAlign: 'center', flex: 1 }}>
          <div style={{ fontSize: typography.sizes.lg, fontWeight: typography.weights.bold, color: colors.text }}>Track Shipment</div>
          <div style={{ fontSize: typography.sizes.sm, color: colors.textSecondary }}>{tripData.trackingId}</div>
        </div>
        <button onClick={() => alert('Share location')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: spacing.sm }}>
          <SafeIcon Icon={FiShare2} size={24} color={colors.text} />
        </button>
      </div>

      <div style={{ padding: spacing.lg, maxWidth: '1200px', margin: '0 auto' }}>
        <Card style={{ marginBottom: spacing.md, padding: 0, height: '200px', overflow: 'hidden' }}>
          <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: `${colors.primary}10`, position: 'relative' }}>
            <SafeIcon Icon={FiMap} size={64} color={colors.primary} />
            <div style={{ fontSize: typography.sizes.md, fontWeight: typography.weights.semibold, color: colors.text, marginTop: spacing.sm }}>Live Tracking Map</div>
            <div style={{ fontSize: typography.sizes.sm, color: colors.textSecondary }}>Real-time truck location</div>
            <div style={{ position: 'absolute', top: spacing.md, right: spacing.md, backgroundColor: colors.backgroundCard, borderRadius: borderRadius.md, padding: spacing.sm, boxShadow: shadows.md }}>
              <div style={{ fontSize: typography.sizes.xl, fontWeight: typography.weights.bold, color: colors.primary, textAlign: 'center' }}>{tripData.progress}%</div>
              <div style={{ fontSize: typography.sizes.xs, color: colors.textSecondary, textAlign: 'center' }}>Complete</div>
            </div>
          </div>
        </Card>

        <Card style={{ marginBottom: spacing.md }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md }}>
            {getStatusBadge()}
            <div style={{ fontSize: typography.sizes.md, fontWeight: typography.weights.semibold, color: colors.success }}>ETA: {tripData.schedule.estimatedTime}</div>
          </div>
          <div style={{ height: '8px', backgroundColor: colors.border, borderRadius: borderRadius.full, overflow: 'hidden', marginBottom: spacing.md }}>
            <div style={{ height: '100%', width: `${tripData.progress}%`, backgroundColor: colors.primary, borderRadius: borderRadius.full }} />
          </div>
          <p style={{ fontSize: typography.sizes.sm, color: colors.textSecondary, lineHeight: '20px' }}>
            Your shipment is on its way and will arrive by {tripData.schedule.expectedDelivery}
          </p>
        </Card>

        <Card style={{ marginBottom: spacing.md }}>
          <h2 style={{ fontSize: typography.sizes.lg, fontWeight: typography.weights.bold, color: colors.text, marginBottom: spacing.md }}>Route Information</h2>
          <div style={{ marginBottom: spacing.md }}>
            <div style={{ display: 'flex', alignItems: 'flex-start' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '20px', backgroundColor: `${colors.primary}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: spacing.md }}>
                <SafeIcon Icon={FiMapPin} size={20} color={colors.primary} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: typography.sizes.xs, color: colors.textSecondary, marginBottom: '2px' }}>Pickup Location</div>
                <div style={{ fontSize: typography.sizes.sm, fontWeight: typography.weights.medium, color: colors.text, marginBottom: '2px' }}>{tripData.from.address}</div>
                <div style={{ fontSize: typography.sizes.sm, color: colors.textSecondary }}>{tripData.from.city}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: spacing.xs, marginTop: spacing.xs }}>
                  <SafeIcon Icon={FiUser} size={14} color={colors.textSecondary} />
                  <span style={{ fontSize: typography.sizes.sm, color: colors.textSecondary, flex: 1 }}>{tripData.from.contact}</span>
                  <button onClick={() => window.open(`tel:${tripData.from.phone}`)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                    <SafeIcon Icon={FiPhone} size={16} color={colors.primary} />
                  </button>
                </div>
              </div>
            </div>
            <div style={{ width: '2px', height: '24px', backgroundColor: colors.border, marginLeft: '20px', marginTop: spacing.sm, marginBottom: spacing.sm }} />
            <div style={{ display: 'flex', alignItems: 'flex-start' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '20px', backgroundColor: `${colors.success}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: spacing.md }}>
                <SafeIcon Icon={FiNavigation} size={20} color={colors.success} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: typography.sizes.xs, color: colors.textSecondary, marginBottom: '2px' }}>Delivery Location</div>
                <div style={{ fontSize: typography.sizes.sm, fontWeight: typography.weights.medium, color: colors.text, marginBottom: '2px' }}>{tripData.to.address}</div>
                <div style={{ fontSize: typography.sizes.sm, color: colors.textSecondary }}>{tripData.to.city}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: spacing.xs, marginTop: spacing.xs }}>
                  <SafeIcon Icon={FiUser} size={14} color={colors.textSecondary} />
                  <span style={{ fontSize: typography.sizes.sm, color: colors.textSecondary, flex: 1 }}>{tripData.to.contact}</span>
                  <button onClick={() => window.open(`tel:${tripData.to.phone}`)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                    <SafeIcon Icon={FiPhone} size={16} color={colors.primary} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card style={{ marginBottom: spacing.md }}>
          <h2 style={{ fontSize: typography.sizes.lg, fontWeight: typography.weights.bold, color: colors.text, marginBottom: spacing.md }}>Driver Details</h2>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '30px', backgroundColor: `${colors.primary}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: spacing.md }}>
              <SafeIcon Icon={FiUser} size={32} color={colors.primary} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: typography.sizes.md, fontWeight: typography.weights.bold, color: colors.text, marginBottom: spacing.xs }}>{tripData.driver.name}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: spacing.xs, marginBottom: spacing.xs }}>
                <SafeIcon Icon={FiStar} size={14} color={colors.warning} />
                <span style={{ fontSize: typography.sizes.sm, fontWeight: typography.weights.semibold, color: colors.text }}>{tripData.driver.rating}</span>
                <span style={{ fontSize: typography.sizes.sm, color: colors.textSecondary }}>• {tripData.driver.trips} trips</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: spacing.xs }}>
                <SafeIcon Icon={FiTruck} size={14} color={colors.textSecondary} />
                <span style={{ fontSize: typography.sizes.sm, color: colors.textSecondary }}>{tripData.truck.number} • {tripData.truck.model}</span>
            </div>
            </div>
            <button
              onClick={() => window.open(`tel:${tripData.driver.phone}`)}
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '24px',
                backgroundColor: colors.primary,
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: shadows.md,
              }}
            >
              <SafeIcon Icon={FiPhone} size={20} color={colors.backgroundCard} />
            </button>
          </div>
        </Card>

        <Card style={{ marginBottom: spacing.md }}>
          <h2 style={{ fontSize: typography.sizes.lg, fontWeight: typography.weights.bold, color: colors.text, marginBottom: spacing.md }}>Shipment Details</h2>
          {[
            { icon: FiPackage, label: 'Material', value: tripData.material },
            { icon: FiBarChart2, label: 'Weight', value: tripData.weight },
            { icon: FiTruck, label: 'Truck Type', value: tripData.truckType },
            { icon: FiCalendar, label: 'Pickup Schedule', value: `${tripData.schedule.pickupDate} at ${tripData.schedule.pickupTime}` },
          ].map((detail, idx) => {
            const Icon = detail.icon;
            return (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', marginBottom: spacing.md }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '18px', backgroundColor: `${colors.primary}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: spacing.md }}>
                  <Icon size={18} color={colors.primary} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: typography.sizes.xs, color: colors.textSecondary, marginBottom: '2px' }}>{detail.label}</div>
                  <div style={{ fontSize: typography.sizes.sm, fontWeight: typography.weights.medium, color: colors.text }}>{detail.value}</div>
                </div>
              </div>
            );
          })}
        </Card>

        <Card style={{ marginBottom: spacing.md }}>
          <h2 style={{ fontSize: typography.sizes.lg, fontWeight: typography.weights.bold, color: colors.text, marginBottom: spacing.md }}>Trip Timeline</h2>
          {milestones.map((milestone, index) => (
            <div key={milestone.id} style={{ display: 'flex', marginBottom: spacing.lg }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginRight: spacing.md }}>
                <div
                  style={{
                    width: milestone.status === 'current' ? '24px' : '20px',
                    height: milestone.status === 'current' ? '24px' : '20px',
                    borderRadius: milestone.status === 'current' ? '12px' : '10px',
                    backgroundColor: milestone.status === 'completed' ? colors.success : milestone.status === 'current' ? colors.primary : colors.border,
                    border: `3px solid ${colors.backgroundCard}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {milestone.status === 'completed' && <SafeIcon Icon={FiCheckCircle} size={12} color={colors.backgroundCard} />}
                </div>
                {index < milestones.length - 1 && (
                  <div
                    style={{
                      width: '2px',
                      height: '40px',
                      backgroundColor: milestone.status === 'completed' ? colors.success : colors.border,
                      marginTop: spacing.xs,
                    }}
                  />
                )}
              </div>
              <div style={{ flex: 1, paddingTop: '2px' }}>
                <div
                  style={{
                    fontSize: typography.sizes.sm,
                    color: milestone.status === 'completed' ? colors.text : milestone.status === 'current' ? colors.primary : colors.textSecondary,
                    fontWeight: milestone.status === 'completed' || milestone.status === 'current' ? typography.weights.semibold : typography.weights.medium,
                    marginBottom: spacing.xs,
                  }}
                >
                  {milestone.label}
                </div>
                {milestone.location && (
                  <div style={{ fontSize: typography.sizes.xs, color: colors.textSecondary, marginBottom: spacing.xs }}>
                    <SafeIcon Icon={FiMapPin} size={12} style={{ display: 'inline', marginRight: spacing.xs }} />
                    {milestone.location}
                  </div>
                )}
                {milestone.timestamp && (
                  <div style={{ fontSize: typography.sizes.xs, color: colors.textSecondary }}>{milestone.timestamp}</div>
                )}
              </div>
            </div>
          ))}
        </Card>

        <Card style={{ marginBottom: spacing.md }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md }}>
            <h2 style={{ fontSize: typography.sizes.lg, fontWeight: typography.weights.bold, color: colors.text }}>Payment Summary</h2>
            <button
              onClick={() => router.push(`/trip/${tripId}/payment`)}
              style={{ background: 'none', border: 'none', color: colors.primary, fontSize: typography.sizes.sm, fontWeight: typography.weights.semibold, cursor: 'pointer' }}
            >
              View Details
            </button>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: spacing.sm }}>
            <span style={{ fontSize: typography.sizes.sm, color: colors.textSecondary }}>Base Fare</span>
            <span style={{ fontSize: typography.sizes.sm, fontWeight: typography.weights.medium, color: colors.text }}>₹{tripData.pricing.baseFare}</span>
              </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: spacing.sm }}>
            <span style={{ fontSize: typography.sizes.sm, color: colors.textSecondary }}>GST (18%)</span>
            <span style={{ fontSize: typography.sizes.sm, fontWeight: typography.weights.medium, color: colors.text }}>₹{tripData.pricing.gst}</span>
            </div>
          <Divider />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: spacing.sm }}>
            <span style={{ fontSize: typography.sizes.md, fontWeight: typography.weights.bold, color: colors.text }}>Total Amount</span>
            <span style={{ fontSize: typography.sizes.lg, fontWeight: typography.weights.bold, color: colors.primary }}>₹{tripData.pricing.total}</span>
              </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: spacing.sm }}>
            <span style={{ fontSize: typography.sizes.sm, color: colors.textSecondary }}>Paid (Advance)</span>
            <span style={{ fontSize: typography.sizes.sm, fontWeight: typography.weights.medium, color: colors.success }}>₹{tripData.pricing.paid}</span>
            </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: typography.sizes.sm, color: colors.textSecondary }}>Due (On Delivery)</span>
            <span style={{ fontSize: typography.sizes.sm, fontWeight: typography.weights.medium, color: colors.warning }}>₹{tripData.pricing.due}</span>
          </div>
        </Card>

        <div style={{ display: 'flex', gap: spacing.md }}>
          <Button title="Report Issue" onClick={() => alert('Report issue')} variant="outline" icon="alert-circle" style={{ flex: 1 }} />
          <Button title="Contact Support" onClick={() => window.open('tel:+9118001234567')} variant="outline" icon="headset" style={{ flex: 1 }} />
        </div>
      </div>
    </div>
  );
}
