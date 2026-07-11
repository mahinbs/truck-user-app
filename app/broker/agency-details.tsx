import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text } from 'react-native';
import { Button } from '../../components/shared/Button';
import { Input } from '../../components/shared/Input';
import { ProfileSubScreen } from '../../components/shared/ProfileSubScreen';
import { primary, textSecondary } from '../../constants/Colors';
import { api, ApiError } from '../../utils/api';

export default function AgencyDetailsScreen() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [agencyName, setAgencyName] = useState('');

  const load = useCallback(async () => {
    try {
      const me = await api.me();
      setAgencyName(me.agencyName || me.name || '');
    } catch (e) {
      console.warn('agency load failed', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const save = async () => {
    if (!agencyName.trim()) {
      Alert.alert('Agency name required');
      return;
    }
    setSaving(true);
    try {
      await api.updateProfile({ agencyName: agencyName.trim() });
      Alert.alert('Saved', 'Agency name updated.');
    } catch (e: any) {
      Alert.alert('Save failed', e instanceof ApiError ? e.message : (e?.message || 'unknown'));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <ProfileSubScreen title="Agency">
        <ActivityIndicator color={primary} style={{ marginTop: 40 }} />
      </ProfileSubScreen>
    );
  }

  return (
    <ProfileSubScreen title="Agency">
      <Text style={styles.hint}>Displayed on your broker profile. GST and PAN are set during verification.</Text>
      <Input label="Agency / firm name" value={agencyName} onChangeText={setAgencyName} placeholder="Express Logistics" />
      <Button title={saving ? 'Saving…' : 'Save'} onPress={save} variant="primary" fullWidth style={{ marginTop: 20 }} disabled={saving} />
    </ProfileSubScreen>
  );
}

const styles = StyleSheet.create({
  hint: { fontSize: 14, color: textSecondary, marginBottom: 12, lineHeight: 20 },
});
