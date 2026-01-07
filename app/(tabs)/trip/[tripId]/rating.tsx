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
import { Input } from '@/components/ui/Input';
import { Chip } from '@/components/ui/Chip';
import { colors, spacing, typography, borderRadius, shadows } from '@/constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';

const RATING_CATEGORIES = [
  { id: 'punctuality', label: 'On Time', icon: 'time' },
  { id: 'communication', label: 'Good Communication', icon: 'chatbubbles' },
  { id: 'handling', label: 'Careful Handling', icon: 'shield-checkmark' },
  { id: 'professional', label: 'Professional', icon: 'briefcase' },
  { id: 'cleanliness', label: 'Clean Truck', icon: 'checkmark-circle' },
  { id: 'helpful', label: 'Helpful', icon: 'happy' },
];

export default function RatingScreen() {
  const { tripId } = useLocalSearchParams();
  const [driverRating, setDriverRating] = useState(0);
  const [serviceRating, setServiceRating] = useState(0);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [feedback, setFeedback] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleSubmit = () => {
    if (driverRating === 0) {
      Alert.alert('Rating Required', 'Please rate the driver');
      return;
    }

    if (serviceRating === 0) {
      Alert.alert('Rating Required', 'Please rate the overall service');
      return;
    }

    setSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setSubmitting(false);
      Alert.alert(
        'Thank You!',
        'Your feedback helps us improve our service',
        [
          {
            text: 'Done',
            onPress: () => router.replace('/(tabs)/dashboard'),
          },
        ]
      );
    }, 1500);
  };

  const handleSkip = () => {
    Alert.alert(
      'Skip Rating',
      'Are you sure you want to skip rating this trip?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Skip', onPress: () => router.replace('/(tabs)/dashboard') },
      ]
    );
  };

  const renderStars = (rating: number, setRating: (rating: number) => void) => {
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity
            key={star}
            onPress={() => setRating(star)}
            style={styles.starButton}
          >
            <Ionicons
              name={star <= rating ? 'star' : 'star-outline'}
              size={40}
              color={star <= rating ? colors.warning : colors.border}
            />
          </TouchableOpacity>
        ))}
      </View>
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
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Rate Your Experience</Text>
        </View>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Success Icon */}
        <View style={styles.successContainer}>
          <View style={styles.successIcon}>
            <Ionicons name="checkmark-circle" size={80} color={colors.success} />
          </View>
          <Text style={styles.successTitle}>Delivery Completed!</Text>
          <Text style={styles.successSubtitle}>
            Your shipment was delivered successfully
          </Text>
        </View>

        {/* Driver Rating */}
        <Card style={styles.ratingCard}>
          <View style={styles.ratingHeader}>
            <View style={styles.driverAvatar}>
              <Ionicons name="person" size={32} color={colors.primary} />
            </View>
            <View style={styles.driverInfo}>
              <Text style={styles.ratingTitle}>Rate Driver</Text>
              <Text style={styles.driverName}>Raj Kumar</Text>
            </View>
          </View>

          {renderStars(driverRating, setDriverRating)}

          {driverRating > 0 && (
            <Text style={styles.ratingText}>{getRatingText(driverRating)}</Text>
          )}
        </Card>

        {/* Service Rating */}
        <Card style={styles.ratingCard}>
          <View style={styles.ratingHeader}>
            <View style={styles.serviceIcon}>
              <Ionicons name="cube" size={24} color={colors.primary} />
            </View>
            <Text style={styles.ratingTitle}>Rate Overall Service</Text>
          </View>

          {renderStars(serviceRating, setServiceRating)}

          {serviceRating > 0 && (
            <Text style={styles.ratingText}>{getRatingText(serviceRating)}</Text>
          )}
        </Card>

        {/* Quick Feedback Tags */}
        {driverRating > 0 && (
          <Card style={styles.categoriesCard}>
            <Text style={styles.cardTitle}>What did you like?</Text>
            <Text style={styles.cardSubtitle}>Select all that apply</Text>

            <View style={styles.categoriesContainer}>
              {RATING_CATEGORIES.map((category) => (
                <Chip
                  key={category.id}
                  label={category.label}
                  icon={category.icon as any}
                  selected={selectedCategories.includes(category.id)}
                  onPress={() => handleCategoryToggle(category.id)}
                />
              ))}
            </View>
          </Card>
        )}

        {/* Written Feedback */}
        <Card style={styles.feedbackCard}>
          <Text style={styles.cardTitle}>Additional Feedback</Text>
          <Text style={styles.cardSubtitle}>Share your experience (optional)</Text>

          <Input
            placeholder="Write your feedback here..."
            value={feedback}
            onChangeText={setFeedback}
            multiline
            numberOfLines={6}
            containerStyle={styles.feedbackInput}
            icon="document-text"
          />
        </Card>

        {/* Tips */}
        <Card style={styles.tipsCard}>
          <View style={styles.tipsHeader}>
            <Ionicons name="heart" size={24} color={colors.error} />
            <Text style={styles.tipsTitle}>Tip Your Driver (Optional)</Text>
          </View>

          <View style={styles.tipsOptions}>
            {[50, 100, 150, 200].map((amount) => (
              <TouchableOpacity key={amount} style={styles.tipButton}>
                <Text style={styles.tipAmount}>₹{amount}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.tipsSubtext}>
            Show your appreciation for great service
          </Text>
        </Card>

        {/* Submit Button */}
        <View style={styles.submitContainer}>
          <Button
            title="Submit Rating"
            onPress={handleSubmit}
            loading={submitting}
            disabled={driverRating === 0 || serviceRating === 0}
            icon="checkmark-circle"
            iconPosition="right"
            fullWidth
            size="lg"
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
  skipButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  skipText: {
    fontSize: typography.sizes.md,
    color: colors.textSecondary,
    fontWeight: typography.weights.medium,
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
  placeholder: {
    width: 60,
  },
  scrollView: {
    flex: 1,
  },
  successContainer: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  successIcon: {
    marginBottom: spacing.md,
  },
  successTitle: {
    fontSize: typography.sizes['2xl'],
    fontWeight: typography.weights.bold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  successSubtitle: {
    fontSize: typography.sizes.md,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  ratingCard: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  ratingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  driverAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: `${colors.primary}15`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  driverInfo: {
    flex: 1,
  },
  ratingTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  driverName: {
    fontSize: typography.sizes.md,
    color: colors.textSecondary,
  },
  serviceIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: `${colors.primary}15`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  starButton: {
    padding: spacing.xs,
  },
  ratingText: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
    color: colors.primary,
    textAlign: 'center',
  },
  categoriesCard: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  cardTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  cardSubtitle: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  feedbackCard: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  feedbackInput: {
    marginBottom: 0,
  },
  tipsCard: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    backgroundColor: `${colors.error}05`,
    borderWidth: 1,
    borderColor: `${colors.error}30`,
  },
  tipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  tipsTitle: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    color: colors.text,
  },
  tipsOptions: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  tipButton: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    backgroundColor: colors.backgroundCard,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  tipAmount: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    color: colors.text,
  },
  tipsSubtext: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  submitContainer: {
    paddingHorizontal: spacing.lg,
  },
  bottomSpacer: {
    height: spacing.xl,
  },
});

