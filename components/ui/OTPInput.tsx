import React, { useRef, useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { colors, spacing, borderRadius, typography, shadows } from '@/constants/theme';

interface OTPInputProps {
  length?: number;
  value: string;
  onChange: (otp: string) => void;
  error?: boolean;
}

export const OTPInput: React.FC<OTPInputProps> = ({
  length = 6,
  value,
  onChange,
  error = false,
}) => {
  const inputRef = useRef<TextInput>(null);
  const [isFocused, setIsFocused] = useState(false);
  const shakeAnim = useSharedValue(0);

  useEffect(() => {
    if (error) {
      shakeAnim.value = withSequence(
        withSpring(-10, { damping: 10 }),
        withSpring(10, { damping: 10 }),
        withSpring(-10, { damping: 10 }),
        withSpring(0, { damping: 10 })
      );
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  }, [error]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeAnim.value }],
  }));

  const handlePress = () => {
    inputRef.current?.focus();
  };

  const renderDigits = () => {
    const digits = [];
    for (let i = 0; i < length; i++) {
      const digit = value[i] || '';
      const isFilled = digit !== '';
      const isActive = isFocused && i === value.length;

      digits.push(
        <View
          key={i}
          style={[
            styles.digitContainer,
            isActive && styles.digitContainerActive,
            error && styles.digitContainerError,
          ]}
        >
          <Animated.Text
            style={[
              styles.digit,
              isFilled && styles.digitFilled,
              error && styles.digitError,
            ]}
          >
            {digit}
          </Animated.Text>
        </View>
      );
    }
    return digits;
  };

  return (
    <Pressable onPress={handlePress} style={styles.container}>
      <Animated.View style={[styles.digitsRow, animatedStyle]}>
        {renderDigits()}
      </Animated.View>
      <TextInput
        ref={inputRef}
        value={value}
        onChangeText={(text) => {
          const filteredText = text.replace(/[^0-9]/g, '').slice(0, length);
          onChange(filteredText);
          if (filteredText.length > 0) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }
        }}
        keyboardType="number-pad"
        maxLength={length}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        style={styles.hiddenInput}
        autoComplete="sms-otp"
        textContentType="oneTimeCode"
      />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  digitsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  digitContainer: {
    flex: 1,
    aspectRatio: 1,
    maxWidth: 56,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.backgroundCard,
    borderWidth: 2,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.sm,
  },
  digitContainerActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryTransparent,
  },
  digitContainerError: {
    borderColor: colors.error,
    backgroundColor: colors.errorLight,
  },
  digit: {
    fontSize: typography.sizes['2xl'],
    fontWeight: typography.weights.bold,
    color: colors.textSecondary,
  },
  digitFilled: {
    color: colors.text,
  },
  digitError: {
    color: colors.error,
  },
  hiddenInput: {
    position: 'absolute',
    width: 1,
    height: 1,
    opacity: 0,
  },
});

