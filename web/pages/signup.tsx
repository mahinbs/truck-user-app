import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { colors } from '../constants/theme';

export default function SignupPage() {
  const router = useRouter();
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
    setTimeout(() => {
      setLoading(false);
      router.push({
        pathname: '/verify-otp',
        query: { phone: formData.phone, type: 'signup' },
      });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-[500px] mx-auto pt-8">
        <div className="mb-8">
          <h1 className="text-[30px] font-bold text-text mb-2">
            Create Account
          </h1>
          <p className="text-base text-text-secondary leading-6">
            Sign up to start booking truck services
          </p>
        </div>

        <div className="mb-6">
          <Input
            label="Full Name"
            placeholder="Enter your full name"
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            error={errors.fullName}
            icon="person"
          />

          <Input
            label="Email Address"
            placeholder="your.email@example.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            error={errors.email}
            icon="mail"
            type="email"
          />

          <Input
            label="Phone Number"
            placeholder="1234567890"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            error={errors.phone}
            icon="call"
            type="tel"
          />

          <Input
            label="Company/Business Name"
            placeholder="Enter your company name"
            value={formData.companyName}
            onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
            error={errors.companyName}
            icon="business"
          />

          <Input
            label="Password"
            placeholder="Create a strong password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            error={errors.password}
            icon="lock-closed"
            showPasswordToggle
          />

          <Input
            label="Confirm Password"
            placeholder="Re-enter your password"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            error={errors.confirmPassword}
            icon="lock-closed"
            showPasswordToggle
          />
        </div>

        <Button
          title="Create Account"
          onClick={handleSignup}
          loading={loading}
          icon="arrow-forward"
          iconPosition="right"
          fullWidth
          className="mb-4"
        />

        <div className="flex justify-center items-center mt-4">
          <span className="text-base text-text-secondary">Already have an account? </span>
          <button
            onClick={() => router.push('/login')}
            className="bg-transparent border-none text-primary text-base font-semibold cursor-pointer ml-1"
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
}

