import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { StatusChip } from '@/components/ui/StatusChip';
import { colors, spacing, typography, borderRadius } from '@/constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

type TripStatus = 'GOING_TO_PICKUP' | 'AT_PICKUP' | 'LOADED' | 'IN_TRANSIT' | 'AT_DESTINATION';

export default function ActiveTripScreen() {
  const [status, setStatus] = useState<TripStatus>('GOING_TO_PICKUP');

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

            <View style={styles.routeInfo}>
              <View style={styles.routeRow}>
                <Ionicons name="location" size={20} color={colors.primary} />
                <View>
                  <Text style={styles.routeLabel}>Pickup</Text>
                  <Text style={styles.routeText}>Mumbai, Maharashtra</Text>
                </View>
              </View>
              <View style={styles.routeRow}>
                <Ionicons name="flag" size={20} color={colors.success} />
                <View>
                  <Text style={styles.routeLabel}>Drop</Text>
                  <Text style={styles.routeText}>Delhi, Delhi</Text>
                </View>
              </View>
            </View>

            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Ionicons name="time" size={18} color={colors.textSecondary} />
                <View>
                  <Text style={styles.statLabel}>ETA</Text>
                  <Text style={styles.statValue}>4h 30m</Text>
                </View>
              </View>
              <View style={styles.statItem}>
                <Ionicons name="speedometer" size={18} color={colors.textSecondary} />
                <View>
                  <Text style={styles.statLabel}>Remaining</Text>
                  <Text style={styles.statValue}>420 km</Text>
                </View>
              </View>
            </View>

            <TouchableOpacity style={styles.customerButton}>
              <Ionicons name="call" size={20} color={colors.primary} />
              <Text style={styles.customerText}>Contact Customer</Text>
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
            size="lg"
          />
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
    height: 180,
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
    padding: spacing.lg,
  },
  mapPlaceholder: {
    height: 250,
    backgroundColor: colors.backgroundCard,
    borderRadius: borderRadius.xl,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  mapText: {
    marginTop: spacing.sm,
    color: colors.textSecondary,
  },
  statusCard: {},
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
  statsRow: {
    flexDirection: 'row',
    gap: spacing.xl,
    marginBottom: spacing.md,
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
  },
  customerText: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    color: colors.primary,
  },
  actionContainer: {
    padding: spacing.lg,
    backgroundColor: colors.backgroundCard,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});

