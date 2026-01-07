import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { FiBriefcase, FiArrowRight, FiUserPlus } from 'react-icons/fi';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { SafeIcon } from '../components/ui/SafeIcon';
import { colors } from '../constants/theme';

export default function LoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
    setTimeout(() => {
      setLoading(false);
      router.push({
        pathname: '/verify-otp',
        query: { phone, type: 'login' },
      });
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="w-full max-w-[400px]">
        {/* Logo */}
        <div className="text-center mb-12">
          <div className="w-[100px] h-[100px] rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
            <SafeIcon Icon={FiBriefcase} size={48} color={colors.primary} />
          </div>
          <h1 className="text-[30px] font-bold text-text mb-1">
            TruckFlow
          </h1>
          <p className="text-sm text-text-secondary">
            Your trusted logistics partner
          </p>
        </div>

        {/* Form */}
        <div>
          <h2 className="text-2xl font-bold text-text mb-1">
            Welcome Back
          </h2>
          <p className="text-base text-text-secondary mb-8 leading-[22px]">
            Sign in to manage your shipments
          </p>

          <Input
            label="Phone Number"
            placeholder="Enter your phone number"
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value);
              setError('');
            }}
            type="tel"
            icon="call"
            error={error}
          />

          <Button
            title="Sign In"
            onClick={handleLogin}
            loading={loading}
            disabled={!phone}
            icon="arrow-forward"
            iconPosition="right"
            fullWidth
            className="mt-4 mb-6"
          />

          <div className="flex items-center my-6">
            <div className="flex-1 h-px bg-border" />
            <span className="mx-4 text-text-secondary text-sm">
              or
            </span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <Button
            title="Create New Account"
            onClick={() => router.push('/signup')}
            variant="outline"
            icon="person-add"
            fullWidth
          />
        </div>
      </div>
    </div>
  );
}
