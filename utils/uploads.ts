/**
 * Pick a document and upload via backend-issued Supabase signed URL.
 * Returns the storage path stored in verification profile fields.
 */
import * as DocumentPicker from 'expo-document-picker';
import { api } from './api';

export type UploadBucket = 'verification' | 'vehicle' | 'avatars';

export async function pickAndUpload(bucket: UploadBucket): Promise<string | null> {
  const pick = await DocumentPicker.getDocumentAsync({
    type: ['image/*', 'application/pdf'],
    copyToCacheDirectory: true,
  });
  if (pick.canceled || !pick.assets?.[0]) return null;

  const asset = pick.assets[0];
  const filename = asset.name || `doc-${Date.now()}.pdf`;
  const signed = await api.signedUploadUrl(bucket, filename);
  const uploadUrl = signed.uploadUrl;
  if (!uploadUrl) throw new Error('signed upload URL missing');

  const fileRes = await fetch(asset.uri);
  const blob = await fileRes.blob();

  const put = await fetch(uploadUrl, {
    method: 'PUT',
    headers: { 'Content-Type': asset.mimeType || 'application/octet-stream' },
    body: blob,
  });
  if (!put.ok) throw new Error(`upload failed (${put.status})`);

  return signed.path;
}
