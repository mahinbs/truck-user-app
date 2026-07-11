import React from 'react';
import { Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ProfileSubScreen, SectionTitle } from '../../components/shared/ProfileSubScreen';
import { primary, text, textSecondary } from '../../constants/Colors';

const FAQ = [
  { q: 'How do I book a truck?', a: 'Home → Book Truck, pick route, truck type, and confirm. Payment is debited from your wallet.' },
  { q: 'How do I add money to my wallet?', a: 'Wallet tab → Add Money. In dev mode this credits instantly; production uses Razorpay.' },
  { q: 'How do I withdraw unused balance?', a: 'Save a bank/UPI account under Payment Methods, then Wallet → Withdraw. Admin approves the payout.' },
  { q: 'How do I track a shipment?', a: 'Open Shipments, tap an active shipment, or use Track from the booking flow.' },
];

export default function BusinessHelpScreen() {
  return (
    <ProfileSubScreen title="Help Center">
      <SectionTitle>Contact</SectionTitle>
      <View style={styles.card}>
        <TouchableOpacity style={styles.contact} onPress={() => Linking.openURL('mailto:support@truckflow.in')}>
          <Text style={styles.contactLabel}>Email support</Text>
          <Text style={styles.contactValue}>support@truckflow.in</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.contact} onPress={() => Linking.openURL('tel:+919876543210')}>
          <Text style={styles.contactLabel}>Phone</Text>
          <Text style={styles.contactValue}>+91 98765 43210</Text>
        </TouchableOpacity>
      </View>
      <SectionTitle>FAQ</SectionTitle>
      {FAQ.map((item) => (
        <View key={item.q} style={styles.faq}>
          <Text style={styles.faqQ}>{item.q}</Text>
          <Text style={styles.faqA}>{item.a}</Text>
        </View>
      ))}
    </ProfileSubScreen>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#fff', borderRadius: 16, marginBottom: 8 },
  contact: { padding: 16, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  contactLabel: { fontSize: 12, color: textSecondary, fontWeight: '600' },
  contactValue: { fontSize: 16, color: primary, fontWeight: '700', marginTop: 4 },
  faq: { backgroundColor: '#fff', borderRadius: 14, padding: 16, marginBottom: 10 },
  faqQ: { fontSize: 15, fontWeight: '700', color: text, marginBottom: 8 },
  faqA: { fontSize: 14, color: textSecondary, lineHeight: 21 },
});
