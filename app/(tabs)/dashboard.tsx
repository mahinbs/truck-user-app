import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { colors, spacing, typography, borderRadius, shadows } from '@/constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';

// Mock data
const mockStats = {
  activeShipments: 5,
  completedShipments: 23,
  totalSpent: 45200,
};

const mockShipments = [
  {
    id: '1',
    trackingId: 'TRK2024001',
    from: 'Mumbai, Maharashtra',
    to: 'Delhi, Delhi',
    status: 'in-transit',
    progress: 65,
    driverName: 'Raj Kumar',
    driverPhone: '+91 9876543210',
    truckNumber: 'MH 02 AB 1234',
    expectedDelivery: '2024-01-08',
    material: 'Electronics',
    weight: '1200 kg',
  },
  {
    id: '2',
    trackingId: 'TRK2024002',
    from: 'Bangalore, Karnataka',
    to: 'Chennai, Tamil Nadu',
    status: 'pending',
    progress: 0,
    expectedDelivery: '2024-01-10',
    material: 'Furniture',
    weight: '2500 kg',
  },
  {
    id: '3',
    trackingId: 'TRK2024003',
    from: 'Pune, Maharashtra',
    to: 'Hyderabad, Telangana',
    status: 'delivered',
    progress: 100,
    deliveredOn: '2024-01-05',
    material: 'Raw Materials',
    weight: '3000 kg',
  },
];

export default function DashboardScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'in-transit':
        return <Badge label="In Transit" variant="info" />;
      case 'pending':
        return <Badge label="Pending" variant="warning" />;
      case 'delivered':
        return <Badge label="Delivered" variant="success" />;
      case 'cancelled':
        return <Badge label="Cancelled" variant="error" />;
      default:
        return <Badge label={status} variant="default" />;
    }
  };

  const filteredShipments = mockShipments.filter((shipment) => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'active') return shipment.status !== 'delivered' && shipment.status !== 'cancelled';
    if (selectedFilter === 'completed') return shipment.status === 'delivered';
    return true;
  });

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello, Welcome Back!</Text>
          <Text style={styles.subtitle}>Manage your shipments</Text>
        </View>
        <TouchableOpacity style={styles.notificationButton}>
          <Ionicons name="notifications" size={24} color={colors.text} />
          <View style={styles.notificationBadge}>
            <Text style={styles.notificationBadgeText}>3</Text>
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <Card style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <Ionicons name="time" size={24} color={colors.primary} />
            </View>
            <Text style={styles.statValue}>{mockStats.activeShipments}</Text>
            <Text style={styles.statLabel}>Active</Text>
          </Card>

          <Card style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <Ionicons name="checkmark-circle" size={24} color={colors.success} />
            </View>
            <Text style={styles.statValue}>{mockStats.completedShipments}</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </Card>

          <Card style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <Ionicons name="wallet" size={24} color={colors.secondary} />
            </View>
            <Text style={styles.statValue}>₹{(mockStats.totalSpent / 1000).toFixed(1)}K</Text>
            <Text style={styles.statLabel}>Total Spent</Text>
          </Card>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActions}>
            <Card
              style={styles.actionCard}
              onPress={() => router.push('/(tabs)/book-trip')}
            >
              <View style={styles.actionIconContainer}>
                <Ionicons name="add-circle" size={32} color={colors.primary} />
              </View>
              <Text style={styles.actionLabel}>New Shipment</Text>
            </Card>

            <Card
              style={styles.actionCard}
              onPress={() => router.push('/(tabs)/track')}
            >
              <View style={styles.actionIconContainer}>
                <Ionicons name="search" size={32} color={colors.info} />
              </View>
              <Text style={styles.actionLabel}>Track</Text>
            </Card>

            <Card
              style={styles.actionCard}
              onPress={() => router.push('/(tabs)/history')}
            >
              <View style={styles.actionIconContainer}>
                <Ionicons name="document-text" size={32} color={colors.success} />
              </View>
              <Text style={styles.actionLabel}>History</Text>
            </Card>

            <Card
              style={styles.actionCard}
              onPress={() => router.push('/(tabs)/support')}
            >
              <View style={styles.actionIconContainer}>
                <Ionicons name="help-circle" size={32} color={colors.warning} />
              </View>
              <Text style={styles.actionLabel}>Support</Text>
            </Card>
          </View>
        </View>

        {/* Shipments Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>My Shipments</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/trips')}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>

          {/* Filter Tabs */}
          <View style={styles.filterTabs}>
            <TouchableOpacity
              style={[
                styles.filterTab,
                selectedFilter === 'all' && styles.filterTabActive,
              ]}
              onPress={() => setSelectedFilter('all')}
            >
              <Text
                style={[
                  styles.filterTabText,
                  selectedFilter === 'all' && styles.filterTabTextActive,
                ]}
              >
                All
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.filterTab,
                selectedFilter === 'active' && styles.filterTabActive,
              ]}
              onPress={() => setSelectedFilter('active')}
            >
              <Text
                style={[
                  styles.filterTabText,
                  selectedFilter === 'active' && styles.filterTabTextActive,
                ]}
              >
                Active
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.filterTab,
                selectedFilter === 'completed' && styles.filterTabActive,
              ]}
              onPress={() => setSelectedFilter('completed')}
            >
              <Text
                style={[
                  styles.filterTabText,
                  selectedFilter === 'completed' && styles.filterTabTextActive,
                ]}
              >
                Completed
              </Text>
            </TouchableOpacity>
          </View>

          {/* Shipment Cards */}
          {filteredShipments.map((shipment) => (
            <Card
              key={shipment.id}
              style={styles.shipmentCard}
              onPress={() => router.push(`/(tabs)/trip/${shipment.id}`)}
            >
              <View style={styles.shipmentHeader}>
                <View style={styles.shipmentHeaderLeft}>
                  <Text style={styles.trackingId}>{shipment.trackingId}</Text>
                  {getStatusBadge(shipment.status)}
                </View>
                <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
              </View>

              <View style={styles.shipmentRoute}>
                <View style={styles.routePoint}>
                  <View style={styles.routeDotFrom} />
                  <View style={styles.routeInfo}>
                    <Text style={styles.routeLabel}>From</Text>
                    <Text style={styles.routeLocation}>{shipment.from}</Text>
                  </View>
                </View>

                <View style={styles.routeConnector} />

                <View style={styles.routePoint}>
                  <View style={styles.routeDotTo} />
                  <View style={styles.routeInfo}>
                    <Text style={styles.routeLabel}>To</Text>
                    <Text style={styles.routeLocation}>{shipment.to}</Text>
                  </View>
                </View>
              </View>

              {shipment.status === 'in-transit' && (
                <View style={styles.progressContainer}>
                  <View style={styles.progressBar}>
                    <View
                      style={[
                        styles.progressFill,
                        { width: `${shipment.progress}%` },
                      ]}
                    />
                  </View>
                  <Text style={styles.progressText}>{shipment.progress}% Complete</Text>
                </View>
              )}

              <View style={styles.shipmentFooter}>
                <View style={styles.shipmentDetail}>
                  <Ionicons name="cube" size={14} color={colors.textSecondary} />
                  <Text style={styles.shipmentDetailText}>{shipment.material}</Text>
                </View>
                <View style={styles.shipmentDetail}>
                  <Ionicons name="barbell" size={14} color={colors.textSecondary} />
                  <Text style={styles.shipmentDetailText}>{shipment.weight}</Text>
                </View>
                <View style={styles.shipmentDetail}>
                  <Ionicons name="calendar" size={14} color={colors.textSecondary} />
                  <Text style={styles.shipmentDetailText}>
                    {shipment.status === 'delivered'
                      ? shipment.deliveredOn
                      : shipment.expectedDelivery}
                  </Text>
                </View>
              </View>
            </Card>
          ))}
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/(tabs)/book-trip')}
      >
        <Ionicons name="add" size={32} color={colors.backgroundCard} />
      </TouchableOpacity>
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
    marginTop: 2,
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.backgroundCard,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.sm,
  },
  notificationBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.error,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadgeText: {
    fontSize: 10,
    fontWeight: typography.weights.bold,
    color: colors.backgroundCard,
  },
  scrollView: {
    flex: 1,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: spacing.md,
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: `${colors.primary}15`,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  statValue: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.text,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    textAlign: 'center',
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
  },
  seeAll: {
    fontSize: typography.sizes.sm,
    color: colors.primary,
    fontWeight: typography.weights.semibold,
  },
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  actionCard: {
    flex: 1,
    alignItems: 'center',
    padding: spacing.md,
  },
  actionIconContainer: {
    marginBottom: spacing.xs,
  },
  actionLabel: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.medium,
    color: colors.text,
    textAlign: 'center',
  },
  filterTabs: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  filterTab: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.full,
    backgroundColor: colors.backgroundCard,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterTabActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterTabText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    color: colors.textSecondary,
  },
  filterTabTextActive: {
    color: colors.backgroundCard,
  },
  shipmentCard: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  shipmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  shipmentHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  trackingId: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    color: colors.text,
  },
  shipmentRoute: {
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
    height: 24,
    backgroundColor: colors.border,
    marginLeft: 5,
    marginVertical: spacing.xs,
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
  },
  progressContainer: {
    marginBottom: spacing.md,
  },
  progressBar: {
    height: 6,
    backgroundColor: colors.border,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
    marginBottom: spacing.xs,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: borderRadius.full,
  },
  progressText: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    textAlign: 'right',
  },
  shipmentFooter: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  shipmentDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  shipmentDetailText: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
  },
  bottomSpacer: {
    height: 80,
  },
  fab: {
    position: 'absolute',
    bottom: 80,
    right: spacing.lg,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.lg,
  },
});
