import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { primary, textSecondary } from '../../constants/Colors';
import { api } from '../../utils/api';
import { docFileName } from './ProfileSubScreen';

type Props = {
  path: string;
  bucket?: 'verification' | 'vehicle' | 'avatars';
  label?: string;
};

export function DocPreview({ path, bucket = 'verification', label }: Props) {
  const [url, setUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const name = docFileName(path) || 'document';
  const isPdf = /\.pdf$/i.test(path);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.signedDownloadUrl(bucket, path);
        if (!cancelled) setUrl(res.downloadUrl);
      } catch (e: any) {
        if (!cancelled) setError(e?.message || 'Could not load preview');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [path, bucket]);

  if (loading) {
    return (
      <View style={styles.box}>
        <ActivityIndicator color={primary} />
        <Text style={styles.meta}>Loading preview…</Text>
      </View>
    );
  }

  if (error || !url) {
    return (
      <View style={styles.box}>
        <Text style={styles.meta}>{error || 'Preview unavailable'}</Text>
        <Text style={styles.fileName}>{name}</Text>
      </View>
    );
  }

  if (isPdf) {
    return (
      <TouchableOpacity style={styles.pdfBox} onPress={() => Linking.openURL(url)}>
        <Text style={styles.pdfIcon}>📄</Text>
        <Text style={styles.pdfText}>Open PDF</Text>
        <Text style={styles.fileName}>{name}</Text>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.wrap}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <Image source={{ uri: url }} style={styles.image} resizeMode="contain" />
      <TouchableOpacity onPress={() => Linking.openURL(url)}>
        <Text style={styles.openLink}>Open full size</Text>
      </TouchableOpacity>
      <Text style={styles.fileName}>{name}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginTop: 4 },
  label: { fontSize: 12, color: textSecondary, marginBottom: 6 },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  openLink: { color: primary, fontWeight: '600', fontSize: 13, marginTop: 8 },
  fileName: { fontSize: 11, color: textSecondary, marginTop: 4 },
  box: { padding: 16, alignItems: 'center', backgroundColor: '#F8FAFC', borderRadius: 10 },
  meta: { fontSize: 13, color: textSecondary, marginTop: 8 },
  pdfBox: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  pdfIcon: { fontSize: 32 },
  pdfText: { fontSize: 15, fontWeight: '700', color: primary, marginTop: 8 },
});
