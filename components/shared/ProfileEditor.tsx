import React, { useState } from 'react';
import { Alert, Modal, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { api, ApiError } from '../../utils/api';
import { Button } from './Button';
import { Input } from './Input';
import { Colors } from '../../constants/Colors';

type Props = {
  visible: boolean;
  onClose: () => void;
};

export function ProfileEditor({ visible, onClose }: Props) {
  const { user, updateUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [saving, setSaving] = useState(false);

  React.useEffect(() => {
    if (visible && user) {
      setName(user.name);
      setPhone(user.phone || '');
    }
  }, [visible, user]);

  const save = async () => {
    setSaving(true);
    try {
      const updated = await api.updateProfile({ name: name.trim(), phone: phone.trim() || undefined });
      await updateUser({
        name: updated.name,
        phone: updated.phone || '',
      });
      onClose();
    } catch (e: any) {
      Alert.alert('Save failed', e instanceof ApiError ? e.message : (e?.message || 'unknown'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' }}>
        <View style={{ backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20 }}>
          <Text style={{ fontSize: 18, fontWeight: '700', marginBottom: 16, color: Colors.light.text }}>
            Edit profile
          </Text>
          <Input label="Name" value={name} onChangeText={setName} />
          <Input label="Phone" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
          <View style={{ flexDirection: 'row', gap: 12, marginTop: 16 }}>
            <Button title="Cancel" variant="secondary" onPress={onClose} style={{ flex: 1 }} />
            <Button title={saving ? 'Saving…' : 'Save'} onPress={save} disabled={saving} style={{ flex: 1 }} />
          </View>
        </View>
      </View>
    </Modal>
  );
}

export function useProfileActions() {
  const { user, logout } = useAuth();
  const [editOpen, setEditOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
  };

  const initials = (user?.name || '?')
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return { user, editOpen, setEditOpen, handleLogout, initials };
}
