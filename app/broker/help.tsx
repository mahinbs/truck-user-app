import React from 'react';
import { Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ProfileSubScreen, SectionTitle } from '../../components/shared/ProfileSubScreen';
import { primary, text, textSecondary } from '../../constants/Colors';

const FAQ = [
  { q: 'How do I accept loads?', a: 'Go to Loads tab, accept an opportunity, then assign one of your managed drivers.' },
  { q: 'How do commissions work?', a: 'Set your commission % in Profile. On delivery, payout + commission land in your wallet (Model B for managed drivers).' },
  { q: 'How do I pay drivers offline?', a: 'Earnings tab → tap Pay on a driver row to record cash/UPI you paid them.' },
  { q: 'How do I withdraw?', a: 'Save bank/UPI under Payment Methods, then request withdrawal from Earnings.' },
];

export default function BrokerHelpScreen() {
  return (
    <ProfileSubScreen title="Broker Help & FAQ">
      <SectionTitle>Contact</SectionTitle>
      <View style={styles.card}>
        <TouchableOpacity style={styles.contact} onPress={() => Linking.openURL('mailto:brokers@truckflow.in')}>
          <Text style={styles.contactLabel}>Broker support</Text>
          <Text style={styles.contactValue}>brokers@truckflow.in</Text>
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
  contact: { padding: 16 },
  contactLabel: { fontSize: 12, color: textSecondary, fontWeight: '600' },
  contactValue: { fontSize: 16, color: primary, fontWeight: '700', marginTop: 4 },
  faq: { backgroundColor: '#fff', borderRadius: 14, padding: 16, marginBottom: 10 },
  faqQ: { fontSize: 15, fontWeight: '700', color: text, marginBottom: 8 },
  faqA: { fontSize: 14, color: textSecondary, lineHeight: 21 },
});
