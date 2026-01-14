import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Divider } from '@/components/ui/Divider';
import { borderRadius, colors, shadows, spacing, typography } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Dimensions,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function ProfileScreen() {
  const { logout } = useAuth();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);

  // Mock user data
  const userData = {
    name: 'Rajesh Sharma',
    email: 'rajesh.sharma@company.com',
    phone: '+91 98765 43210',
    company: 'ABC Trading Pvt Ltd',
    gst: '22AAAAA0000A1Z5',
    memberSince: 'Jan 2024',
    verified: true,
  };

  const stats = {
    totalShipments: 23,
    activeShipments: 5,
    totalSpent: 45200,
    rating: 4.8,
  };

  const handleLogout = async () => {
    if (Platform.OS === 'web') {
      // Use window.confirm for web
      const confirmed = window.confirm('Are you sure you want to logout?');
      if (confirmed) {
        try {
          await logout();
          router.replace('/(auth)/role-selection');
        } catch (error) {
          console.error('Logout error:', error);
          window.alert('Failed to logout. Please try again.');
        }
      }
    } else {
      // Use Alert.alert for native platforms
      Alert.alert(
        'Logout',
        'Are you sure you want to logout?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Logout',
            style: 'destructive',
            onPress: async () => {
              try {
                await logout();
                router.replace('/(auth)/role-selection');
              } catch (error) {
                console.error('Logout error:', error);
                Alert.alert('Error', 'Failed to logout. Please try again.');
              }
            },
          },
        ]
      );
    }
  };

  const handleEditProfile = () => {
    Alert.alert('Edit Profile', 'Profile editing feature will be implemented');
  };

  const MenuItem = ({
    icon,
    title,
    subtitle,
    onPress,
    badge,
    rightElement,
  }: {
    icon: keyof typeof Ionicons.glyphMap;
    title: string;
    subtitle?: string;
    onPress?: () => void;
    badge?: string;
    rightElement?: React.ReactNode;
  }) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View style={styles.menuIconContainer}>
        <Ionicons name={icon} size={22} color={colors.primary} />
      </View>
      <View style={styles.menuContent}>
        <View style={styles.menuTitleRow}>
          <Text style={styles.menuTitle}>{title}</Text>
          {badge && <Badge label={badge} variant="error" />}
        </View>
        {subtitle && <Text style={styles.menuSubtitle}>{subtitle}</Text>}
      </View>
      {rightElement || (
        <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
      )}
    </TouchableOpacity>
  );

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
          <Text style={styles.headerTitle}>My Profile</Text>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Profile Card */}
          <Card style={styles.profileCard}>
            <View style={styles.profileHeader}>
              <View style={styles.avatarContainer}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>
                    {userData.name.split(' ').map((n) => n[0]).join('')}
                  </Text>
                </View>
                {userData.verified && (
                  <View style={styles.verifiedBadge}>
                    <Ionicons name="checkmark-circle" size={24} color={colors.success} />
                  </View>
                )}
              </View>

              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>{userData.name}</Text>
                <Text style={styles.profileEmail}>{userData.email}</Text>
                <Text style={styles.memberSince}>
                  Member since {userData.memberSince}
                </Text>
              </View>

              <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
                <Ionicons name="create" size={20} color={colors.primary} />
              </TouchableOpacity>
            </View>
          </Card>

          {/* Business Details */}
          <Card style={styles.section}>
            <Text style={styles.sectionTitle}>Business Information</Text>

            <View style={styles.detailRow}>
              <Ionicons name="business" size={18} color={colors.textSecondary} />
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Company Name</Text>
                <Text style={styles.detailValue}>{userData.company}</Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <Ionicons name="document-text" size={18} color={colors.textSecondary} />
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>GST Number</Text>
                <Text style={styles.detailValue}>{userData.gst}</Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <Ionicons name="call" size={18} color={colors.textSecondary} />
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Phone Number</Text>
                <Text style={styles.detailValue}>{userData.phone}</Text>
              </View>
            </View>
          </Card>

          {/* Account Management */}
          <Card style={styles.section}>
            <Text style={styles.sectionTitle}>Account Management</Text>

            <MenuItem
              icon="wallet"
              title="Payment Methods"
              subtitle="Manage your payment options"
              onPress={() => Alert.alert('Payment Methods', 'Coming soon')}
            />

            <MenuItem
              icon="location"
              title="Saved Addresses"
              subtitle="Manage pickup & delivery locations"
              onPress={() => Alert.alert('Saved Addresses', 'Coming soon')}
            />

            <MenuItem
              icon="document"
              title="Documents"
              subtitle="GST, PAN, and other documents"
              onPress={() => Alert.alert('Documents', 'Coming soon')}
            />

            <MenuItem
              icon="shield-checkmark"
              title="KYC Verification"
              subtitle="Verified business account"
              rightElement={<Badge label="Verified" variant="success" />}
            />
          </Card>

          {/* Notifications */}
          <Card style={styles.section}>
            <Text style={styles.sectionTitle}>Notifications</Text>

            <MenuItem
              icon="notifications"
              title="Push Notifications"
              subtitle="Receive updates about your shipments"
              rightElement={
                <Switch
                  value={notificationsEnabled}
                  onValueChange={setNotificationsEnabled}
                  trackColor={{ false: colors.border, true: colors.primary }}
                  thumbColor={colors.backgroundCard}
                />
              }
            />

            <MenuItem
              icon="mail"
              title="Email Notifications"
              subtitle="Get shipment updates via email"
              rightElement={
                <Switch
                  value={emailNotifications}
                  onValueChange={setEmailNotifications}
                  trackColor={{ false: colors.border, true: colors.primary }}
                  thumbColor={colors.backgroundCard}
                />
              }
            />

            <MenuItem
              icon="chatbubbles"
              title="SMS Notifications"
              subtitle="Receive SMS for important updates"
              rightElement={
                <Switch
                  value={smsNotifications}
                  onValueChange={setSmsNotifications}
                  trackColor={{ false: colors.border, true: colors.primary }}
                  thumbColor={colors.backgroundCard}
                />
              }
            />
          </Card>

          {/* Support */}
          <Card style={styles.section}>
            <Text style={styles.sectionTitle}>Support & Information</Text>

            <MenuItem
              icon="help-circle"
              title="Help Center"
              subtitle="FAQs and support"
              onPress={() => Alert.alert('Help Center', 'Coming soon')}
            />

            <MenuItem
              icon="chatbox"
              title="Contact Support"
              subtitle="Get help from our team"
              onPress={() => Alert.alert('Contact Support', 'Coming soon')}
            />

            <MenuItem
              icon="document-text"
              title="Terms & Conditions"
              onPress={() => Alert.alert('Terms & Conditions', 'Coming soon')}
            />

            <MenuItem
              icon="shield"
              title="Privacy Policy"
              onPress={() => Alert.alert('Privacy Policy', 'Coming soon')}
            />

            <MenuItem
              icon="information-circle"
              title="About"
              subtitle="Version 1.0.0"
              onPress={() => Alert.alert('About', 'TruckFlow v1.0.0')}
            />
          </Card>

          {/* Logout Button */}
          <View style={styles.logoutContainer}>
            <Button
              title="Logout"
              onPress={handleLogout}
              variant="outline"
              icon="log-out"
              fullWidth
              style={styles.logoutButton}
            />
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
  profileCard: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: spacing.md,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: typography.sizes['3xl'],
    fontWeight: typography.weights.bold,
    color: colors.backgroundCard,
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: colors.backgroundCard,
    borderRadius: 12,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  profileEmail: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  memberSince: {
    fontSize: typography.sizes.xs,
    color: colors.textLight,
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${colors.primary}15`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.text,
    marginBottom: spacing.md,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  detailContent: {
    marginLeft: spacing.md,
    flex: 1,
  },
  detailLabel: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    color: colors.text,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${colors.primary}15`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  menuContent: {
    flex: 1,
  },
  menuTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  menuTitle: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
    color: colors.text,
  },
  menuSubtitle: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  logoutContainer: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  logoutButton: {
    borderColor: colors.error,
  },
  bottomSpacer: {
    height: 80,
  },
});
