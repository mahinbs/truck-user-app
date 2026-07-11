import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { ProfileSubScreen } from '../../components/shared/ProfileSubScreen';
import { text, textSecondary } from '../../constants/Colors';

const SECTIONS = [
  { title: '1. Service', body: 'TruckFlow connects businesses with verified truck drivers and brokers for freight movement. We are a technology platform, not a carrier.' },
  { title: '2. Wallet & payments', body: 'Businesses preload a wallet to book shipments. Refunds for cancellations follow platform policy. Withdrawals require a verified payout account and admin approval.' },
  { title: '3. Shipments', body: 'Quoted prices include platform fees and GST where applicable. Businesses must provide accurate load weight and dimensions.' },
  { title: '4. Liability', body: 'Disputes on damage or delay are resolved between parties with platform mediation. Always insure high-value cargo.' },
  { title: '5. Privacy', body: 'We collect account, shipment, and payment data to operate the service. Driver KYC is encrypted and visible only to authorised admins.' },
];

export default function TermsScreen() {
  return (
    <ProfileSubScreen title="Terms & Conditions">
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
