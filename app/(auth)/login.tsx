import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { borderRadius, colors, spacing, typography } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, KeyboardAvoidingView, Platform, Animated as RNAnimated, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function LoginScreen() {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
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

  const handleLogin = () => {
    if (!phone.trim()) {
      setError('Phone number is required');
      return;
    }

    if (!/^\d{10}$/.test(phone.replace(/\D/g, ''))) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }

    setError('');
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      router.push({
        pathname: '/(auth)/verify-otp',
        params: { phone, type: 'login' },
      });
    }, 1000);
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colors.primaryGradientStart, colors.primaryGradientEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 0.3 }}
        style={styles.headerGradient}
      >
        {/* Decorative circles */}
        <View style={[styles.decorCircle, styles.decorCircle1]} />
        <View style={[styles.decorCircle, styles.decorCircle2]} />
      </LinearGradient>

      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <KeyboardAvoidingView
          style={styles.keyboardView}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Logo Section */}
            <RNAnimated.View 
              style={[
                styles.logoSection,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                },
              ]}
            >
              <View style={styles.logoContainer}>
                <Ionicons name="car-sport" size={60} color={colors.textWhite} />
              </View>
              <Text style={styles.logoText}>TruckFlow</Text>
              <Text style={styles.tagline}>Your Trusted Logistics Partner</Text>
            </RNAnimated.View>

            {/* Form Card */}
            <RNAnimated.View 
              style={[
                styles.formCard,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                },
              ]}
            >
              <Text style={styles.title}>Welcome Back</Text>
              <Text style={styles.subtitle}>
                Sign in to manage your shipments
              </Text>

              <View style={styles.inputContainer}>
                <Input
                  label="Phone Number"
                  placeholder="Enter your phone number"
                  value={phone}
                  onChangeText={(text) => {
                    setPhone(text);
                    setError('');
                  }}
                  keyboardType="phone-pad"
                  icon="call"
                  error={error}
                />
              </View>

              <Button
                title="Sign In"
                onPress={handleLogin}
                loading={loading}
                disabled={!phone}
                variant="gradient"
                size="md"
                icon="arrow-forward"
                iconPosition="right"
                fullWidth
              />

              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>or</Text>
                <View style={styles.dividerLine} />
              </View>

              <Button
                title="Create New Account"
                onPress={() => router.push('/(auth)/signup')}
                variant="outline"
                icon="person-add"
                fullWidth
              />
            </RNAnimated.View>
          </ScrollView>
        </KeyboardAvoidingView>
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
    height: 400,
    overflow: 'hidden',
  },
  decorCircle: {
    position: 'absolute',
    borderRadius: 9999,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  decorCircle1: {
    width: width * 0.8,
    height: width * 0.8,
    top: -width * 0.4,
    right: -width * 0.2,
  },
  decorCircle2: {
    width: width * 0.6,
    height: width * 0.6,
    top: 150,
    left: -width * 0.3,
  },
  safeArea: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxl,
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: spacing.xl,
    marginTop: spacing.lg,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  logoText: {
    fontSize: typography.sizes['3xl'],
    fontWeight: typography.weights.bold,
    color: colors.textWhite,
    marginBottom: spacing.xs,
  },
  tagline: {
    fontSize: typography.sizes.md,
    color: colors.textWhite,
    opacity: 0.9,
  },
  formCard: {
    backgroundColor: colors.backgroundCard,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  title: {
    fontSize: typography.sizes['2xl'],
    fontWeight: typography.weights.bold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: typography.sizes.md,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
    lineHeight: 22,
  },
  inputContainer: {
    marginBottom: spacing.md,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.xl,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    marginHorizontal: spacing.md,
    color: colors.textSecondary,
    fontSize: typography.sizes.sm,
  },
});

