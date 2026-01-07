import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { FiShield, FiUpload, FiChevronRight, FiCalendar, FiClock } from 'react-icons/fi';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { SafeIcon } from '../components/ui/SafeIcon';
import { colors, spacing, typography, borderRadius } from '../constants/theme';

export default function KYCPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    gstNumber: '',
    panNumber: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  });
  const [documents, setDocuments] = useState({
    gstCertificate: null,
    panCard: null,
    addressProof: null,
  });
  const [loading, setLoading] = useState(false);

  const handleUpload = (docType: string) => {
    alert(`Upload ${docType} functionality will be implemented`);
  };

  const handleSubmit = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push('/dashboard');
    }, 2000);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: colors.background,
        padding: spacing.lg,
      }}
    >
      <div style={{ maxWidth: '600px', margin: '0 auto', paddingTop: spacing.xl }}>
        <div style={{ textAlign: 'center', marginBottom: spacing.xl }}>
          <div
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '40px',
              backgroundColor: `${colors.primary}15`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto',
              marginBottom: spacing.md,
            }}
          >
            <SafeIcon Icon={FiShield} size={40} color={colors.primary} />
          </div>
          <h1
            style={{
              fontSize: typography.sizes['2xl'],
              fontWeight: typography.weights.bold,
              color: colors.text,
              marginBottom: spacing.sm,
            }}
          >
            Complete KYC
          </h1>
          <p style={{ fontSize: typography.sizes.md, color: colors.textSecondary }}>
            Verify your business to start booking trucks
          </p>
        </div>

        <div style={{ marginBottom: spacing.lg }}>
          <h2 style={{ fontSize: typography.sizes.lg, fontWeight: typography.weights.bold, color: colors.text, marginBottom: spacing.md }}>
            Business Information
          </h2>

          <Input
            label="GST Number"
            placeholder="22AAAAA0000A1Z5"
            value={formData.gstNumber}
            onChange={(e) => setFormData({ ...formData, gstNumber: e.target.value.toUpperCase() })}
            icon="document-text"
          />

          <Input
            label="PAN Number"
            placeholder="ABCDE1234F"
            value={formData.panNumber}
            onChange={(e) => setFormData({ ...formData, panNumber: e.target.value.toUpperCase() })}
            icon="card"
            maxLength={10}
          />
        </div>

        <div style={{ marginBottom: spacing.lg }}>
          <h2 style={{ fontSize: typography.sizes.lg, fontWeight: typography.weights.bold, color: colors.text, marginBottom: spacing.md }}>
            Business Address
          </h2>

          <Input
            label="Address"
            placeholder="Enter your business address"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            icon="location"
          />

          <div style={{ display: 'flex', gap: spacing.md }}>
            <div style={{ flex: 1 }}>
              <Input
                label="City"
                placeholder="City"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              />
            </div>
            <div style={{ flex: 1 }}>
              <Input
                label="State"
                placeholder="State"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
              />
            </div>
          </div>

          <Input
            label="Pincode"
            placeholder="400001"
            value={formData.pincode}
            onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
            icon="pin"
            type="number"
            maxLength={6}
          />
        </div>

        <div style={{ marginBottom: spacing.lg }}>
          <h2 style={{ fontSize: typography.sizes.lg, fontWeight: typography.weights.bold, color: colors.text, marginBottom: spacing.md }}>
            Upload Documents
          </h2>

          {[
            { id: 'gst', label: 'GST Certificate', key: 'gstCertificate' },
            { id: 'pan', label: 'PAN Card', key: 'panCard' },
            { id: 'address', label: 'Address Proof', key: 'addressProof' },
          ].map((doc) => (
            <Card
              key={doc.id}
              onClick={() => handleUpload(doc.label)}
              style={{ marginBottom: spacing.md, cursor: 'pointer' }}
            >
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: borderRadius.md,
                    backgroundColor: `${colors.primary}15`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: spacing.md,
                  }}
                >
                  <SafeIcon Icon={FiUpload} size={24} color={colors.primary} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: typography.sizes.md, fontWeight: typography.weights.semibold, color: colors.text, marginBottom: '2px' }}>
                    {doc.label}
                  </div>
                  <div style={{ fontSize: typography.sizes.sm, color: colors.textSecondary }}>
                    {documents[doc.key as keyof typeof documents] ? 'Uploaded' : 'Tap to upload'}
                  </div>
                </div>
                <SafeIcon Icon={FiChevronRight} size={20} color={colors.textSecondary} />
              </div>
            </Card>
          ))}
        </div>

        <Button
          title="Submit & Continue"
          onClick={handleSubmit}
          loading={loading}
          icon="checkmark-circle"
          iconPosition="right"
          fullWidth
          style={{ marginBottom: spacing.md }}
        />

        <button
          onClick={() => router.push('/dashboard')}
          style={{
            width: '100%',
            background: 'none',
            border: 'none',
            color: colors.textSecondary,
            fontSize: typography.sizes.md,
            fontWeight: typography.weights.medium,
            cursor: 'pointer',
            padding: spacing.md,
            textAlign: 'center',
          }}
        >
          Skip for now
        </button>
      </div>
    </div>
  );
}

