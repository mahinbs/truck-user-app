import { Ionicons } from '@expo/vector-icons';
import { useRouter, useSegments } from 'expo-router';
import React, { ReactNode } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { primary, text, textSecondary } from '../../constants/Colors';
import { theme } from '../../constants/theme';

type Props = {
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  /** Explicit back target — defaults to profile tab in current role layout */
  backTo?: string;
};

export function ProfileSubScreen({ title, children, footer, backTo }: Props) {
  const router = useRouter();
  const segments = useSegments();

  const handleBack = () => {
    if (backTo) {
      router.navigate(backTo as any);
      return;
    }
    const group = segments[0];
    if (group === 'driver') {
      router.navigate('/driver/profile' as any);
    } else if (group === 'business') {
      router.navigate('/business/profile' as any);
    } else if (group === 'broker') {
      router.navigate('/broker/profile' as any);
    } else {
      router.back();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.iconButton}>
          <Ionicons name="arrow-back" size={24} color={text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{title}</Text>
        <View style={styles.iconButton} />
      </View>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {children}
      </ScrollView>
      {footer}
    </SafeAreaView>
  );
}

export function InfoCard({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  if (!value) return null;
  return (
    <View style={styles.infoCard}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={[styles.infoValue, mono && styles.mono]} numberOfLines={3}>{value}</Text>
    </View>
  );
}

export function SectionTitle({ children }: { children: string }) {
  return <Text style={styles.sectionTitle}>{children}</Text>;
}

export function docFileName(path?: string | null) {
  if (!path) return null;
  const part = path.split('/').pop() || path;
  return part.length > 48 ? `…${part.slice(-44)}` : part;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: text,
  },
  iconButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    ...theme.shadows.light,
  },
  content: { padding: theme.spacing.lg, paddingBottom: 100 },
  sectionTitle: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: theme.spacing.sm,
    marginTop: theme.spacing.md,
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    ...theme.shadows.light,
  },
  infoLabel: { fontSize: 12, color: textSecondary, fontWeight: '600', marginBottom: 4 },
  infoValue: { fontSize: 15, color: text, fontWeight: '600' },
  mono: { fontFamily: 'monospace', fontSize: 13 },
});
