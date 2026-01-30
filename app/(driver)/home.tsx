import { Card } from '@/components/ui/Card';
import { borderRadius, colors, shadows, spacing, typography } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
    Dimensions,
    RefreshControl,
    Animated as RNAnimated,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

// Mock data
const mockDriver = {
  name: 'Raj Kumar',
  rating: 4.8,
  totalTrips: 127,
  vehicleNumber: 'MH 02 AB 1234',
  vehicleType: 'Container Truck',
};

const mockIncomingTrips = [
  {
    id: '1',
    from: 'Mumbai, Maharashtra',
    to: 'Delhi, Delhi',
    distance: '1,420 km',
    earnings: 12500,
    pickupTime: '2024-01-12 08:00 AM',
    material: 'Electronics',
    weight: '1200 kg',
  },
  {
    id: '2',
    from: 'Bangalore, Karnataka',
    to: 'Chennai, Tamil Nadu',
    distance: '346 km',
    earnings: 4500,
    pickupTime: '2024-01-12 10:30 AM',
    material: 'Furniture',
    weight: '2500 kg',
  },
];

const mockTodayStats = {
  tripsCompleted: 2,
  earnings: 8500,
  distance: 420,
  hoursOnline: 6.5,
};

// Current/active trip (trip in progress) - null when driver has no active trip
const mockCurrentTrip = {
  id: 'current-1',
  trackingId: 'TRK2024001',
  from: 'Mumbai, Maharashtra',
  to: 'Delhi, Delhi',
  status: 'in-transit' as const,
  progress: 65,
  earnings: 12500,
  distance: '1,420 km',
  remainingKm: 497,
  eta: '4h 30m',
  pickupTime: '2024-01-12 08:00 AM',
  material: 'Electronics',
  weight: '1200 kg',
  truckType: 'Container Truck',
  customerName: 'Alex Morgan',
  customerPhone: '+91 9876543210',
};

export default function DriverHomeScreen() {
  const [isOnline, setIsOnline] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fadeAnim = useRef(new RNAnimated.Value(0)).current;
  const slideAnim = useRef(new RNAnimated.Value(30)).current;

  useEffect(() => {
    RNAnimated.parallel([
      RNAnimated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      RNAnimated.spring(slideAnim, {
        toValue: 0,
        tension: 20,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  };

  const handleToggleStatus = () => {
    const newStatus = !isOnline;
    setIsOnline(newStatus);
    Haptics.impactAsync(
      newStatus ? Haptics.ImpactFeedbackStyle.Heavy : Haptics.ImpactFeedbackStyle.Light
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colors.primary + '08', colors.background]}
        style={styles.headerGradient}
      />

      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.primary}
            />
          }
        >
          {/* Online/Offline Toggle Card */}
          <RNAnimated.View
            style={[
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <Card style={styles.statusCard}>
              <View style={styles.statusContent}>
                <View style={styles.statusLeft}>
                  <View
                    style={[
                      styles.statusDot,
                      { backgroundColor: isOnline ? colors.success : colors.textSecondary },
                    ]}
                  />
                  <View>
                    <Text style={styles.statusTitle}>
                      {isOnline ? "You're Online" : "You're Offline"}
                    </Text>
                    <Text style={styles.statusSubtitle}>
                      {isOnline
                        ? 'Receiving trip requests'
                        : 'Turn on to receive requests'}
                    </Text>
                  </View>
                </View>
                <Switch
                  value={isOnline}
                  onValueChange={handleToggleStatus}
                  trackColor={{ false: colors.border, true: colors.successLight }}
                  thumbColor={isOnline ? colors.success : colors.backgroundCard}
                  ios_backgroundColor={colors.border}
                />
              </View>
            </Card>
          </RNAnimated.View>

          {/* Current Trip (active trip in progress) */}
          {mockCurrentTrip && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Current Trip</Text>
                <View style={styles.currentTripBadge}>
                  <View style={[styles.currentTripDot, { backgroundColor: colors.success }]} />
                  <Text style={styles.currentTripBadgeText}>In Progress</Text>
                </View>
              </View>
              <Card
                style={styles.currentTripCard}
                onPress={() => router.push(`/(driver)/active-trip?id=${mockCurrentTrip.id}`)}
              >
                <View style={styles.currentTripHeader}>
                  <View style={styles.currentTripEarnings}>
                    <Ionicons name="wallet" size={18} color={colors.success} />
                    <Text style={styles.currentTripEarningsText}>₹{mockCurrentTrip.earnings.toLocaleString()}</Text>
                  </View>
                  <View style={styles.currentTripProgressWrap}>
                    <Text style={styles.currentTripProgressText}>{mockCurrentTrip.progress}%</Text>
                    <Text style={styles.currentTripProgressLabel}>Complete</Text>
                  </View>
                </View>

                <View style={styles.currentTripProgressBar}>
                  <LinearGradient
                    colors={[colors.primaryGradientStart, colors.primaryGradientEnd]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={[styles.currentTripProgressFill, { width: `${mockCurrentTrip.progress}%` }]}
                  />
                </View>

                <View style={styles.currentTripRoute}>
                  <View style={styles.currentTripRoutePoint}>
                    <LinearGradient
                      colors={[colors.primary, colors.primaryDark]}
                      style={styles.currentTripRouteDot}
                    />
                    <View style={styles.currentTripRouteInfo}>
                      <Text style={styles.currentTripRouteLabel}>Pickup</Text>
                      <Text style={styles.currentTripRouteLocation}>{mockCurrentTrip.from}</Text>
                    </View>
                  </View>
                  <View style={styles.currentTripRouteConnector}>
                    <View style={styles.currentTripRouteLine} />
                    <Ionicons name="arrow-down" size={12} color={colors.textSecondary} style={styles.currentTripRouteArrow} />
                  </View>
                  <View style={styles.currentTripRoutePoint}>
                    <LinearGradient
                      colors={[colors.success, colors.successDark]}
                      style={[styles.currentTripRouteDot, styles.currentTripRouteDotTo]}
                    />
                    <View style={styles.currentTripRouteInfo}>
                      <Text style={styles.currentTripRouteLabel}>Drop</Text>
                      <Text style={styles.currentTripRouteLocation}>{mockCurrentTrip.to}</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.currentTripMeta}>
                  <View style={styles.currentTripMetaItem}>
                    <Ionicons name="time" size={16} color={colors.textSecondary} />
                    <Text style={styles.currentTripMetaText}>ETA {mockCurrentTrip.eta}</Text>
                  </View>
                  <View style={styles.currentTripMetaItem}>
                    <Ionicons name="navigate" size={16} color={colors.textSecondary} />
                    <Text style={styles.currentTripMetaText}>{mockCurrentTrip.remainingKm} km left</Text>
                  </View>
                  <View style={styles.currentTripMetaItem}>
                    <Ionicons name="cube" size={16} color={colors.textSecondary} />
                    <Text style={styles.currentTripMetaText}>{mockCurrentTrip.material}</Text>
                  </View>
                </View>

                <View style={styles.currentTripCta}>
                  <Text style={styles.currentTripCtaText}>Tap to view full details</Text>
                  <Ionicons name="chevron-forward" size={20} color={colors.primary} />
                </View>
              </Card>
            </View>
          )}

          {/* Today's Stats */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Today's Summary</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <LinearGradient
                  colors={[colors.success, '#059669']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.statGradient}
                >
                  <Ionicons name="checkmark-circle" size={24} color={colors.textWhite} />
                  <Text style={styles.statValue}>{mockTodayStats.tripsCompleted}</Text>
                  <Text style={styles.statLabel}>Trips</Text>
                </LinearGradient>
              </View>

              <View style={styles.statCard}>
                <LinearGradient
                  colors={[colors.blue, colors.blueDark]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.statGradient}
                >
                  <Ionicons name="wallet" size={24} color={colors.textWhite} />
                  <Text style={styles.statValue}>₹{(mockTodayStats.earnings / 1000).toFixed(1)}K</Text>
                  <Text style={styles.statLabel}>Earned</Text>
                </LinearGradient>
              </View>

              <View style={styles.statCard}>
                <LinearGradient
                  colors={[colors.info, colors.blueDark]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.statGradient}
                >
                  <Ionicons name="speedometer" size={24} color={colors.textWhite} />
                  <Text style={styles.statValue}>{mockTodayStats.distance}</Text>
                  <Text style={styles.statLabel}>Km</Text>
                </LinearGradient>
              </View>
            </View>
          </View>

          {/* Incoming Trips */}
          {isOnline && mockIncomingTrips.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>New Trip Requests</Text>
                <View style={styles.requestCount}>
                  <Text style={styles.requestCountText}>{mockIncomingTrips.length}</Text>
                </View>
              </View>

              {mockIncomingTrips.map((trip, index) => {
                const cardStyle = index === 0 
                  ? styles.tripCard 
                  : { ...styles.tripCard, marginTop: spacing.md };
                return (
                <Card
                  key={trip.id}
                  style={cardStyle}
                  onPress={() => router.push(`/(driver)/trip-request?id=${trip.id}`)}
                >
                  <View style={styles.tripHeader}>
                    <View style={styles.earningsTag}>
                      <Ionicons name="wallet" size={16} color={colors.success} />
                      <Text style={styles.earningsText}>₹{trip.earnings.toLocaleString()}</Text>
                    </View>
                    <View style={styles.distanceTag}>
                      <Ionicons name="location" size={14} color={colors.textSecondary} />
                      <Text style={styles.distanceText}>{trip.distance}</Text>
                    </View>
                  </View>

                  <View style={styles.tripRoute}>
                    <View style={styles.routePoint}>
                      <View style={styles.routeDotFrom} />
                      <View style={styles.routeInfo}>
                        <Text style={styles.routeLabel}>Pickup</Text>
                        <Text style={styles.routeLocation}>{trip.from}</Text>
                        <Text style={styles.routeTime}>{trip.pickupTime}</Text>
                      </View>
                    </View>

                    <View style={styles.routeConnector} />

                    <View style={styles.routePoint}>
                      <View style={styles.routeDotTo} />
                      <View style={styles.routeInfo}>
                        <Text style={styles.routeLabel}>Drop</Text>
                        <Text style={styles.routeLocation}>{trip.to}</Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.tripFooter}>
                    <View style={styles.tripDetail}>
                      <Ionicons name="cube" size={14} color={colors.textSecondary} />
                      <Text style={styles.tripDetailText}>{trip.material}</Text>
                    </View>
                    <View style={styles.tripDetail}>
                      <Ionicons name="barbell" size={14} color={colors.textSecondary} />
                      <Text style={styles.tripDetailText}>{trip.weight}</Text>
                    </View>
                  </View>

                  <View style={styles.tripActions}>
                    <TouchableOpacity
                      style={styles.rejectButton}
                      onPress={(e) => {
                        e.stopPropagation();
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      }}
                    >
                      <Text style={styles.rejectButtonText}>Reject</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.acceptButton}
                      onPress={(e) => {
                        e.stopPropagation();
                        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                        router.push(`/(driver)/trip-request?id=${trip.id}`);
                      }}
                    >
                      <LinearGradient
                        colors={[colors.primaryGradientStart, colors.primaryGradientEnd]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.acceptButtonGradient}
                      >
                        <Text style={styles.acceptButtonText}>View Details</Text>
                        <Ionicons name="arrow-forward" size={16} color={colors.textWhite} />
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>
                </Card>
                );
              })}
            </View>
          )}

          {/* Offline Message */}
          {!isOnline && (
            <View style={styles.offlineMessage}>
              <Ionicons name="moon" size={48} color={colors.textSecondary} />
              <Text style={styles.offlineTitle}>You're Currently Offline</Text>
              <Text style={styles.offlineSubtitle}>
                Turn on your status to start receiving trip requests
              </Text>
            </View>
          )}

          <View style={styles.bottomSpacer} />
        </ScrollView>
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
    height: 240,
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
  greeting: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.text,
  },
  subtitle: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    opacity: 0.9,
    marginTop: 2,
  },
  scrollView: {
    flex: 1,
  },
  statusCard: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    ...shadows.md,
  },
  statusContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    flex: 1,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  statusTitle: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    color: colors.text,
    marginBottom: 2,
  },
  statusSubtitle: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.text,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  requestCount: {
    backgroundColor: colors.error,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
    minWidth: 24,
    alignItems: 'center',
  },
  requestCountText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
    color: colors.textWhite,
  },
  currentTripBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.successLight,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  currentTripDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  currentTripBadgeText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
    color: colors.success,
  },
  currentTripCard: {
    marginHorizontal: spacing.lg,
    padding: spacing.lg,
    ...shadows.md,
  },
  currentTripHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  currentTripEarnings: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.successLight,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  currentTripEarningsText: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
    color: colors.success,
  },
  currentTripProgressWrap: {
    alignItems: 'flex-end',
  },
  currentTripProgressText: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.primary,
  },
  currentTripProgressLabel: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  currentTripProgressBar: {
    height: 8,
    backgroundColor: colors.border,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
    marginBottom: spacing.lg,
  },
  currentTripProgressFill: {
    height: '100%',
    borderRadius: borderRadius.full,
  },
  currentTripRoute: {
    marginBottom: spacing.lg,
  },
  currentTripRoutePoint: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currentTripRouteDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  currentTripRouteDotTo: {},
  currentTripRouteConnector: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 20,
    marginLeft: 6,
    marginVertical: 2,
  },
  currentTripRouteLine: {
    width: 2,
    height: '100%',
    backgroundColor: colors.border,
  },
  currentTripRouteArrow: {
    position: 'absolute',
  },
  currentTripRouteInfo: {
    marginLeft: spacing.md,
    flex: 1,
  },
  currentTripRouteLabel: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  currentTripRouteLocation: {
    fontSize: typography.sizes.sm,
    color: colors.text,
    fontWeight: typography.weights.medium,
  },
  currentTripMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginBottom: spacing.md,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  currentTripMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  currentTripMetaText: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
  },
  currentTripCta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingTop: spacing.xs,
  },
  currentTripCtaText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    color: colors.primary,
  },
  statsGrid: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  statCard: {
    flex: 1,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    ...shadows.lg,
  },
  statGradient: {
    padding: spacing.md,
    alignItems: 'center',
    minHeight: 100,
    justifyContent: 'center',
  },
  statValue: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.textWhite,
    marginTop: spacing.xs,
  },
  statLabel: {
    fontSize: typography.sizes.xs,
    color: colors.textWhite,
    opacity: 0.9,
    marginTop: spacing.xs - 2,
  },
  tripCard: {
    marginHorizontal: spacing.lg,
    ...shadows.sm,
  },
  tripHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  earningsTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.successLight,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  earningsText: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
    color: colors.success,
  },
  distanceTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs - 2,
  },
  distanceText: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
  },
  tripRoute: {
    marginBottom: spacing.md,
  },
  routePoint: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  routeDotFrom: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary,
    marginTop: 4,
  },
  routeDotTo: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.success,
    marginTop: 4,
  },
  routeConnector: {
    width: 2,
    height: 20,
    backgroundColor: colors.border,
    marginLeft: 5,
    marginVertical: spacing.xs - 2,
  },
  routeInfo: {
    marginLeft: spacing.md,
    flex: 1,
  },
  routeLabel: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  routeLocation: {
    fontSize: typography.sizes.sm,
    color: colors.text,
    fontWeight: typography.weights.medium,
    marginBottom: 2,
  },
  routeTime: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
  },
  tripFooter: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  tripDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs - 2,
  },
  tripDetailText: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
  },
  tripActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  rejectButton: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
  },
  rejectButtonText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    color: colors.textSecondary,
  },
  acceptButton: {
    flex: 2,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    ...shadows.md,
  },
  acceptButtonGradient: {
    paddingVertical: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  acceptButtonText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    color: colors.textWhite,
  },
  offlineMessage: {
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xxl,
  },
  offlineTitle: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.text,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  offlineSubtitle: {
    fontSize: typography.sizes.md,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  bottomSpacer: {
    height: 80,
  },
});

