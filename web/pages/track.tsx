import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { FiSearch, FiArrowLeft, FiCode, FiClock, FiHelpCircle, FiHeadphones } from 'react-icons/fi';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { SafeIcon } from '../components/ui/SafeIcon';
import { colors, spacing, typography, borderRadius } from '../constants/theme';

const recentTrackingIds = ['TRK2024001', 'TRK2024002', 'TRK2024003', 'TRK2024004'];

export default function TrackPage() {
  const router = useRouter();
  const [trackingId, setTrackingId] = useState('');
  const [searching, setSearching] = useState(false);

  const handleTrack = () => {
    if (!trackingId.trim()) {
      alert('Please enter a tracking ID');
      return;
    }
    setSearching(true);
    setTimeout(() => {
      setSearching(false);
      router.push(`/trip/${trackingId}`);
    }, 1000);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: colors.background }}>
      <div style={{ padding: spacing.lg }}>
        <button
          onClick={() => router.back()}
          style={{ background: 'none', border: 'none', cursor: 'pointer', marginBottom: spacing.lg, padding: spacing.sm }}
        >
          <SafeIcon Icon={FiArrowLeft} size={24} color={colors.text} />
        </button>

        <div style={{ textAlign: 'center', marginBottom: spacing.xl, marginTop: spacing.md }}>
          <div
            style={{
              width: '120px',
              height: '120px',
              borderRadius: '60px',
              backgroundColor: `${colors.primary}15`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto',
              marginBottom: spacing.lg,
            }}
          >
            <SafeIcon Icon={FiSearch} size={64} color={colors.primary} />
          </div>
          <h1 style={{ fontSize: typography.sizes['2xl'], fontWeight: typography.weights.bold, color: colors.text, marginBottom: spacing.sm }}>
            Track Your Shipment
          </h1>
          <p style={{ fontSize: typography.sizes.md, color: colors.textSecondary, lineHeight: '22px' }}>
            Enter your tracking ID to get real-time updates
          </p>
        </div>

        <Card style={{ marginBottom: spacing.lg }}>
          <Input
            label="Tracking ID"
            placeholder="Enter tracking ID (e.g., TRK2024001)"
            value={trackingId}
            onChange={(e) => setTrackingId(e.target.value.toUpperCase())}
            icon="search"
          />

          <Button
            title="Track Now"
            onClick={handleTrack}
            loading={searching}
            icon="arrow-forward"
            iconPosition="right"
            fullWidth
            size="lg"
          />

          <div style={{ display: 'flex', alignItems: 'center', margin: `${spacing.lg} 0` }}>
            <div style={{ flex: 1, height: '1px', backgroundColor: colors.border }} />
            <span style={{ margin: `0 ${spacing.md}`, color: colors.textSecondary, fontSize: typography.sizes.sm }}>OR</span>
            <div style={{ flex: 1, height: '1px', backgroundColor: colors.border }} />
          </div>

          <button
            onClick={() => alert('QR code scanning will be implemented')}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: spacing.md,
              borderRadius: borderRadius.lg,
              border: `2px dashed ${colors.primary}`,
              background: 'transparent',
              cursor: 'pointer',
              gap: spacing.sm,
            }}
          >
            <SafeIcon Icon={FiCode} size={24} color={colors.primary} />
            <span style={{ fontSize: typography.sizes.md, fontWeight: typography.weights.semibold, color: colors.primary }}>
              Scan QR Code
            </span>
          </button>
        </Card>

        {recentTrackingIds.length > 0 && (
          <div style={{ marginBottom: spacing.lg }}>
            <h2 style={{ fontSize: typography.sizes.lg, fontWeight: typography.weights.bold, color: colors.text, marginBottom: spacing.md }}>
              Recent Tracking
            </h2>
            {recentTrackingIds.map((id) => (
              <Card
                key={id}
                onClick={() => router.push(`/trip/${id}`)}
                style={{ marginBottom: spacing.md, cursor: 'pointer' }}
              >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '20px',
                      backgroundColor: `${colors.primary}15`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: spacing.md,
                    }}
                  >
                    <SafeIcon Icon={FiClock} size={20} color={colors.primary} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: typography.sizes.md, fontWeight: typography.weights.semibold, color: colors.text, marginBottom: '2px' }}>
                      {id}
                    </div>
                    <div style={{ fontSize: typography.sizes.xs, color: colors.textSecondary }}>Last tracked: Today</div>
                  </div>
                  <SafeIcon Icon={FiArrowLeft} size={20} color={colors.textSecondary} style={{ transform: 'rotate(180deg)' }} />
                </div>
              </Card>
            ))}
          </div>
        )}

        <Card style={{ backgroundColor: `${colors.primary}08`, border: `1px solid ${colors.primary}30` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.md }}>
            <SafeIcon Icon={FiHelpCircle} size={24} color={colors.primary} />
            <h3 style={{ fontSize: typography.sizes.lg, fontWeight: typography.weights.bold, color: colors.text }}>Need Help?</h3>
          </div>
          <p style={{ fontSize: typography.sizes.sm, color: colors.textSecondary, lineHeight: '20px', marginBottom: spacing.md }}>
            Can't find your tracking ID? Check your email or SMS for the tracking number sent after booking.
          </p>
          <Button
            title="Contact Support"
            onClick={() => router.push('/support')}
            variant="outline"
            icon="headset"
            fullWidth
          />
        </Card>
      </div>
    </div>
  );
}

