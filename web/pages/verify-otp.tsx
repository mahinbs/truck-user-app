import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { FiMail, FiArrowLeft, FiCheckCircle } from 'react-icons/fi';
import { Button } from '../components/ui/Button';
import { SafeIcon } from '../components/ui/SafeIcon';
import { colors, spacing, typography, borderRadius, shadows } from '../constants/theme';

export default function VerifyOTPPage() {
  const router = useRouter();
  const { phone, type } = router.query;
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);

  useEffect(() => {
    const timer = setInterval(() => {
      setResendTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyPress = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleVerify = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (type === 'signup') {
        router.push('/kyc');
      } else {
        router.push('/dashboard');
      }
    }, 1000);
  };

  const isOtpComplete = otp.every((digit) => digit !== '');

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.background,
        padding: spacing.lg,
      }}
    >
      <div style={{ width: '100%', maxWidth: '400px' }}>
        <button
          onClick={() => router.back()}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            marginBottom: spacing.lg,
            padding: spacing.sm,
          }}
        >
          <SafeIcon Icon={FiArrowLeft} size={24} color={colors.text} />
        </button>

        <div style={{ textAlign: 'center', marginBottom: spacing.xl }}>
          <div
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '40px',
              backgroundColor: `${colors.primary}15`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto',
              marginBottom: spacing.lg,
            }}
          >
            <SafeIcon Icon={FiMail} size={48} color={colors.primary} />
          </div>

          <h1
            style={{
              fontSize: typography.sizes['2xl'],
              fontWeight: typography.weights.bold,
              color: colors.text,
              marginBottom: spacing.sm,
            }}
          >
            Verify Your Number
          </h1>
          <p
            style={{
              fontSize: typography.sizes.md,
              color: colors.textSecondary,
              marginBottom: spacing.xl,
              lineHeight: '22px',
            }}
          >
            We've sent a 6-digit code to
            <br />
            <span style={{ fontWeight: typography.weights.semibold, color: colors.primary }}>
              {phone}
            </span>
          </p>
        </div>

        <div
          style={{
            display: 'flex',
            gap: spacing.sm,
            marginBottom: spacing.xl,
            justifyContent: 'center',
          }}
        >
          {otp.map((digit, index) => (
            <input
              key={index}
              id={`otp-${index}`}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleOtpChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyPress(index, e)}
              style={{
                width: '60px',
                height: '60px',
                border: `2px solid ${digit ? colors.primary : colors.border}`,
                borderRadius: borderRadius.lg,
                textAlign: 'center',
                fontSize: typography.sizes['2xl'],
                fontWeight: typography.weights.bold,
                color: colors.text,
                backgroundColor: digit ? `${colors.primary}08` : colors.backgroundCard,
                boxShadow: shadows.sm,
              }}
            />
          ))}
        </div>

        <Button
          title="Verify & Continue"
          onClick={handleVerify}
          loading={loading}
          disabled={!isOtpComplete}
          icon="checkmark-circle"
          iconPosition="right"
          fullWidth
          style={{ marginBottom: spacing.lg }}
        />

        <div style={{ textAlign: 'center' }}>
          <span style={{ fontSize: typography.sizes.sm, color: colors.textSecondary }}>
            Didn't receive the code?{' '}
          </span>
          {resendTimer > 0 ? (
            <span style={{ fontSize: typography.sizes.sm, color: colors.textSecondary, fontWeight: typography.weights.medium }}>
              Resend in {resendTimer}s
            </span>
          ) : (
            <button
              onClick={() => setResendTimer(60)}
              style={{
                background: 'none',
                border: 'none',
                color: colors.primary,
                fontSize: typography.sizes.sm,
                fontWeight: typography.weights.semibold,
                cursor: 'pointer',
              }}
            >
              Resend Code
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
