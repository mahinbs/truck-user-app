import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity, Animated as RNAnimated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '@/components/ui/Button';
import { OTPInput } from '@/components/ui/OTPInput';
import { colors, spacing, typography, borderRadius } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

export default function VerifyOTPScreen() {
  const { phone, type } = useLocalSearchParams<{ phone: string; type: string }>();
  const { login, user } = useAuth();
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const [error, setError] = useState(false);
  
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

  useEffect(() => {
    const timer = setInterval(() => {
      setResendTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleVerify = async () => {
    if (otp.length !== 6) return;
    
    setLoading(true);
    setError(false);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate error for demo (remove in production)
      if (otp !== '123456') {
        setError(true);
        setLoading(false);
        return;
      }
      
      // If signup, navigate to role selection
      if (type === 'signup') {
        // Save temporary user data (without role yet)
        await login('temp_token', {
          id: 'temp_' + Date.now(),
          name: '',
          email: '',
          phone: phone || '',
          role: null,
        });
        router.replace('/(auth)/role-selection');
      } else {
        // For login, use the role that was saved in role-selection
        // Check both user state and AsyncStorage for the role
        let userRole = user?.role;
        
        // If role not in user state, check AsyncStorage
        if (!userRole) {
          const savedRole = await AsyncStorage.getItem('@truckflow_role');
          userRole = savedRole as 'BUSINESS' | 'DRIVER' | null;
        }
        
        // If still no role, default to BUSINESS (shouldn't happen in normal flow)
        if (!userRole) {
          userRole = 'BUSINESS';
        }
        
        await login('auth_token_' + Date.now(), {
          id: 'user_' + Date.now(),
          name: user?.name || 'User Name',
          email: user?.email || 'user@example.com',
          phone: phone || '',
          role: userRole as 'BUSINESS' | 'DRIVER',
        });
        
        // Navigate based on role
        if (userRole === 'BUSINESS') {
          router.replace('/(tabs)/dashboard');
        } else if (userRole === 'DRIVER') {
          router.replace('/(driver)/home');
        } else {
          // No role selected, go to role selection
          router.replace('/(auth)/role-selection');
        }
      }
    } catch (error) {
      console.error('Verify error:', error);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = () => {
    if (resendTimer === 0) {
      setResendTimer(60);
      setOtp('');
      setError(false);
      // Resend OTP logic here
    }
  };

  const isOtpComplete = otp.length === 6;

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
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.textWhite} />
        </TouchableOpacity>

        <KeyboardAvoidingView
          style={styles.keyboardView}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Icon Section */}
            <RNAnimated.View 
              style={[
                styles.iconSection,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                },
              ]}
            >
              <View style={styles.iconContainer}>
                <Ionicons name="mail-open" size={60} color={colors.textWhite} />
              </View>
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
              <Text style={styles.title}>Verify Your Number</Text>
              <Text style={styles.subtitle}>
                We've sent a 6-digit code to{'\n'}
                <Text style={styles.phoneNumber}>{phone}</Text>
              </Text>

              <View style={styles.otpContainer}>
                <OTPInput
                  value={otp}
                  onChange={(value) => {
                    setOtp(value);
                    setError(false);
                  }}
                  error={error}
                />
              </View>

              {error && (
                <Text style={styles.errorText}>
                  Invalid code. Please try again.
                </Text>
              )}

              <Button
                title="Verify & Continue"
                onPress={handleVerify}
                loading={loading}
                disabled={!isOtpComplete}
                variant="gradient"
                size="md"
                icon="checkmark-circle"
                iconPosition="right"
                fullWidth
                style={styles.button}
              />

              <View style={styles.resendContainer}>
                <Text style={styles.resendText}>Didn't receive the code? </Text>
                {resendTimer > 0 ? (
                  <Text style={styles.timerText}>Resend in {resendTimer}s</Text>
                ) : (
                  <TouchableOpacity onPress={handleResend}>
                    <Text style={styles.resendLink}>Resend Code</Text>
                  </TouchableOpacity>
                )}
              </View>
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
    height: 350,
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
    top: 100,
    left: -width * 0.25,
  },
  safeArea: {
    flex: 1,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: spacing.md,
    marginTop: spacing.sm,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
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
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: typography.sizes.md,
    color: colors.textSecondary,
    marginBottom: spacing.xl,
    textAlign: 'center',
    lineHeight: 22,
  },
  phoneNumber: {
    fontWeight: typography.weights.semibold,
    color: colors.primary,
  },
  otpContainer: {
    marginBottom: spacing.lg,
  },
  errorText: {
    fontSize: typography.sizes.sm,
    color: colors.error,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  button: {
    marginBottom: spacing.md,
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.md,
  },
  resendText: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
  },
  timerText: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    fontWeight: typography.weights.medium,
  },
  resendLink: {
    fontSize: typography.sizes.sm,
    color: colors.primary,
    fontWeight: typography.weights.semibold,
  },
});

