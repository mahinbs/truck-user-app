/**
 * Profile verification for drivers + brokers.
 * Drivers cannot go online without verification approved; brokers cannot accept loads.
 *
 * For v1 we collect document URLs as strings (admin enters Storage paths after
 * uploading separately). Once we wire expo-image-picker → /uploads/signed-url,
 * we'll replace these TextInputs with file pickers.
 */
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { Button } from '../../components/shared/Button';
import { DocUrlField } from '../../components/shared/DocUrlField';
import { Input } from '../../components/shared/Input';
import { Colors } from '../../constants/Colors';
import { theme } from '../../constants/theme';
import { useAuth } from '../../contexts/AuthContext';
import { api, ApiError } from '../../utils/api';

type Status = 'pending' | 'submitted' | 'approved' | 'rejected';

export default function VerificationScreen() {
    const router = useRouter();
    const { user } = useAuth();
    const isDriver = user?.role === 'DRIVER';
    const isBroker = user?.role === 'BROKER';

    const [status, setStatus] = useState<Status>('pending');
    const [submittedAt, setSubmittedAt] = useState<string | null>(null);
    const [rejectReason, setRejectReason] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Driver fields
    const [licenseNumber, setLicenseNumber] = useState('');
    const [licenseDocUrl, setLicenseDocUrl] = useState('');
    const [truckNumber, setTruckNumber] = useState('');
    const [rcDocUrl, setRcDocUrl] = useState('');
    // Broker fields
    const [agencyName, setAgencyName] = useState('');
    const [gstin, setGstin] = useState('');
    const [gstDocUrl, setGstDocUrl] = useState('');
    // Shared
    const [panNumber, setPanNumber] = useState('');
    const [panDocUrl, setPanDocUrl] = useState('');
    const [aadharLast4, setAadharLast4] = useState('');
    const [aadharDocUrl, setAadharDocUrl] = useState('');

    const loadStatus = useCallback(async () => {
        if (!isDriver && !isBroker) { setLoading(false); return; }
        try {
            const res: any = isDriver
                ? await api.driverVerificationStatus()
                : await api.brokerVerificationStatus();
            setStatus(res.verificationStatus);
            setSubmittedAt(res.submittedAt || null);
            setRejectReason(res.rejectReason || null);
        } catch (e) {
            console.warn('verification status fetch failed', e);
        } finally {
            setLoading(false);
        }
    }, [isDriver, isBroker]);

    useEffect(() => { loadStatus(); }, [loadStatus]);

    const submit = async () => {
        setError(null);
        if (isDriver) {
            if (!licenseNumber.trim() || !licenseDocUrl.trim() || !truckNumber.trim()) {
                setError('License number, license doc URL and truck number are required.');
                return;
            }
        } else if (isBroker) {
            if (!panNumber.trim() || !panDocUrl.trim()) {
                setError('PAN number and PAN doc URL are required.');
                return;
            }
        } else {
            setError('Only drivers and brokers complete profile verification.');
            return;
        }

        setSubmitting(true);
        try {
            const res: any = isDriver
                ? await api.driverSubmitVerification({
                    licenseNumber, licenseDocUrl,
                    panNumber: panNumber || undefined,
                    panDocUrl: panDocUrl || undefined,
                    aadharLast4: aadharLast4 || undefined,
                    aadharDocUrl: aadharDocUrl || undefined,
                    truckNumber,
                    rcDocUrl: rcDocUrl || undefined,
                })
                : await api.brokerSubmitVerification({
                    panNumber, panDocUrl,
                    aadharLast4: aadharLast4 || undefined,
                    aadharDocUrl: aadharDocUrl || undefined,
                    gstin: gstin || undefined,
                    gstDocUrl: gstDocUrl || undefined,
                    agencyName: agencyName || undefined,
                });
            setStatus(res.verificationStatus);
            setSubmittedAt(res.submittedAt || null);
            setRejectReason(null);
        } catch (e: any) {
            setError(e instanceof ApiError ? e.message : (e?.message || 'Submit failed'));
        } finally {
            setSubmitting(false);
        }
    };

    const formatSubmittedAt = (iso: string | null) => {
        if (!iso) return null;
        try {
            return new Date(iso).toLocaleString(undefined, {
                dateStyle: 'medium',
                timeStyle: 'short',
            });
        } catch {
            return null;
        }
    };

    const awaitingReview = status === 'submitted';
    const showForm = status === 'pending' || status === 'rejected';

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <ActivityIndicator size="large" color={Colors.light.primary} style={{ marginTop: 64 }} />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
                <TouchableOpacity onPress={() => router.back()} style={{ alignSelf: 'flex-start', padding: 8 }}>
                    <Ionicons name="arrow-back" size={24} color={Colors.light.text} />
                </TouchableOpacity>

                {awaitingReview ? (
                    <View style={styles.pendingWrap}>
                        <View style={styles.pendingIcon}>
                            <Ionicons name="time-outline" size={72} color="#F59E0B" />
                        </View>
                        <Text style={styles.pendingTitle}>Pending review</Text>
                        <Text style={styles.pendingSubtitle}>
                            {isDriver
                                ? 'Your license and vehicle documents were submitted successfully. An admin will review them before you can go online and accept loads.'
                                : 'Your documents were submitted successfully. An admin will review them before you can accept load opportunities.'}
                        </Text>
                        {submittedAt ? (
                            <View style={styles.pendingCard}>
                                <Text style={styles.pendingCardLabel}>Submitted on</Text>
                                <Text style={styles.pendingCardValue}>{formatSubmittedAt(submittedAt)}</Text>
                            </View>
                        ) : null}
                        <View style={styles.pendingSteps}>
                            <Text style={styles.pendingStepsTitle}>What happens next?</Text>
                            <Text style={styles.pendingStep}>1. Our team verifies your documents</Text>
                            <Text style={styles.pendingStep}>2. You get approved or asked to resubmit</Text>
                            <Text style={styles.pendingStep}>3. Once approved, you can use the app fully</Text>
                        </View>
                        <Button
                            title="Refresh status"
                            onPress={() => { setLoading(true); loadStatus(); }}
                            variant="outline"
                            fullWidth
                            style={{ marginTop: 8 }}
                        />
                    </View>
                ) : (
                    <>
                <Text style={styles.title}>Profile Verification</Text>
                <Text style={styles.subtitle}>
                    {isDriver
                        ? 'Submit your driving license + vehicle docs to start accepting loads.'
                        : isBroker
                        ? 'Submit your PAN + GST to accept load opportunities.'
                        : 'Verification is only required for drivers and brokers.'}
                </Text>

                {status !== 'pending' ? (
                    <View style={[styles.banner,
                        status === 'approved' ? styles.bannerOk :
                        status === 'rejected' ? styles.bannerErr : styles.bannerInfo]}>
                        <Text style={styles.bannerText}>
                            {status === 'approved' ? 'Approved' : status === 'rejected' ? 'Rejected — please resubmit' : status}
                        </Text>
                        {rejectReason ? <Text style={styles.bannerSub}>Reason: {rejectReason}</Text> : null}
                    </View>
                ) : null}

                {status === 'approved' ? (
                    <Button
                        title="Continue"
                        onPress={() => router.replace(isDriver ? '/driver/home' as any : '/broker/home' as any)}
                        variant="primary"
                        fullWidth
                    />
                ) : showForm ? (
                    <>
                        {isDriver && (
                            <>
                                <Text style={styles.section}>Driving License</Text>
                                <Input label="License Number" value={licenseNumber} onChangeText={setLicenseNumber} placeholder="DL01..." />
                                <DocUrlField label="License document" value={licenseDocUrl} onChangeText={setLicenseDocUrl} placeholder="Upload or paste path" />

                                <Text style={styles.section}>Vehicle</Text>
                                <Input label="Truck Number" value={truckNumber} onChangeText={setTruckNumber} placeholder="MH-12-AB-1234" autoCapitalize="characters" />
                                <DocUrlField label="RC document (optional)" value={rcDocUrl} onChangeText={setRcDocUrl} />
                            </>
                        )}

                        {isBroker && (
                            <>
                                <Text style={styles.section}>Agency</Text>
                                <Input label="Agency Name (optional)" value={agencyName} onChangeText={setAgencyName} placeholder="Your firm" />
                                <Input label="GSTIN (optional)" value={gstin} onChangeText={setGstin} placeholder="27AAAAA0000A1Z5" autoCapitalize="characters" />
                                <DocUrlField label="GST document (optional)" value={gstDocUrl} onChangeText={setGstDocUrl} />
                            </>
                        )}

                        <Text style={styles.section}>Identity</Text>
                        <Input label={isBroker ? 'PAN Number' : 'PAN Number (optional)'} value={panNumber} onChangeText={setPanNumber} placeholder="ABCDE1234F" autoCapitalize="characters" />
                        <DocUrlField label={isBroker ? 'PAN document' : 'PAN document (optional)'} value={panDocUrl} onChangeText={setPanDocUrl} />
                        <Input label="Aadhar last 4 digits (optional)" value={aadharLast4} onChangeText={setAadharLast4} keyboardType="numeric" maxLength={4} />
                        <DocUrlField label="Aadhar document (optional)" value={aadharDocUrl} onChangeText={setAadharDocUrl} />

                        {error ? <Text style={{ color: '#EF4444', marginTop: 8 }}>{error}</Text> : null}

                        <Button
                            title={submitting ? 'Submitting…' : (status === 'rejected' ? 'Resubmit' : 'Submit for Review')}
                            onPress={submit}
                            variant="primary"
                            fullWidth
                            style={{ marginTop: 24 }}
                            disabled={submitting}
                        />
                    </>
                ) : null}
                    </>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8FAFC' },
    content: { padding: theme.spacing.lg, paddingBottom: 64 },
    title: { fontSize: 26, fontWeight: '800', color: Colors.light.text, marginTop: 8 },
    subtitle: { fontSize: 14, color: Colors.light.textSecondary, marginTop: 6, marginBottom: 20 },
    section: { fontSize: 14, fontWeight: '700', color: Colors.light.text, marginTop: 20, marginBottom: 8 },
    banner: { borderRadius: 12, padding: 14, marginBottom: 20 },
    bannerOk: { backgroundColor: 'rgba(16,185,129,0.12)' },
    bannerErr: { backgroundColor: 'rgba(239,68,68,0.12)' },
    bannerWait: { backgroundColor: 'rgba(245,158,11,0.12)' },
    bannerInfo: { backgroundColor: 'rgba(59,130,246,0.12)' },
    bannerText: { fontSize: 14, fontWeight: '700', color: Colors.light.text },
    bannerSub: { fontSize: 13, color: Colors.light.text, marginTop: 4 },
    pendingWrap: { alignItems: 'center', paddingTop: 24, paddingBottom: 32 },
    pendingIcon: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: 'rgba(245,158,11,0.12)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
    },
    pendingTitle: { fontSize: 26, fontWeight: '800', color: Colors.light.text, textAlign: 'center' },
    pendingSubtitle: {
        fontSize: 15,
        lineHeight: 22,
        color: Colors.light.textSecondary,
        textAlign: 'center',
        marginTop: 10,
        marginBottom: 20,
    },
    pendingCard: {
        width: '100%',
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: 'rgba(245,158,11,0.25)',
    },
    pendingCardLabel: { fontSize: 12, color: Colors.light.textSecondary, fontWeight: '600' },
    pendingCardValue: { fontSize: 16, color: Colors.light.text, fontWeight: '700', marginTop: 4 },
    pendingSteps: {
        width: '100%',
        backgroundColor: 'rgba(59,130,246,0.06)',
        borderRadius: 12,
        padding: 16,
        marginBottom: 24,
    },
    pendingStepsTitle: { fontSize: 14, fontWeight: '700', color: Colors.light.text, marginBottom: 10 },
    pendingStep: { fontSize: 14, color: Colors.light.textSecondary, lineHeight: 22 },
});
