import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { borderRadius, colors, shadows, spacing, typography } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Dimensions,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

// Mock data
const allTrips = [
  {
    id: '1',
    trackingId: 'TRK2024001',
    from: 'Mumbai, Maharashtra',
    to: 'Delhi, Delhi',
    status: 'delivered',
    date: '2024-01-05',
    material: 'Electronics',
    weight: '1200 kg',
    price: 1416,
  },
  {
    id: '2',
    trackingId: 'TRK2024002',
    from: 'Bangalore, Karnataka',
    to: 'Chennai, Tamil Nadu',
    status: 'in-transit',
    date: '2024-01-07',
    material: 'Furniture',
    weight: '2500 kg',
    price: 2800,
  },
  {
    id: '3',
    trackingId: 'TRK2024003',
    from: 'Pune, Maharashtra',
    to: 'Hyderabad, Telangana',
    status: 'delivered',
    date: '2024-01-03',
    material: 'Raw Materials',
    weight: '3000 kg',
    price: 3500,
  },
  {
    id: '4',
    trackingId: 'TRK2024004',
    from: 'Ahmedabad, Gujarat',
    to: 'Jaipur, Rajasthan',
    status: 'delivered',
    date: '2024-01-02',
    material: 'Textiles',
    weight: '1800 kg',
    price: 2200,
  },
];

export default function TripsHistoryScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'delivered' | 'active'>('all');
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  };

  const filteredTrips = allTrips.filter((trip) => {
    const matchesSearch =
      trip.trackingId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.to.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.material.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      filterStatus === 'all' ||
      (filterStatus === 'active' && trip.status !== 'delivered') ||
      (filterStatus === 'delivered' && trip.status === 'delivered');

    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'in-transit':
        return (
          <View style={styles.statusBadge}>
            <Ionicons name="time" size={16} color={colors.info} />
            <Text style={styles.statusBadgeText}>In Transit</Text>
          </View>
        );
      case 'delivered':
        return (
          <View style={styles.statusBadgeSuccess}>
            <Ionicons name="checkmark-circle" size={16} color={colors.success} />
            <Text style={styles.statusBadgeTextSuccess}>Delivered</Text>
          </View>
        );
      case 'pending':
        return (
          <View style={styles.statusBadgeWarning}>
            <Ionicons name="time" size={16} color={colors.warning} />
            <Text style={styles.statusBadgeTextWarning}>Pending</Text>
          </View>
        );
      case 'cancelled':
        return (
          <View style={styles.statusBadgeError}>
            <Ionicons name="close-circle" size={16} color={colors.error} />
            <Text style={styles.statusBadgeTextError}>Cancelled</Text>
          </View>
        );
      default:
        return null;
    }
  };

  const stats = {
    total: allTrips.length,
    delivered: allTrips.filter((t) => t.status === 'delivered').length,
    active: allTrips.filter((t) => t.status !== 'delivered').length,
    totalSpent: allTrips.reduce((sum, t) => sum + t.price, 0),
  };

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
          <Text style={styles.headerTitle}>My Shipments</Text>
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
          {/* Stats Cards */}
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <LinearGradient
                colors={[colors.primary, colors.primaryDark]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.statGradient}
              >
                <Ionicons name="cube" size={24} color={colors.textWhite} />
                <Text style={styles.statValue}>{stats.total}</Text>
                <Text style={styles.statLabel}>Total Trips</Text>
              </LinearGradient>
            </View>

            <View style={styles.statCard}>
              <LinearGradient
                colors={[colors.success, '#059669']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.statGradient}
              >
                <Ionicons name="checkmark-circle" size={24} color={colors.textWhite} />
                <Text style={styles.statValue}>{stats.delivered}</Text>
                <Text style={styles.statLabel}>Delivered</Text>
              </LinearGradient>
            </View>

            <View style={styles.statCard}>
              <LinearGradient
                colors={[colors.info, colors.blueDark]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.statGradient}
              >
                <Ionicons name="time" size={24} color={colors.textWhite} />
                <Text style={styles.statValue}>{stats.active}</Text>
                <Text style={styles.statLabel}>Active</Text>
              </LinearGradient>
            </View>
          </View>

          {/* Search */}
          <View style={styles.searchContainer}>
            <Input
              placeholder="Search by tracking ID, location..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              icon="search"
              containerStyle={styles.searchInput}
            />
          </View>

          {/* Filter Tabs */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.filterTabs}
            contentContainerStyle={styles.filterTabsContent}
          >
            {(['all', 'active', 'delivered'] as const).map((status) => (
              <TouchableOpacity
                key={status}
                style={[
                  styles.filterTab,
                  filterStatus === status && styles.filterTabActive,
                ]}
                onPress={() => {
                  setFilterStatus(status);
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }}
              >
                <Text
                  style={[
                    styles.filterTabText,
                    filterStatus === status && styles.filterTabTextActive,
                  ]}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Trips List */}
          <View style={styles.tripsContainer}>
            {filteredTrips.length === 0 ? (
              <Card style={styles.emptyCard}>
                <Ionicons name="cube-outline" size={64} color={colors.textLight} />
                <Text style={styles.emptyText}>No shipments found</Text>
                <Text style={styles.emptySubtext}>
                  Try adjusting your search or filters
                </Text>
              </Card>
            ) : (
              filteredTrips.map((trip) => (
                <Card
                  key={trip.id}
                  style={styles.tripCard}
                  onPress={() => router.push(`/(tabs)/trip/${trip.id}`)}
                >
                  <View style={styles.tripHeader}>
                    <View style={styles.tripHeaderLeft}>
                      <Text style={styles.trackingId}>{trip.trackingId}</Text>
                      <Text style={styles.route}>{trip.from} → {trip.to}</Text>
                    </View>
                    <View style={styles.statusBadgeContainer}>
                      {getStatusBadge(trip.status)}
                    </View>
                  </View>

                  <View style={styles.tripDetails}>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Material</Text>
                      <Text style={styles.detailValue}>{trip.material}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Weight</Text>
                      <Text style={styles.detailValue}>{trip.weight}</Text>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.detailRow}>
                      <Text style={styles.totalLabel}>Total Amount</Text>
                      <Text style={styles.totalValue}>₹{trip.price.toLocaleString()}</Text>
                    </View>
                  </View>

                  <View style={styles.tripFooter}>
                    <View style={styles.tripMeta}>
                      <Ionicons name="calendar" size={14} color={colors.textSecondary} />
                      <Text style={styles.metaText}>{trip.date}</Text>
                    </View>
                    <TouchableOpacity
                      style={styles.receiptButton}
                      onPress={(e) => {
                        e.stopPropagation();
                        router.push(`/(tabs)/trip/${trip.id}/payment`);
                      }}
                    >
                      <Ionicons name="receipt" size={16} color={colors.primary} />
                      <Text style={styles.receiptText}>Invoice</Text>
                    </TouchableOpacity>
                  </View>
                </Card>
              ))
            )}
          </View>

          <View style={styles.bottomSpacer} />
        </ScrollView>
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
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  headerTitle: {
    fontSize: typography.sizes['2xl'],
    fontWeight: typography.weights.bold,
    color: colors.textWhite,
  },
  scrollView: {
    flex: 1,
  },
  statsGrid: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
    marginBottom: spacing.xl,
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
  searchContainer: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  searchInput: {
    marginBottom: 0,
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
  tripsContainer: {
    paddingHorizontal: spacing.lg,
  },
  tripCard: {
    marginBottom: spacing.md,
  },
  tripHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  tripHeaderLeft: {
    flex: 1,
    minWidth: 0,
  },
  trackingId: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
    color: colors.text,
    marginBottom: spacing.xs - 2,
  },
  route: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
  },
  statusBadgeContainer: {
    flexShrink: 0,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs - 2,
    backgroundColor: colors.infoLight,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs - 2,
    borderRadius: borderRadius.full,
  },
  statusBadgeText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
    color: colors.info,
  },
  statusBadgeSuccess: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs - 2,
    backgroundColor: colors.successLight,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs - 2,
    borderRadius: borderRadius.full,
  },
  statusBadgeTextSuccess: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
    color: colors.success,
  },
  statusBadgeWarning: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs - 2,
    backgroundColor: colors.warningLight,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs - 2,
    borderRadius: borderRadius.full,
  },
  statusBadgeTextWarning: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
    color: colors.warning,
  },
  statusBadgeError: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs - 2,
    backgroundColor: colors.errorLight,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs - 2,
    borderRadius: borderRadius.full,
  },
  statusBadgeTextError: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
    color: colors.error,
  },
  tripDetails: {
    marginBottom: spacing.md,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  detailLabel: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
  },
  detailValue: {
    fontSize: typography.sizes.sm,
    color: colors.text,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.sm,
  },
  totalLabel: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    color: colors.text,
  },
  totalValue: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
    color: colors.primary,
  },
  tripFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  tripMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs - 2,
  },
  metaText: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
  },
  receiptButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs - 2,
    backgroundColor: colors.primaryTransparent,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  receiptText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
    color: colors.primary,
  },
  emptyCard: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
    color: colors.text,
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  emptySubtext: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  bottomSpacer: {
    height: 80,
  },
});
