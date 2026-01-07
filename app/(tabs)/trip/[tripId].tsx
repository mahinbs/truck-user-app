import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Divider } from '@/components/ui/Divider';
import { colors, spacing, typography, borderRadius, shadows } from '@/constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Milestone {
  id: string;
  label: string;
  status: 'completed' | 'pending' | 'current';
  timestamp?: string;
  location?: string;
}

export default function TripDetailScreen() {
  const { tripId } = useLocalSearchParams();

  // Mock data - replace with real API data
  const tripData = {
    trackingId: 'TRK2024001',
    status: 'in-transit',
    from: {
      address: 'ABC Warehouse, Andheri East',
      city: 'Mumbai, Maharashtra',
      contact: 'Raj Sharma',
      phone: '+91 98765 43210',
    },
    to: {
      address: 'XYZ Distribution Center, Connaught Place',
      city: 'Delhi, Delhi',
      contact: 'Priya Singh',
      phone: '+91 98765 43211',
    },
    material: 'Electronics - Laptops & Accessories',
    weight: '1200 kg',
    truckType: 'Medium Truck (20ft)',
    driver: {
      name: 'Raj Kumar',
      phone: '+91 98765 43212',
      rating: 4.8,
      trips: 245,
    },
    truck: {
      number: 'MH 02 AB 1234',
      model: 'Tata 1109',
    },
    schedule: {
      pickupDate: '2024-01-07',
      pickupTime: '09:00 AM',
      expectedDelivery: '2024-01-08',
      estimatedTime: '14:30 PM',
    },
    pricing: {
      baseFare: 1200,
      gst: 216,
      total: 1416,
      paid: 708,
      due: 708,
    },
    progress: 65,
  };

  const milestones: Milestone[] = [
    {
      id: '1',
      label: 'Booking Confirmed',
      status: 'completed',
      timestamp: '2024-01-07 08:30 AM',
      location: 'Mumbai',
    },
    {
      id: '2',
      label: 'Driver Assigned',
      status: 'completed',
      timestamp: '2024-01-07 08:45 AM',
    },
    {
      id: '3',
      label: 'Reached Pickup',
      status: 'completed',
      timestamp: '2024-01-07 09:15 AM',
      location: 'Mumbai',
    },
    {
      id: '4',
      label: 'Loaded & Started',
      status: 'completed',
      timestamp: '2024-01-07 10:00 AM',
      location: 'Mumbai',
    },
    {
      id: '5',
      label: 'In Transit',
      status: 'current',
      timestamp: '2024-01-07 02:30 PM',
      location: 'Approaching Vadodara',
    },
    {
      id: '6',
      label: 'Delivered',
      status: 'pending',
    },
  ];

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

  const handleCall = (phone: string) => {
    Linking.openURL(`tel:${phone}`);
  };

  const handleShareLocation = () => {
    Alert.alert('Share Location', 'Live tracking link will be shared');
  };

  const handleReportIssue = () => {
    Alert.alert('Report Issue', 'Issue reporting functionality will be implemented');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Track Shipment</Text>
          <Text style={styles.headerSubtitle}>{tripData.trackingId}</Text>
        </View>
        <TouchableOpacity style={styles.headerButton} onPress={handleShareLocation}>
          <Ionicons name="share-outline" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Map Placeholder */}
        <Card style={styles.mapCard} padding={0}>
          <View style={styles.mapPlaceholder}>
            <Ionicons name="map" size={64} color={colors.primary} />
            <Text style={styles.mapLabel}>Live Tracking Map</Text>
            <Text style={styles.mapSubtext}>Real-time truck location</Text>
            <View style={styles.mapOverlay}>
              <View style={styles.progressIndicator}>
                <Text style={styles.progressText}>{tripData.progress}%</Text>
                <Text style={styles.progressLabel}>Complete</Text>
              </View>
            </View>
          </View>
        </Card>

        {/* Status Card */}
        <Card style={styles.statusCard}>
          <View style={styles.statusHeader}>
            {getStatusBadge()}
            <Text style={styles.eta}>ETA: {tripData.schedule.estimatedTime}</Text>
          </View>

          <View style={styles.progressBarContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${tripData.progress}%` }]} />
            </View>
          </View>

          <Text style={styles.statusMessage}>
            Your shipment is on its way and will arrive by{' '}
            {tripData.schedule.expectedDelivery}
          </Text>
        </Card>

        {/* Route Info */}
        <Card style={styles.routeCard}>
          <Text style={styles.cardTitle}>Route Information</Text>

          <View style={styles.routePoint}>
            <View style={styles.routeIconContainer}>
              <Ionicons name="location" size={20} color={colors.primary} />
            </View>
            <View style={styles.routeDetails}>
              <Text style={styles.routeLabel}>Pickup Location</Text>
              <Text style={styles.routeAddress}>{tripData.from.address}</Text>
              <Text style={styles.routeCity}>{tripData.from.city}</Text>
              <View style={styles.contactRow}>
                <Ionicons name="person" size={14} color={colors.textSecondary} />
                <Text style={styles.contactText}>{tripData.from.contact}</Text>
                <TouchableOpacity onPress={() => handleCall(tripData.from.phone)}>
                  <Ionicons name="call" size={16} color={colors.primary} style={styles.callIcon} />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={styles.routeConnector}>
            <View style={styles.routeLine} />
            <Ionicons name="arrow-down" size={20} color={colors.textSecondary} />
          </View>

          <View style={styles.routePoint}>
            <View style={styles.routeIconContainer}>
              <Ionicons name="navigate" size={20} color={colors.success} />
            </View>
            <View style={styles.routeDetails}>
              <Text style={styles.routeLabel}>Delivery Location</Text>
              <Text style={styles.routeAddress}>{tripData.to.address}</Text>
              <Text style={styles.routeCity}>{tripData.to.city}</Text>
              <View style={styles.contactRow}>
                <Ionicons name="person" size={14} color={colors.textSecondary} />
                <Text style={styles.contactText}>{tripData.to.contact}</Text>
                <TouchableOpacity onPress={() => handleCall(tripData.to.phone)}>
                  <Ionicons name="call" size={16} color={colors.primary} style={styles.callIcon} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Card>

        {/* Driver Info */}
        <Card style={styles.driverCard}>
          <Text style={styles.cardTitle}>Driver Details</Text>

          <View style={styles.driverInfo}>
            <View style={styles.driverAvatar}>
              <Ionicons name="person" size={32} color={colors.primary} />
            </View>
            <View style={styles.driverDetails}>
              <Text style={styles.driverName}>{tripData.driver.name}</Text>
              <View style={styles.driverRating}>
                <Ionicons name="star" size={14} color={colors.warning} />
                <Text style={styles.ratingText}>{tripData.driver.rating}</Text>
                <Text style={styles.tripsText}>• {tripData.driver.trips} trips</Text>
              </View>
              <View style={styles.truckInfo}>
                <Ionicons name="car" size={14} color={colors.textSecondary} />
                <Text style={styles.truckText}>
                  {tripData.truck.number} • {tripData.truck.model}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.callButton}
              onPress={() => handleCall(tripData.driver.phone)}
            >
              <Ionicons name="call" size={20} color={colors.backgroundCard} />
            </TouchableOpacity>
          </View>
        </Card>

        {/* Shipment Details */}
        <Card style={styles.detailsCard}>
          <Text style={styles.cardTitle}>Shipment Details</Text>

          <View style={styles.detailRow}>
            <View style={styles.detailIconContainer}>
              <Ionicons name="cube" size={18} color={colors.primary} />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Material</Text>
              <Text style={styles.detailValue}>{tripData.material}</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.detailIconContainer}>
              <Ionicons name="barbell" size={18} color={colors.primary} />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Weight</Text>
              <Text style={styles.detailValue}>{tripData.weight}</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.detailIconContainer}>
              <Ionicons name="car" size={18} color={colors.primary} />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Truck Type</Text>
              <Text style={styles.detailValue}>{tripData.truckType}</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.detailIconContainer}>
              <Ionicons name="calendar" size={18} color={colors.primary} />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Pickup Schedule</Text>
              <Text style={styles.detailValue}>
                {tripData.schedule.pickupDate} at {tripData.schedule.pickupTime}
              </Text>
            </View>
          </View>
        </Card>

        {/* Timeline */}
        <Card style={styles.timelineCard}>
          <Text style={styles.cardTitle}>Trip Timeline</Text>

          {milestones.map((milestone, index) => (
            <View key={milestone.id} style={styles.timelineItem}>
              <View style={styles.timelineLeft}>
                <View
                  style={[
                    styles.timelineDot,
                    milestone.status === 'completed' && styles.timelineDotCompleted,
                    milestone.status === 'current' && styles.timelineDotCurrent,
                  ]}
                >
                  {milestone.status === 'completed' && (
                    <Ionicons name="checkmark" size={12} color={colors.backgroundCard} />
                  )}
                  {milestone.status === 'current' && (
                    <View style={styles.pulse} />
                  )}
                </View>
                {index < milestones.length - 1 && (
                  <View
                    style={[
                      styles.timelineLine,
                      milestone.status === 'completed' && styles.timelineLineCompleted,
                    ]}
                  />
                )}
              </View>
              <View style={styles.timelineContent}>
                <Text
                  style={[
                    styles.timelineLabel,
                    milestone.status === 'completed' && styles.timelineLabelCompleted,
                    milestone.status === 'current' && styles.timelineLabelCurrent,
                  ]}
                >
                  {milestone.label}
                </Text>
                {milestone.location && (
                  <Text style={styles.timelineLocation}>
                    <Ionicons name="location" size={12} /> {milestone.location}
                  </Text>
                )}
                {milestone.timestamp && (
                  <Text style={styles.timelineTime}>{milestone.timestamp}</Text>
                )}
              </View>
            </View>
          ))}
        </Card>

        {/* Payment Summary */}
        <Card style={styles.paymentCard}>
          <View style={styles.paymentHeader}>
            <Text style={styles.cardTitle}>Payment Summary</Text>
            <TouchableOpacity
              onPress={() => router.push(`/(tabs)/trip/${tripId}/payment`)}
            >
              <Text style={styles.viewDetails}>View Details</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.paymentRow}>
            <Text style={styles.paymentLabel}>Base Fare</Text>
            <Text style={styles.paymentValue}>₹{tripData.pricing.baseFare}</Text>
          </View>
          <View style={styles.paymentRow}>
            <Text style={styles.paymentLabel}>GST (18%)</Text>
            <Text style={styles.paymentValue}>₹{tripData.pricing.gst}</Text>
          </View>
          <Divider />
          <View style={styles.paymentRow}>
            <Text style={styles.paymentTotal}>Total Amount</Text>
            <Text style={styles.paymentTotalValue}>₹{tripData.pricing.total}</Text>
          </View>
          <View style={styles.paymentRow}>
            <Text style={styles.paymentLabel}>Paid (Advance)</Text>
            <Text style={[styles.paymentValue, { color: colors.success }]}>
              ₹{tripData.pricing.paid}
            </Text>
          </View>
          <View style={styles.paymentRow}>
            <Text style={styles.paymentLabel}>Due (On Delivery)</Text>
            <Text style={[styles.paymentValue, { color: colors.warning }]}>
              ₹{tripData.pricing.due}
            </Text>
          </View>
        </Card>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <Button
            title="Report Issue"
            onPress={handleReportIssue}
            variant="outline"
            icon="alert-circle"
            style={styles.actionButton}
          />
          <Button
            title="Contact Support"
            onPress={() => handleCall('+91 1800-123-4567')}
            variant="outline"
            icon="headset"
            style={styles.actionButton}
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
  headerButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
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
  headerSubtitle: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
  },
  scrollView: {
    flex: 1,
  },
  mapCard: {
    margin: spacing.lg,
    height: 200,
    overflow: 'hidden',
  },
  mapPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: `${colors.primary}10`,
    position: 'relative',
  },
  mapLabel: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    color: colors.text,
    marginTop: spacing.sm,
  },
  mapSubtext: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
  },
  mapOverlay: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
  },
  progressIndicator: {
    backgroundColor: colors.backgroundCard,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    ...shadows.md,
  },
  progressText: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.primary,
    textAlign: 'center',
  },
  progressLabel: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  statusCard: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  eta: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    color: colors.success,
  },
  progressBarContainer: {
    marginBottom: spacing.md,
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.border,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: borderRadius.full,
  },
  statusMessage: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  routeCard: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  cardTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.text,
    marginBottom: spacing.md,
  },
  routePoint: {
    flexDirection: 'row',
  },
  routeIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${colors.primary}15`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  routeDetails: {
    flex: 1,
  },
  routeLabel: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  routeAddress: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    color: colors.text,
    marginBottom: 2,
  },
  routeCity: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  contactText: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    flex: 1,
  },
  callIcon: {
    marginLeft: spacing.sm,
  },
  routeConnector: {
    alignItems: 'center',
    marginVertical: spacing.sm,
  },
  routeLine: {
    width: 2,
    height: 30,
    backgroundColor: colors.border,
  },
  driverCard: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  driverInfo: {
    flexDirection: 'row',
    alignItems: 'center',
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
  driverDetails: {
    flex: 1,
  },
  driverName: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  driverRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  ratingText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    color: colors.text,
    marginLeft: spacing.xs,
  },
  tripsText: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    marginLeft: spacing.xs,
  },
  truckInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  truckText: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
  },
  callButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.md,
  },
  detailsCard: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  detailIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: `${colors.primary}15`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    color: colors.text,
  },
  timelineCard: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: spacing.lg,
  },
  timelineLeft: {
    alignItems: 'center',
    marginRight: spacing.md,
  },
  timelineDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.border,
    borderWidth: 3,
    borderColor: colors.backgroundCard,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timelineDotCompleted: {
    backgroundColor: colors.success,
  },
  timelineDotCurrent: {
    backgroundColor: colors.primary,
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  pulse: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.backgroundCard,
  },
  timelineLine: {
    width: 2,
    height: 40,
    backgroundColor: colors.border,
    marginTop: spacing.xs,
  },
  timelineLineCompleted: {
    backgroundColor: colors.success,
  },
  timelineContent: {
    flex: 1,
    paddingTop: 2,
  },
  timelineLabel: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  timelineLabelCompleted: {
    color: colors.text,
    fontWeight: typography.weights.medium,
  },
  timelineLabelCurrent: {
    color: colors.primary,
    fontWeight: typography.weights.semibold,
  },
  timelineLocation: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  timelineTime: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
  },
  paymentCard: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  paymentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  viewDetails: {
    fontSize: typography.sizes.sm,
    color: colors.primary,
    fontWeight: typography.weights.semibold,
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  paymentLabel: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
  },
  paymentValue: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    color: colors.text,
  },
  paymentTotal: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
    color: colors.text,
  },
  paymentTotalValue: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.primary,
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  actionButton: {
    flex: 1,
  },
  bottomSpacer: {
    height: 80,
  },
});
