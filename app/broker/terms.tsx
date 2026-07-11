import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { ProfileSubScreen } from '../../components/shared/ProfileSubScreen';
import { text, textSecondary } from '../../constants/Colors';

const SECTIONS = [
  { title: '1. Broker role', body: 'Brokers connect shippers with drivers they manage. You are responsible for driver compliance and offline settlements.' },
  { title: '2. Commission', body: 'Your commission % applies to trips you broker. Platform fees are set by TruckFlow admin separately.' },
  { title: '3. Managed drivers', body: 'Drivers under your fleet may not have app logins. You assign trips and record offline payments in the app.' },
  { title: '4. Payouts', body: 'Wallet credits on delivery. Withdrawals require a verified payout account and admin approval.' },
  { title: '5. Verification', body: 'PAN, GST and agency documents must be approved before accepting load opportunities.' },
];

export default function BrokerTermsScreen() {
  return (
    <ProfileSubScreen title="Terms & Commission Policy">
      <Text style={styles.updated}>Last updated: June 2026</Text>
      {SECTIONS.map((s) => (
        <React.Fragment key={s.title}>
          <Text style={styles.heading}>{s.title}</Text>
          <Text style={styles.body}>{s.body}</Text>
        </React.Fragment>
      ))}
    </ProfileSubScreen>
  );
}

const styles = StyleSheet.create({
  updated: { fontSize: 12, color: textSecondary, marginBottom: 16 },
  heading: { fontSize: 16, fontWeight: '700', color: text, marginTop: 12, marginBottom: 6 },
  body: { fontSize: 14, color: textSecondary, lineHeight: 22 },
});
