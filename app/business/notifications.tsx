import React, { useState } from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';
import { ProfileSubScreen, SectionTitle } from '../../components/shared/ProfileSubScreen';
import { primary, text, textSecondary } from '../../constants/Colors';

export default function NotificationsScreen() {
  const [shipmentUpdates, setShipmentUpdates] = useState(true);
  const [walletAlerts, setWalletAlerts] = useState(true);
  const [promos, setPromos] = useState(false);

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
    <ProfileSubScreen title="Notifications">
      <Text style={styles.hint}>Preferences are stored on this device for now. Push notifications require device permission.</Text>
      <SectionTitle>Alerts</SectionTitle>
      <View style={styles.card}>
        <Row label="Shipment updates" sub="Driver assigned, pickup, delivery" value={shipmentUpdates} onChange={setShipmentUpdates} />
        <Row label="Wallet activity" sub="Top-ups, debits, withdrawals" value={walletAlerts} onChange={setWalletAlerts} />
        <Row label="Offers & tips" sub="Product news" value={promos} onChange={setPromos} />
      </View>
    </ProfileSubScreen>
  );
}

const styles = StyleSheet.create({
  hint: { fontSize: 14, color: textSecondary, marginBottom: 12, lineHeight: 20 },
  card: { backgroundColor: '#fff', borderRadius: 16, overflow: 'hidden' },
  row: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  rowLabel: { fontSize: 15, fontWeight: '600', color: text },
  rowSub: { fontSize: 13, color: textSecondary, marginTop: 2 },
});
