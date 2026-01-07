import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { colors, spacing, typography, borderRadius, shadows } from '@/constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function KYCScreen() {
  const [formData, setFormData] = useState({
    gstNumber: '',
    panNumber: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  });
  const [documents, setDocuments] = useState({
    gstCertificate: null,
    panCard: null,
    addressProof: null,
  });
  const [loading, setLoading] = useState(false);

  const handleUpload = (docType: string) => {
    Alert.alert('Upload Document', `Upload ${docType} functionality will be implemented`);
  };

  const handleSubmit = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      router.replace('/(tabs)/dashboard');
    }, 2000);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <Ionicons name="shield-checkmark" size={40} color={colors.primary} />
            </View>
            <Text style={styles.title}>Complete KYC</Text>
            <Text style={styles.subtitle}>
              Verify your business to start booking trucks
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Business Information</Text>
            
            <Input
              label="GST Number"
              placeholder="22AAAAA0000A1Z5"
              value={formData.gstNumber}
              onChangeText={(text) =>
                setFormData({ ...formData, gstNumber: text.toUpperCase() })
              }
              icon="document-text"
              autoCapitalize="characters"
            />

            <Input
              label="PAN Number"
              placeholder="ABCDE1234F"
              value={formData.panNumber}
              onChangeText={(text) =>
                setFormData({ ...formData, panNumber: text.toUpperCase() })
              }
              icon="card"
              autoCapitalize="characters"
              maxLength={10}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Business Address</Text>
            
            <Input
              label="Address"
              placeholder="Enter your business address"
              value={formData.address}
              onChangeText={(text) =>
                setFormData({ ...formData, address: text })
              }
              icon="location"
              multiline
              numberOfLines={2}
            />

            <View style={styles.row}>
              <Input
                label="City"
                placeholder="City"
                value={formData.city}
                onChangeText={(text) =>
                  setFormData({ ...formData, city: text })
                }
                containerStyle={styles.halfInput}
              />

              <Input
                label="State"
                placeholder="State"
                value={formData.state}
                onChangeText={(text) =>
                  setFormData({ ...formData, state: text })
                }
                containerStyle={styles.halfInput}
              />
            </View>

            <Input
              label="Pincode"
              placeholder="400001"
              value={formData.pincode}
              onChangeText={(text) =>
                setFormData({ ...formData, pincode: text })
              }
              icon="pin"
              keyboardType="numeric"
              maxLength={6}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Upload Documents</Text>
            
            <Card style={styles.uploadCard} onPress={() => handleUpload('GST Certificate')}>
              <View style={styles.uploadContent}>
                <View style={styles.uploadIconContainer}>
                  <Ionicons name="cloud-upload" size={24} color={colors.primary} />
                </View>
                <View style={styles.uploadText}>
                  <Text style={styles.uploadTitle}>GST Certificate</Text>
                  <Text style={styles.uploadSubtitle}>
                    {documents.gstCertificate ? 'Uploaded' : 'Tap to upload'}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
              </View>
            </Card>

            <Card style={styles.uploadCard} onPress={() => handleUpload('PAN Card')}>
              <View style={styles.uploadContent}>
                <View style={styles.uploadIconContainer}>
                  <Ionicons name="cloud-upload" size={24} color={colors.primary} />
                </View>
                <View style={styles.uploadText}>
                  <Text style={styles.uploadTitle}>PAN Card</Text>
                  <Text style={styles.uploadSubtitle}>
                    {documents.panCard ? 'Uploaded' : 'Tap to upload'}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
              </View>
            </Card>

            <Card style={styles.uploadCard} onPress={() => handleUpload('Address Proof')}>
              <View style={styles.uploadContent}>
                <View style={styles.uploadIconContainer}>
                  <Ionicons name="cloud-upload" size={24} color={colors.primary} />
                </View>
                <View style={styles.uploadText}>
                  <Text style={styles.uploadTitle}>Address Proof</Text>
                  <Text style={styles.uploadSubtitle}>
                    {documents.addressProof ? 'Uploaded' : 'Tap to upload'}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
              </View>
            </Card>
          </View>

          <Button
            title="Submit & Continue"
            onPress={handleSubmit}
            loading={loading}
            icon="checkmark-circle"
            iconPosition="right"
            fullWidth
            style={styles.submitButton}
          />

          <TouchableOpacity 
            style={styles.skipButton}
            onPress={() => router.replace('/(tabs)/dashboard')}
          >
            <Text style={styles.skipText}>Skip for now</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: `${colors.primary}15`,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  title: {
    fontSize: typography.sizes['2xl'],
    fontWeight: typography.weights.bold,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: typography.sizes.md,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
    color: colors.text,
    marginBottom: spacing.md,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  halfInput: {
    flex: 1,
  },
  uploadCard: {
    marginBottom: spacing.md,
  },
  uploadContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  uploadIconContainer: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    backgroundColor: `${colors.primary}15`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  uploadText: {
    flex: 1,
  },
  uploadTitle: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    color: colors.text,
    marginBottom: 2,
  },
  uploadSubtitle: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
  },
  submitButton: {
    marginTop: spacing.md,
    marginBottom: spacing.md,
  },
  skipButton: {
    alignSelf: 'center',
    paddingVertical: spacing.md,
  },
  skipText: {
    fontSize: typography.sizes.md,
    color: colors.textSecondary,
    fontWeight: typography.weights.medium,
  },
});

