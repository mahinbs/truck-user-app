import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { FiArrowLeft, FiHelpCircle, FiPhone, FiMail, FiMessageCircle, FiSend, FiChevronDown, FiChevronUp, FiFileText, FiShield, FiInfo } from 'react-icons/fi';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { SafeIcon } from '../components/ui/SafeIcon';
import { colors, spacing, typography } from '../constants/theme';

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
];

const contactMethods = [
  {
    id: 'phone',
    title: 'Call Support',
    subtitle: '+91 1800-123-4567',
    icon: FiPhone,
    color: colors.primary,
    action: () => window.open('tel:+9118001234567'),
  },
  {
    id: 'email',
    title: 'Email Support',
    subtitle: 'support@truckflow.com',
    icon: FiMail,
    color: colors.info,
    action: () => window.open('mailto:support@truckflow.com'),
  },
  {
    id: 'chat',
    title: 'Live Chat',
    subtitle: 'Available 24/7',
    icon: FiMessageCircle,
    color: colors.success,
    action: () => alert('Live chat feature will be available soon'),
  },
];

export default function SupportPage() {
  const router = useRouter();
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
      alert('Please fill in all fields');
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      alert('Your message has been sent. We\'ll get back to you soon!');
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 1500);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: colors.background }}>
      <div style={{ padding: spacing.lg }}>
        <button
          onClick={() => router.back()}
          style={{ background: 'none', border: 'none', cursor: 'pointer', marginBottom: spacing.lg, padding: spacing.sm }}
        >
          <SafeIcon Icon={FiArrowLeft} size={24} color={colors.text} />
        </button>

        <div style={{ textAlign: 'center', paddingTop: spacing.xl, paddingBottom: spacing.xl }}>
          <div
            style={{
              width: '120px',
              height: '120px',
              borderRadius: '60px',
              backgroundColor: `${colors.primary}15`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto',
              marginBottom: spacing.lg,
            }}
          >
            <SafeIcon Icon={FiHelpCircle} size={64} color={colors.primary} />
          </div>
          <h1 style={{ fontSize: typography.sizes['2xl'], fontWeight: typography.weights.bold, color: colors.text, marginBottom: spacing.sm }}>
            How can we help you?
          </h1>
          <p style={{ fontSize: typography.sizes.md, color: colors.textSecondary, lineHeight: '22px' }}>
            We're here to assist you with any questions or concerns
          </p>
        </div>

        <div style={{ marginBottom: spacing.lg }}>
          <h2 style={{ fontSize: typography.sizes.lg, fontWeight: typography.weights.bold, color: colors.text, marginBottom: spacing.md }}>
            Contact Us
          </h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: spacing.md }}>
            {contactMethods.map((method) => {
              const Icon = method.icon;
              return (
                <Card
                  key={method.id}
                  onClick={method.action}
                  style={{ width: '47%', textAlign: 'center', padding: spacing.md, cursor: 'pointer' }}
                >
                  <div
                    style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: '28px',
                      backgroundColor: `${method.color}15`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto',
                      marginBottom: spacing.sm,
                    }}
                  >
                    <Icon size={28} color={method.color} />
                  </div>
                  <div style={{ fontSize: typography.sizes.sm, fontWeight: typography.weights.semibold, color: colors.text, marginBottom: spacing.xs }}>
                    {method.title}
                  </div>
                  <div style={{ fontSize: typography.sizes.xs, color: colors.textSecondary }}>{method.subtitle}</div>
                </Card>
              );
            })}
          </div>
        </div>

        <div style={{ marginBottom: spacing.lg }}>
          <h2 style={{ fontSize: typography.sizes.lg, fontWeight: typography.weights.bold, color: colors.text, marginBottom: spacing.md }}>
            Frequently Asked Questions
          </h2>
          {faqs.map((faq) => (
            <Card
              key={faq.id}
              onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
              style={{ marginBottom: spacing.md, cursor: 'pointer' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: typography.sizes.md, fontWeight: typography.weights.semibold, color: colors.text, flex: 1, marginRight: spacing.md }}>
                  {faq.question}
                </div>
                {expandedFaq === faq.id ? <SafeIcon Icon={FiChevronUp} size={20} color={colors.textSecondary} /> : <SafeIcon Icon={FiChevronDown} size={20} color={colors.textSecondary} />}
              </div>
              {expandedFaq === faq.id && (
                <div
                  style={{
                    fontSize: typography.sizes.sm,
                    color: colors.textSecondary,
                    lineHeight: '20px',
                    marginTop: spacing.md,
                    paddingTop: spacing.md,
                    borderTop: `1px solid ${colors.border}`,
                  }}
                >
                  {faq.answer}
                </div>
              )}
            </Card>
          ))}
        </div>

        <div style={{ marginBottom: spacing.lg }}>
          <h2 style={{ fontSize: typography.sizes.lg, fontWeight: typography.weights.bold, color: colors.text, marginBottom: spacing.md }}>
            Send us a Message
          </h2>
          <Card>
            <Input label="Your Name" placeholder="Enter your name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} icon="person" />
            <Input label="Email Address" placeholder="your.email@example.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} icon="mail" type="email" />
            <Input label="Subject" placeholder="What is this regarding?" value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} icon="document-text" />
            <Input
              label="Message"
              placeholder="Describe your issue or question..."
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              icon="chatbubbles"
            />
            <Button title="Send Message" onClick={handleSubmit} loading={submitting} icon="send" iconPosition="right" fullWidth style={{ marginTop: spacing.md }} />
          </Card>
        </div>
      </div>
    </div>
  );
}

