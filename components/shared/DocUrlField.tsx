import React, { useState } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import { Input } from './Input';
import { Colors } from '../../constants/Colors';
import { pickAndUpload, UploadBucket } from '../../utils/uploads';

type Props = {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  placeholder?: string;
  bucket?: UploadBucket;
};

export function DocUrlField({
  label,
  value,
  onChangeText,
  placeholder,
  bucket = 'verification',
}: Props) {
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const onUpload = async () => {
    setErr(null);
    setUploading(true);
    try {
      const path = await pickAndUpload(bucket);
      if (path) onChangeText(path);
    } catch (e: any) {
      setErr(e?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <View>
      <Input
        label={label}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        autoCapitalize="none"
      />
      <TouchableOpacity
        onPress={onUpload}
        disabled={uploading}
        style={{
          alignSelf: 'flex-start',
          marginTop: 6,
          paddingVertical: 8,
          paddingHorizontal: 14,
          borderRadius: 10,
          backgroundColor: Colors.light.primary,
          opacity: uploading ? 0.6 : 1,
        }}
      >
        {uploading ? (
          <ActivityIndicator color="#fff" size="small" />
        ) : (
          <Text style={{ color: '#fff', fontWeight: '600', fontSize: 13 }}>Upload file</Text>
        )}
      </TouchableOpacity>
      {err ? <Text style={{ color: '#EF4444', marginTop: 4, fontSize: 12 }}>{err}</Text> : null}
    </View>
  );
}
