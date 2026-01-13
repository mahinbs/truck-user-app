import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '@/components/ui/Button';
import { colors, spacing, typography, borderRadius } from '@/constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function DeliveryConfirmationScreen() {
  const [notes, setNotes] = useState('');

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Confirm Delivery</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        <View style={styles.photoSection}>
          <TouchableOpacity style={styles.photoButton}>
            <Ionicons name="camera" size={48} color={colors.primary} />
            <Text style={styles.photoText}>Upload Delivery Photo</Text>
            <Text style={styles.photoSubtext}>Tap to capture or select</Text>
          </TouchableOpacity>
        </View>

        <TextInput
          style={styles.input}
          placeholder="Delivery notes (optional)"
          value={notes}
          onChangeText={setNotes}
          multiline
          numberOfLines={3}
          textAlignVertical="top"
        />

        <View style={styles.successCard}>
          <Ionicons name="checkmark-circle" size={64} color={colors.success} />
          <Text style={styles.successTitle}>Trip Completed!</Text>
          <Text style={styles.successSubtitle}>You earned ₹12,500 from this trip</Text>
        </View>

        <Button
          title="Confirm & Complete"
          variant="gradient"
          onPress={() => {
            router.replace('/(driver)/home');
          }}
          icon="checkmark-done"
          iconPosition="right"
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
  photoSection: { marginBottom: spacing.xl },
  photoButton: { backgroundColor: colors.backgroundCard, borderRadius: borderRadius.xl, padding: spacing.xxl, alignItems: 'center', borderWidth: 2, borderColor: colors.border, borderStyle: 'dashed' },
  photoText: { fontSize: typography.sizes.md, fontWeight: typography.weights.semibold, color: colors.primary, marginTop: spacing.md },
  photoSubtext: { fontSize: typography.sizes.sm, color: colors.textSecondary, marginTop: spacing.xs },
  input: { backgroundColor: colors.backgroundCard, borderRadius: borderRadius.lg, padding: spacing.md, fontSize: typography.sizes.md, color: colors.text, borderWidth: 1, borderColor: colors.border, marginBottom: spacing.xl, minHeight: 100 },
  successCard: { alignItems: 'center', paddingVertical: spacing.xl, marginBottom: spacing.xl },
  successTitle: { fontSize: typography.sizes['2xl'], fontWeight: typography.weights.bold, color: colors.text, marginTop: spacing.md },
  successSubtitle: { fontSize: typography.sizes.md, color: colors.success, marginTop: spacing.xs, fontWeight: typography.weights.semibold },
});

