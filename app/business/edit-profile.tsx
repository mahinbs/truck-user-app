import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from '../../components/shared/Button';
import { Input } from '../../components/shared/Input';
import { ProfileSubScreen } from '../../components/shared/ProfileSubScreen';
import { primary, textSecondary } from '../../constants/Colors';
import { api, ApiError } from '../../utils/api';

export default function EditProfileScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [gstin, setGstin] = useState('');
  const [billingAddress, setBillingAddress] = useState('');
  const [city, setCity] = useState('');
  const [stateName, setStateName] = useState('');
  const [pincode, setPincode] = useState('');

  const load = useCallback(async () => {
    try {
      const me = await api.me();
      setName(me.name || '');
      setPhone(me.phone || '');
      setEmail(me.email || '');
      setContactPerson(me.contactPerson || me.name || '');
      setCompanyName(me.companyName || '');
      setGstin(me.gstin || '');
      setBillingAddress(me.billingAddress || '');
      setCity(me.city || '');
      setStateName(me.state || '');
      setPincode(me.pincode || '');
    } catch (e) {
      console.warn('edit profile load failed', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const save = async () => {
    if (!name.trim()) {
      Alert.alert('Required', 'Full name is required.');
      return;
    }
    if (!phone.trim()) {
      Alert.alert('Required', 'Phone number is required.');
      return;
    }
    if (!companyName.trim()) {
      Alert.alert('Required', 'Company name is required.');
      return;
    }
    if (!billingAddress.trim()) {
      Alert.alert('Required', 'Billing address is required.');
      return;
    }
    if (!city.trim() || !stateName.trim() || !pincode.trim()) {
      Alert.alert('Required', 'City, state and pincode are required.');
      return;
    }
    setSaving(true);
    try {
      await api.updateProfile({
        name: name.trim(),
        phone: phone.trim(),
        contactPerson: (contactPerson.trim() || name.trim()),
        companyName: companyName.trim(),
        gstin: gstin.trim() || undefined,
        billingAddress: billingAddress.trim(),
        city: city.trim(),
        state: stateName.trim(),
        pincode: pincode.trim(),
      });
      Alert.alert('Saved', 'Profile updated.', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (e: any) {
      Alert.alert('Save failed', e instanceof ApiError ? e.message : (e?.message || 'unknown'));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <ProfileSubScreen title="Edit Profile">
        <ActivityIndicator color={primary} style={{ marginTop: 40 }} />
      </ProfileSubScreen>
    );
  }

  return (
    <ProfileSubScreen title="Edit Profile">
      <Text style={styles.hint}>Update your account and business contact details.</Text>
      <Input label="Full name *" value={name} onChangeText={setName} placeholder="Your name" />
      <Input label="Contact person *" value={contactPerson} onChangeText={setContactPerson} placeholder="Operations contact" />
      <Input label="Phone *" value={phone} onChangeText={setPhone} keyboardType="phone-pad" placeholder="+91…" />
      <Input label="Email" value={email} editable={false} />
      <Input label="Company name *" value={companyName} onChangeText={setCompanyName} placeholder="Acme Logistics Pvt Ltd" />
      <Input label="GSTIN" value={gstin} onChangeText={setGstin} autoCapitalize="characters" placeholder="27AAAAA0000A1Z5" />
      <Input label="Billing address *" value={billingAddress} onChangeText={setBillingAddress} placeholder="Street, area" multiline />
      <Input label="City *" value={city} onChangeText={setCity} placeholder="Mumbai" />
      <Input label="State *" value={stateName} onChangeText={setStateName} placeholder="Maharashtra" />
      <Input label="Pincode *" value={pincode} onChangeText={setPincode} keyboardType="number-pad" placeholder="400001" />
      <Button title={saving ? 'Saving…' : 'Save changes'} onPress={save} variant="primary" fullWidth style={{ marginTop: 20 }} disabled={saving} />
    </ProfileSubScreen>
  );
}

const styles = StyleSheet.create({
  hint: { fontSize: 14, color: textSecondary, marginBottom: 12 },
});
