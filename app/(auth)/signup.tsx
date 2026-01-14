import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { colors, spacing, typography } from '@/constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SignupScreen() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    companyName: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Phone number must be 10 digits';
    }

    if (!formData.companyName.trim()) {
      newErrors.companyName = 'Company/Business name is required';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async () => {
    if (!validateForm()) return;

    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      // Navigate to OTP verification
      router.push({
        pathname: '/(auth)/verify-otp',
        params: { phone: formData.phone, type: 'signup' },
      });
    }, 1500);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>
              Sign up to start booking truck services
            </Text>
          </View>

          <View style={styles.form}>
            <Input
              label="Full Name"
              placeholder="Enter your full name"
              value={formData.fullName}
              onChangeText={(text) =>
                setFormData({ ...formData, fullName: text })
              }
              error={errors.fullName}
              icon="person"
              autoCapitalize="words"
            />

            <Input
              label="Email Address"
              placeholder="your.email@example.com"
              value={formData.email}
              onChangeText={(text) =>
                setFormData({ ...formData, email: text })
              }
              error={errors.email}
              icon="mail"
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Input
              label="Phone Number"
              placeholder="1234567890"
              value={formData.phone}
              onChangeText={(text) =>
                setFormData({ ...formData, phone: text })
              }
              error={errors.phone}
              icon="call"
              keyboardType="phone-pad"
            />

            <Input
              label="Company/Business Name"
              placeholder="Enter your company name"
              value={formData.companyName}
              onChangeText={(text) =>
                setFormData({ ...formData, companyName: text })
              }
              error={errors.companyName}
              icon="business"
              autoCapitalize="words"
            />

            <Input
              label="Password"
              placeholder="Create a strong password"
              value={formData.password}
              onChangeText={(text) =>
                setFormData({ ...formData, password: text })
              }
              error={errors.password}
              icon="lock-closed"
              secureTextEntry
              showPasswordToggle
            />

            <Input
              label="Confirm Password"
              placeholder="Re-enter your password"
              value={formData.confirmPassword}
              onChangeText={(text) =>
                setFormData({ ...formData, confirmPassword: text })
              }
              error={errors.confirmPassword}
              icon="lock-closed"
              secureTextEntry
              showPasswordToggle
            />
          </View>

          <Button
            title="Create Account"
            onPress={handleSignup}
            loading={loading}
            variant="gradient"
            icon="arrow-forward"
            iconPosition="right"
            fullWidth
            size="md"
            style={styles.signupButton}
          />

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <Button
              title="Sign In"
              onPress={() => router.push('/(auth)/login')}
              variant="ghost"
              size="sm"
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
  },
  header: {
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: typography.sizes['3xl'],
    fontWeight: typography.weights.bold,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: typography.sizes.md,
    color: colors.textSecondary,
    lineHeight: 24,
  },
  form: {
    marginBottom: spacing.lg,
  },
  signupButton: {
    marginBottom: spacing.md,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.md,
  },
  footerText: {
    fontSize: typography.sizes.md,
    color: colors.textSecondary,
  },
});

