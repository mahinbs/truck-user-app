import { Card } from '@/components/ui/Card';
import { FloatingButton } from '@/components/ui/FloatingButton';
import { StatusChip } from '@/components/ui/StatusChip';
import { borderRadius, colors, shadows, spacing, typography } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  RefreshControl,
  Animated as RNAnimated,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const SMALL_BREAKPOINT = 375;

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


export default function DashboardScreen() {
  const { width, height } = useWindowDimensions();
  const isSmallScreen = width < SMALL_BREAKPOINT;
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');
  
  const fadeAnim = useRef(new RNAnimated.Value(0)).current;
  const slideAnim = useRef(new RNAnimated.Value(30)).current;
  const scaleAnim = useRef(new RNAnimated.Value(0.95)).current;

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
      RNAnimated.spring(scaleAnim, {
        toValue: 1,
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

  const filteredShipments = mockShipments.filter((shipment) => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'active') {
      return shipment.status === 'in-transit' || shipment.status === 'pending';
    }
    if (selectedFilter === 'completed') return shipment.status === 'delivered';
    return true;
  });


  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colors.primary + '08', colors.background]}
        style={[styles.backgroundGradient, { height: height * 0.4 }]}
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
              colors={[colors.primary]}
            />
          }
        >
          {/* Hero Stats */}
          <RNAnimated.View 
            style={[
              styles.heroStatsContainer,
              ...(isSmallScreen ? [styles.heroStatsContainerSmall] : []),
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
                style={[styles.heroGradient, ...(isSmallScreen ? [styles.heroGradientSmall] : [])]}
              >
                <View style={styles.heroContent}>
                  <View style={styles.heroContentLeft}>
                    <Text style={styles.heroTitle} numberOfLines={1}>Total Distance</Text>
                    <Text style={[styles.heroValue, ...(isSmallScreen ? [styles.heroValueSmall] : [])]} numberOfLines={1}>{mockStats.totalDistance} km</Text>
                    <Text style={styles.heroSubtitle} numberOfLines={1}>Across India</Text>
                  </View>
                  <View style={[styles.heroIconContainer, ...(isSmallScreen ? [styles.heroIconContainerSmall] : [])]}>
                    <Ionicons name="map" size={isSmallScreen ? 28 : 40} color={colors.textWhite} />
                  </View>
                </View>
                <View style={[styles.heroStats, ...(isSmallScreen ? [styles.heroStatsSmall] : [])]}>
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

          {/* Action Buttons */}
          <RNAnimated.View 
            style={[
              styles.actionButtonsContainer,
              ...(isSmallScreen ? [styles.actionButtonsContainerSmall] : []),
              {
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            <View style={[styles.actionButtons, ...(isSmallScreen ? [styles.actionButtonsSmall] : [])]}>
              <TouchableOpacity
                style={[styles.actionButton, styles.primaryAction, ...(isSmallScreen ? [styles.actionButtonSmall] : [])]}
                onPress={() => router.push('/(tabs)/book-trip')}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={[colors.primary, colors.primaryDark]}
                  style={styles.actionButtonIcon}
                >
                  <Ionicons name="add" size={24} color={colors.textWhite} />
                </LinearGradient>
                <Text style={styles.actionButtonText}>New Shipment</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionButton, styles.secondaryAction, ...(isSmallScreen ? [styles.actionButtonSmall] : [])]}
                onPress={() => router.push('/(tabs)/track')}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={[colors.info, colors.infoDark]}
                  style={styles.actionButtonIcon}
                >
                  <Ionicons name="location" size={24} color={colors.textWhite} />
                </LinearGradient>
                <Text style={styles.actionButtonText}>Live Tracking</Text>
              </TouchableOpacity>
            </View>
          </RNAnimated.View>

          {/* Quick Stats */}
          <View style={[styles.section, ...(isSmallScreen ? [styles.sectionSmall] : [])]}>
            <Text style={[styles.sectionTitle, ...(isSmallScreen ? [styles.sectionTitleSmall] : [])]}>Quick Stats</Text>
            <View style={[styles.quickStatsContainer, ...(isSmallScreen ? [styles.quickStatsContainerSmall] : [])]}>
              <Card style={StyleSheet.flatten([styles.quickStatCard, ...(isSmallScreen ? [styles.quickStatCardSmall] : [])])}>
                <View style={styles.quickStatIconWrapper}>
                  <LinearGradient
                    colors={[colors.primary + '20', colors.primary + '10']}
                    style={[styles.quickStatIconBg, ...(isSmallScreen ? [styles.quickStatIconBgSmall] : [])]}
                  >
                    <Ionicons name="trending-up" size={isSmallScreen ? 20 : 24} color={colors.primary} />
                  </LinearGradient>
                </View>
                <Text style={[styles.quickStatValue, ...(isSmallScreen ? [styles.quickStatValueSmall] : [])]} numberOfLines={1}>₹{(mockStats.totalSpent / 1000).toFixed(1)}K</Text>
                <Text style={[styles.quickStatLabel, ...(isSmallScreen ? [styles.quickStatLabelSmall] : [])]} numberOfLines={1}>Total Spent</Text>
              </Card>

              <Card style={StyleSheet.flatten([styles.quickStatCard, ...(isSmallScreen ? [styles.quickStatCardSmall] : [])])}>
                <View style={styles.quickStatIconWrapper}>
                  <LinearGradient
                    colors={[colors.success + '20', colors.success + '10']}
                    style={[styles.quickStatIconBg, ...(isSmallScreen ? [styles.quickStatIconBgSmall] : [])]}
                  >
                    <Ionicons name="checkmark-circle" size={isSmallScreen ? 20 : 24} color={colors.success} />
                  </LinearGradient>
                </View>
                <Text style={[styles.quickStatValue, ...(isSmallScreen ? [styles.quickStatValueSmall] : [])]} numberOfLines={1}>{mockStats.completedShipments}</Text>
                <Text style={[styles.quickStatLabel, ...(isSmallScreen ? [styles.quickStatLabelSmall] : [])]} numberOfLines={1}>Completed</Text>
              </Card>

              <Card style={StyleSheet.flatten([styles.quickStatCard, ...(isSmallScreen ? [styles.quickStatCardSmall] : [])])}>
                <View style={styles.quickStatIconWrapper}>
                  <LinearGradient
                    colors={[colors.info + '20', colors.info + '10']}
                    style={[styles.quickStatIconBg, ...(isSmallScreen ? [styles.quickStatIconBgSmall] : [])]}
                  >
                    <Ionicons name="time" size={isSmallScreen ? 20 : 24} color={colors.info} />
                  </LinearGradient>
                </View>
                <Text style={[styles.quickStatValue, ...(isSmallScreen ? [styles.quickStatValueSmall] : [])]} numberOfLines={1}>{mockStats.activeShipments}</Text>
                <Text style={[styles.quickStatLabel, ...(isSmallScreen ? [styles.quickStatLabelSmall] : [])]} numberOfLines={1}>Active</Text>
              </Card>
            </View>
          </View>

          {/* Performance Insights */}
          <View style={[styles.section, ...(isSmallScreen ? [styles.sectionSmall] : [])]}>
            <Text style={[styles.sectionTitle, ...(isSmallScreen ? [styles.sectionTitleSmall] : [])]}>Performance Insights</Text>
            <Card style={StyleSheet.flatten([styles.insightsCard, ...(isSmallScreen ? [styles.insightsCardSmall] : [])])}>
              <View style={styles.insightsHeader}>
                <View style={[styles.insightsIconContainer, ...(isSmallScreen ? [styles.insightsIconContainerSmall] : [])]}>
                  <LinearGradient
                    colors={[colors.primaryGradientStart, colors.primaryGradientEnd]}
                    style={[styles.insightsIconBg, ...(isSmallScreen ? [styles.insightsIconBgSmall] : [])]}
                  >
                    <Ionicons name="analytics" size={isSmallScreen ? 20 : 24} color={colors.textWhite} />
                  </LinearGradient>
                </View>
                <View style={styles.insightsContent}>
                  <Text style={[styles.insightsTitle, ...(isSmallScreen ? [styles.insightsTitleSmall] : [])]} numberOfLines={1}>On-Time Delivery Rate</Text>
                  <Text style={[styles.insightsSubtitle, ...(isSmallScreen ? [styles.insightsSubtitleSmall] : [])]} numberOfLines={1}>Your shipments are delivered on time</Text>
                </View>
                <View style={styles.insightsValueContainer}>
                  <Text style={[styles.insightsValue, ...(isSmallScreen ? [styles.insightsValueSmall] : [])]} numberOfLines={1}>98%</Text>
                </View>
              </View>
              <View style={styles.insightsProgressBar}>
                <LinearGradient
                  colors={[colors.primaryGradientStart, colors.primaryGradientEnd]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[styles.insightsProgressFill, { width: '98%' }]}
                />
              </View>
            </Card>
          </View>

          {/* Service Highlights */}
          <View style={[styles.section, ...(isSmallScreen ? [styles.sectionSmall] : [])]}>
            <Text style={[styles.sectionTitle, ...(isSmallScreen ? [styles.sectionTitleSmall] : [])]}>Why Choose Us</Text>
            <View style={[styles.highlightsGrid, ...(isSmallScreen ? [styles.highlightsGridSmall] : [])]}>
              <Card style={StyleSheet.flatten([styles.highlightCard, ...(isSmallScreen ? [styles.highlightCardSmall] : [])])}>
                <View style={styles.highlightIconWrapper}>
                  <LinearGradient
                    colors={[colors.success + '20', colors.success + '10']}
                    style={[styles.highlightIconBg, ...(isSmallScreen ? [styles.highlightIconBgSmall] : [])]}
                  >
                    <Ionicons name="shield-checkmark" size={isSmallScreen ? 20 : 24} color={colors.success} />
                  </LinearGradient>
                </View>
                <Text style={[styles.highlightTitle, ...(isSmallScreen ? [styles.highlightTitleSmall] : [])]} numberOfLines={1}>Secure</Text>
                <Text style={[styles.highlightSubtitle, ...(isSmallScreen ? [styles.highlightSubtitleSmall] : [])]} numberOfLines={2}>100% insured shipments</Text>
              </Card>

              <Card style={StyleSheet.flatten([styles.highlightCard, ...(isSmallScreen ? [styles.highlightCardSmall] : [])])}>
                <View style={styles.highlightIconWrapper}>
                  <LinearGradient
                    colors={[colors.info + '20', colors.info + '10']}
                    style={[styles.highlightIconBg, ...(isSmallScreen ? [styles.highlightIconBgSmall] : [])]}
                  >
                    <Ionicons name="location" size={isSmallScreen ? 20 : 24} color={colors.info} />
                  </LinearGradient>
                </View>
                <Text style={[styles.highlightTitle, ...(isSmallScreen ? [styles.highlightTitleSmall] : [])]} numberOfLines={1}>Track Live</Text>
                <Text style={[styles.highlightSubtitle, ...(isSmallScreen ? [styles.highlightSubtitleSmall] : [])]} numberOfLines={2}>Real-time updates</Text>
              </Card>

              <Card style={StyleSheet.flatten([styles.highlightCard, ...(isSmallScreen ? [styles.highlightCardSmall] : [])])}>
                <View style={styles.highlightIconWrapper}>
                  <LinearGradient
                    colors={[colors.primary + '20', colors.primary + '10']}
                    style={[styles.highlightIconBg, ...(isSmallScreen ? [styles.highlightIconBgSmall] : [])]}
                  >
                    <Ionicons name="time" size={isSmallScreen ? 20 : 24} color={colors.primary} />
                  </LinearGradient>
                </View>
                <Text style={[styles.highlightTitle, ...(isSmallScreen ? [styles.highlightTitleSmall] : [])]} numberOfLines={1}>Fast</Text>
                <Text style={[styles.highlightSubtitle, ...(isSmallScreen ? [styles.highlightSubtitleSmall] : [])]} numberOfLines={2}>Quick delivery</Text>
              </Card>
            </View>
          </View>

          {/* Shipments Section */}
          <View style={[styles.section, ...(isSmallScreen ? [styles.sectionSmall] : [])]}>
            <View style={[styles.sectionHeader, ...(isSmallScreen ? [styles.sectionHeaderSmall] : [])]}>
              <Text style={[styles.sectionTitle, ...(isSmallScreen ? [styles.sectionTitleSmall] : [])]} numberOfLines={1}>Recent Shipments</Text>
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
              contentContainerStyle={[styles.filterTabsContent, ...(isSmallScreen ? [styles.filterTabsContentSmall] : [])]}
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
            <View style={[styles.shipmentsList, ...(isSmallScreen ? [styles.shipmentsListSmall] : [])]}>
              {filteredShipments.map((shipment, index) => (
                <Card
                  key={shipment.id}
                  style={StyleSheet.flatten([
                    styles.shipmentCard,
                    ...(isSmallScreen ? [styles.shipmentCardSmall] : []),
                    { marginTop: index === 0 ? 0 : spacing.md },
                  ])}
                  onPress={() => router.push(`/(tabs)/trip/${shipment.id}`)}
                >
                  <View style={styles.shipmentHeader}>
                    <View style={styles.shipmentHeaderLeft}>
                      <View style={styles.trackingBadge}>
                        <Ionicons name="cube" size={12} color={colors.primary} />
                        <Text style={styles.trackingId} numberOfLines={1} ellipsizeMode="tail">{shipment.trackingId}</Text>
                      </View>
                      <StatusChip status={shipment.status} size="sm" style={styles.shipmentStatusChip} />
                    </View>
                    <Text style={styles.shipmentPrice} numberOfLines={1}>{shipment.price}</Text>
                  </View>

                  <View style={styles.shipmentRoute}>
                    <View style={styles.routePoint}>
                      <LinearGradient
                        colors={[colors.primary, colors.primaryDark]}
                        style={styles.routeDotFrom}
                      />
                      <View style={styles.routeInfo}>
                        <Text style={styles.routeLabel}>Pickup</Text>
                        <Text style={styles.routeLocation} numberOfLines={2} ellipsizeMode="tail">{shipment.from}</Text>
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
                        <Text style={styles.routeLocation} numberOfLines={2} ellipsizeMode="tail">{shipment.to}</Text>
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

                  <View style={[styles.shipmentDetails, ...(isSmallScreen ? [styles.shipmentDetailsSmall] : [])]}>
                    <View style={styles.detailItem}>
                      <Ionicons name="cube" size={isSmallScreen ? 12 : 14} color={colors.textSecondary} />
                      <Text style={styles.detailText} numberOfLines={1} ellipsizeMode="tail">{shipment.material}</Text>
                    </View>
                    <View style={styles.detailItem}>
                      <Ionicons name="barbell" size={isSmallScreen ? 12 : 14} color={colors.textSecondary} />
                      <Text style={styles.detailText} numberOfLines={1} ellipsizeMode="tail">{shipment.weight}</Text>
                    </View>
                    <View style={styles.detailItem}>
                      <Ionicons name="car" size={isSmallScreen ? 12 : 14} color={colors.textSecondary} />
                      <Text style={styles.detailText} numberOfLines={1} ellipsizeMode="tail">{shipment.truckType}</Text>
                    </View>
                  </View>

                  <View style={[styles.shipmentFooter, ...(isSmallScreen ? [styles.shipmentFooterSmall] : [])]}>
                    <View style={[styles.detailItem, styles.detailItemFlex]}>
                      <Ionicons name="calendar" size={isSmallScreen ? 12 : 14} color={colors.textSecondary} />
                      <Text style={styles.detailText} numberOfLines={1} ellipsizeMode="tail">
                        {shipment.status === 'delivered'
                          ? `Delivered: ${shipment.deliveredOn}`
                          : `ETA: ${shipment.expectedDelivery}`}
                      </Text>
                    </View>
                    <View style={styles.distanceBadge}>
                      <Ionicons name="navigate" size={12} color={colors.primary} />
                      <Text style={styles.distanceText} numberOfLines={1}>{shipment.distance}</Text>
                    </View>
                  </View>
                </Card>
              ))}
            </View>
          </View>

          <View style={styles.bottomSpacer} />
        </ScrollView>

        {/* Floating Action Button */}
        <View style={styles.fabContainer}>
          <FloatingButton
            icon="add"
            onPress={() => router.push('/(tabs)/book-trip')}
            variant="gradient"
            size="lg"
            style={styles.fab}
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
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  safeArea: {
    flex: 1,
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
  heroStatsContainerSmall: {
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  heroCard: {
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    ...shadows.lg,
  },
  heroGradient: {
    padding: spacing.xl,
  },
  heroGradientSmall: {
    padding: spacing.md,
  },
  heroContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.xl,
  },
  heroContentLeft: {
    flex: 1,
    minWidth: 0,
    marginRight: spacing.sm,
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
  heroValueSmall: {
    fontSize: 22,
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
  heroIconContainerSmall: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  heroStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.textWhite + '20',
  },
  heroStatsSmall: {
    paddingTop: spacing.md,
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
    marginBottom: spacing.lg,
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
  actionButtonsContainer: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  actionButtonsContainerSmall: {
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: spacing.md,
    width: '100%',
  },
  actionButtonsSmall: {
    gap: spacing.sm,
  },
  actionButton: {
    flex: 1,
    minWidth: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.backgroundCard,
    ...shadows.md,
    gap: spacing.sm,
  },
  actionButtonSmall: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
  },
  primaryAction: {
    borderWidth: 1,
    borderColor: colors.primary + '20',
  },
  secondaryAction: {
    borderWidth: 1,
    borderColor: colors.info + '20',
  },
  actionButtonIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    color: colors.text,
  },
  sectionSmall: {
    marginBottom: spacing.md,
  },
  sectionTitleSmall: {
    fontSize: typography.sizes.md,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  sectionHeaderSmall: {
    paddingHorizontal: spacing.md,
  },
  quickStatsContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  quickStatsContainerSmall: {
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  quickStatCard: {
    flex: 1,
    minWidth: 0,
    padding: spacing.md,
    alignItems: 'center',
    ...shadows.md,
  },
  quickStatCardSmall: {
    padding: spacing.sm,
  },
  quickStatIconWrapper: {
    marginBottom: spacing.sm,
  },
  quickStatIconBg: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickStatIconBgSmall: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  quickStatValue: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.text,
    marginBottom: spacing.xs / 2,
  },
  quickStatValueSmall: {
    fontSize: typography.sizes.sm,
  },
  quickStatLabel: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  quickStatLabelSmall: {
    fontSize: 10,
  },
  insightsCard: {
    padding: spacing.lg,
    marginHorizontal: spacing.lg,
    ...shadows.md,
  },
  insightsCardSmall: {
    padding: spacing.md,
    marginHorizontal: spacing.md,
  },
  insightsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  insightsIconContainer: {
    marginRight: spacing.md,
  },
  insightsIconContainerSmall: {
    marginRight: spacing.sm,
  },
  insightsIconBg: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  insightsIconBgSmall: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  insightsContent: {
    flex: 1,
    minWidth: 0,
  },
  insightsTitle: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
    color: colors.text,
    marginBottom: spacing.xs / 2,
  },
  insightsTitleSmall: {
    fontSize: typography.sizes.sm,
  },
  insightsSubtitle: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
  },
  insightsSubtitleSmall: {
    fontSize: 10,
  },
  insightsValueContainer: {
    alignItems: 'flex-end',
  },
  insightsValue: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.primary,
  },
  insightsValueSmall: {
    fontSize: typography.sizes.lg,
  },
  insightsProgressBar: {
    height: 6,
    backgroundColor: colors.border,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  insightsProgressFill: {
    height: '100%',
    borderRadius: borderRadius.full,
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
    ...shadows.md,
  },
  shipmentHeader: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  shipmentHeaderLeft: {
    flex: 1,
    minWidth: 0,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: spacing.sm,
  },
  shipmentStatusChip: {
    flexShrink: 0,
  },
  trackingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    maxWidth: '100%',
    backgroundColor: colors.primaryTransparent,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  trackingId: {
    flex: 1,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
    color: colors.primary,
  },
  shipmentPrice: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.text,
    marginLeft: spacing.sm,
    flexShrink: 0,
    minWidth: 72,
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
    minWidth: 0,
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
    flex: 1,
    minWidth: 0,
    maxWidth: '33%',
  },
  detailText: {
    flex: 1,
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
    height: 100,
  },
  fabContainer: {
    position: 'absolute',
    bottom: 20,
    right: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fab: {
    ...shadows.xl,
  },
  highlightsGrid: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  highlightsGridSmall: {
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  highlightCard: {
    flex: 1,
    minWidth: 0,
    padding: spacing.md,
    alignItems: 'center',
    ...shadows.sm,
  },
  highlightCardSmall: {
    padding: spacing.sm,
  },
  highlightIconWrapper: {
    marginBottom: spacing.sm,
  },
  highlightIconBg: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  highlightIconBgSmall: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  highlightTitle: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
    color: colors.text,
    marginBottom: spacing.xs / 2,
    textAlign: 'center',
  },
  highlightTitleSmall: {
    fontSize: typography.sizes.xs,
  },
  highlightSubtitle: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  highlightSubtitleSmall: {
    fontSize: 10,
  },
  filterTabsContentSmall: {
    paddingHorizontal: spacing.md,
  },
  shipmentsListSmall: {
    paddingHorizontal: spacing.md,
  },
  shipmentCardSmall: {
    padding: spacing.md,
  },
  shipmentDetailsSmall: {
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  shipmentFooterSmall: {
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  detailItemFlex: {
    flex: 1,
    minWidth: 0,
  },
});