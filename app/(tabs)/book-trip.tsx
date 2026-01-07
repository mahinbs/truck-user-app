import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Chip } from '@/components/ui/Chip';
import { colors, spacing, typography, borderRadius, shadows } from '@/constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';

const MATERIAL_TYPES = [
  { id: 'electronics', label: 'Electronics', icon: 'hardware-chip' },
  { id: 'furniture', label: 'Furniture', icon: 'bed' },
  { id: 'food', label: 'Food Items', icon: 'fast-food' },
  { id: 'raw', label: 'Raw Materials', icon: 'cube' },
  { id: 'fragile', label: 'Fragile', icon: 'warning' },
  { id: 'other', label: 'Other', icon: 'apps' },
];

const TRUCK_TYPES = [
  {
    id: 'small',
    name: 'Small Truck',
    capacity: '500-1000 kg',
    icon: 'car',
    basePrice: 800,
  },
  {
    id: 'medium',
    name: 'Medium Truck',
    capacity: '1000-3000 kg',
    icon: 'bus',
    basePrice: 1500,
  },
  {
    id: 'large',
    name: 'Large Truck',
    capacity: '3000-8000 kg',
    icon: 'train',
    basePrice: 2500,
  },
  {
    id: 'trailer',
    name: 'Trailer',
    capacity: '8000+ kg',
    icon: 'boat',
    basePrice: 4000,
  },
];

export default function BookTripScreen() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    pickupLocation: '',
    pickupDetails: '',
    dropLocation: '',
    dropDetails: '',
    materialType: '',
    weight: '',
    truckType: '',
    urgency: 'standard',
    date: '',
    time: '',
    notes: '',
  });

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    }
  };

  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleConfirm = () => {
    // Navigate to price comparison or bid listing
    router.push('/(tabs)/dashboard');
  };

  const getStepTitle = () => {
    switch (step) {
      case 1:
        return 'Pickup & Drop Locations';
      case 2:
        return 'Material Details';
      case 3:
        return 'Truck & Schedule';
      case 4:
        return 'Review & Confirm';
      default:
        return '';
    }
  };

  const calculateEstimate = () => {
    const truck = TRUCK_TYPES.find((t) => t.id === formData.truckType);
    if (!truck) return 0;
    
    let price = truck.basePrice;
    if (formData.urgency === 'urgent') price *= 1.5;
    if (formData.urgency === 'express') price *= 2;
    
    return Math.round(price);
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <View>
            <View style={styles.stepHeader}>
              <Ionicons name="location" size={24} color={colors.primary} />
              <Text style={styles.stepTitle}>{getStepTitle()}</Text>
            </View>

            <Input
              label="Pickup Location"
              placeholder="Enter pickup address or landmark"
              value={formData.pickupLocation}
              onChangeText={(text) =>
                setFormData({ ...formData, pickupLocation: text })
              }
              icon="location"
            />

            <Input
              label="Pickup Details (Optional)"
              placeholder="Floor number, contact person, etc."
              value={formData.pickupDetails}
              onChangeText={(text) =>
                setFormData({ ...formData, pickupDetails: text })
              }
              icon="information-circle"
            />

            <Input
              label="Drop Location"
              placeholder="Enter delivery address or landmark"
              value={formData.dropLocation}
              onChangeText={(text) =>
                setFormData({ ...formData, dropLocation: text })
              }
              icon="navigate"
            />

            <Input
              label="Delivery Details (Optional)"
              placeholder="Floor number, contact person, etc."
              value={formData.dropDetails}
              onChangeText={(text) =>
                setFormData({ ...formData, dropDetails: text })
              }
              icon="information-circle"
            />
          </View>
        );

      case 2:
        return (
          <View>
            <View style={styles.stepHeader}>
              <Ionicons name="cube" size={24} color={colors.primary} />
              <Text style={styles.stepTitle}>{getStepTitle()}</Text>
            </View>

            <Text style={styles.label}>Material Type</Text>
            <View style={styles.chipsContainer}>
              {MATERIAL_TYPES.map((material) => (
                <Chip
                  key={material.id}
                  label={material.label}
                  icon={material.icon as any}
                  selected={formData.materialType === material.id}
                  onPress={() =>
                    setFormData({ ...formData, materialType: material.id })
                  }
                />
              ))}
            </View>

            <Input
              label="Estimated Weight (kg)"
              placeholder="Enter approximate weight"
              value={formData.weight}
              onChangeText={(text) =>
                setFormData({ ...formData, weight: text })
              }
              icon="barbell"
              keyboardType="numeric"
            />

            <Input
              label="Additional Notes (Optional)"
              placeholder="Special handling instructions, etc."
              value={formData.notes}
              onChangeText={(text) =>
                setFormData({ ...formData, notes: text })
              }
              icon="document-text"
              multiline
              numberOfLines={3}
            />
          </View>
        );

      case 3:
        return (
          <View>
            <View style={styles.stepHeader}>
              <Ionicons name="car" size={24} color={colors.primary} />
              <Text style={styles.stepTitle}>{getStepTitle()}</Text>
            </View>

            <Text style={styles.label}>Select Truck Type</Text>
            {TRUCK_TYPES.map((truck) => (
              <Card
                key={truck.id}
                style={[
                  styles.truckCard,
                  formData.truckType === truck.id && styles.truckCardSelected,
                ]}
                onPress={() =>
                  setFormData({ ...formData, truckType: truck.id })
                }
              >
                <View style={styles.truckContent}>
                  <View style={styles.truckIconContainer}>
                    <Ionicons name={truck.icon as any} size={28} color={colors.primary} />
                  </View>
                  <View style={styles.truckInfo}>
                    <Text style={styles.truckName}>{truck.name}</Text>
                    <Text style={styles.truckCapacity}>{truck.capacity}</Text>
                  </View>
                  <View style={styles.truckPrice}>
                    <Text style={styles.truckPriceLabel}>From</Text>
                    <Text style={styles.truckPriceValue}>₹{truck.basePrice}</Text>
                  </View>
                  {formData.truckType === truck.id && (
                    <Ionicons name="checkmark-circle" size={24} color={colors.primary} />
                  )}
                </View>
              </Card>
            ))}

            <Text style={styles.label}>Urgency</Text>
            <View style={styles.urgencyContainer}>
              <Chip
                label="Standard"
                icon="time"
                selected={formData.urgency === 'standard'}
                onPress={() => setFormData({ ...formData, urgency: 'standard' })}
              />
              <Chip
                label="Urgent (24h)"
                icon="flash"
                selected={formData.urgency === 'urgent'}
                onPress={() => setFormData({ ...formData, urgency: 'urgent' })}
              />
              <Chip
                label="Express (6h)"
                icon="rocket"
                selected={formData.urgency === 'express'}
                onPress={() => setFormData({ ...formData, urgency: 'express' })}
              />
            </View>

            <Input
              label="Preferred Pickup Date"
              placeholder="DD/MM/YYYY"
              value={formData.date}
              onChangeText={(text) =>
                setFormData({ ...formData, date: text })
              }
              icon="calendar"
            />

            <Input
              label="Preferred Time"
              placeholder="HH:MM"
              value={formData.time}
              onChangeText={(text) =>
                setFormData({ ...formData, time: text })
              }
              icon="time"
            />
          </View>
        );

      case 4:
        return (
          <View>
            <View style={styles.stepHeader}>
              <Ionicons name="checkmark-circle" size={24} color={colors.success} />
              <Text style={styles.stepTitle}>{getStepTitle()}</Text>
            </View>

            <Card style={styles.summaryCard}>
              <View style={styles.summarySection}>
                <Text style={styles.summarySectionTitle}>Route</Text>
                <View style={styles.summaryRow}>
                  <Ionicons name="location" size={16} color={colors.textSecondary} />
                  <Text style={styles.summaryText}>{formData.pickupLocation}</Text>
                </View>
                <View style={styles.routeConnector} />
                <View style={styles.summaryRow}>
                  <Ionicons name="navigate" size={16} color={colors.textSecondary} />
                  <Text style={styles.summaryText}>{formData.dropLocation}</Text>
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.summarySection}>
                <Text style={styles.summarySectionTitle}>Material</Text>
                <View style={styles.summaryRow}>
                  <Ionicons name="cube" size={16} color={colors.textSecondary} />
                  <Text style={styles.summaryText}>
                    {MATERIAL_TYPES.find((m) => m.id === formData.materialType)?.label || 'N/A'}
                  </Text>
                </View>
                <View style={styles.summaryRow}>
                  <Ionicons name="barbell" size={16} color={colors.textSecondary} />
                  <Text style={styles.summaryText}>{formData.weight} kg</Text>
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.summarySection}>
                <Text style={styles.summarySectionTitle}>Truck & Schedule</Text>
                <View style={styles.summaryRow}>
                  <Ionicons name="car" size={16} color={colors.textSecondary} />
                  <Text style={styles.summaryText}>
                    {TRUCK_TYPES.find((t) => t.id === formData.truckType)?.name || 'N/A'}
                  </Text>
                </View>
                <View style={styles.summaryRow}>
                  <Ionicons name="calendar" size={16} color={colors.textSecondary} />
                  <Text style={styles.summaryText}>
                    {formData.date} at {formData.time}
                  </Text>
                </View>
                <View style={styles.summaryRow}>
                  <Ionicons name="flash" size={16} color={colors.textSecondary} />
                  <Text style={styles.summaryText}>
                    {formData.urgency.charAt(0).toUpperCase() + formData.urgency.slice(1)}
                  </Text>
                </View>
              </View>
            </Card>

            <Card style={styles.priceCard}>
              <View style={styles.priceHeader}>
                <Text style={styles.priceLabel}>Estimated Price</Text>
                <Text style={styles.priceValue}>₹{calculateEstimate()}</Text>
              </View>
              <Text style={styles.priceNote}>
                Final price may vary based on actual distance and truck availability
              </Text>
            </Card>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Book Shipment</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Progress Indicator */}
        <View style={styles.progressContainer}>
          {[1, 2, 3, 4].map((s) => (
            <View key={s} style={styles.progressItem}>
              <View
                style={[
                  styles.progressDot,
                  s <= step && styles.progressDotActive,
                  s === step && styles.progressDotCurrent,
                ]}
              >
                <Text
                  style={[
                    styles.progressNumber,
                    s <= step && styles.progressNumberActive,
                  ]}
                >
                  {s}
                </Text>
              </View>
              {s < 4 && (
                <View
                  style={[
                    styles.progressLine,
                    s < step && styles.progressLineActive,
                  ]}
                />
              )}
            </View>
          ))}
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {renderStepContent()}
        </ScrollView>

        {/* Actions */}
        <View style={styles.actions}>
          {step > 1 && (
            <Button
              title="Previous"
              onPress={handlePrevious}
              variant="outline"
              icon="arrow-back"
              style={styles.actionButton}
            />
          )}
          <Button
            title={step === 4 ? 'Get Quotes' : 'Next'}
            onPress={step === 4 ? handleConfirm : handleNext}
            icon={step === 4 ? 'checkmark' : 'arrow-forward'}
            iconPosition="right"
            style={[styles.actionButton, step === 1 && styles.actionButtonFull]}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.backgroundCard,
    ...shadows.sm,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.text,
  },
  placeholder: {
    width: 40,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  progressItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  progressDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressDotActive: {
    backgroundColor: colors.primary,
  },
  progressDotCurrent: {
    ...shadows.md,
  },
  progressNumber: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
    color: colors.textSecondary,
  },
  progressNumberActive: {
    color: colors.backgroundCard,
  },
  progressLine: {
    flex: 1,
    height: 2,
    backgroundColor: colors.border,
    marginHorizontal: spacing.xs,
  },
  progressLineActive: {
    backgroundColor: colors.primary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  stepTitle: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.text,
    marginLeft: spacing.md,
  },
  label: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    color: colors.text,
    marginBottom: spacing.md,
    marginTop: spacing.md,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing.md,
  },
  truckCard: {
    marginBottom: spacing.md,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  truckCardSelected: {
    borderColor: colors.primary,
    backgroundColor: `${colors.primary}08`,
  },
  truckContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  truckIconContainer: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    backgroundColor: `${colors.primary}15`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  truckInfo: {
    flex: 1,
  },
  truckName: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    color: colors.text,
    marginBottom: 2,
  },
  truckCapacity: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
  },
  truckPrice: {
    alignItems: 'flex-end',
    marginRight: spacing.md,
  },
  truckPriceLabel: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
  },
  truckPriceValue: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.primary,
  },
  urgencyContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing.md,
  },
  summaryCard: {
    marginBottom: spacing.md,
  },
  summarySection: {
    marginBottom: spacing.md,
  },
  summarySectionTitle: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  summaryText: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    marginLeft: spacing.sm,
    flex: 1,
  },
  routeConnector: {
    width: 2,
    height: 16,
    backgroundColor: colors.border,
    marginLeft: 7,
    marginVertical: 2,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.md,
  },
  priceCard: {
    backgroundColor: `${colors.primary}10`,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  priceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  priceLabel: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
    color: colors.text,
  },
  priceValue: {
    fontSize: typography.sizes['3xl'],
    fontWeight: typography.weights.bold,
    color: colors.primary,
  },
  priceNote: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
    padding: spacing.lg,
    backgroundColor: colors.backgroundCard,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    ...shadows.md,
  },
  actionButton: {
    flex: 1,
  },
  actionButtonFull: {
    flex: 1,
  },
});
