import { useRouter, useSegments } from 'expo-router';
import React, { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useAuth, UserRole } from '../../contexts/AuthContext';

const HOME: Record<Exclude<UserRole, null>, string> = {
  BUSINESS: '/business/home',
  DRIVER: '/driver/home',
  BROKER: '/broker/home',
};

type Props = {
  allowed: Exclude<UserRole, null>;
  children: React.ReactNode;
};

/** Redirect users who land in the wrong portal (e.g. /home route collision on web). */
export function RoleGate({ allowed, children }: Props) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated || !user?.role) {
      router.replace('/(auth)/login' as any);
      return;
    }
    if (user.role !== allowed) {
      router.replace(HOME[user.role] as any);
    }
  }, [isLoading, isAuthenticated, user?.role, allowed, router, segments]);

  if (isLoading || !user?.role || user.role !== allowed) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <>{children}</>;
}
