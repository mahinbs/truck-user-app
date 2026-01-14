import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { colors, spacing, typography } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Alert, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function DriverProfileScreen() {
  const { logout } = useAuth();

  const handleLogout = async () => {
    if (Platform.OS === 'web') {
      // Use window.confirm for web
      const confirmed = window.confirm('Are you sure you want to logout?');
      if (confirmed) {
        try {
          await logout();
          router.replace('/(auth)/role-selection');
        } catch (error) {
          console.error('Logout error:', error);
          window.alert('Failed to logout. Please try again.');
        }
      }
    } else {
      // Use Alert.alert for native platforms
      Alert.alert(
        'Logout',
        'Are you sure you want to logout?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Logout',
            style: 'destructive',
            onPress: async () => {
              try {
                await logout();
                router.replace('/(auth)/role-selection');
              } catch (error) {
                console.error('Logout error:', error);
                Alert.alert('Error', 'Failed to logout. Please try again.');
              }
            },
          },
        ]
      );
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={48} color={colors.primary} />
          </View>
          <Text style={styles.name}>Raj Kumar</Text>
          <Text style={styles.vehicle}>MH 02 AB 1234 • Container Truck</Text>
          <View style={styles.rating}>
            <Ionicons name="star" size={18} color={colors.warning} />
            <Text style={styles.ratingText}>4.8 (127 trips)</Text>
          </View>
        </View>

        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Documents</Text>
          {['Driving License', 'Vehicle RC', 'Insurance'].map((doc) => (
            <TouchableOpacity key={doc} style={styles.menuItem}>
              <Ionicons name="document-text" size={20} color={colors.primary} />
              <Text style={styles.menuText}>{doc}</Text>
              <Ionicons name="checkmark-circle" size={20} color={colors.success} />
            </TouchableOpacity>
          ))}
        </Card>

        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          {[
            { icon: 'notifications', label: 'Notifications' },
            { icon: 'help-circle', label: 'Help & Support' },
            { icon: 'shield-checkmark', label: 'Privacy Policy' },
          ].map((item) => (
            <TouchableOpacity key={item.label} style={styles.menuItem}>
              <Ionicons name={item.icon as any} size={20} color={colors.primary} />
              <Text style={styles.menuText}>{item.label}</Text>
              <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          ))}
        </Card>

        <View style={styles.logoutContainer}>
          <Button
            title="Logout"
            variant="outline"
            onPress={handleLogout}
            icon="log-out"
            fullWidth
            style={styles.logoutButton}
          />
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: colors.background 
  },
  scrollView: { 
    flex: 1 
  },
  scrollContent: {
    paddingBottom: spacing.xxl,
  },
  profileHeader: { 
    alignItems: 'center', 
    paddingVertical: spacing.xl 
  },
  avatar: { 
    width: 100, 
    height: 100, 
    borderRadius: 50, 
    backgroundColor: colors.primaryTransparent, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginBottom: spacing.md 
  },
  name: { 
    fontSize: typography.sizes['2xl'], 
    fontWeight: typography.weights.bold, 
    color: colors.text, 
    marginBottom: spacing.xs 
  },
  vehicle: { 
    fontSize: typography.sizes.sm, 
    color: colors.textSecondary, 
    marginBottom: spacing.sm 
  },
  rating: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: spacing.xs 
  },
  ratingText: { 
    fontSize: typography.sizes.md, 
    fontWeight: typography.weights.semibold, 
    color: colors.text 
  },
  section: { 
    marginHorizontal: spacing.lg, 
    marginBottom: spacing.md 
  },
  sectionTitle: { 
    fontSize: typography.sizes.lg, 
    fontWeight: typography.weights.semibold, 
    color: colors.text, 
    marginBottom: spacing.md 
  },
  menuItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: spacing.md, 
    paddingVertical: spacing.md 
  },
  menuText: { 
    flex: 1, 
    fontSize: typography.sizes.md, 
    color: colors.text 
  },
  logoutContainer: {
    paddingHorizontal: spacing.lg,
    marginTop: spacing.md,
    marginBottom: spacing.md,
  },
  logoutButton: { 
    borderColor: colors.error 
  },
  bottomSpacer: {
    height: 100,
  },
});

