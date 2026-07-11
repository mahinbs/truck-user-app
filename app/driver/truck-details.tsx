import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Button } from '../../components/shared/Button';
import { Input } from '../../components/shared/Input';
import { InfoCard, ProfileSubScreen, SectionTitle } from '../../components/shared/ProfileSubScreen';
import { primary, text, textSecondary } from '../../constants/Colors';
import { api, ApiError } from '../../utils/api';

type TruckType = { code: string; label: string; maxWeightKg: number };

export default function TruckDetailsScreen() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [truckTypes, setTruckTypes] = useState<TruckType[]>([]);
  const [truckType, setTruckType] = useState('');
  const [truckNumber, setTruckNumber] = useState('');
  const [verificationStatus, setVerificationStatus] = useState('pending');

  const load = useCallback(async () => {
    try {
      const [me, types] = await Promise.all([api.me(), api.truckTypes() as Promise<TruckType[]>]);
      setTruckTypes(types);
      setTruckType(me.truckType || '');
      setTruckNumber(me.truckNumber || '');
      setVerificationStatus(me.verificationStatus || 'pending');
    } catch (e) {
      console.warn('truck details load failed', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const selected = truckTypes.find((t) => t.code === truckType || t.label === truckType);
  const isVerified = verificationStatus === 'approved';

  const save = async () => {
    if (!truckType) {
      Alert.alert('Select truck type', 'Choose the type of truck you operate.');
      return;
    }
    if (!isVerified && !truckNumber.trim()) {
      Alert.alert('Truck number required', 'Enter your vehicle registration number.');
      return;
    }
    setSaving(true);
    try {
      const body: { truckType: string; truckNumber?: string } = {
        truckType: selected?.code || truckType,
      };
      if (!isVerified) {
        body.truckNumber = truckNumber.trim().toUpperCase();
      }
      await api.updateProfile(body);
      Alert.alert('Saved', 'Truck details updated. You will receive loads matching this type.');
      await load();
    } catch (e: any) {
      Alert.alert('Save failed', e instanceof ApiError ? e.message : (e?.message || 'unknown'));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <ProfileSubScreen title="Truck Details">
        <ActivityIndicator color={primary} style={{ marginTop: 40 }} />
      </ProfileSubScreen>
    );
  }

  return (
    <ProfileSubScreen title="Truck Details">
      <Text style={styles.hint}>
        After verification is approved, set your truck type so you receive matching load offers.
      </Text>
      <InfoCard label="Verification" value={verificationStatus} />

      <SectionTitle>Truck type</SectionTitle>
      <View style={styles.typeGrid}>
        {truckTypes.map((t) => {
          const active = truckType === t.code || truckType === t.label;
          return (
            <TouchableOpacity
              key={t.code}
              style={[styles.typeChip, active && styles.typeChipActive]}
              onPress={() => setTruckType(t.code)}
            >
              <Text style={[styles.typeChipText, active && styles.typeChipTextActive]}>{t.label}</Text>
              <Text style={styles.typeChipSub}>Up to {t.maxWeightKg.toLocaleString()} kg</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {selected ? (
        <InfoCard label="Selected truck type" value={selected.label} />
      ) : null}

      {isVerified ? (
        <InfoCard
          label="Registration number"
          value={truckNumber || '—'}
        />
      ) : (
        <Input
          label="Registration number"
          value={truckNumber}
          onChangeText={setTruckNumber}
          placeholder="MH-12-AB-1234"
          autoCapitalize="characters"
        />
      )}
      {isVerified ? (
        <Text style={styles.lockedHint}>
          Registration was verified with your documents and cannot be changed here.
        </Text>
      ) : null}

      <Button
        title={saving ? 'Saving…' : 'Save truck type'}
        onPress={save}
        variant="primary"
        fullWidth
        style={{ marginTop: 20 }}
        disabled={saving}
      />
    </ProfileSubScreen>
  );
}

const styles = StyleSheet.create({
  hint: { fontSize: 14, color: textSecondary, lineHeight: 20, marginBottom: 12 },
  typeGrid: { gap: 10, marginBottom: 16 },
  typeChip: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  typeChipActive: { borderColor: primary, backgroundColor: 'rgba(59,130,246,0.08)' },
  typeChipText: { fontSize: 15, fontWeight: '700', color: text },
  typeChipTextActive: { color: primary },
  typeChipSub: { fontSize: 12, color: textSecondary, marginTop: 4 },
  lockedHint: {
    fontSize: 13,
    color: textSecondary,
    lineHeight: 18,
    marginTop: -4,
    marginBottom: 8,
    fontStyle: 'italic',
  },
});
