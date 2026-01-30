import { colors, shadows, spacing, typography } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface BusinessHeaderProps {
  title: string;
  showBack?: boolean;
  showGreeting?: boolean;
  userName?: string;
  notificationCount?: number;
  onNotificationPress?: () => void;
  onSearchPress?: () => void;
  onHelpPress?: () => void;
}

export const BusinessHeader: React.FC<BusinessHeaderProps> = ({
  title,
  showBack = false,
  showGreeting = false,
  userName = '',
  notificationCount = 0,
  onNotificationPress,
  onSearchPress,
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

  const handleSearch = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (onSearchPress) {
      onSearchPress();
    } else {
      // TODO: Navigate to search screen
      console.log('Search pressed');
    }
  };

  const handleHelp = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (onHelpPress) {
      onHelpPress();
    } else {
      router.push('/(tabs)/support');
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
                <Ionicons name="arrow-back" size={20} color={colors.textWhite} />
              </TouchableOpacity>
            ) : (
              <View style={styles.logo}>
                <Ionicons name="cube" size={20} color={colors.textWhite} />
              </View>
            )}
            <View style={styles.titleBlock}>
              {showGreeting ? (
                <>
                  <Text style={styles.greetingLabel} numberOfLines={1}>Welcome back</Text>
                  <Text style={styles.greetingName} numberOfLines={1}>{userName || 'User'}</Text>
                </>
              ) : (
                <Text style={styles.headerTitle} numberOfLines={1}>{title}</Text>
              )}
            </View>
          </View>

          {/* Right Section - Actions */}
          <View style={styles.rightSection}>
            {onSearchPress !== undefined && (
              <TouchableOpacity
                style={styles.iconButton}
                onPress={handleSearch}
                activeOpacity={0.7}
              >
                <Ionicons name="search" size={18} color={colors.textWhite} />
              </TouchableOpacity>
            )}
            
            <TouchableOpacity
              style={styles.iconButton}
              onPress={handleNotification}
              activeOpacity={0.7}
            >
              <Ionicons name="notifications-outline" size={18} color={colors.textWhite} />
              {notificationCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>
                    {notificationCount > 9 ? '9+' : notificationCount}
                  </Text>
                </View>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.iconButton}
              onPress={handleHelp}
              activeOpacity={0.7}
            >
              <Ionicons name="help-circle-outline" size={18} color={colors.textWhite} />
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
    paddingHorizontal: spacing.md,
    width: '100%',
    minHeight: 44,
  },
  leftSection: {
    flex: 1,
    minWidth: 0,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleBlock: {
    flex: 1,
    minWidth: 0,
    marginLeft: spacing.sm,
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
    color: colors.textWhite,
  },
  greetingLabel: {
    fontSize: typography.sizes.xs,
    color: colors.textWhite,
    opacity: 0.9,
  },
  greetingName: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.textWhite,
    marginTop: 2,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: spacing.xs,
    flexShrink: 0,
  },
  iconButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: 2,
    right: 2,
    minWidth: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: colors.error,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: colors.primaryGradientStart,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: typography.weights.bold,
    color: colors.textWhite,
  },
});

