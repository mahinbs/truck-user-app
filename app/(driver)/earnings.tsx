import { Card } from '@/components/ui/Card';
import { borderRadius, colors, shadows, spacing, typography } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const mockEarnings = {
  totalBalance: 45230,
  todayEarnings: 8500,
  weekEarnings: 32400,
  monthEarnings: 124500,
  pendingWithdrawal: 12000,
  trips: [
    { id: '1', date: '2024-01-12', route: 'Mumbai → Delhi', amount: 12500, status: 'completed' },
    { id: '2', date: '2024-01-12', route: 'Pune → Bangalore', amount: 8500, status: 'completed' },
    { id: '3', date: '2024-01-11', route: 'Delhi → Jaipur', amount: 5200, status: 'completed' },
    { id: '4', date: '2024-01-11', route: 'Mumbai → Surat', amount: 3800, status: 'completed' },
  ],
};

export default function EarningsScreen() {
  const [selectedPeriod, setSelectedPeriod] = useState('week');

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.container} edges={['top']}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.headerSpacer} />
          {/* Total Balance Card */}
          <Card style={styles.balanceCard}>
            <LinearGradient
              colors={[colors.success, '#059669']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.balanceGradient}
            >
              <Text style={styles.balanceLabel}>Total Balance</Text>
              <Text style={styles.balanceAmount}>₹{mockEarnings.totalBalance.toLocaleString()}</Text>
              <TouchableOpacity style={styles.withdrawButton}>
                <Text style={styles.withdrawText}>Withdraw</Text>
                <Ionicons name="arrow-forward" size={16} color={colors.textWhite} />
              </TouchableOpacity>
            </LinearGradient>
          </Card>

          {/* Period Tabs */}
          <View style={styles.periodTabs}>
            {['today', 'week', 'month'].map((period) => (
              <TouchableOpacity
                key={period}
                style={[
                  styles.periodTab,
                  selectedPeriod === period && styles.periodTabActive,
                ]}
                onPress={() => setSelectedPeriod(period)}
              >
                <Text
                  style={[
                    styles.periodTabText,
                    selectedPeriod === period && styles.periodTabTextActive,
                  ]}
                >
                  {period.charAt(0).toUpperCase() + period.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Stats Cards */}
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <LinearGradient
                colors={[colors.primary, colors.primaryDark]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.statGradient}
              >
                <Ionicons name="today" size={24} color={colors.textWhite} />
                <Text style={styles.statValue}>₹{(mockEarnings.todayEarnings / 1000).toFixed(1)}K</Text>
                <Text style={styles.statLabel}>Today</Text>
              </LinearGradient>
            </View>

            <View style={styles.statCard}>
              <LinearGradient
                colors={[colors.secondary, colors.secondaryDark]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.statGradient}
              >
                <Ionicons name="calendar" size={24} color={colors.textWhite} />
                <Text style={styles.statValue}>₹{(mockEarnings.weekEarnings / 1000).toFixed(1)}K</Text>
                <Text style={styles.statLabel}>This Week</Text>
              </LinearGradient>
            </View>
          </View>

          {/* Earnings List */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recent Trips</Text>
            {mockEarnings.trips.map((trip) => (
              <Card key={trip.id} style={styles.tripCard}>
                <View style={styles.tripRow}>
                  <View style={styles.tripIcon}>
                    <Ionicons name="car-sport" size={20} color={colors.success} />
                  </View>
                  <View style={styles.tripInfo}>
                    <Text style={styles.tripRoute}>{trip.route}</Text>
                    <Text style={styles.tripDate}>{trip.date}</Text>
                  </View>
                  <Text style={styles.tripAmount}>₹{trip.amount.toLocaleString()}</Text>
                </View>
              </Card>
            ))}
          </View>
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
  headerSpacer: {
    height: spacing.md,
  },
  scrollView: {
    flex: 1,
  },
  balanceCard: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    padding: 0,
    overflow: 'hidden',
  },
  balanceGradient: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  balanceLabel: {
    fontSize: typography.sizes.md,
    color: colors.textWhite,
    opacity: 0.9,
    marginBottom: spacing.xs,
  },
  balanceAmount: {
    fontSize: typography.sizes['4xl'],
    fontWeight: typography.weights.bold,
    color: colors.textWhite,
    marginBottom: spacing.md,
  },
  withdrawButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
  },
  withdrawText: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    color: colors.textWhite,
  },
  periodTabs: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  periodTab: {
    flex: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.full,
    backgroundColor: colors.backgroundCard,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
  },
  periodTabActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  periodTabText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    color: colors.textSecondary,
  },
  periodTabTextActive: {
    color: colors.textWhite,
  },
  statsGrid: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
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
  section: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.text,
    marginBottom: spacing.md,
  },
  tripCard: {
    marginBottom: spacing.sm,
  },
  tripRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  tripIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.successLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tripInfo: {
    flex: 1,
  },
  tripRoute: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    color: colors.text,
    marginBottom: 2,
  },
  tripDate: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
  },
  tripAmount: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.success,
  },
});

