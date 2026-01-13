import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated as RNAnimated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';

const { width, height } = Dimensions.get('window');

export default function SplashScreen() {
  const router = useRouter();
  const { isAuthenticated, user, isLoading } = useAuth();
  const fadeAnim = useRef(new RNAnimated.Value(0)).current;
  const scaleAnim = useRef(new RNAnimated.Value(0.8)).current;
  const logoRotate = useRef(new RNAnimated.Value(0)).current;

  useEffect(() => {
    // Logo animation
    RNAnimated.parallel([
      RNAnimated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      RNAnimated.spring(scaleAnim, {
        toValue: 1,
        tension: 20,
        friction: 7,
        useNativeDriver: true,
      }),
      RNAnimated.timing(logoRotate, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();

    // Check auth and navigate
    const checkAuth = async () => {
      // Wait for auth to initialize
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      if (!isLoading) {
        if (isAuthenticated && user?.role) {
          // Navigate to appropriate dashboard based on role
          if (user.role === 'BUSINESS') {
            router.replace('/(tabs)/dashboard');
          } else if (user.role === 'DRIVER') {
            router.replace('/(driver)/home');
          } else {
            // User logged in but no role selected
            router.replace('/(auth)/role-selection');
          }
        } else {
          // No token, go to login
          router.replace('/(auth)/login');
        }
      }
    };

    checkAuth();
  }, [isAuthenticated, user, isLoading]);

  const rotateInterpolate = logoRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <LinearGradient
      colors={[colors.primaryGradientStart, colors.primaryGradientEnd]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      {/* Animated circles in background */}
      <View style={styles.circlesContainer}>
        <View style={[styles.circle, styles.circle1]} />
        <View style={[styles.circle, styles.circle2]} />
        <View style={[styles.circle, styles.circle3]} />
      </View>

      {/* Logo and text */}
      <RNAnimated.View 
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [
              { scale: scaleAnim },
            ],
          },
        ]}
      >
        <RNAnimated.View 
          style={[
            styles.logoContainer,
            {
              transform: [{ rotate: rotateInterpolate }],
            },
          ]}
        >
          <Ionicons name="car-sport" size={80} color={colors.textWhite} />
        </RNAnimated.View>

        <Text style={styles.appName}>TruckFlow</Text>
        <Text style={styles.tagline}>Your Trusted Logistics Partner</Text>

        {/* Loading indicator */}
        <View style={styles.loadingContainer}>
          <View style={styles.loadingBar}>
            <RNAnimated.View 
              style={[
                styles.loadingProgress,
                {
                  opacity: fadeAnim,
                },
              ]}
            />
          </View>
        </View>
      </RNAnimated.View>

      {/* Version info */}
      <Text style={styles.version}>Version 1.0.0</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circlesContainer: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  circle: {
    position: 'absolute',
    borderRadius: 9999,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  circle1: {
    width: width * 1.5,
    height: width * 1.5,
    top: -width * 0.75,
    right: -width * 0.5,
  },
  circle2: {
    width: width * 1.2,
    height: width * 1.2,
    bottom: -width * 0.6,
    left: -width * 0.4,
  },
  circle3: {
    width: width * 0.8,
    height: width * 0.8,
    top: height * 0.6,
    right: -width * 0.3,
  },
  content: {
    alignItems: 'center',
    zIndex: 1,
  },
  logoContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  appName: {
    fontSize: typography.sizes['4xl'],
    fontWeight: typography.weights.bold,
    color: colors.textWhite,
    marginBottom: spacing.sm,
  },
  tagline: {
    fontSize: typography.sizes.md,
    color: colors.textWhite,
    opacity: 0.9,
    marginBottom: spacing.xxl,
  },
  loadingContainer: {
    width: 200,
    marginTop: spacing.xl,
  },
  loadingBar: {
    width: '100%',
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  loadingProgress: {
    width: '60%',
    height: '100%',
    backgroundColor: colors.textWhite,
    borderRadius: 2,
  },
  version: {
    position: 'absolute',
    bottom: spacing.xl,
    fontSize: typography.sizes.sm,
    color: colors.textWhite,
    opacity: 0.7,
  },
});

