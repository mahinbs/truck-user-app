import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ProfileSubScreen, SectionTitle } from '../../components/shared/ProfileSubScreen';
import { text, textSecondary } from '../../constants/Colors';
import { useAuth } from '../../contexts/AuthContext';

export default function BrokerSettingsScreen() {
  const router = useRouter();
  const { user } = useAuth();

  const Row = ({ label, sub, onPress }: { label: string; sub?: string; onPress?: () => void }) => (
    <TouchableOpacity style={styles.row} onPress={onPress} disabled={!onPress}>
      <View style={{ flex: 1 }}>
        <Text style={styles.rowLabel}>{label}</Text>
        {sub ? <Text style={styles.rowSub}>{sub}</Text> : null}
      </View>
      {onPress ? <Text style={styles.chev}>›</Text> : null}
    </TouchableOpacity>
  );

  return (
    <ProfileSubScreen title="Settings">
      <SectionTitle>Account</SectionTitle>
      <View style={styles.card}>
        <Row label="Email" sub={user?.email} />
        <Row label="Verification" sub={user?.isVerified ? 'Approved' : 'Pending'} onPress={() => router.push('/(onboarding)/verification' as any)} />
        <Row label="Agency" onPress={() => router.push('/broker/agency-details' as any)} />
        <Row label="Documents" onPress={() => router.push('/broker/documents' as any)} />
        <Row label="Payout account" onPress={() => router.push('/broker/payment-methods' as any)} />
        <Row label="Manage drivers" onPress={() => router.push('/broker/drivers' as any)} />
        <Row label="Earnings" onPress={() => router.push('/broker/earnings' as any)} />
        <Row label="Security" onPress={() => router.push('/broker/security' as any)} />
      </View>
      <SectionTitle>App</SectionTitle>
      <View style={styles.card}>
        <Row label="Version" sub="1.0.0" />
      </View>
    </ProfileSubScreen>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#fff', borderRadius: 16, overflow: 'hidden', marginBottom: 8 },
  row: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  rowLabel: { fontSize: 15, fontWeight: '600', color: text },
  rowSub: { fontSize: 13, color: textSecondary, marginTop: 2 },
  chev: { fontSize: 22, color: textSecondary },
});
