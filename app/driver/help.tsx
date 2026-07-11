import React from 'react';
import { Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ProfileSubScreen, SectionTitle } from '../../components/shared/ProfileSubScreen';
import { primary, text, textSecondary } from '../../constants/Colors';

const FAQ = [
  {
    q: 'How do I start receiving loads?',
    a: 'Complete verification, get approved by admin, set your truck type under Truck Details, then go Online on the Home tab.',
  },
  {
    q: 'When do I get paid?',
    a: 'Earnings are credited to your wallet when a trip is marked delivered. Withdraw from the Earnings tab — admin approves payouts.',
  },
  {
    q: 'How do I update my documents?',
    a: 'Open Documents from Profile. If rejected, tap Resubmit verification to upload again.',
  },
  {
    q: 'Why was my verification rejected?',
    a: 'Check Documents for the admin reason, fix the issue, and resubmit.',
  },
];

export default function HelpScreen() {
  return (
    <ProfileSubScreen title="Help & Support">
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
