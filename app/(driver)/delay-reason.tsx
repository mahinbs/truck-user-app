import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '@/components/ui/Button';
import { colors, spacing, typography, borderRadius } from '@/constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';

const reasons = [
  { id: 'traffic', label: 'Heavy Traffic', icon: 'car' },
  { id: 'weather', label: 'Bad Weather', icon: 'rainy' },
  { id: 'breakdown', label: 'Vehicle Breakdown', icon: 'construct' },
  { id: 'border', label: 'Border Check', icon: 'shield-checkmark' },
  { id: 'other', label: 'Other', icon: 'ellipsis-horizontal' },
];

export default function DelayReasonScreen() {
  const [selected, setSelected] = useState('');
  const [notes, setNotes] = useState('');

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="close" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Report Delay</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        <Text style={styles.subtitle}>Select reason for delay</Text>
        <View style={styles.reasonsGrid}>
          {reasons.map((reason) => (
            <TouchableOpacity
              key={reason.id}
              style={[styles.reasonCard, selected === reason.id && styles.reasonCardActive]}
              onPress={() => setSelected(reason.id)}
            >
              <Ionicons
                name={reason.icon as any}
                size={32}
                color={selected === reason.id ? colors.primary : colors.textSecondary}
              />
              <Text style={[styles.reasonText, selected === reason.id && styles.reasonTextActive]}>
                {reason.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TextInput
          style={styles.input}
          placeholder="Additional notes (optional)"
          value={notes}
          onChangeText={setNotes}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />

        <Button
          title="Submit Report"
          variant="gradient"
          onPress={() => router.back()}
          disabled={!selected}
          fullWidth
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.lg, paddingVertical: spacing.md },
  title: { fontSize: typography.sizes.xl, fontWeight: typography.weights.bold, color: colors.text },
  content: { flex: 1, paddingHorizontal: spacing.lg },
  subtitle: { fontSize: typography.sizes.md, color: colors.textSecondary, marginBottom: spacing.md },
  reasonsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, marginBottom: spacing.xl },
  reasonCard: { width: '47%', aspectRatio: 1.2, backgroundColor: colors.backgroundCard, borderRadius: borderRadius.xl, padding: spacing.md, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: colors.border },
  reasonCardActive: { borderColor: colors.primary, backgroundColor: colors.primaryTransparent },
  reasonText: { marginTop: spacing.sm, fontSize: typography.sizes.sm, color: colors.textSecondary, textAlign: 'center' },
  reasonTextActive: { color: colors.primary, fontWeight: typography.weights.semibold },
  input: { backgroundColor: colors.backgroundCard, borderRadius: borderRadius.lg, padding: spacing.md, fontSize: typography.sizes.md, color: colors.text, borderWidth: 1, borderColor: colors.border, marginBottom: spacing.xl, minHeight: 120 },
});

