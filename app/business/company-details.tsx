import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text } from 'react-native';
import { Button } from '../../components/shared/Button';
import { Input } from '../../components/shared/Input';
import { ProfileSubScreen } from '../../components/shared/ProfileSubScreen';
import { primary, textSecondary } from '../../constants/Colors';
import { api, ApiError } from '../../utils/api';

export default function CompanyDetailsScreen() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [companyName, setCompanyName] = useState('');
  const [gstin, setGstin] = useState('');
  const [billingAddress, setBillingAddress] = useState('');

  const load = useCallback(async () => {
    try {
      const me = await api.me();
      setCompanyName(me.companyName || me.name || '');
      setGstin(me.gstin || '');
      setBillingAddress(me.billingAddress || '');
    } catch (e) {
      console.warn('company details load failed', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const save = async () => {
    setSaving(true);
    try {
      await api.updateProfile({
        companyName: companyName.trim() || undefined,
        gstin: gstin.trim() || undefined,
        billingAddress: billingAddress.trim() || undefined,
      });
      Alert.alert('Saved', 'Company details updated.');
    } catch (e: any) {
      Alert.alert('Save failed', e instanceof ApiError ? e.message : (e?.message || 'unknown'));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <ProfileSubScreen title="Company Details">
        <ActivityIndicator color={primary} style={{ marginTop: 40 }} />
      </ProfileSubScreen>
    );
  }

  return (
    <ProfileSubScreen title="Company Details">
      <Text style={styles.hint}>Used on invoices and shipment billing.</Text>
      <Input label="Company name" value={companyName} onChangeText={setCompanyName} placeholder="Acme Logistics Pvt Ltd" />
      <Input label="GSTIN" value={gstin} onChangeText={setGstin} autoCapitalize="characters" placeholder="27AAAAA0000A1Z5" />
      <Input label="Billing address" value={billingAddress} onChangeText={setBillingAddress} placeholder="Full address" multiline />
      <Button title={saving ? 'Saving…' : 'Save'} onPress={save} variant="primary" fullWidth style={{ marginTop: 20 }} disabled={saving} />
    </ProfileSubScreen>
  );
}

const styles = StyleSheet.create({
  hint: { fontSize: 14, color: textSecondary, marginBottom: 12 },
});
