import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Card } from './ui/Card';
import { StatusBadge } from './ui/StatusBadge';
import { colors, spacing, typography } from '@/constants/theme';

interface ShipmentCardProps {
  id: string;
  name: string;
  from: string;
  to: string;
  status: 'on-track' | 'at-risk' | 'delayed' | 'pending' | 'completed' | 'active';
  price: string;
  onPress: () => void;
}

export const ShipmentCard: React.FC<ShipmentCardProps> = ({
  name,
  from,
  to,
  status,
  price,
  onPress,
}) => {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Card style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.name}>{name}</Text>
          <StatusBadge status={status} />
        </View>
        
        <View style={styles.route}>
          <View style={styles.location}>
            <View style={[styles.dot, styles.pickupDot]} />
            <Text style={styles.locationText}>{from}</Text>
          </View>
          <View style={styles.line} />
          <View style={styles.location}>
            <View style={[styles.dot, styles.dropDot]} />
            <Text style={styles.locationText}>{to}</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.price}>{price}</Text>
        </View>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  name: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    color: colors.text,
    flex: 1,
  },
  route: {
    marginBottom: spacing.md,
  },
  location: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: spacing.sm,
  },
  pickupDot: {
    backgroundColor: colors.success,
  },
  dropDot: {
    backgroundColor: colors.primary,
  },
  line: {
    width: 1,
    height: 12,
    backgroundColor: colors.border,
    marginLeft: 4,
    marginBottom: spacing.xs,
  },
  locationText: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  price: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
    color: colors.text,
  },
});

