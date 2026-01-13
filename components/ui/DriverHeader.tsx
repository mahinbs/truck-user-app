import { colors, shadows, spacing, typography } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface DriverHeaderProps {
  title: string;
  showBack?: boolean;
  notificationCount?: number;
  onNotificationPress?: () => void;
  onSOSPress?: () => void;
  onHelpPress?: () => void;
}

export const DriverHeader: React.FC<DriverHeaderProps> = ({
  title,
  showBack = false,
  notificationCount = 0,
  onNotificationPress,
  onSOSPress,
  onHelpPress,
}) => {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (router.canGoBack()) {
      router.back();
    }
  };

  const handleNotification = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (onNotificationPress) {
      onNotificationPress();
    } else {
      // TODO: Navigate to notifications screen
      console.log('Notifications pressed');
    }
  };

  const handleSOS = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    if (onSOSPress) {
      onSOSPress();
    } else {
      router.push('/(driver)/support');
    }
  };

  const handleHelp = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (onHelpPress) {
      onHelpPress();
    } else {
      router.push('/(driver)/support');
    }
  };

  return (
    <LinearGradient
      colors={[colors.primaryGradientStart, colors.primaryGradientEnd]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradient}
    >
      <View style={[styles.container]}>
        <View style={styles.content}>
          {/* Left Section - Logo */}
          <View style={styles.leftSection}>
            {showBack ? (
              <TouchableOpacity
                style={styles.backButton}
                onPress={handleBack}
                activeOpacity={0.7}
              >
                <Ionicons name="arrow-back" size={24} color={colors.textWhite} />
              </TouchableOpacity>
            ) : (
              <View style={styles.logoContainer}>
                <View style={styles.logo}>
                  <Ionicons name="car-sport" size={28} color={colors.textWhite} />
                </View>
                <Text style={styles.logoText}>Driver</Text>
              </View>
            )}
          </View>

          {/* Right Section - Actions */}
          <View style={styles.rightSection}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={handleNotification}
              activeOpacity={0.7}
            >
              <Ionicons name="notifications-outline" size={22} color={colors.textWhite} />
              {notificationCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>
                    {notificationCount > 9 ? '9+' : notificationCount}
                  </Text>
                </View>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.iconButton, styles.sosButton]}
              onPress={handleSOS}
              activeOpacity={0.7}
            >
              <Ionicons name="alert-circle" size={22} color={colors.textWhite} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.iconButton}
              onPress={handleHelp}
              activeOpacity={0.7}
            >
              <Ionicons name="help-circle-outline" size={22} color={colors.textWhite} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    ...shadows.md,
  },
  container: {
      paddingBottom: spacing.md,
      justifyContent: 'center',
      alignItems: 'center',
      paddingTop: spacing.md,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    width: '100%',
  },
  leftSection: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.textWhite,
    letterSpacing: 0.5,
  },
  rightSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: spacing.md,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  sosButton: {
    backgroundColor: 'rgba(239, 68, 68, 0.3)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  badge: {
    position: 'absolute',
    top: 4,
    right: 4,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.error,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: colors.primaryGradientStart,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: typography.weights.bold,
    color: colors.textWhite,
  },
});

