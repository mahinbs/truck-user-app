import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { FiSettings, FiClock, FiCheckCircle, FiDollarSign, FiStar, FiUser, FiBriefcase, FiFileText, FiPhone, FiShield, FiCreditCard, FiMapPin, FiFile, FiBell, FiMail, FiMessageCircle, FiHelpCircle, FiHeadphones, FiFileText as FiFileText2, FiShield as FiShield2, FiInfo, FiLogOut, FiEdit2, FiChevronRight } from 'react-icons/fi';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Divider } from '../components/ui/Divider';
import { SafeIcon } from '../components/ui/SafeIcon';
import { colors, spacing, typography, borderRadius } from '../constants/theme';

const userData = {
  name: 'Rajesh Sharma',
  email: 'rajesh.sharma@company.com',
  phone: '+91 98765 43210',
  company: 'ABC Trading Pvt Ltd',
  gst: '22AAAAA0000A1Z5',
  memberSince: 'Jan 2024',
  verified: true,
};

const stats = {
  totalShipments: 23,
  activeShipments: 5,
  totalSpent: 45200,
  rating: 4.8,
};

export default function ProfilePage() {
  const router = useRouter();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
    router.push('/login');
    }
  };

  const MenuItem = ({ icon, title, subtitle, onClick, badge, rightElement }: any) => {
    const Icon = icon;
    return (
      <button
        onClick={onClick}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          padding: `${spacing.md} 0`,
          borderBottom: `1px solid ${colors.border}`,
          background: 'none',
          borderLeft: 'none',
          borderRight: 'none',
          borderTop: 'none',
          cursor: onClick ? 'pointer' : 'default',
        }}
      >
        <div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '20px',
            backgroundColor: `${colors.primary}15`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: spacing.md,
          }}
        >
          <SafeIcon Icon={Icon} size={20} color={colors.primary} />
        </div>
        <div style={{ flex: 1, textAlign: 'left' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
            <span style={{ fontSize: typography.sizes.md, fontWeight: typography.weights.medium, color: colors.text }}>{title}</span>
            {badge && <Badge label={badge} variant="success" />}
          </div>
          {subtitle && <div style={{ fontSize: typography.sizes.xs, color: colors.textSecondary, marginTop: '2px' }}>{subtitle}</div>}
        </div>
        {rightElement || <FiChevronRight size={20} color={colors.textSecondary} />}
      </button>
    );
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: colors.background, paddingBottom: '80px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: `${spacing.md} ${spacing.lg}`, backgroundColor: colors.backgroundCard, boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)' }}>
        <h1 style={{ fontSize: typography.sizes.xl, fontWeight: typography.weights.bold, color: colors.text }}>Profile</h1>
        <button
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '20px',
            backgroundColor: colors.background,
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <FiSettings size={20} color={colors.text} />
        </button>
      </div>

      <div style={{ padding: spacing.lg }}>
        <Card style={{ marginBottom: spacing.md }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: spacing.lg }}>
            <div style={{ position: 'relative', marginRight: spacing.md }}>
              <div style={{ width: '80px', height: '80px', borderRadius: '40px', backgroundColor: colors.primary, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: typography.sizes['3xl'], fontWeight: typography.weights.bold, color: colors.backgroundCard }}>
                  {userData.name.split(' ').map((n) => n[0]).join('')}
                </span>
              </div>
              {userData.verified && (
                <div style={{ position: 'absolute', bottom: 0, right: 0, backgroundColor: colors.backgroundCard, borderRadius: '12px' }}>
                  <SafeIcon Icon={FiShield} size={24} color={colors.success} />
                </div>
              )}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: typography.sizes.lg, fontWeight: typography.weights.bold, color: colors.text, marginBottom: spacing.xs }}>{userData.name}</div>
              <div style={{ fontSize: typography.sizes.sm, color: colors.textSecondary, marginBottom: spacing.xs }}>{userData.email}</div>
              <div style={{ fontSize: typography.sizes.xs, color: colors.textLight }}>Member since {userData.memberSince}</div>
            </div>
            <button
              onClick={() => alert('Edit profile')}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '20px',
                backgroundColor: `${colors.primary}15`,
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <FiEdit2 size={20} color={colors.primary} />
            </button>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', paddingTop: spacing.md, borderTop: `1px solid ${colors.border}` }}>
            {[
              { value: stats.totalShipments, label: 'Shipments' },
              { value: stats.activeShipments, label: 'Active' },
              { value: `₹${(stats.totalSpent / 1000).toFixed(1)}K`, label: 'Spent' },
              { value: stats.rating, label: 'Rating', icon: FiStar },
            ].map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <React.Fragment key={idx}>
                  <div style={{ flex: 1, textAlign: 'center' }}>
                    {Icon && (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: spacing.xs, marginBottom: spacing.xs }}>
                        <SafeIcon Icon={Icon} size={16} color={colors.warning} />
                        <span style={{ fontSize: typography.sizes.lg, fontWeight: typography.weights.bold, color: colors.text }}>{stat.value}</span>
                      </div>
                    )}
                    {!Icon && <div style={{ fontSize: typography.sizes.lg, fontWeight: typography.weights.bold, color: colors.text, marginBottom: spacing.xs }}>{stat.value}</div>}
                    <div style={{ fontSize: typography.sizes.xs, color: colors.textSecondary }}>{stat.label}</div>
                  </div>
                  {idx < 3 && <Divider vertical style={{ height: '30px', margin: 0 }} />}
                </React.Fragment>
              );
            })}
          </div>
        </Card>

        <Card style={{ marginBottom: spacing.md }}>
          <h2 style={{ fontSize: typography.sizes.lg, fontWeight: typography.weights.bold, color: colors.text, marginBottom: spacing.md }}>Business Information</h2>
          {[
            { icon: FiBriefcase, label: 'Company Name', value: userData.company },
            { icon: FiFileText, label: 'GST Number', value: userData.gst },
            { icon: FiPhone, label: 'Phone Number', value: userData.phone },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', marginBottom: spacing.md }}>
                <SafeIcon Icon={Icon} size={18} color={colors.textSecondary} style={{ marginRight: spacing.md }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: typography.sizes.xs, color: colors.textSecondary, marginBottom: '2px' }}>{item.label}</div>
                  <div style={{ fontSize: typography.sizes.sm, fontWeight: typography.weights.medium, color: colors.text }}>{item.value}</div>
          </div>
          </div>
            );
          })}
        </Card>

        <Card style={{ marginBottom: spacing.md }}>
          <h2 style={{ fontSize: typography.sizes.lg, fontWeight: typography.weights.bold, color: colors.text, marginBottom: spacing.md }}>Account Management</h2>
          <MenuItem icon={FiCreditCard} title="Payment Methods" subtitle="Manage your payment options" onClick={() => alert('Coming soon')} />
          <MenuItem icon={FiMapPin} title="Saved Addresses" subtitle="Manage pickup & delivery locations" onClick={() => alert('Coming soon')} />
          <MenuItem icon={FiFile} title="Documents" subtitle="GST, PAN, and other documents" onClick={() => alert('Coming soon')} />
          <MenuItem icon={FiShield} title="KYC Verification" subtitle="Verified business account" badge="Verified" />
        </Card>

        <Card style={{ marginBottom: spacing.md }}>
          <h2 style={{ fontSize: typography.sizes.lg, fontWeight: typography.weights.bold, color: colors.text, marginBottom: spacing.md }}>Notifications</h2>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: `${spacing.md} 0`, borderBottom: `1px solid ${colors.border}` }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '20px', backgroundColor: `${colors.primary}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: spacing.md }}>
                <SafeIcon Icon={FiBell} size={20} color={colors.primary} />
              </div>
              <div>
                <div style={{ fontSize: typography.sizes.md, fontWeight: typography.weights.medium, color: colors.text }}>Push Notifications</div>
                <div style={{ fontSize: typography.sizes.xs, color: colors.textSecondary, marginTop: '2px' }}>Receive updates about your shipments</div>
              </div>
            </div>
            <input type="checkbox" checked={notificationsEnabled} onChange={(e) => setNotificationsEnabled(e.target.checked)} style={{ width: '20px', height: '20px', cursor: 'pointer' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: `${spacing.md} 0`, borderBottom: `1px solid ${colors.border}` }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '20px', backgroundColor: `${colors.primary}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: spacing.md }}>
                <SafeIcon Icon={FiMail} size={20} color={colors.primary} />
            </div>
              <div>
                <div style={{ fontSize: typography.sizes.md, fontWeight: typography.weights.medium, color: colors.text }}>Email Notifications</div>
                <div style={{ fontSize: typography.sizes.xs, color: colors.textSecondary, marginTop: '2px' }}>Get shipment updates via email</div>
          </div>
            </div>
            <input type="checkbox" checked={emailNotifications} onChange={(e) => setEmailNotifications(e.target.checked)} style={{ width: '20px', height: '20px', cursor: 'pointer' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: `${spacing.md} 0` }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '20px', backgroundColor: `${colors.primary}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: spacing.md }}>
                <SafeIcon Icon={FiMessageCircle} size={20} color={colors.primary} />
              </div>
              <div>
                <div style={{ fontSize: typography.sizes.md, fontWeight: typography.weights.medium, color: colors.text }}>SMS Notifications</div>
                <div style={{ fontSize: typography.sizes.xs, color: colors.textSecondary, marginTop: '2px' }}>Receive SMS for important updates</div>
              </div>
            </div>
            <input type="checkbox" checked={smsNotifications} onChange={(e) => setSmsNotifications(e.target.checked)} style={{ width: '20px', height: '20px', cursor: 'pointer' }} />
          </div>
        </Card>

        <Card style={{ marginBottom: spacing.md }}>
          <h2 style={{ fontSize: typography.sizes.lg, fontWeight: typography.weights.bold, color: colors.text, marginBottom: spacing.md }}>Support & Information</h2>
          <MenuItem icon={FiHelpCircle} title="Help Center" subtitle="FAQs and support" onClick={() => router.push('/support')} />
          <MenuItem icon={FiHeadphones} title="Contact Support" subtitle="Get help from our team" onClick={() => router.push('/support')} />
          <MenuItem icon={FiFileText2} title="Terms & Conditions" onClick={() => alert('Coming soon')} />
          <MenuItem icon={FiShield} title="Privacy Policy" onClick={() => alert('Coming soon')} />
          <MenuItem icon={FiInfo} title="About" subtitle="Version 1.0.0" onClick={() => alert('TruckFlow v1.0.0')} />
        </Card>

        <Button title="Logout" onClick={handleLogout} variant="outline" icon="log-out" fullWidth style={{ borderColor: colors.error, color: colors.error }} />
      </div>
    </div>
  );
}
