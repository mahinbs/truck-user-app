import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { StatusChip } from '@/components/ui/StatusChip';
import { borderRadius, colors, shadows, spacing, typography } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { Dimensions, Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

type TripStatus = 'GOING_TO_PICKUP' | 'AT_PICKUP' | 'LOADED' | 'IN_TRANSIT' | 'AT_DESTINATION';

// Full trip details (can be loaded by id when navigated from home current trip card)
const TRIP_DETAILS: Record<string, {
  trackingId: string;
  from: string;
  to: string;
  material: string;
  weight: string;
  truckType: string;
  earnings: number;
  customerName: string;
  customerPhone: string;
  eta: string;
  remainingKm: string;
}> = {
  'current-1': {
    trackingId: 'TRK2024001',
    from: 'Mumbai, Maharashtra',
    to: 'Delhi, Delhi',
    material: 'Electronics',
    weight: '1200 kg',
    truckType: 'Container Truck',
    earnings: 12500,
    customerName: 'Alex Morgan',
    customerPhone: '+919876543210',
    eta: '4h 30m',
    remainingKm: '497 km',
  },
};

export default function ActiveTripScreen() {
  const { id: tripId } = useLocalSearchParams<{ id?: string }>();
  const tripDetails = tripId ? TRIP_DETAILS[tripId] : null;
  const [status, setStatus] = useState<TripStatus>(tripId ? 'IN_TRANSIT' : 'GOING_TO_PICKUP');

  const getActionButton = () => {
    switch (status) {
      case 'GOING_TO_PICKUP':
        return {
          title: 'Reached Pickup',
          icon: 'location' as const,
          onPress: () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            setStatus('AT_PICKUP');
          },
        };
      case 'AT_PICKUP':
        return {
          title: 'Load Complete',
          icon: 'checkmark-done' as const,
          onPress: () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            setStatus('LOADED');
          },
        };
      case 'LOADED':
        return {
          title: 'Start Journey',
          icon: 'car-sport' as const,
          onPress: () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            setStatus('IN_TRANSIT');
          },
        };
      case 'IN_TRANSIT':
        return {
          title: 'Reached Destination',
          icon: 'flag' as const,
          onPress: () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            setStatus('AT_DESTINATION');
          },
        };
      case 'AT_DESTINATION':
        return {
          title: 'Confirm Delivery',
          icon: 'checkmark-circle' as const,
          onPress: () => {
            router.push('/(driver)/delivery-confirmation');
          },
        };
    }
  };

  const action = getActionButton();

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colors.primaryGradientStart, colors.primaryGradientEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
      />

      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={colors.textWhite} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Active Trip</Text>
          <View style={{ width: 44 }} />
        </View>

        <View style={styles.content}>
          {/* Map Placeholder */}
          <View style={styles.mapPlaceholder}>
            <Ionicons name="map" size={64} color={colors.textSecondary} />
            <Text style={styles.mapText}>Map integration coming soon</Text>
          </View>

          {/* Status Card */}
          <Card style={styles.statusCard}>
            <View style={styles.statusHeader}>
              <StatusChip status={status === 'IN_TRANSIT' ? 'in-transit' : 'active'} />
              <TouchableOpacity 
                style={styles.reportButton}
                onPress={() => router.push('/(driver)/delay-reason')}
              >
                <Ionicons name="warning" size={16} color={colors.warning} />
                <Text style={styles.reportText}>Report Delay</Text>
              </TouchableOpacity>
            </View>

            {tripDetails && (
              <View style={styles.trackingRow}>
                <Ionicons name="cube" size={16} color={colors.primary} />
                <Text style={styles.trackingId}>{tripDetails.trackingId}</Text>
                <Text style={styles.earningsTag}>₹{tripDetails.earnings.toLocaleString()}</Text>
              </View>
            )}

            <View style={styles.routeInfo}>
              <View style={styles.routeRow}>
                <Ionicons name="location" size={20} color={colors.primary} />
                <View>
                  <Text style={styles.routeLabel}>Pickup</Text>
                  <Text style={styles.routeText}>{tripDetails?.from ?? 'Mumbai, Maharashtra'}</Text>
                </View>
              </View>
              <View style={styles.routeRow}>
                <Ionicons name="flag" size={20} color={colors.success} />
                <View>
                  <Text style={styles.routeLabel}>Drop</Text>
                  <Text style={styles.routeText}>{tripDetails?.to ?? 'Delhi, Delhi'}</Text>
                </View>
              </View>
            </View>

            {tripDetails && (
              <View style={styles.detailsGrid}>
                <View style={styles.detailRow}>
                  <Ionicons name="cube" size={18} color={colors.textSecondary} />
                  <Text style={styles.detailLabel}>Material</Text>
                  <Text style={styles.detailValue}>{tripDetails.material}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Ionicons name="barbell" size={18} color={colors.textSecondary} />
                  <Text style={styles.detailLabel}>Weight</Text>
                  <Text style={styles.detailValue}>{tripDetails.weight}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Ionicons name="car" size={18} color={colors.textSecondary} />
                  <Text style={styles.detailLabel}>Vehicle</Text>
                  <Text style={styles.detailValue}>{tripDetails.truckType}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Ionicons name="person" size={18} color={colors.textSecondary} />
                  <Text style={styles.detailLabel}>Customer</Text>
                  <Text style={styles.detailValue}>{tripDetails.customerName}</Text>
                </View>
              </View>
            )}

            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Ionicons name="time" size={18} color={colors.textSecondary} />
                <View>
                  <Text style={styles.statLabel}>ETA</Text>
                  <Text style={styles.statValue}>{tripDetails?.eta ?? '4h 30m'}</Text>
                </View>
              </View>
              <View style={styles.statItem}>
                <Ionicons name="speedometer" size={18} color={colors.textSecondary} />
                <View>
                  <Text style={styles.statLabel}>Remaining</Text>
                  <Text style={styles.statValue}>{tripDetails?.remainingKm ?? '420 km'}</Text>
                </View>
              </View>
            </View>

            <TouchableOpacity 
              style={styles.customerButton}
              onPress={() => tripDetails?.customerPhone && Linking.openURL(`tel:${tripDetails.customerPhone}`)}
            >
              <Ionicons name="call" size={20} color={colors.primary} />
              <Text style={styles.customerText}>Contact Customer{tripDetails ? ` · ${tripDetails.customerName}` : ''}</Text>
            </TouchableOpacity>
          </Card>
        </View>

        {/* Action Button */}
        <View style={styles.actionContainer}>
          <Button
            title={action.title}
            variant="gradient"
            onPress={action.onPress}
            icon={action.icon}
            iconPosition="right"
            fullWidth
            size="md"
            style={styles.actionButton}
          />
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: spacing.sm,
    flex: 1,
    backgroundColor: colors.background,
  },
  headerGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 160,
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
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  mapPlaceholder: {
    height: 200,
    backgroundColor: colors.backgroundCard,
    borderRadius: borderRadius.xl,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  mapText: {
    marginTop: spacing.sm,
    color: colors.textSecondary,
  },
  statusCard: {
    ...shadows.md,
    marginBottom: spacing.sm,
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  reportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    backgroundColor: colors.warningLight,
    borderRadius: borderRadius.full,
  },
  reportText: {
    fontSize: typography.sizes.xs,
    color: colors.warning,
    fontWeight: typography.weights.semibold,
  },
  trackingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  trackingId: {
    flex: 1,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
    color: colors.primary,
  },
  earningsTag: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
    color: colors.success,
  },
  routeInfo: {
    gap: spacing.md,
    marginBottom: spacing.md,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  routeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  routeLabel: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  routeText: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    color: colors.text,
  },
  detailsGrid: {
    gap: spacing.sm,
    marginBottom: spacing.md,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  detailLabel: {
    width: 72,
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
  },
  detailValue: {
    flex: 1,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    color: colors.text,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.lg,
    marginBottom: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  statItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  statLabel: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  statValue: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
    color: colors.text,
  },
  customerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    backgroundColor: colors.primaryTransparent,
    borderRadius: borderRadius.lg,
    marginTop: spacing.sm,
  },
  customerText: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    color: colors.primary,
  },
  actionContainer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
    backgroundColor: colors.backgroundCard,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  actionButton: {
    marginVertical: 0,
  },
});

