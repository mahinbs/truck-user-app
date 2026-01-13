import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Dimensions,
  Animated as RNAnimated,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { colors, spacing, typography, borderRadius } from '@/constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

type Step = 1 | 2 | 3 | 4;

const truckTypes = [
  { id: 'open', label: 'Open Truck', capacity: '1-2 Tons', icon: 'car-sport' },
  { id: 'container', label: 'Container', capacity: '5-10 Tons', icon: 'cube' },
  { id: 'trailer', label: 'Trailer', capacity: '20+ Tons', icon: 'git-network' },
];

export default function BookTripScreen() {
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [formData, setFormData] = useState({
    pickupLocation: '',
    dropLocation: '',
    secondDropLocation: '',
    material: '',
    weight: '',
    truckType: '',
    notes: '',
    date: '',
    time: '',
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(new Date());

  const progressAnim = useRef(new RNAnimated.Value(0.25)).current;

  useEffect(() => {
    RNAnimated.spring(progressAnim, {
      toValue: currentStep * 0.25,
      useNativeDriver: false,
    }).start();
  }, [currentStep]);

  const nextStep = () => {
    if (currentStep < 4) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setCurrentStep((currentStep + 1) as Step);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setCurrentStep((currentStep - 1) as Step);
    }
  };

  const handleSubmit = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    // TODO: Submit booking to API
    router.replace('/(tabs)/dashboard');
  };

  const handleDateChange = (event: any, date?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
      if (event.type === 'set' && date) {
        setSelectedDate(date);
        const formattedDate = date.toLocaleDateString('en-US', {
          weekday: 'short',
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        });
        setFormData({ ...formData, date: formattedDate });
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    } else {
      // iOS
      if (date) {
        setSelectedDate(date);
        const formattedDate = date.toLocaleDateString('en-US', {
          weekday: 'short',
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        });
        setFormData({ ...formData, date: formattedDate });
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    }
  };

  const handleTimeChange = (event: any, time?: Date) => {
    if (Platform.OS === 'android') {
      setShowTimePicker(false);
      if (event.type === 'set' && time) {
        setSelectedTime(time);
        const formattedTime = time.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        });
        setFormData({ ...formData, time: formattedTime });
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    } else {
      // iOS
      if (time) {
        setSelectedTime(time);
        const formattedTime = time.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        });
        setFormData({ ...formData, time: formattedTime });
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    }
  };

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

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
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={colors.textWhite} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Book a Trip</Text>
          <View style={{ width: 44 }} />
        </View>

        {/* Progress Indicator */}
        <View style={styles.progressSection}>
          <View style={styles.stepIndicators}>
            {[1, 2, 3, 4].map((step) => (
              <View key={step} style={styles.stepDot}>
                <View
                  style={[
                    styles.stepDotInner,
                    currentStep >= step && styles.stepDotActive,
                  ]}
                >
                  {currentStep > step ? (
                    <Ionicons name="checkmark" size={12} color={colors.textWhite} />
                  ) : (
                    <Text style={styles.stepDotText}>{step}</Text>
                  )}
                </View>
              </View>
            ))}
          </View>
          <View style={styles.progressBar}>
            <RNAnimated.View
              style={[styles.progressFill, { width: progressWidth }]}
            />
          </View>
          <Text style={styles.stepTitle}>
            {currentStep === 1 && 'Route Details'}
            {currentStep === 2 && 'Load Details'}
            {currentStep === 3 && 'Schedule'}
            {currentStep === 4 && 'Confirmation'}
          </Text>
        </View>

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Step 1: Route Details */}
          {currentStep === 1 && (
            <Card style={styles.stepCard}>
              <Text style={styles.cardTitle}>Where are you shipping from and to?</Text>
              
              <View style={styles.inputGroup}>
                <View style={styles.inputIcon}>
                  <Ionicons name="location" size={20} color={colors.primary} />
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="Pickup Location"
                  value={formData.pickupLocation}
                  onChangeText={(text) => setFormData({ ...formData, pickupLocation: text })}
                  placeholderTextColor={colors.textSecondary}
                />
              </View>

              <View style={styles.inputGroup}>
                <View style={styles.inputIcon}>
                  <Ionicons name="flag" size={20} color={colors.success} />
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="Drop Location"
                  value={formData.dropLocation}
                  onChangeText={(text) => setFormData({ ...formData, dropLocation: text })}
                  placeholderTextColor={colors.textSecondary}
                />
              </View>

              <TouchableOpacity style={styles.addStop}>
                <Ionicons name="add-circle" size={20} color={colors.primary} />
                <Text style={styles.addStopText}>Add Second Drop (Optional)</Text>
              </TouchableOpacity>
            </Card>
          )}

          {/* Step 2: Load Details */}
          {currentStep === 2 && (
            <Card style={styles.stepCard}>
              <Text style={styles.cardTitle}>What are you shipping?</Text>
              
              <View style={styles.inputGroup}>
                <View style={styles.inputIcon}>
                  <Ionicons name="cube" size={20} color={colors.primary} />
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="Material Type (e.g., Electronics)"
                  value={formData.material}
                  onChangeText={(text) => setFormData({ ...formData, material: text })}
                  placeholderTextColor={colors.textSecondary}
                />
              </View>

              <View style={styles.inputGroup}>
                <View style={styles.inputIcon}>
                  <Ionicons name="barbell" size={20} color={colors.primary} />
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="Weight (kg)"
                  value={formData.weight}
                  onChangeText={(text) => setFormData({ ...formData, weight: text })}
                  keyboardType="numeric"
                  placeholderTextColor={colors.textSecondary}
                />
              </View>

              <Text style={styles.sectionLabel}>Select Truck Type</Text>
              <View style={styles.truckGrid}>
                {truckTypes.map((truck) => (
                  <TouchableOpacity
                    key={truck.id}
                    style={[
                      styles.truckCard,
                      formData.truckType === truck.id && styles.truckCardActive,
                    ]}
                    onPress={() => {
                      setFormData({ ...formData, truckType: truck.id });
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    }}
                  >
                    <Ionicons
                      name={truck.icon as any}
                      size={32}
                      color={formData.truckType === truck.id ? colors.primary : colors.textSecondary}
                    />
                    <Text style={[styles.truckLabel, formData.truckType === truck.id && styles.truckLabelActive]}>
                      {truck.label}
                    </Text>
                    <Text style={styles.truckCapacity}>{truck.capacity}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Special instructions (optional)"
                value={formData.notes}
                onChangeText={(text) => setFormData({ ...formData, notes: text })}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
                placeholderTextColor={colors.textSecondary}
              />
            </Card>
          )}

          {/* Step 3: Schedule */}
          {currentStep === 3 && (
            <Card style={styles.stepCard}>
              <Text style={styles.cardTitle}>When do you need the pickup?</Text>
              
              <TouchableOpacity 
                style={styles.dateButton}
                onPress={() => {
                  setShowDatePicker(true);
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }}
              >
                <Ionicons name="calendar" size={20} color={colors.primary} />
                <Text style={styles.dateButtonText}>
                  {formData.date || 'Select Pickup Date'}
                </Text>
                <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
              </TouchableOpacity>

              {showDatePicker && (
                <View style={styles.pickerContainer}>
                  {Platform.OS === 'ios' && (
                    <View style={styles.pickerHeader}>
                      <TouchableOpacity
                        onPress={() => {
                          setShowDatePicker(false);
                          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        }}
                        style={styles.pickerButton}
                      >
                        <Text style={styles.pickerButtonText}>Cancel</Text>
                      </TouchableOpacity>
                      <Text style={styles.pickerTitle}>Select Date</Text>
                      <TouchableOpacity
                        onPress={() => {
                          setShowDatePicker(false);
                          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        }}
                        style={styles.pickerButton}
                      >
                        <Text style={[styles.pickerButtonText, styles.pickerButtonDone]}>Done</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                  <DateTimePicker
                    value={selectedDate}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={handleDateChange}
                    minimumDate={new Date()}
                  />
                </View>
              )}

              <TouchableOpacity 
                style={styles.dateButton}
                onPress={() => {
                  setShowTimePicker(true);
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }}
              >
                <Ionicons name="time" size={20} color={colors.primary} />
                <Text style={styles.dateButtonText}>
                  {formData.time || 'Select Pickup Time'}
                </Text>
                <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
              </TouchableOpacity>

              {showTimePicker && (
                <View style={styles.pickerContainer}>
                  {Platform.OS === 'ios' && (
                    <View style={styles.pickerHeader}>
                      <TouchableOpacity
                        onPress={() => {
                          setShowTimePicker(false);
                          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        }}
                        style={styles.pickerButton}
                      >
                        <Text style={styles.pickerButtonText}>Cancel</Text>
                      </TouchableOpacity>
                      <Text style={styles.pickerTitle}>Select Time</Text>
                      <TouchableOpacity
                        onPress={() => {
                          setShowTimePicker(false);
                          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        }}
                        style={styles.pickerButton}
                      >
                        <Text style={[styles.pickerButtonText, styles.pickerButtonDone]}>Done</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                  <DateTimePicker
                    value={selectedTime}
                    mode="time"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={handleTimeChange}
                    is24Hour={false}
                  />
                </View>
              )}

              <View style={styles.infoBox}>
                <Ionicons name="information-circle" size={20} color={colors.info} />
                <Text style={styles.infoText}>
                  Driver will be assigned within 30 minutes of your selected time
                </Text>
              </View>
            </Card>
          )}

          {/* Step 4: Confirmation */}
          {currentStep === 4 && (
            <Card style={styles.stepCard}>
              <Text style={styles.cardTitle}>Review Your Booking</Text>
              
              <View style={styles.summarySection}>
                <Text style={styles.summaryLabel}>Route</Text>
                <View style={styles.routeSummary}>
                  <Text style={styles.summaryValue}>{formData.pickupLocation || 'Not set'}</Text>
                  <Ionicons name="arrow-forward" size={16} color={colors.textSecondary} />
                  <Text style={styles.summaryValue}>{formData.dropLocation || 'Not set'}</Text>
                </View>
              </View>

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Material</Text>
                <Text style={styles.summaryValue}>{formData.material || 'Not set'}</Text>
              </View>

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Weight</Text>
                <Text style={styles.summaryValue}>{formData.weight ? `${formData.weight} kg` : 'Not set'}</Text>
              </View>

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Truck Type</Text>
                <Text style={styles.summaryValue}>
                  {truckTypes.find((t) => t.id === formData.truckType)?.label || 'Not selected'}
                </Text>
              </View>

              <View style={styles.divider} />

              <View style={styles.priceSection}>
                <Text style={styles.priceLabel}>Estimated Cost</Text>
                <Text style={styles.priceValue}>₹12,500</Text>
              </View>

              <View style={styles.priceRow}>
                <Text style={styles.priceSubLabel}>Platform Fee</Text>
                <Text style={styles.priceSubValue}>₹500</Text>
              </View>

              <View style={styles.priceDivider} />

              <View style={styles.priceRow}>
                <Text style={styles.priceTotalLabel}>Total Amount</Text>
                <Text style={styles.priceTotalValue}>₹13,000</Text>
              </View>
            </Card>
          )}
        </ScrollView>

        {/* Bottom Navigation */}
        <View style={styles.bottomNav}>
          {currentStep > 1 && (
            <TouchableOpacity style={styles.navButton} onPress={prevStep}>
              <Ionicons name="chevron-back" size={20} color={colors.primary} />
              <Text style={styles.navButtonText}>Back</Text>
            </TouchableOpacity>
          )}
          
          <View style={styles.navSpacer} />
          
          {currentStep < 4 ? (
            <Button
              title="Continue"
              variant="gradient"
              onPress={nextStep}
              icon="arrow-forward"
              iconPosition="right"
              style={styles.continueButton}
            />
          ) : (
            <Button
              title="Confirm Booking"
              variant="gradient"
              onPress={handleSubmit}
              icon="checkmark-circle"
              iconPosition="right"
              style={styles.continueButton}
            />
          )}
        </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.textWhite,
  },
  progressSection: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  stepIndicators: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  stepDot: {
    flex: 1,
    alignItems: 'center',
  },
  stepDotInner: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepDotActive: {
    backgroundColor: colors.primary,
  },
  stepDotText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    color: colors.textSecondary,
  },
  progressBar: {
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: spacing.sm,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
  },
  stepTitle: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    color: colors.textWhite,
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: 100,
  },
  stepCard: {
    marginBottom: spacing.md,
  },
  cardTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.text,
    marginBottom: spacing.lg,
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundLight,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  inputIcon: {
    marginRight: spacing.sm,
  },
  input: {
    flex: 1,
    paddingVertical: spacing.md,
    fontSize: typography.sizes.md,
    color: colors.text,
  },
  textArea: {
    backgroundColor: colors.backgroundLight,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 80,
    marginTop: spacing.md,
  },
  addStop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
  },
  addStopText: {
    fontSize: typography.sizes.sm,
    color: colors.primary,
    fontWeight: typography.weights.semibold,
  },
  sectionLabel: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    color: colors.text,
    marginBottom: spacing.md,
    marginTop: spacing.md,
  },
  truckGrid: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  truckCard: {
    flex: 1,
    backgroundColor: colors.backgroundLight,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.border,
  },
  truckCardActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryTransparent,
  },
  truckLabel: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    color: colors.textSecondary,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  truckLabelActive: {
    color: colors.primary,
  },
  truckCapacity: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    marginTop: spacing.xs - 2,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.backgroundLight,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  dateButtonText: {
    flex: 1,
    fontSize: typography.sizes.md,
    color: colors.text,
  },
  infoBox: {
    flexDirection: 'row',
    gap: spacing.sm,
    backgroundColor: colors.infoLight,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginTop: spacing.md,
  },
  infoText: {
    flex: 1,
    fontSize: typography.sizes.sm,
    color: colors.text,
    lineHeight: 20,
  },
  summarySection: {
    marginBottom: spacing.md,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  summaryLabel: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
  },
  summaryValue: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    color: colors.text,
  },
  routeSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.md,
  },
  priceSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  priceLabel: {
    fontSize: typography.sizes.md,
    color: colors.textSecondary,
  },
  priceValue: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.text,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  priceSubLabel: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
  },
  priceSubValue: {
    fontSize: typography.sizes.sm,
    color: colors.text,
  },
  priceDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.md,
  },
  priceTotalLabel: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.text,
  },
  priceTotalValue: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.primary,
  },
  bottomNav: {
    flexDirection: 'row',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.backgroundCard,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  navButtonText: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    color: colors.primary,
  },
  navSpacer: {
    flex: 1,
  },
  continueButton: {
    minWidth: 140,
    flexShrink: 0,
    flexGrow: 0,
  },
  pickerContainer: {
    marginTop: spacing.sm,
    marginBottom: spacing.md,
    backgroundColor: colors.backgroundLight,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
  },
  pickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.backgroundCard,
  },
  pickerButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  pickerButtonText: {
    fontSize: typography.sizes.md,
    color: colors.textSecondary,
    fontWeight: typography.weights.medium,
  },
  pickerButtonDone: {
    color: colors.primary,
    fontWeight: typography.weights.semibold,
  },
  pickerTitle: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    color: colors.text,
  },
});
