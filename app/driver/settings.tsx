import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { ProfileSubScreen, SectionTitle } from '../../components/shared/ProfileSubScreen';
import { primary, text, textSecondary } from '../../constants/Colors';
import { useAuth } from '../../contexts/AuthContext';

export default function SettingsScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [urgentOnly, setUrgentOnly] = useState(false);

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
        <Row label="Verification" sub={user?.isVerified ? 'Approved' : 'Not approved'} onPress={() => router.push('/(onboarding)/verification' as any)} />
        <Row label="Truck details" sub="Type & registration" onPress={() => router.push('/driver/truck-details' as any)} />
        <Row label="Payout account" sub="Bank or UPI" onPress={() => router.push('/driver/bank-account' as any)} />
      </View>

      <SectionTitle>Preferences</SectionTitle>
      <View style={styles.card}>
        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <Text style={styles.rowLabel}>Urgent loads only</Text>
            <Text style={styles.rowSub}>Show high-pay urgent requests first (UI preference)</Text>
          </View>
          <Switch value={urgentOnly} onValueChange={setUrgentOnly} trackColor={{ true: primary }} />
        </View>
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  rowLabel: { fontSize: 15, fontWeight: '600', color: text },
  rowSub: { fontSize: 13, color: textSecondary, marginTop: 2 },
  chev: { fontSize: 22, color: textSecondary },
});
