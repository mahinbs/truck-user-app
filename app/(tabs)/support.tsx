import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { colors, spacing, typography, borderRadius, shadows } from '@/constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';

const faqs = [
  {
    id: '1',
    question: 'How do I track my shipment?',
    answer: 'You can track your shipment by entering the tracking ID in the Track page, or by clicking on any shipment from your dashboard.',
  },
  {
    id: '2',
    question: 'What payment methods are accepted?',
    answer: 'We accept UPI, Credit/Debit Cards, Net Banking, and Digital Wallets. Payment can be made in advance or on delivery.',
  },
  {
    id: '3',
    question: 'How do I cancel a shipment?',
    answer: 'You can cancel a shipment from the trip details page if it hasn\'t been picked up yet. Contact support for assistance with cancellations.',
  },
  {
    id: '4',
    question: 'What if my shipment is delayed?',
    answer: 'If your shipment is delayed, you\'ll receive real-time updates. You can contact the driver directly or reach out to our support team for assistance.',
  },
  {
    id: '5',
    question: 'How do I rate a driver?',
    answer: 'After your shipment is delivered, you\'ll be prompted to rate the driver and service. You can also access this from the trip details page.',
  },
];

const contactMethods = [
  {
    id: 'phone',
    title: 'Call Support',
    subtitle: '+91 1800-123-4567',
    icon: 'call',
    color: colors.primary,
    action: () => Linking.openURL('tel:+9118001234567'),
  },
  {
    id: 'email',
    title: 'Email Support',
    subtitle: 'support@truckflow.com',
    icon: 'mail',
    color: colors.info,
    action: () => Linking.openURL('mailto:support@truckflow.com'),
  },
  {
    id: 'chat',
    title: 'Live Chat',
    subtitle: 'Available 24/7',
    icon: 'chatbubbles',
    color: colors.success,
    action: () => Alert.alert('Live Chat', 'Live chat feature will be available soon'),
  },
  {
    id: 'whatsapp',
    title: 'WhatsApp',
    subtitle: '+91 98765 43210',
    icon: 'logo-whatsapp',
    color: colors.success,
    action: () => Linking.openURL('https://wa.me/919876543210'),
  },
];

export default function SupportScreen() {
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = () => {
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      Alert.alert('Success', 'Your message has been sent. We\'ll get back to you soon!');
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 1500);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Support</Text>
        </View>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.heroIcon}>
            <Ionicons name="help-circle" size={64} color={colors.primary} />
          </View>
          <Text style={styles.heroTitle}>How can we help you?</Text>
          <Text style={styles.heroSubtitle}>
            We're here to assist you with any questions or concerns
          </Text>
        </View>

        {/* Contact Methods */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Us</Text>
          <View style={styles.contactGrid}>
            {contactMethods.map((method) => (
              <Card
                key={method.id}
                style={styles.contactCard}
                onPress={method.action}
              >
                <View style={[styles.contactIcon, { backgroundColor: `${method.color}15` }]}>
                  <Ionicons name={method.icon as any} size={28} color={method.color} />
                </View>
                <Text style={styles.contactTitle}>{method.title}</Text>
                <Text style={styles.contactSubtitle}>{method.subtitle}</Text>
              </Card>
            ))}
          </View>
        </View>

        {/* FAQs */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
          {faqs.map((faq) => (
            <Card
              key={faq.id}
              style={styles.faqCard}
              onPress={() =>
                setExpandedFaq(expandedFaq === faq.id ? null : faq.id)
              }
            >
              <View style={styles.faqHeader}>
                <Text style={styles.faqQuestion}>{faq.question}</Text>
                <Ionicons
                  name={expandedFaq === faq.id ? 'chevron-up' : 'chevron-down'}
                  size={20}
                  color={colors.textSecondary}
                />
              </View>
              {expandedFaq === faq.id && (
                <Text style={styles.faqAnswer}>{faq.answer}</Text>
              )}
            </Card>
          ))}
        </View>

        {/* Contact Form */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Send us a Message</Text>
          <Card style={styles.formCard}>
            <Input
              label="Your Name"
              placeholder="Enter your name"
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
              icon="person"
            />

            <Input
              label="Email Address"
              placeholder="your.email@example.com"
              value={formData.email}
              onChangeText={(text) => setFormData({ ...formData, email: text })}
              icon="mail"
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Input
              label="Subject"
              placeholder="What is this regarding?"
              value={formData.subject}
              onChangeText={(text) => setFormData({ ...formData, subject: text })}
              icon="document-text"
            />

            <Input
              label="Message"
              placeholder="Describe your issue or question..."
              value={formData.message}
              onChangeText={(text) => setFormData({ ...formData, message: text })}
              icon="chatbubbles"
              multiline
              numberOfLines={5}
            />

            <Button
              title="Send Message"
              onPress={handleSubmit}
              loading={submitting}
              icon="send"
              iconPosition="right"
              fullWidth
              style={styles.submitButton}
            />
          </Card>
        </View>

        {/* Quick Links */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Links</Text>
          <Card style={styles.linksCard}>
            <TouchableOpacity style={styles.linkItem}>
              <Ionicons name="document-text" size={20} color={colors.primary} />
              <Text style={styles.linkText}>Terms & Conditions</Text>
              <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity style={styles.linkItem}>
              <Ionicons name="shield-checkmark" size={20} color={colors.primary} />
              <Text style={styles.linkText}>Privacy Policy</Text>
              <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity style={styles.linkItem}>
              <Ionicons name="information-circle" size={20} color={colors.primary} />
              <Text style={styles.linkText}>About Us</Text>
              <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </Card>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.backgroundCard,
    ...shadows.sm,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.text,
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  heroSection: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  heroIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: `${colors.primary}15`,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  heroTitle: {
    fontSize: typography.sizes['2xl'],
    fontWeight: typography.weights.bold,
    color: colors.text,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: typography.sizes.md,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  section: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.text,
    marginBottom: spacing.md,
  },
  contactGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  contactCard: {
    width: '47%',
    alignItems: 'center',
    padding: spacing.md,
  },
  contactIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  contactTitle: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    color: colors.text,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  contactSubtitle: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  faqCard: {
    marginBottom: spacing.md,
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  faqQuestion: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    color: colors.text,
    flex: 1,
    marginRight: spacing.md,
  },
  faqAnswer: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    lineHeight: 20,
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  formCard: {
    marginTop: spacing.sm,
  },
  submitButton: {
    marginTop: spacing.md,
  },
  linksCard: {
    marginTop: spacing.sm,
  },
  linkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  linkText: {
    flex: 1,
    fontSize: typography.sizes.md,
    color: colors.text,
    marginLeft: spacing.md,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
  },
  bottomSpacer: {
    height: spacing.xl,
  },
});

