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
import { Chip } from '@/components/ui/Chip';
import { colors, spacing, typography, borderRadius, shadows } from '@/constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';

// Mock history data
const historyData = [
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
    driverName: 'Raj Kumar',
    rating: 5,
  },
  {
    id: '2',
    trackingId: 'TRK2024002',
    from: 'Bangalore, Karnataka',
    to: 'Chennai, Tamil Nadu',
    status: 'delivered',
    date: '2024-01-03',
    material: 'Furniture',
    weight: '2500 kg',
    price: 2800,
    driverName: 'Suresh Patel',
    rating: 4,
  },
  {
    id: '3',
    trackingId: 'TRK2024003',
    from: 'Pune, Maharashtra',
    to: 'Hyderabad, Telangana',
    status: 'delivered',
    date: '2024-01-01',
    material: 'Raw Materials',
    weight: '3000 kg',
    price: 3500,
    driverName: 'Amit Singh',
    rating: 5,
  },
  {
    id: '4',
    trackingId: 'TRK2024004',
    from: 'Ahmedabad, Gujarat',
    to: 'Jaipur, Rajasthan',
    status: 'delivered',
    date: '2023-12-28',
    material: 'Textiles',
    weight: '1800 kg',
    price: 2200,
    driverName: 'Vikram Mehta',
    rating: 4,
  },
];

export default function HistoryScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'this-month' | 'last-month' | 'older'>('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'delivered' | 'cancelled'>('all');

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  };

  const filteredHistory = historyData.filter((item) => {
    if (selectedStatus !== 'all' && item.status !== selectedStatus) return false;
    // Add date filtering logic here if needed
    return true;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'delivered':
        return <Badge label="Delivered" variant="success" />;
      case 'cancelled':
        return <Badge label="Cancelled" variant="error" />;
      default:
        return <Badge label={status} variant="default" />;
    }
  };

  const renderStars = (rating: number) => {
    return (
      <View style={styles.stars}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Ionicons
            key={star}
            name={star <= rating ? 'star' : 'star-outline'}
            size={14}
            color={colors.warning}
          />
        ))}
      </View>
    );
  };

  const totalSpent = historyData.reduce((sum, item) => sum + item.price, 0);
  const totalShipments = historyData.length;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Shipment History</Text>
        </View>
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
        {/* Stats Summary */}
        <View style={styles.statsContainer}>
          <Card style={styles.statCard}>
            <Ionicons name="cube" size={24} color={colors.primary} />
            <Text style={styles.statValue}>{totalShipments}</Text>
            <Text style={styles.statLabel}>Total Shipments</Text>
          </Card>
          <Card style={styles.statCard}>
            <Ionicons name="checkmark-circle" size={24} color={colors.success} />
            <Text style={styles.statValue}>{totalShipments}</Text>
            <Text style={styles.statLabel}>Delivered</Text>
          </Card>
          <Card style={styles.statCard}>
            <Ionicons name="wallet" size={24} color={colors.secondary} />
            <Text style={styles.statValue}>₹{(totalSpent / 1000).toFixed(1)}K</Text>
            <Text style={styles.statLabel}>Total Spent</Text>
          </Card>
        </View>

        {/* Filters */}
        <View style={styles.filtersSection}>
          <Text style={styles.filterLabel}>Filter by Status</Text>
          <View style={styles.filterChips}>
            <Chip
              label="All"
              selected={selectedStatus === 'all'}
              onPress={() => setSelectedStatus('all')}
            />
            <Chip
              label="Delivered"
              icon="checkmark-circle"
              selected={selectedStatus === 'delivered'}
              onPress={() => setSelectedStatus('delivered')}
            />
            <Chip
              label="Cancelled"
              icon="close-circle"
              selected={selectedStatus === 'cancelled'}
              onPress={() => setSelectedStatus('cancelled')}
            />
          </View>

          <Text style={styles.filterLabel}>Filter by Date</Text>
          <View style={styles.filterChips}>
            <Chip
              label="All"
              selected={selectedFilter === 'all'}
              onPress={() => setSelectedFilter('all')}
            />
            <Chip
              label="This Month"
              icon="calendar"
              selected={selectedFilter === 'this-month'}
              onPress={() => setSelectedFilter('this-month')}
            />
            <Chip
              label="Last Month"
              icon="calendar-outline"
              selected={selectedFilter === 'last-month'}
              onPress={() => setSelectedFilter('last-month')}
            />
            <Chip
              label="Older"
              icon="time-outline"
              selected={selectedFilter === 'older'}
              onPress={() => setSelectedFilter('older')}
            />
          </View>
        </View>

        {/* History List */}
        <View style={styles.historySection}>
          <Text style={styles.sectionTitle}>
            {filteredHistory.length} Shipment{filteredHistory.length !== 1 ? 's' : ''}
          </Text>

          {filteredHistory.length === 0 ? (
            <Card style={styles.emptyCard}>
              <Ionicons name="cube-outline" size={64} color={colors.textLight} />
              <Text style={styles.emptyText}>No shipments found</Text>
              <Text style={styles.emptySubtext}>
                Try adjusting your filters
              </Text>
            </Card>
          ) : (
            filteredHistory.map((item) => (
              <Card
                key={item.id}
                style={styles.historyCard}
                onPress={() => router.push(`/(tabs)/trip/${item.id}`)}
              >
                <View style={styles.historyHeader}>
                  <View style={styles.historyHeaderLeft}>
                    <Text style={styles.trackingId}>{item.trackingId}</Text>
                    {getStatusBadge(item.status)}
                  </View>
                  <TouchableOpacity
                    onPress={(e) => {
                      e.stopPropagation();
                      router.push(`/(tabs)/trip/${item.id}/payment`);
                    }}
                  >
                    <Ionicons name="receipt" size={20} color={colors.primary} />
                  </TouchableOpacity>
                </View>

                <View style={styles.historyRoute}>
                  <View style={styles.routePoint}>
                    <View style={styles.routeDotFrom} />
                    <View style={styles.routeInfo}>
                      <Text style={styles.routeLabel}>From</Text>
                      <Text style={styles.routeLocation}>{item.from}</Text>
                    </View>
                  </View>

                  <View style={styles.routeConnector} />

                  <View style={styles.routePoint}>
                    <View style={styles.routeDotTo} />
                    <View style={styles.routeInfo}>
                      <Text style={styles.routeLabel}>To</Text>
                      <Text style={styles.routeLocation}>{item.to}</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.historyDetails}>
                  <View style={styles.detailRow}>
                    <View style={styles.detailItem}>
                      <Ionicons name="cube" size={14} color={colors.textSecondary} />
                      <Text style={styles.detailText}>{item.material}</Text>
                    </View>
                    <View style={styles.detailItem}>
                      <Ionicons name="barbell" size={14} color={colors.textSecondary} />
                      <Text style={styles.detailText}>{item.weight}</Text>
                    </View>
                    <View style={styles.detailItem}>
                      <Ionicons name="calendar" size={14} color={colors.textSecondary} />
                      <Text style={styles.detailText}>{item.date}</Text>
                    </View>
                  </View>

                  <View style={styles.driverRow}>
                    <View style={styles.driverInfo}>
                      <Ionicons name="person" size={14} color={colors.textSecondary} />
                      <Text style={styles.driverName}>{item.driverName}</Text>
                      {renderStars(item.rating)}
                    </View>
                    <Text style={styles.price}>₹{item.price}</Text>
                  </View>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.backgroundCard,
    ...shadows.sm,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
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
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: spacing.md,
  },
  statValue: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.text,
    marginTop: spacing.xs,
    marginBottom: spacing.xs,
  },
  statLabel: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  filtersSection: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  filterLabel: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    color: colors.text,
    marginBottom: spacing.sm,
    marginTop: spacing.md,
  },
  filterChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  historySection: {
    paddingHorizontal: spacing.lg,
  },
  sectionTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.text,
    marginBottom: spacing.md,
  },
  historyCard: {
    marginBottom: spacing.md,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  historyHeaderLeft: {
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
  historyRoute: {
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
  historyDetails: {
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  detailRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginBottom: spacing.md,
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
  driverRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  driverInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  driverName: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    marginRight: spacing.xs,
  },
  stars: {
    flexDirection: 'row',
    gap: 2,
  },
  price: {
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
    height: spacing.xl,
  },
});

