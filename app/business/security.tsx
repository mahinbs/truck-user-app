import React, { useState } from 'react';
import { Alert, StyleSheet, Text } from 'react-native';
import { Button } from '../../components/shared/Button';
import { Input } from '../../components/shared/Input';
import { ProfileSubScreen } from '../../components/shared/ProfileSubScreen';
import { textSecondary } from '../../constants/Colors';
import { api, ApiError } from '../../utils/api';
import { useAuth } from '../../contexts/AuthContext';

export default function SecurityScreen() {
  const { user } = useAuth();
  const [email, setEmail] = useState(user?.email || '');
  const [busy, setBusy] = useState(false);

  const resetRequest = async () => {
    setBusy(true);
    try {
      await api.forgotPassword(email.trim());
      Alert.alert('Check your email', 'If an account exists, password reset instructions were sent.');
    } catch (e: any) {
      Alert.alert('Failed', e instanceof ApiError ? e.message : (e?.message || 'unknown'));
    } finally {
      setBusy(false);
    }
  };

  return (
    <ProfileSubScreen title="Security & Privacy">
      <Text style={styles.hint}>
        Password changes are handled via email reset. Your data is encrypted in transit and sensitive driver KYC is encrypted at rest.
      </Text>
      <Input label="Account email" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
      <Button title={busy ? 'Sending…' : 'Send password reset email'} onPress={resetRequest} variant="primary" fullWidth disabled={busy} style={{ marginTop: 16 }} />
    </ProfileSubScreen>
  );
}

const styles = StyleSheet.create({
  hint: { fontSize: 14, color: textSecondary, lineHeight: 21, marginBottom: 16 },
});
