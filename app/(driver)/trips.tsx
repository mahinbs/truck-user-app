import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '@/components/ui/Card';
import { StatusChip } from '@/components/ui/StatusChip';
import { colors, spacing, typography, borderRadius } from '@/constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';

const mockTrips = [
  { id: '1', from: 'Mumbai', to: 'Delhi', date: '2024-01-12', earnings: 12500, status: 'in-transit' as const },
  { id: '2', from: 'Pune', to: 'Bangalore', date: '2024-01-12', earnings: 8500, status: 'completed' as const },
  { id: '3', from: 'Delhi', to: 'Jaipur', date: '2024-01-11', earnings: 5200, status: 'completed' as const },
];

export default function DriverTripsScreen() {
  const [filter, setFilter] = useState('all');

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>My Trips</Text>
      </View>

      <View style={styles.filterTabs}>
        {['all', 'active', 'completed'].map((f) => (
          <TouchableOpacity
            key={f}
            style={[styles.filterTab, filter === f && styles.filterTabActive]}
            onPress={() => setFilter(f)}
          >
            <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.scrollView}>
        {mockTrips.map((trip) => (
          <Card key={trip.id} style={styles.tripCard} onPress={() => router.push(`/(driver)/active-trip`)}>
            <View style={styles.tripHeader}>
              <StatusChip status={trip.status} size="sm" />
              <Text style={styles.earnings}>₹{trip.earnings.toLocaleString()}</Text>
            </View>
            <View style={styles.tripRoute}>
              <Text style={styles.routeText}>{trip.from} → {trip.to}</Text>
              <Text style={styles.dateText}>{trip.date}</Text>
            </View>
          </Card>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { paddingHorizontal: spacing.lg, paddingVertical: spacing.md },
  title: { fontSize: typography.sizes['2xl'], fontWeight: typography.weights.bold, color: colors.text },
  filterTabs: { flexDirection: 'row', paddingHorizontal: spacing.lg, gap: spacing.sm, marginBottom: spacing.md },
  filterTab: { flex: 1, paddingVertical: spacing.sm, borderRadius: borderRadius.full, backgroundColor: colors.backgroundCard, borderWidth: 1.5, borderColor: colors.border, alignItems: 'center' },
  filterTabActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  filterText: { fontSize: typography.sizes.sm, fontWeight: typography.weights.semibold, color: colors.textSecondary },
  filterTextActive: { color: colors.textWhite },
  scrollView: { flex: 1, paddingHorizontal: spacing.lg },
  tripCard: { marginBottom: spacing.md },
  tripHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm },
  earnings: { fontSize: typography.sizes.lg, fontWeight: typography.weights.bold, color: colors.success },
  tripRoute: {},
  routeText: { fontSize: typography.sizes.md, fontWeight: typography.weights.semibold, color: colors.text, marginBottom: 2 },
  dateText: { fontSize: typography.sizes.sm, color: colors.textSecondary },
});

