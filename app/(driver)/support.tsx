import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '@/components/ui/Card';
import { colors, spacing, typography, borderRadius } from '@/constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SupportScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Help & Support</Text>
      </View>

      <View style={styles.content}>
        <TouchableOpacity style={styles.sosButton}>
          <Ionicons name="alert-circle" size={32} color={colors.textWhite} />
          <Text style={styles.sosText}>Emergency SOS</Text>
        </TouchableOpacity>

        <Card style={styles.helpCard}>
          <Ionicons name="call" size={24} color={colors.primary} />
          <View style={styles.helpInfo}>
            <Text style={styles.helpTitle}>Call Support</Text>
            <Text style={styles.helpSubtitle}>Available 24/7</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
        </Card>

        <Card style={styles.helpCard}>
          <Ionicons name="chatbubbles" size={24} color={colors.primary} />
          <View style={styles.helpInfo}>
            <Text style={styles.helpTitle}>Chat with Us</Text>
            <Text style={styles.helpSubtitle}>Get instant help</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
        </Card>

        <Card style={styles.helpCard}>
          <Ionicons name="help-circle" size={24} color={colors.primary} />
          <View style={styles.helpInfo}>
            <Text style={styles.helpTitle}>FAQs</Text>
            <Text style={styles.helpSubtitle}>Find quick answers</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
        </Card>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { paddingHorizontal: spacing.lg, paddingVertical: spacing.md },
  title: { fontSize: typography.sizes['2xl'], fontWeight: typography.weights.bold, color: colors.text },
  content: { flex: 1, paddingHorizontal: spacing.lg },
  sosButton: { backgroundColor: colors.error, borderRadius: borderRadius.xl, padding: spacing.xl, alignItems: 'center', marginBottom: spacing.xl },
  sosText: { fontSize: typography.sizes.xl, fontWeight: typography.weights.bold, color: colors.textWhite, marginTop: spacing.sm },
  helpCard: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.md },
  helpInfo: { flex: 1 },
  helpTitle: { fontSize: typography.sizes.md, fontWeight: typography.weights.semibold, color: colors.text, marginBottom: 2 },
  helpSubtitle: { fontSize: typography.sizes.sm, color: colors.textSecondary },
});

