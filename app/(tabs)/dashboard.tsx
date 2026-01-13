import { Card } from '@/components/ui/Card';
import { FloatingButton } from '@/components/ui/FloatingButton';
import { StatusChip } from '@/components/ui/StatusChip';
import { borderRadius, colors, shadows, spacing, typography } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  RefreshControl,
  Animated as RNAnimated,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

// Mock data
const mockStats = {
  activeShipments: 5,
  completedShipments: 23,
  totalSpent: 45200,
  totalDistance: '4,850',
};

const mockShipments = [
  {
    id: '1',
    trackingId: 'TRK2024001',
    from: 'Mumbai, Maharashtra',
    to: 'Delhi, Delhi',
    status: 'in-transit' as const,
    progress: 65,
    driverName: 'Raj Kumar',
    driverPhone: '+91 9876543210',
    truckNumber: 'MH 02 AB 1234',
    expectedDelivery: '2024-01-08',
    material: 'Electronics',
    weight: '1200 kg',
    price: '₹12,450',
    distance: '1,450 km',
    truckType: 'Container Truck',
  },
  {
    id: '2',
    trackingId: 'TRK2024002',
    from: 'Bangalore, Karnataka',
    to: 'Chennai, Tamil Nadu',
    status: 'pending' as const,
    progress: 0,
    expectedDelivery: '2024-01-10',
    material: 'Furniture',
    weight: '2500 kg',
    price: '₹8,750',
    distance: '350 km',
    truckType: 'Open Truck',
  },
  {
    id: '3',
    trackingId: 'TRK2024003',
    from: 'Pune, Maharashtra',
    to: 'Hyderabad, Telangana',
    status: 'delivered' as const,
    progress: 100,
    deliveredOn: '2024-01-05',
    material: 'Raw Materials',
    weight: '3000 kg',
    price: '₹15,200',
    distance: '560 km',
    truckType: 'Trailer',
  },
];

const quickServices = [
  { id: '1', icon: 'cube', label: 'Express', color: colors.primary, bg: colors.primaryTransparent },
  { id: '2', icon: 'shield-checkmark', label: 'Secure', color: colors.success, bg: colors.successLight },
  { id: '3', icon: 'time', label: 'Economy', color: colors.warning, bg: colors.warningLight },
  { id: '4', icon: 'calendar', label: 'Scheduled', color: colors.info, bg: colors.infoLight },
];

export default function DashboardScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [activeStat, setActiveStat] = useState(0);
  
  const fadeAnim = useRef(new RNAnimated.Value(0)).current;
  const slideAnim = useRef(new RNAnimated.Value(30)).current;
  const statAnim = useRef(new RNAnimated.Value(0)).current;

  useEffect(() => {
    RNAnimated.parallel([
      RNAnimated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      RNAnimated.spring(slideAnim, {
        toValue: 0,
        tension: 20,
        friction: 7,
        useNativeDriver: true,
      }),
      RNAnimated.timing(statAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),
    ]).start();

    // Auto rotate stats
    const interval = setInterval(() => {
      setActiveStat((prev) => (prev + 1) % 3);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  };

  const filteredShipments = mockShipments.filter((shipment) => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'active') {
      return shipment.status === 'in-transit' || shipment.status === 'pending';
    }
    if (selectedFilter === 'completed') return shipment.status === 'delivered';
    return true;
  });

  const renderStatCard = (index: number, icon: string, value: string, label: string, gradientColors: string[]) => (
    <TouchableOpacity
      style={[
        styles.statCard,
        activeStat === index && styles.statCardActive,
      ]}
      activeOpacity={0.9}
      onPress={() => setActiveStat(index)}
    >
      <LinearGradient
        colors={gradientColors as any}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.statGradient}
      >
        <View style={styles.statIconContainer}>
          <Ionicons name={icon as any} size={28} color={colors.textWhite} />
        </View>
        <RNAnimated.View 
          style={{
            opacity: statAnim,
            transform: [{
              translateY: statAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [20, 0],
              }),
            }],
          }}
        >
          <Text style={styles.statValue}>{value}</Text>
          <Text style={styles.statLabel}>{label}</Text>
        </RNAnimated.View>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colors.primary + '08', colors.background]}
        style={styles.backgroundGradient}
      />
      
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <View style={styles.headerLeft}>
              <Ionicons name="hand-left-outline" size={20} color={colors.textSecondary} style={styles.greetingIcon} />
              <Text style={styles.greeting}>Welcome back</Text>
            </View>
            <Text style={styles.userName}>Alex Morgan</Text>
          </View>
        </View>

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={onRefresh}
              tintColor={colors.primary}
              colors={[colors.primary]}
            />
          }
        >
          {/* Hero Stats */}
          <RNAnimated.View 
            style={[
              styles.heroStatsContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <View style={styles.heroCard}>
              <LinearGradient
                colors={[colors.primaryGradientStart, colors.primaryGradientEnd]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.heroGradient}
              >
                <View style={styles.heroContent}>
                  <View>
                    <Text style={styles.heroTitle}>Total Distance</Text>
                    <Text style={styles.heroValue}>{mockStats.totalDistance} km</Text>
                    <Text style={styles.heroSubtitle}>Across India</Text>
                  </View>
                  <View style={styles.heroIconContainer}>
                    <Ionicons name="map" size={40} color={colors.textWhite} />
                  </View>
                </View>
                <View style={styles.heroStats}>
                  <View style={styles.heroStatItem}>
                    <Text style={styles.heroStatValue}>{mockStats.activeShipments}</Text>
                    <Text style={styles.heroStatLabel}>Active</Text>
                  </View>
                  <View style={styles.heroStatDivider} />
                  <View style={styles.heroStatItem}>
                    <Text style={styles.heroStatValue}>{mockStats.completedShipments}</Text>
                    <Text style={styles.heroStatLabel}>Completed</Text>
                  </View>
                  <View style={styles.heroStatDivider} />
                  <View style={styles.heroStatItem}>
                    <Text style={styles.heroStatValue}>₹{(mockStats.totalSpent / 1000).toFixed(1)}K</Text>
                    <Text style={styles.heroStatLabel}>Spent</Text>
                  </View>
                </View>
              </LinearGradient>
            </View>
          </RNAnimated.View>

          {/* Quick Services */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quick Services</Text>
            <View style={styles.quickServicesContainer}>
              <View style={styles.quickServices}>
                {quickServices.map((service) => (
                  <Card
                    key={service.id}
                    style={styles.serviceCard}
                    onPress={() => router.push('/(tabs)/book-trip')}
                  >
                    <LinearGradient
                      colors={[service.bg + '40', service.bg + '10']}
                      style={styles.serviceIconContainer}
                    >
                      <Ionicons name={service.icon as any} size={28} color={service.color} />
                    </LinearGradient>
                    <Text style={styles.serviceLabel}>{service.label}</Text>
                    <Text style={styles.serviceSubtitle}>Delivery</Text>
                  </Card>
                ))}
              </View>
            </View>
          </View>

          {/* Quick Actions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.quickActionsContainer}>
              <View style={styles.quickActions}>
                <Card
                  style={styles.actionCard}
                  onPress={() => router.push('/(tabs)/book-trip')}
                >
                  <LinearGradient
                    colors={[colors.primary, colors.primaryDark]}
                    style={styles.actionGradient}
                  >
                    <Ionicons name="add" size={28} color={colors.textWhite} />
                  </LinearGradient>
                  <Text style={styles.actionLabel}>Book Trip</Text>
                </Card>

                <Card
                  style={styles.actionCard}
                  onPress={() => router.push('/(tabs)/track')}
                >
                  <LinearGradient
                    colors={[colors.info, colors.infoDark]}
                    style={styles.actionGradient}
                  >
                    <Ionicons name="location" size={28} color={colors.textWhite} />
                  </LinearGradient>
                  <Text style={styles.actionLabel}>Live Track</Text>
                </Card>

                <Card
                  style={styles.actionCard}
                  onPress={() => router.push('/(tabs)/history')}
                >
                  <LinearGradient
                    colors={[colors.success, colors.successDark]}
                    style={styles.actionGradient}
                  >
                    <Ionicons name="document" size={28} color={colors.textWhite} />
                  </LinearGradient>
                  <Text style={styles.actionLabel}>History</Text>
                </Card>
              </View>
            </View>
          </View>

          {/* Stats Cards */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Overview</Text>
            <View style={styles.statsContainer}>
              {renderStatCard(
                0,
                'time',
                mockStats.activeShipments.toString(),
                'Active Shipments',
                [colors.primaryGradientStart, colors.primaryGradientEnd]
              )}
              {renderStatCard(
                1,
                'checkmark-done',
                mockStats.completedShipments.toString(),
                'Completed',
                [colors.success, colors.successDark]
              )}
              {renderStatCard(
                2,
                'trending-up',
                `₹${(mockStats.totalSpent / 1000).toFixed(1)}K`,
                'Total Value',
                [colors.warning, colors.warningDark]
              )}
            </View>
          </View>

          {/* Shipments Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Shipments</Text>
              <TouchableOpacity 
                style={styles.seeAllButton}
                onPress={() => router.push('/(tabs)/trips')}
              >
                <Text style={styles.seeAllText}>See All</Text>
                <Ionicons name="arrow-forward" size={16} color={colors.primary} />
              </TouchableOpacity>
            </View>

            {/* Filter Tabs */}
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.filterTabs}
              contentContainerStyle={styles.filterTabsContent}
            >
              {['all', 'active', 'completed'].map((filter) => (
                <TouchableOpacity
                  key={filter}
                  style={[
                    styles.filterTab,
                    selectedFilter === filter && styles.filterTabActive,
                  ]}
                  onPress={() => setSelectedFilter(filter)}
                >
                  <Text
                    style={[
                      styles.filterTabText,
                      selectedFilter === filter && styles.filterTabTextActive,
                    ]}
                  >
                    {filter.charAt(0).toUpperCase() + filter.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Shipment Cards */}
            <View style={styles.shipmentsList}>
              {filteredShipments.map((shipment, index) => (
                <Card
                  key={shipment.id}
                  style={{
                    ...styles.shipmentCard,
                    marginTop: index === 0 ? 0 : spacing.md,
                  }}
                  onPress={() => router.push(`/(tabs)/trip/${shipment.id}`)}
                >
                  <View style={styles.shipmentHeader}>
                    <View style={styles.shipmentHeaderLeft}>
                      <View style={styles.trackingBadge}>
                        <Ionicons name="cube" size={12} color={colors.primary} />
                        <Text style={styles.trackingId}>{shipment.trackingId}</Text>
                      </View>
                      <StatusChip status={shipment.status} size="sm" />
                    </View>
                    <Text style={styles.shipmentPrice}>{shipment.price}</Text>
                  </View>

                  <View style={styles.shipmentRoute}>
                    <View style={styles.routePoint}>
                      <LinearGradient
                        colors={[colors.primary, colors.primaryDark]}
                        style={styles.routeDotFrom}
                      />
                      <View style={styles.routeInfo}>
                        <Text style={styles.routeLabel}>Pickup</Text>
                        <Text style={styles.routeLocation}>{shipment.from}</Text>
                      </View>
                    </View>

                    <View style={styles.routeConnector}>
                      <View style={styles.routeLine} />
                      <Ionicons name="arrow-down" size={12} color={colors.textSecondary} style={styles.routeArrow} />
                    </View>

                    <View style={styles.routePoint}>
                      <LinearGradient
                        colors={[colors.success, colors.successDark]}
                        style={styles.routeDotTo}
                      />
                      <View style={styles.routeInfo}>
                        <Text style={styles.routeLabel}>Delivery</Text>
                        <Text style={styles.routeLocation}>{shipment.to}</Text>
                      </View>
                    </View>
                  </View>

                  {shipment.status === 'in-transit' && (
                    <View style={styles.progressContainer}>
                      <View style={styles.progressHeader}>
                        <Text style={styles.progressLabel}>On the way</Text>
                        <Text style={styles.progressPercent}>{shipment.progress}%</Text>
                      </View>
                      <View style={styles.progressBar}>
                        <LinearGradient
                          colors={[colors.primaryGradientStart, colors.primaryGradientEnd]}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 0 }}
                          style={[
                            styles.progressFill,
                            { width: `${shipment.progress}%` },
                          ]}
                        />
                      </View>
                    </View>
                  )}

                  <View style={styles.shipmentDetails}>
                    <View style={styles.detailItem}>
                      <Ionicons name="cube" size={14} color={colors.textSecondary} />
                      <Text style={styles.detailText}>{shipment.material}</Text>
                    </View>
                    <View style={styles.detailItem}>
                      <Ionicons name="barbell" size={14} color={colors.textSecondary} />
                      <Text style={styles.detailText}>{shipment.weight}</Text>
                    </View>
                    <View style={styles.detailItem}>
                      <Ionicons name="car" size={14} color={colors.textSecondary} />
                      <Text style={styles.detailText}>{shipment.truckType}</Text>
                    </View>
                  </View>

                  <View style={styles.shipmentFooter}>
                    <View style={styles.detailItem}>
                      <Ionicons name="calendar" size={14} color={colors.textSecondary} />
                      <Text style={styles.detailText}>
                        {shipment.status === 'delivered'
                          ? `Delivered: ${shipment.deliveredOn}`
                          : `ETA: ${shipment.expectedDelivery}`}
                      </Text>
                    </View>
                    <View style={styles.distanceBadge}>
                      <Ionicons name="navigate" size={12} color={colors.primary} />
                      <Text style={styles.distanceText}>{shipment.distance}</Text>
                    </View>
                  </View>
                </Card>
              ))}
            </View>
          </View>

          <View style={styles.bottomSpacer} />
        </ScrollView>

        {/* Floating Action Button */}
        <FloatingButton
          icon="add"
          onPress={() => router.push('/(tabs)/book-trip')}
          variant="gradient"
          size="lg"
          style={styles.fab}
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: height * 0.4,
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
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  greetingIcon: {
    marginRight: 2,
  },
  greeting: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
  },
  userName: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.text,
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.backgroundCard,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.sm,
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.error,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.backgroundCard,
  },
  notificationBadgeText: {
    fontSize: 9,
    fontWeight: typography.weights.bold,
    color: colors.textWhite,
  },
  scrollView: {
    flex: 1,
  },
  heroStatsContainer: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.xl,
  },
  heroCard: {
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    ...shadows.lg,
  },
  heroGradient: {
    padding: spacing.xl,
  },
  heroContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.xl,
  },
  heroTitle: {
    fontSize: typography.sizes.sm,
    color: colors.textWhite,
    opacity: 0.9,
  },
  heroValue: {
    fontSize: 32,
    fontWeight: typography.weights.bold,
    color: colors.textWhite,
    marginTop: spacing.xs,
  },
  heroSubtitle: {
    fontSize: typography.sizes.xs,
    color: colors.textWhite,
    opacity: 0.8,
    marginTop: 2,
  },
  heroIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary + '40',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.textWhite + '20',
  },
  heroStatItem: {
    alignItems: 'center',
  },
  heroStatValue: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.textWhite,
  },
  heroStatLabel: {
    fontSize: typography.sizes.xs,
    color: colors.textWhite,
    opacity: 0.8,
    marginTop: 2,
  },
  heroStatDivider: {
    width: 1,
    height: 24,
    backgroundColor: colors.textWhite + '30',
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
    marginBottom: spacing.xl,
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  seeAllText: {
    fontSize: typography.sizes.sm,
    color: colors.primary,
    fontWeight: typography.weights.semibold,
  },
  quickServicesContainer: {
    paddingHorizontal: spacing.lg,
  },
  quickServices: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  serviceCard: {
    flex: 1,
    height: 110,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.sm,
    borderWidth: 0,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.backgroundCard,
    ...shadows.sm,
  },
  serviceIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  serviceLabel: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
    color: colors.text,
    textAlign: 'center',
  },
  serviceSubtitle: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  quickActionsContainer: {
    paddingHorizontal: spacing.lg,
  },
  quickActions: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  actionCard: {
    flex: 1,
    height: 110,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.sm,
    borderWidth: 0,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.backgroundCard,
    ...shadows.sm,
  },
  actionGradient: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  actionLabel: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
    color: colors.text,
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  statCard: {
    flex: 1,
    height: 160,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    ...shadows.md,
    backgroundColor: colors.primary, // Fallback
  },
  statCardActive: {
    ...shadows.lg,
    // Removed scale transform to keep sizes consistent
  },
  statGradient: {
    flex: 1,
    padding: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  statValue: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.textWhite,
    marginBottom: 2,
    textAlign: 'center',
  },
  statLabel: {
    fontSize: typography.sizes.xs,
    color: colors.textWhite,
    opacity: 0.9,
    textAlign: 'center',
  },
  filterTabs: {
    marginBottom: spacing.md,
  },
  filterTabsContent: {
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  filterTab: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.full,
    backgroundColor: colors.backgroundCard,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  filterTabActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterTabText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    color: colors.textSecondary,
  },
  filterTabTextActive: {
    color: colors.textWhite,
  },
  shipmentsList: {
    paddingHorizontal: spacing.lg,
  },
  shipmentCard: {
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    ...shadows.sm,
  },
  shipmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  shipmentHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  trackingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.primaryTransparent,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  trackingId: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
    color: colors.primary,
  },
  shipmentPrice: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.text,
  },
  shipmentRoute: {
    marginBottom: spacing.lg,
  },
  routePoint: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  routeDotFrom: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  routeDotTo: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  routeConnector: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 24,
    marginLeft: 7,
    marginVertical: 2,
  },
  routeLine: {
    width: 2,
    height: '100%',
    backgroundColor: colors.border,
  },
  routeArrow: {
    position: 'absolute',
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
    fontSize: typography.sizes.md,
    color: colors.text,
    fontWeight: typography.weights.medium,
  },
  progressContainer: {
    marginBottom: spacing.lg,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  progressLabel: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    fontWeight: typography.weights.medium,
  },
  progressPercent: {
    fontSize: typography.sizes.sm,
    color: colors.primary,
    fontWeight: typography.weights.bold,
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.border,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: borderRadius.full,
  },
  shipmentDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  detailText: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
  },
  shipmentFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  distanceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.primaryTransparent,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  distanceText: {
    fontSize: typography.sizes.xs,
    color: colors.primary,
    fontWeight: typography.weights.medium,
  },
  bottomSpacer: {
    height: 120,
  },
  fab: {
    position: 'absolute',
    bottom: 60,
    right: spacing.lg,
    ...shadows.lg,
  },
});