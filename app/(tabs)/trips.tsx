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
import { Input } from '@/components/ui/Input';
import { colors, spacing, typography, borderRadius, shadows } from '@/constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';

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
        return <Badge label="In Transit" variant="info" />;
      case 'delivered':
        return <Badge label="Delivered" variant="success" />;
      case 'pending':
        return <Badge label="Pending" variant="warning" />;
      case 'cancelled':
        return <Badge label="Cancelled" variant="error" />;
      default:
        return <Badge label={status} variant="default" />;
    }
  };

  const stats = {
    total: allTrips.length,
    delivered: allTrips.filter((t) => t.status === 'delivered').length,
    active: allTrips.filter((t) => t.status !== 'delivered').length,
    totalSpent: allTrips.reduce((sum, t) => sum + t.price, 0),
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Shipments</Text>
        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="funnel" size={20} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{stats.total}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={[styles.statValue, { color: colors.success }]}>
              {stats.delivered}
            </Text>
            <Text style={styles.statLabel}>Delivered</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={[styles.statValue, { color: colors.info }]}>
              {stats.active}
            </Text>
            <Text style={styles.statLabel}>Active</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={[styles.statValue, { color: colors.primary }]}>
              ₹{(stats.totalSpent / 1000).toFixed(1)}K
            </Text>
            <Text style={styles.statLabel}>Total</Text>
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
        <View style={styles.filterTabs}>
          {(['all', 'active', 'delivered'] as const).map((status) => (
            <TouchableOpacity
              key={status}
              style={[
                styles.filterTab,
                filterStatus === status && styles.filterTabActive,
              ]}
              onPress={() => setFilterStatus(status)}
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
        </View>

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
                    {getStatusBadge(trip.status)}
                  </View>
                  <TouchableOpacity
                    onPress={(e) => {
                      e.stopPropagation();
                      router.push(`/(tabs)/trip/${trip.id}/payment`);
                    }}
                  >
                    <Ionicons name="receipt" size={20} color={colors.primary} />
                  </TouchableOpacity>
                </View>

                <View style={styles.tripRoute}>
                  <View style={styles.routePoint}>
                    <View style={styles.routeDotFrom} />
                    <View style={styles.routeInfo}>
                      <Text style={styles.routeLabel}>From</Text>
                      <Text style={styles.routeLocation}>{trip.from}</Text>
                    </View>
                  </View>

                  <View style={styles.routeConnector} />

                  <View style={styles.routePoint}>
                    <View style={styles.routeDotTo} />
                    <View style={styles.routeInfo}>
                      <Text style={styles.routeLabel}>To</Text>
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
                  <View style={styles.tripDetail}>
                    <Ionicons name="calendar" size={14} color={colors.textSecondary} />
                    <Text style={styles.tripDetailText}>{trip.date}</Text>
                  </View>
                </View>

                <View style={styles.priceRow}>
                  <Text style={styles.priceLabel}>Total Amount</Text>
                  <Text style={styles.priceValue}>₹{trip.price}</Text>
                </View>
              </Card>
            ))
          )}
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.backgroundCard,
    ...shadows.sm,
  },
  headerTitle: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.text,
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  statBox: {
    flex: 1,
    backgroundColor: colors.backgroundCard,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    alignItems: 'center',
    ...shadows.sm,
  },
  statValue: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  statLabel: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  searchContainer: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  searchInput: {
    marginBottom: 0,
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
  tripsContainer: {
    paddingHorizontal: spacing.lg,
  },
  tripCard: {
    marginBottom: spacing.md,
  },
  tripHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  tripHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flex: 1,
  },
  trackingId: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    color: colors.text,
  },
  tripRoute: {
    marginBottom: spacing.md,
  },
  routePoint: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  routeDotFrom: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
    marginTop: 4,
  },
  routeDotTo: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.success,
    marginTop: 4,
  },
  routeConnector: {
    width: 2,
    height: 20,
    backgroundColor: colors.border,
    marginLeft: 4,
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
  tripFooter: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  tripDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  tripDetailText: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  priceLabel: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
  },
  priceValue: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
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
