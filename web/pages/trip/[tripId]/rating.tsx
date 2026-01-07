import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { FiArrowLeft, FiCheckCircle, FiStar, FiHeart } from 'react-icons/fi';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Chip } from '../../../components/ui/Chip';
import { SafeIcon } from '../../../components/ui/SafeIcon';
import { colors, spacing, typography, borderRadius } from '../../../constants/theme';

const RATING_CATEGORIES = [
  { id: 'punctuality', label: 'On Time', icon: 'time' },
  { id: 'communication', label: 'Good Communication', icon: 'chatbubbles' },
  { id: 'handling', label: 'Careful Handling', icon: 'shield-checkmark' },
  { id: 'professional', label: 'Professional', icon: 'briefcase' },
  { id: 'cleanliness', label: 'Clean Truck', icon: 'checkmark-circle' },
  { id: 'helpful', label: 'Helpful', icon: 'happy' },
];

export default function RatingPage() {
  const router = useRouter();
  const { tripId } = router.query;
  const [driverRating, setDriverRating] = useState(0);
  const [serviceRating, setServiceRating] = useState(0);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [feedback, setFeedback] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories((prev) => (prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId]));
  };

  const handleSubmit = () => {
    if (driverRating === 0 || serviceRating === 0) {
      alert('Please rate both driver and service');
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      alert('Thank You! Your feedback helps us improve our service');
      router.push('/dashboard');
    }, 1500);
  };

  const renderStars = (rating: number, setRating: (rating: number) => void) => {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', gap: spacing.sm, marginBottom: spacing.md }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => setRating(star)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: spacing.xs }}
          >
            <SafeIcon Icon={FiStar} size={40} color={star <= rating ? colors.warning : colors.border} />
          </button>
        ))}
      </div>
    );
  };

  const getRatingText = (rating: number) => {
    switch (rating) {
      case 1:
        return 'Poor';
      case 2:
        return 'Fair';
      case 3:
        return 'Good';
      case 4:
        return 'Very Good';
      case 5:
        return 'Excellent';
      default:
        return '';
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: colors.background }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: `${spacing.md} ${spacing.lg}`, backgroundColor: colors.backgroundCard, boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)' }}>
        <button onClick={() => router.push('/dashboard')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: spacing.sm }}>
          <span style={{ fontSize: typography.sizes.md, color: colors.textSecondary, fontWeight: typography.weights.medium }}>Skip</span>
        </button>
        <div style={{ fontSize: typography.sizes.lg, fontWeight: typography.weights.bold, color: colors.text }}>Rate Your Experience</div>
        <div style={{ width: '60px' }} />
      </div>

      <div style={{ padding: spacing.lg, maxWidth: '600px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', paddingTop: spacing.xl, paddingBottom: spacing.xl }}>
          <div
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto',
              marginBottom: spacing.md,
            }}
          >
            <FiCheckCircle size={80} color={colors.success} />
          </div>
          <h1 style={{ fontSize: typography.sizes['2xl'], fontWeight: typography.weights.bold, color: colors.text, marginBottom: spacing.sm }}>
            Delivery Completed!
          </h1>
          <p style={{ fontSize: typography.sizes.md, color: colors.textSecondary }}>Your shipment was delivered successfully</p>
        </div>

        <Card style={{ marginBottom: spacing.md }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: spacing.lg }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '30px', backgroundColor: `${colors.primary}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: spacing.md }}>
              <SafeIcon Icon={FiStar} size={32} color={colors.primary} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: typography.sizes.lg, fontWeight: typography.weights.bold, color: colors.text, marginBottom: spacing.xs }}>Rate Driver</div>
              <div style={{ fontSize: typography.sizes.md, color: colors.textSecondary }}>Raj Kumar</div>
            </div>
          </div>
          {renderStars(driverRating, setDriverRating)}
          {driverRating > 0 && (
            <div style={{ fontSize: typography.sizes.lg, fontWeight: typography.weights.semibold, color: colors.primary, textAlign: 'center' }}>
              {getRatingText(driverRating)}
            </div>
          )}
        </Card>

        <Card style={{ marginBottom: spacing.md }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: spacing.lg }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '24px', backgroundColor: `${colors.primary}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: spacing.md }}>
              <SafeIcon Icon={FiCheckCircle} size={24} color={colors.primary} />
            </div>
            <div style={{ fontSize: typography.sizes.lg, fontWeight: typography.weights.bold, color: colors.text }}>Rate Overall Service</div>
          </div>
          {renderStars(serviceRating, setServiceRating)}
          {serviceRating > 0 && (
            <div style={{ fontSize: typography.sizes.lg, fontWeight: typography.weights.semibold, color: colors.primary, textAlign: 'center' }}>
              {getRatingText(serviceRating)}
            </div>
          )}
        </Card>

        {driverRating > 0 && (
          <Card style={{ marginBottom: spacing.md }}>
            <h3 style={{ fontSize: typography.sizes.lg, fontWeight: typography.weights.bold, color: colors.text, marginBottom: spacing.xs }}>What did you like?</h3>
            <p style={{ fontSize: typography.sizes.sm, color: colors.textSecondary, marginBottom: spacing.md }}>Select all that apply</p>
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
              {RATING_CATEGORIES.map((category) => (
                <Chip
                  key={category.id}
                  label={category.label}
                  icon={category.icon}
                  selected={selectedCategories.includes(category.id)}
                  onClick={() => handleCategoryToggle(category.id)}
                />
              ))}
            </div>
          </Card>
        )}

        <Card style={{ marginBottom: spacing.md }}>
          <h3 style={{ fontSize: typography.sizes.lg, fontWeight: typography.weights.bold, color: colors.text, marginBottom: spacing.xs }}>Additional Feedback</h3>
          <p style={{ fontSize: typography.sizes.sm, color: colors.textSecondary, marginBottom: spacing.md }}>Share your experience (optional)</p>
          <Input
            placeholder="Write your feedback here..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            containerStyle={{ marginBottom: 0 }}
            icon="document-text"
          />
        </Card>

        <Card style={{ backgroundColor: `${colors.error}05`, border: `1px solid ${colors.error}30`, marginBottom: spacing.md }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.md }}>
            <SafeIcon Icon={FiHeart} size={24} color={colors.error} />
            <h3 style={{ fontSize: typography.sizes.md, fontWeight: typography.weights.semibold, color: colors.text }}>Tip Your Driver (Optional)</h3>
          </div>
          <div style={{ display: 'flex', gap: spacing.md, marginBottom: spacing.md }}>
            {[50, 100, 150, 200].map((amount) => (
              <button
                key={amount}
                style={{
                  flex: 1,
                  padding: spacing.md,
                  borderRadius: borderRadius.md,
                  backgroundColor: colors.backgroundCard,
                  border: `1px solid ${colors.border}`,
                  cursor: 'pointer',
                  fontSize: typography.sizes.md,
                  fontWeight: typography.weights.semibold,
                  color: colors.text,
                }}
              >
                ₹{amount}
              </button>
            ))}
          </div>
          <p style={{ fontSize: typography.sizes.xs, color: colors.textSecondary, textAlign: 'center' }}>Show your appreciation for great service</p>
        </Card>

        <Button
          title="Submit Rating"
          onClick={handleSubmit}
          loading={submitting}
          disabled={driverRating === 0 || serviceRating === 0}
          icon="checkmark-circle"
          iconPosition="right"
          fullWidth
          size="lg"
        />
      </div>
    </div>
  );
}

