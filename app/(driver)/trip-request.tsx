import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { colors, spacing, typography, borderRadius, shadows } from '@/constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

// Mock trip data
const tripData = {
  id: '1',
  from: 'Mumbai, Maharashtra',
  fromAddress: 'Warehouse 12, MIDC Area, Andheri East',
  to: 'Delhi, Delhi',
  toAddress: 'Industrial Area, Sector 59, Noida',
  distance: '1,420 km',
  earnings: 12500,
  pickupTime: '2024-01-12 08:00 AM',
  deliveryTime: 'Expected: 2024-01-14 06:00 PM',
  material: 'Electronics',
  weight: '1200 kg',
  customerName: 'ABC Electronics Pvt Ltd',
  customerPhone: '+91 98765 43210',
  specialInstructions: 'Handle with care. Fragile items.',
};

export default function TripRequestScreen() {
  const [loading, setLoading] = useState(false);

  const handleAccept = () => {
    setLoading(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
    setTimeout(() => {
      setLoading(false);
      router.replace(`/(driver)/active-trip?id=${tripData.id}`);
    }, 1000);
  };

  const handleReject = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.back();
  };

  return (
    <View style={styles.container}>
      {/* Gradient Header */}
      <LinearGradient
        colors={[colors.primaryGradientStart, colors.primaryGradientEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
      >
        <View style={[styles.decorCircle, styles.decorCircle1]} />
      </LinearGradient>

      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={colors.textWhite} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Trip Request</Text>
          <View style={{ width: 44 }} />
        </View>

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Earnings Card */}
          <Card style={styles.earningsCard}>
            <LinearGradient
              colors={[colors.success, '#059669']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.earningsGradient}
            >
              <Ionicons name="wallet" size={32} color={colors.textWhite} />
              <Text style={styles.earningsAmount}>₹{tripData.earnings.toLocaleString()}</Text>
              <Text style={styles.earningsLabel}>Trip Earnings</Text>
            </LinearGradient>
          </Card>

          {/* Trip Details */}
          <Card style={styles.detailsCard}>
            <View style={styles.routeSection}>
              <View style={styles.routePoint}>
                <View style={styles.routeDotFrom} />
                <View style={styles.routeInfo}>
                  <Text style={styles.routeLabel}>Pickup Location</Text>
                  <Text style={styles.routeCity}>{tripData.from}</Text>
                  <Text style={styles.routeAddress}>{tripData.fromAddress}</Text>
                  <View style={styles.timeTag}>
                    <Ionicons name="time" size={14} color={colors.primary} />
                    <Text style={styles.timeText}>{tripData.pickupTime}</Text>
                  </View>
                </View>
              </View>

              <View style={styles.routeConnector} />

              <View style={styles.routePoint}>
                <View style={styles.routeDotTo} />
                <View style={styles.routeInfo}>
                  <Text style={styles.routeLabel}>Drop Location</Text>
                  <Text style={styles.routeCity}>{tripData.to}</Text>
                  <Text style={styles.routeAddress}>{tripData.toAddress}</Text>
                  <View style={styles.timeTag}>
                    <Ionicons name="calendar" size={14} color={colors.success} />
                    <Text style={styles.timeText}>{tripData.deliveryTime}</Text>
                  </View>
                </View>
              </View>
            </View>
          </Card>

          {/* Load Details */}
          <Card style={styles.card}>
            <Text style={styles.cardTitle}>Load Details</Text>
            <View style={styles.detailRow}>
              <View style={styles.detailItem}>
                <Ionicons name="cube" size={20} color={colors.primary} />
                <View>
                  <Text style={styles.detailLabel}>Material</Text>
                  <Text style={styles.detailValue}>{tripData.material}</Text>
                </View>
              </View>
              <View style={styles.detailItem}>
                <Ionicons name="barbell" size={20} color={colors.primary} />
                <View>
                  <Text style={styles.detailLabel}>Weight</Text>
                  <Text style={styles.detailValue}>{tripData.weight}</Text>
                </View>
              </View>
            </View>
            <View style={styles.detailItem}>
              <Ionicons name="speedometer" size={20} color={colors.primary} />
              <View>
                <Text style={styles.detailLabel}>Total Distance</Text>
                <Text style={styles.detailValue}>{tripData.distance}</Text>
              </View>
            </View>
          </Card>

          {/* Customer Details */}
          <Card style={styles.card}>
            <Text style={styles.cardTitle}>Customer Details</Text>
            <View style={styles.customerInfo}>
              <View style={styles.customerAvatar}>
                <Ionicons name="person" size={24} color={colors.primary} />
              </View>
              <View style={styles.customerDetails}>
                <Text style={styles.customerName}>{tripData.customerName}</Text>
                <TouchableOpacity style={styles.phoneButton}>
                  <Ionicons name="call" size={14} color={colors.primary} />
                  <Text style={styles.phoneText}>{tripData.customerPhone}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Card>

          {/* Special Instructions */}
          {tripData.specialInstructions && (
            <Card style={styles.card}>
              <Text style={styles.cardTitle}>Special Instructions</Text>
              <View style={styles.instructionsBox}>
                <Ionicons name="information-circle" size={20} color={colors.warning} />
                <Text style={styles.instructionsText}>
                  {tripData.specialInstructions}
                </Text>
              </View>
            </Card>
          )}

          <View style={styles.bottomSpacer} />
        </ScrollView>

        {/* Bottom Actions */}
        <View style={styles.bottomActions}>
          <TouchableOpacity 
            style={styles.rejectBtn} 
            onPress={handleReject}
            disabled={loading}
          >
            <Text style={styles.rejectBtnText}>Reject</Text>
          </TouchableOpacity>
          <View style={styles.acceptBtn}>
            <Button
              title="Accept Trip"
              variant="gradient"
              onPress={handleAccept}
              loading={loading}
              icon="checkmark-circle"
              iconPosition="right"
              fullWidth
            />
          </View>
        </View>
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
    height: 180,
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.textWhite,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
  },
  earningsCard: {
    marginBottom: spacing.md,
    padding: 0,
    overflow: 'hidden',
  },
  earningsGradient: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  earningsAmount: {
    fontSize: typography.sizes['4xl'],
    fontWeight: typography.weights.bold,
    color: colors.textWhite,
    marginVertical: spacing.sm,
  },
  earningsLabel: {
    fontSize: typography.sizes.md,
    color: colors.textWhite,
    opacity: 0.9,
  },
  detailsCard: {
    marginBottom: spacing.md,
  },
  routeSection: {
    paddingVertical: spacing.sm,
  },
  routePoint: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  routeDotFrom: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.primary,
    marginTop: 4,
  },
  routeDotTo: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.success,
    marginTop: 4,
  },
  routeConnector: {
    width: 2,
    height: 40,
    backgroundColor: colors.border,
    marginLeft: 7,
    marginVertical: spacing.sm,
  },
  routeInfo: {
    marginLeft: spacing.md,
    flex: 1,
  },
  routeLabel: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    marginBottom: spacing.xs - 2,
  },
  routeCity: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.text,
    marginBottom: spacing.xs - 2,
  },
  routeAddress: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    lineHeight: 20,
  },
  timeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs - 2,
    backgroundColor: colors.backgroundLight,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs - 2,
    borderRadius: borderRadius.md,
    alignSelf: 'flex-start',
  },
  timeText: {
    fontSize: typography.sizes.xs,
    color: colors.text,
    fontWeight: typography.weights.medium,
  },
  card: {
    marginBottom: spacing.md,
  },
  cardTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
    color: colors.text,
    marginBottom: spacing.md,
  },
  detailRow: {
    flexDirection: 'row',
    gap: spacing.lg,
    marginBottom: spacing.md,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    flex: 1,
  },
  detailLabel: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    color: colors.text,
  },
  customerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  customerAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primaryTransparent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  customerDetails: {
    flex: 1,
  },
  customerName: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    color: colors.text,
    marginBottom: spacing.xs - 2,
  },
  phoneButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs - 2,
  },
  phoneText: {
    fontSize: typography.sizes.sm,
    color: colors.primary,
    fontWeight: typography.weights.medium,
  },
  instructionsBox: {
    flexDirection: 'row',
    gap: spacing.sm,
    backgroundColor: colors.warningLight,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    borderLeftWidth: 4,
    borderLeftColor: colors.warning,
  },
  instructionsText: {
    flex: 1,
    fontSize: typography.sizes.sm,
    color: colors.text,
    lineHeight: 20,
  },
  bottomSpacer: {
    height: 100,
  },
  bottomActions: {
    flexDirection: 'row',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.backgroundCard,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    ...shadows.lg,
  },
  rejectBtn: {
    flex: 1,
    paddingVertical: spacing.md + 2,
    borderRadius: borderRadius.xl,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rejectBtnText: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    color: colors.textSecondary,
  },
  acceptBtn: {
    flex: 2,
  },
});

