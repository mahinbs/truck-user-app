import React, { useState } from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';
import { ProfileSubScreen, SectionTitle } from '../../components/shared/ProfileSubScreen';
import { primary, text, textSecondary } from '../../constants/Colors';

export default function BrokerNotificationsScreen() {
  const [loadAlerts, setLoadAlerts] = useState(true);
  const [tripUpdates, setTripUpdates] = useState(true);
  const [walletAlerts, setWalletAlerts] = useState(true);

  const Row = ({ label, sub, value, onChange }: { label: string; sub: string; value: boolean; onChange: (v: boolean) => void }) => (
    <View style={styles.row}>
      <View style={{ flex: 1 }}>
        <Text style={styles.rowLabel}>{label}</Text>
        <Text style={styles.rowSub}>{sub}</Text>
      </View>
      <Switch value={value} onValueChange={onChange} trackColor={{ true: primary }} />
    </View>
  );

  return (
    <ProfileSubScreen title="Alert Settings">
      <Text style={styles.hint}>Stored on this device for now.</Text>
      <SectionTitle>Alerts</SectionTitle>
      <View style={styles.card}>
        <Row label="New load opportunities" sub="When matching shipments are posted" value={loadAlerts} onChange={setLoadAlerts} />
        <Row label="Trip status" sub="Pickup, in transit, delivered" value={tripUpdates} onChange={setTripUpdates} />
        <Row label="Wallet & payouts" sub="Credits and withdrawal updates" value={walletAlerts} onChange={setWalletAlerts} />
      </View>
    </ProfileSubScreen>
  );
}

const styles = StyleSheet.create({
  hint: { fontSize: 14, color: textSecondary, marginBottom: 12 },
  card: { backgroundColor: '#fff', borderRadius: 16, overflow: 'hidden' },
  row: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  rowLabel: { fontSize: 15, fontWeight: '600', color: text },
  rowSub: { fontSize: 13, color: textSecondary, marginTop: 2 },
});
