import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { ShipmentCard } from './ShipmentCard';
import { colors, spacing, typography, borderRadius } from '@/constants/theme';

type TabType = 'active' | 'delivered' | 'all';

interface Shipment {
  id: string;
  name: string;
  from: string;
  to: string;
  status: 'on-track' | 'at-risk' | 'delayed' | 'pending' | 'completed' | 'active';
  price: string;
}

interface ShipmentListProps {
  shipments: Shipment[];
  onShipmentPress: (id: string) => void;
}

export const ShipmentList: React.FC<ShipmentListProps> = ({ shipments, onShipmentPress }) => {
  const [activeTab, setActiveTab] = useState<TabType>('active');

  const filteredShipments = shipments.filter((shipment) => {
    if (activeTab === 'active') {
      return ['on-track', 'at-risk', 'delayed', 'active'].includes(shipment.status);
    }
    if (activeTab === 'delivered') {
      return shipment.status === 'completed';
    }
    return true;
  });

  return (
    <View style={styles.container}>
      <View style={styles.tabs}>
        {(['active', 'delivered', 'all'] as TabType[]).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
        {filteredShipments.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No shipments found</Text>
          </View>
        ) : (
          filteredShipments.map((shipment) => (
            <ShipmentCard
              key={shipment.id}
              {...shipment}
              onPress={() => onShipmentPress(shipment.id)}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: colors.backgroundCard,
    padding: spacing.xs,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    borderRadius: borderRadius.sm,
  },
  tabActive: {
    backgroundColor: colors.primary,
  },
  tabText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    color: colors.textSecondary,
  },
  tabTextActive: {
    color: '#FFFFFF',
    fontWeight: typography.weights.semibold,
  },
  list: {
    flex: 1,
  },
  empty: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: typography.sizes.md,
    color: colors.textSecondary,
  },
});

