import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, View } from 'react-native';
import { Button } from './Button';
import { Input } from './Input';
import { InfoCard } from './ProfileSubScreen';
import { primary, textSecondary } from '../../constants/Colors';
import { api, ApiError } from '../../utils/api';

export type PayoutDetails = {
  method?: 'bank' | 'upi';
  accountHolder?: string;
  bankName?: string;
  accountNumber?: string;
  ifsc?: string;
  upiId?: string;
};

export function payoutSummary(p?: Record<string, unknown> | null) {
  if (!p) return 'Not set — tap to add';
  if (p.method === 'upi' && p.upiId) return String(p.upiId);
  if (p.bankName && p.accountNumber) {
    const n = String(p.accountNumber);
    return `${p.bankName} •••• ${n.slice(-4)}`;
  }
  return 'Tap to view or edit';
}

type Props = {
  hint?: string;
  onSaved?: () => void;
};

export function PayoutAccountForm({ hint, onSaved }: Props) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [method, setMethod] = useState<'bank' | 'upi'>('bank');
  const [accountHolder, setAccountHolder] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [ifsc, setIfsc] = useState('');
  const [upiId, setUpiId] = useState('');

  const load = useCallback(async () => {
    try {
      const me = await api.me();
      const p = (me.payoutDetails || {}) as PayoutDetails;
      setMethod(p.method === 'upi' ? 'upi' : 'bank');
      setAccountHolder(p.accountHolder || me.name || '');
      setBankName(p.bankName || '');
      setAccountNumber(p.accountNumber || '');
      setIfsc(p.ifsc || '');
      setUpiId(p.upiId || '');
    } catch (e) {
      console.warn('payout account load failed', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const save = async () => {
    const payload: PayoutDetails = { method, accountHolder: accountHolder.trim() };
    if (method === 'bank') {
      if (!bankName.trim() || !accountNumber.trim() || !ifsc.trim()) {
        Alert.alert('Missing fields', 'Bank name, account number and IFSC are required.');
        return;
      }
      payload.bankName = bankName.trim();
      payload.accountNumber = accountNumber.trim();
      payload.ifsc = ifsc.trim().toUpperCase();
    } else {
      if (!upiId.trim()) {
        Alert.alert('UPI required', 'Enter your UPI ID.');
        return;
      }
      payload.upiId = upiId.trim();
    }
    setSaving(true);
    try {
      await api.updateProfile({ payoutDetails: payload });
      Alert.alert('Saved', 'Payout account saved.');
      onSaved?.();
      await load();
    } catch (e: any) {
      Alert.alert('Save failed', e instanceof ApiError ? e.message : (e?.message || 'unknown'));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <ActivityIndicator color={primary} style={{ marginTop: 24 }} />;
  }

  const summary = method === 'bank'
    ? `${bankName || 'Bank'} ${accountNumber ? `•••• ${accountNumber.slice(-4)}` : ''}`
    : upiId || 'UPI not set';

  return (
    <View>
      {hint ? <Text style={styles.hint}>{hint}</Text> : null}
      <InfoCard label="Current payout account" value={summary.trim() || 'Not set'} />

      <View style={styles.methodRow}>
        <Button title="Bank account" variant={method === 'bank' ? 'primary' : 'outline'} onPress={() => setMethod('bank')} style={{ flex: 1 }} />
        <Button title="UPI" variant={method === 'upi' ? 'primary' : 'outline'} onPress={() => setMethod('upi')} style={{ flex: 1 }} />
      </View>

      <Input label="Account holder name" value={accountHolder} onChangeText={setAccountHolder} />

      {method === 'bank' ? (
        <>
          <Input label="Bank name" value={bankName} onChangeText={setBankName} placeholder="HDFC Bank" />
          <Input label="Account number" value={accountNumber} onChangeText={setAccountNumber} keyboardType="number-pad" />
          <Input label="IFSC code" value={ifsc} onChangeText={setIfsc} autoCapitalize="characters" placeholder="HDFC0001234" />
        </>
      ) : (
        <Input label="UPI ID" value={upiId} onChangeText={setUpiId} placeholder="business@upi" autoCapitalize="none" />
      )}

      <Button title={saving ? 'Saving…' : 'Save payout account'} onPress={save} variant="primary" fullWidth style={{ marginTop: 20 }} disabled={saving} />
    </View>
  );
}

const styles = StyleSheet.create({
  hint: { fontSize: 14, color: textSecondary, lineHeight: 20, marginBottom: 12 },
  methodRow: { flexDirection: 'row', gap: 10, marginBottom: 8 },
});
