import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { colors, spacing, typography, borderRadius, shadows } from '@/constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';

// Mock recent tracking IDs
const recentTrackingIds = [
  'TRK2024001',
  'TRK2024002',
  'TRK2024003',
  'TRK2024004',
];

export default function TrackScreen() {
  const [trackingId, setTrackingId] = useState('');
  const [searching, setSearching] = useState(false);

  const handleTrack = () => {
    if (!trackingId.trim()) {
      Alert.alert('Error', 'Please enter a tracking ID');
      return;
    }

    setSearching(true);
    // Simulate API call
    setTimeout(() => {
      setSearching(false);
      // Navigate to trip details
      router.push(`/(tabs)/trip/${trackingId}`);
    }, 1000);
  };

  const handleRecentTracking = (id: string) => {
    setTrackingId(id);
    router.push(`/(tabs)/trip/${id}`);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Track Shipment</Text>
        </View>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.heroIcon}>
            <Ionicons name="search" size={64} color={colors.primary} />
          </View>
          <Text style={styles.heroTitle}>Track Your Shipment</Text>
          <Text style={styles.heroSubtitle}>
            Enter your tracking ID to get real-time updates
          </Text>
        </View>

        {/* Search Card */}
        <Card style={styles.searchCard}>
          <Input
            label="Tracking ID"
            placeholder="Enter tracking ID (e.g., TRK2024001)"
            value={trackingId}
            onChangeText={setTrackingId}
            icon="barcode"
            autoCapitalize="characters"
            containerStyle={styles.trackingInput}
          />

          <Button
            title="Track Now"
            onPress={handleTrack}
            loading={searching}
            icon="navigate"
            iconPosition="right"
            fullWidth
            size="lg"
          />

          <View style={styles.orDivider}>
            <View style={styles.dividerLine} />
            <Text style={styles.orText}>OR</Text>
            <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity
            style={styles.scanButton}
            onPress={() => Alert.alert('Scan QR', 'QR code scanning will be implemented')}
          >
            <Ionicons name="qr-code" size={24} color={colors.primary} />
            <Text style={styles.scanButtonText}>Scan QR Code</Text>
          </TouchableOpacity>
        </Card>

        {/* Recent Tracking */}
        {recentTrackingIds.length > 0 && (
          <View style={styles.recentSection}>
            <Text style={styles.sectionTitle}>Recent Tracking</Text>
            {recentTrackingIds.map((id) => (
              <Card
                key={id}
                style={styles.recentCard}
                onPress={() => handleRecentTracking(id)}
              >
                <View style={styles.recentCardContent}>
                  <View style={styles.recentIcon}>
                    <Ionicons name="time" size={20} color={colors.primary} />
                  </View>
                  <View style={styles.recentInfo}>
                    <Text style={styles.recentId}>{id}</Text>
                    <Text style={styles.recentDate}>Last tracked: Today</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
                </View>
              </Card>
            ))}
          </View>
        )}

        {/* Help Section */}
        <Card style={styles.helpCard}>
          <View style={styles.helpHeader}>
            <Ionicons name="help-circle" size={24} color={colors.primary} />
            <Text style={styles.helpTitle}>Need Help?</Text>
          </View>
          <Text style={styles.helpText}>
            Can't find your tracking ID? Check your email or SMS for the tracking
            number sent after booking.
          </Text>
          <Button
            title="Contact Support"
            onPress={() => router.push('/(tabs)/support')}
            variant="outline"
            icon="headset"
            fullWidth
            style={styles.helpButton}
          />
        </Card>

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
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: spacing.xl,
    marginTop: spacing.md,
  },
  heroIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: `${colors.primary}15`,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  heroTitle: {
    fontSize: typography.sizes['2xl'],
    fontWeight: typography.weights.bold,
    color: colors.text,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: typography.sizes.md,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  searchCard: {
    marginBottom: spacing.lg,
  },
  trackingInput: {
    marginBottom: spacing.md,
  },
  orDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  orText: {
    marginHorizontal: spacing.md,
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    fontWeight: typography.weights.medium,
  },
  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    borderColor: colors.primary,
    borderStyle: 'dashed',
    gap: spacing.sm,
  },
  scanButtonText: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    color: colors.primary,
  },
  recentSection: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.text,
    marginBottom: spacing.md,
  },
  recentCard: {
    marginBottom: spacing.md,
  },
  recentCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recentIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${colors.primary}15`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  recentInfo: {
    flex: 1,
  },
  recentId: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    color: colors.text,
    marginBottom: 2,
  },
  recentDate: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
  },
  helpCard: {
    backgroundColor: `${colors.primary}08`,
    borderWidth: 1,
    borderColor: `${colors.primary}30`,
  },
  helpHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  helpTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.text,
  },
  helpText: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: spacing.md,
  },
  helpButton: {
    marginTop: spacing.sm,
  },
  bottomSpacer: {
    height: spacing.xl,
  },
});

