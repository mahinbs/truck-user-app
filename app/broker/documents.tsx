import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Button } from '../../components/shared/Button';
import { DocPreview } from '../../components/shared/DocPreview';
import { ProfileSubScreen, SectionTitle } from '../../components/shared/ProfileSubScreen';
import { primary, text, textSecondary } from '../../constants/Colors';
import { api } from '../../utils/api';

type TextRow = { kind: 'text'; label: string; value: string };
type FileRow = { kind: 'file'; label: string; path: string };
type Row = TextRow | FileRow;

export default function BrokerDocumentsScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('pending');
  const [rejectReason, setRejectReason] = useState<string | null>(null);
  const [submittedAt, setSubmittedAt] = useState<string | null>(null);
  const [rows, setRows] = useState<Row[]>([]);

  const load = useCallback(async () => {
    try {
      const res: any = await api.brokerVerificationStatus();
      const d = res.docs || {};
      setStatus(res.verificationStatus);
      setRejectReason(res.rejectReason || null);
      setSubmittedAt(res.submittedAt || null);
      const next: Row[] = [];
      if (d.agencyName) next.push({ kind: 'text', label: 'Agency name', value: d.agencyName });
      if (d.panNumber) next.push({ kind: 'text', label: 'PAN number', value: d.panNumber });
      if (d.panDocUrl) next.push({ kind: 'file', label: 'PAN document', path: d.panDocUrl });
      if (d.gstin) next.push({ kind: 'text', label: 'GSTIN', value: d.gstin });
      if (d.gstDocUrl) next.push({ kind: 'file', label: 'GST document', path: d.gstDocUrl });
      if (d.aadharLast4) next.push({ kind: 'text', label: 'Aadhar last 4', value: d.aadharLast4 });
      if (d.aadharDocUrl) next.push({ kind: 'file', label: 'Aadhar document', path: d.aadharDocUrl });
      setRows(next);
    } catch (e) {
      console.warn('broker documents load failed', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  if (loading) {
    return (
      <ProfileSubScreen title="Company Documents">
        <ActivityIndicator color={primary} style={{ marginTop: 40 }} />
      </ProfileSubScreen>
    );
  }

  return (
    <ProfileSubScreen title="Company Documents">
      <View style={[styles.banner, status === 'approved' ? styles.ok : status === 'rejected' ? styles.err : styles.wait]}>
        <Text style={styles.bannerTitle}>Verification: {status}</Text>
        {submittedAt ? <Text style={styles.bannerSub}>Submitted {new Date(submittedAt).toLocaleString()}</Text> : null}
        {rejectReason ? <Text style={styles.bannerSub}>Reason: {rejectReason}</Text> : null}
      </View>

      {rows.length === 0 ? (
        <Text style={styles.empty}>No documents on file. Complete verification to upload PAN, GST and agency details.</Text>
      ) : (
        <>
          <SectionTitle>Agency details</SectionTitle>
          {rows.filter((r) => r.kind === 'text').map((row) => (
            <View key={row.label} style={styles.row}>
              <Text style={styles.rowLabel}>{row.label}</Text>
              <Text style={styles.rowValue}>{(row as TextRow).value}</Text>
            </View>
          ))}
          <SectionTitle>Uploaded files</SectionTitle>
          {rows.filter((r) => r.kind === 'file').map((row) => (
            <View key={row.label} style={styles.row}>
              <Text style={styles.rowLabel}>{row.label}</Text>
              <DocPreview path={(row as FileRow).path} />
            </View>
          ))}
        </>
      )}

      {(status === 'pending' || status === 'rejected') ? (
        <Button
          title={status === 'rejected' ? 'Resubmit verification' : 'Upload documents'}
          onPress={() => router.push('/(onboarding)/verification' as any)}
          variant="primary"
          fullWidth
          style={{ marginTop: 24 }}
        />
      ) : null}
      {status === 'submitted' ? (
        <TouchableOpacity onPress={load} style={{ marginTop: 16, alignItems: 'center' }}>
          <Text style={{ color: primary, fontWeight: '600' }}>Refresh status</Text>
        </TouchableOpacity>
      ) : null}
    </ProfileSubScreen>
  );
}

const styles = StyleSheet.create({
  banner: { borderRadius: 12, padding: 14, marginBottom: 16 },
  ok: { backgroundColor: 'rgba(16,185,129,0.12)' },
  err: { backgroundColor: 'rgba(239,68,68,0.12)' },
  wait: { backgroundColor: 'rgba(245,158,11,0.12)' },
  bannerTitle: { fontSize: 15, fontWeight: '700' },
  bannerSub: { fontSize: 13, color: textSecondary, marginTop: 4 },
  empty: { fontSize: 14, color: textSecondary, lineHeight: 22, textAlign: 'center', marginTop: 24 },
  row: { backgroundColor: '#fff', borderRadius: 12, padding: 14, marginBottom: 10 },
  rowLabel: { fontSize: 12, color: textSecondary, fontWeight: '600', marginBottom: 6 },
  rowValue: { fontSize: 16, fontWeight: '700', color: text },
});
