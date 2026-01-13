import { Button } from '@/components/ui/Button';
import { borderRadius, colors, shadows, spacing, typography } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  Pressable,
  Animated as RNAnimated,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

type UserRole = 'BUSINESS' | 'DRIVER' | null;

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function RoleSelectionScreen() {
  const { setUserRole } = useAuth();
  const [selectedRole, setSelectedRole] = useState<UserRole>(null);
  const [loading, setLoading] = useState(false);

  const fadeAnim = useRef(new RNAnimated.Value(0)).current;
  const slideAnim = useRef(new RNAnimated.Value(50)).current;

  useEffect(() => {
    RNAnimated.parallel([
      RNAnimated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      RNAnimated.spring(slideAnim, {
        toValue: 0,
        tension: 20,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const handleContinue = async () => {
    if (!selectedRole) return;

    setLoading(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    try {
      // Save role to auth context
      await setUserRole(selectedRole);
      
      // Navigate to login page after role selection
      router.replace('/(auth)/login');
    } catch (error) {
      console.error('Role selection error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colors.primaryGradientStart, colors.primaryGradientEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 0.3 }}
        style={styles.headerGradient}
      >
        <View style={[styles.decorCircle, styles.decorCircle1]} />
        <View style={[styles.decorCircle, styles.decorCircle2]} />
      </LinearGradient>

      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <RNAnimated.View
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {/* Icon Section */}
          <View style={styles.iconSection}>
            <View style={styles.iconContainer}>
              <Ionicons name="people" size={60} color={colors.textWhite} />
            </View>
            <Text style={styles.title}>Choose Your Role</Text>
            <Text style={styles.subtitle}>
              Select how you want to use TruckFlow
            </Text>
          </View>

          {/* Role Cards */}
          <View style={styles.rolesContainer}>
            <RoleCard
              role="BUSINESS"
              icon="briefcase"
              title="Business/User"
              selected={selectedRole === 'BUSINESS'}
              onSelect={() => handleRoleSelect('BUSINESS')}
            />

            <RoleCard
              role="DRIVER"
              icon="car-sport"
              title="Truck Driver"
              selected={selectedRole === 'DRIVER'}
              onSelect={() => handleRoleSelect('DRIVER')}
            />
          </View>

          {/* Continue Button */}
          <Button
            title="Continue"
            variant="gradient"
            onPress={handleContinue}
            disabled={!selectedRole}
            loading={loading}
            icon="arrow-forward"
            iconPosition="right"
            fullWidth
            size="md"
            style={styles.continueButton}
          />
        </RNAnimated.View>
      </SafeAreaView>
    </View>
  );
}

interface RoleCardProps {
  role: 'BUSINESS' | 'DRIVER';
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  selected: boolean;
  onSelect: () => void;
}

function RoleCard({
  icon,
  title,
  selected,
  onSelect,
}: RoleCardProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.97);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  return (
    <AnimatedPressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onSelect}
      style={[animatedStyle]}
    >
      <View
        style={[
          styles.roleCard,
          selected && styles.roleCardSelected,
        ]}
      >
        {selected && (
          <View style={styles.selectedBadge}>
            <Ionicons name="checkmark-circle" size={24} color={colors.success} />
          </View>
        )}

        <LinearGradient
          colors={
            selected
              ? [colors.primaryTransparent, colors.primaryTransparentMedium]
              : [colors.backgroundCard, colors.backgroundCard]
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.cardGradient}
        >
          <View style={[
            styles.roleIconContainer,
            selected && styles.roleIconContainerSelected,
          ]}>
            <Ionicons 
              name={icon} 
              size={32} 
              color={selected ? colors.primary : colors.textSecondary} 
            />
          </View>

          <Text style={[styles.roleTitle, selected && styles.roleTitleSelected]}>
            {title}
          </Text>
        </LinearGradient>
      </View>
    </AnimatedPressable>
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
    height: 300,
    overflow: 'hidden',
  },
  decorCircle: {
    position: 'absolute',
    borderRadius: 9999,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  decorCircle1: {
    width: width * 0.7,
    height: width * 0.7,
    top: -width * 0.3,
    right: -width * 0.2,
  },
  decorCircle2: {
    width: width * 0.5,
    height: width * 0.5,
    top: 80,
    left: -width * 0.25,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
  },
  iconSection: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  title: {
    fontSize: typography.sizes['2xl'],
    fontWeight: typography.weights.bold,
    color: colors.textWhite,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: typography.sizes.md,
    color: colors.textWhite,
    opacity: 0.9,
    textAlign: 'center',
  },
  rolesContainer: {
    flex: 1,
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  roleCard: {
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: colors.border,
    ...shadows.md,
  },
  roleCardSelected: {
    borderColor: colors.primary,
    borderWidth: 2,
    ...shadows.lg,
  },
  selectedBadge: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    zIndex: 10,
  },
  cardGradient: {
    padding: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 140,
  },
  roleIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.backgroundLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  roleIconContainerSelected: {
    backgroundColor: colors.primaryTransparent,
  },
  roleTitle: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.text,
    textAlign: 'center',
  },
  roleTitleSelected: {
    color: colors.primary,
  },
  continueButton: {
    marginBottom: spacing.xl,
  },
});

