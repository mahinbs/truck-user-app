import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, Modal, TextInput } from 'react-native';
import { ProfileEditor, useProfileActions } from '../../components/shared/ProfileEditor';
import { payoutSummary } from '../../components/shared/PayoutAccountForm';
import { api, ApiError, ApiUser } from '../../utils/api';
import { Button } from '../../components/shared/Button';
import {
    Animated,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { Colors } from '../../constants/Colors';
import { theme } from '../../constants/theme';

function memberSince(createdAt?: string | null) {
    if (!createdAt) return '—';
    const months = Math.max(1, Math.round((Date.now() - new Date(createdAt).getTime()) / (30 * 24 * 3600 * 1000)));
    if (months < 12) return `${months}mo`;
    return `${(months / 12).toFixed(1)}y`;
}

export default function BrokerProfile() {
    const router = useRouter();
    const { user, editOpen, setEditOpen, handleLogout, initials } = useProfileActions();
    const [profile, setProfile] = useState<ApiUser | null>(null);
    const [commissionPct, setCommissionPct] = useState('');
    const [commissionOpen, setCommissionOpen] = useState(false);
    const [stats, setStats] = useState({ drivers: 0, activeTrips: 0, volume: 0 });
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(20)).current;

    const load = useCallback(async () => {
        try {
            const [me, drivers, trips, dash, comm] = await Promise.all([
                api.me(),
                api.brokerMyDrivers() as Promise<any[]>,
                api.brokerActiveTrips() as Promise<any[]>,
                api.brokerEarningsSummary() as Promise<{ driverPool?: { totalEarnedByDrivers?: number } }>,
                api.brokerGetCommission(),
            ]);
            setProfile(me);
            setCommissionPct(comm.commissionPct != null ? String(comm.commissionPct) : '');
            setStats({
                drivers: drivers.length,
                activeTrips: trips.length,
                volume: Math.round(dash.driverPool?.totalEarnedByDrivers || 0),
            });
        } catch (e) {
            console.warn('broker profile load failed', e);
        }
    }, []);

    useFocusEffect(useCallback(() => { load(); }, [load]));

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
            Animated.timing(slideAnim, { toValue: 0, duration: 600, useNativeDriver: true }),
        ]).start();
    }, []);

    const onLogout = async () => {
        await handleLogout();
        router.replace('/');
    };

    const saveCommission = async () => {
        const pct = parseFloat(commissionPct);
        if (!Number.isFinite(pct)) {
            Alert.alert('Enter a valid commission %');
            return;
        }
        try {
            await api.brokerSetCommission(pct);
            setCommissionOpen(false);
            Alert.alert('Saved', 'Commission updated.');
            load();
        } catch (e: any) {
            Alert.alert('Failed', e instanceof ApiError ? e.message : (e?.message || 'unknown'));
        }
    };

    const MenuItem = ({ icon, label, subLabel, color = Colors.light.primary, showDivider = true, onPress }: any) => (
        <>
            <TouchableOpacity style={styles.menuItem} onPress={onPress}>
                <View style={styles.menuItemLeft}>
                    <View style={[styles.menuIcon, { backgroundColor: `${color}15` }]}>
                        <Ionicons name={icon} size={20} color={color} />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.menuText}>{label}</Text>
                        {subLabel ? <Text style={styles.menuSubText}>{subLabel}</Text> : null}
                    </View>
                </View>
                <Ionicons name="chevron-forward" size={18} color={Colors.light.textSecondary} />
            </TouchableOpacity>
            {showDivider && <View style={styles.menuDivider} />}
        </>
    );

    const verStatus = profile?.verificationStatus || 'pending';
    const docSub = verStatus === 'approved' ? 'Verified — view uploads' : verStatus === 'submitted' ? 'Pending review' : 'PAN, GST, agency';

    return (
        <View style={styles.container}>
            <LinearGradient colors={theme.gradients.background as any} style={StyleSheet.absoluteFillObject} />

            <SafeAreaView style={styles.safeArea}>
                <View style={styles.header}>
                    <View style={styles.iconButton} />
                    <Text style={styles.headerTitle}>Broker Profile</Text>
                    <TouchableOpacity style={styles.iconButton} onPress={() => setEditOpen(true)}>
                        <Ionicons name="create-outline" size={24} color={Colors.light.primary} />
                    </TouchableOpacity>
                </View>

                <ScrollView style={styles.scrollView} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                    <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
                        <View style={styles.profileSection}>
                            <View style={styles.avatarContainer}>
                                <LinearGradient colors={theme.gradients.primary as any} style={styles.avatarGradient}>
                                    <View style={styles.avatarInner}>
                                        <Text style={styles.avatarText}>{initials}</Text>
                                    </View>
                                </LinearGradient>
                                {(profile?.isVerified || user?.isVerified) ? (
                                    <View style={styles.verifiedBadge}>
                                        <Ionicons name="checkmark-circle" size={20} color="#10B981" />
                                    </View>
                                ) : null}
                            </View>

                            <Text style={styles.userName}>{profile?.agencyName || user?.name || 'Broker'}</Text>
                            <Text style={styles.userRole}>Licensed Freight Broker</Text>

                            <View style={styles.contactInfo}>
                                <Text style={styles.contactText}>{user?.email || ''}</Text>
                                {user?.phone ? (
                                    <>
                                        <View style={styles.contactDot} />
                                        <Text style={styles.contactText}>{user.phone}</Text>
                                    </>
                                ) : null}
                            </View>
                        </View>

                        <View style={styles.statsContainer}>
                            <View style={styles.statCard}>
                                <Text style={styles.statValue}>{stats.drivers}</Text>
                                <Text style={styles.statLabel}>Drivers</Text>
                            </View>
                            <View style={styles.statDivider} />
                            <View style={styles.statCard}>
                                <Text style={[styles.statValue, { color: '#10B981' }]}>{stats.activeTrips}</Text>
                                <Text style={styles.statLabel}>Active trips</Text>
                            </View>
                            <View style={styles.statDivider} />
                            <View style={styles.statCard}>
                                <Text style={[styles.statValue, { color: '#F59E0B', fontSize: 16 }]}>
                                    ₹{stats.volume >= 100000 ? `${(stats.volume / 100000).toFixed(1)}L` : stats.volume.toLocaleString()}
                                </Text>
                                <Text style={styles.statLabel}>Volume</Text>
                            </View>
                        </View>

                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Brokerage</Text>
                            <View style={styles.menuContainer}>
                                <MenuItem
                                    icon="business-outline"
                                    label="Company Documents & GST"
                                    subLabel={docSub}
                                    onPress={() => router.push('/broker/documents' as any)}
                                />
                                <MenuItem
                                    icon="storefront-outline"
                                    label="Agency details"
                                    subLabel={profile?.agencyName || 'Firm name'}
                                    onPress={() => router.push('/broker/agency-details' as any)}
                                />
                                <MenuItem
                                    icon="people-outline"
                                    label="Manage drivers"
                                    subLabel={`${stats.drivers} in fleet`}
                                    onPress={() => router.push('/broker/drivers' as any)}
                                />
                                <MenuItem
                                    icon="pie-chart-outline"
                                    label="Commission rate"
                                    subLabel={commissionPct ? `${commissionPct}%` : 'Not set'}
                                    color="#8B5CF6"
                                    onPress={() => setCommissionOpen(true)}
                                />
                                <MenuItem
                                    icon="wallet-outline"
                                    label="Bank payout account"
                                    subLabel={payoutSummary(profile?.payoutDetails)}
                                    color="#10B981"
                                    onPress={() => router.push('/broker/payment-methods' as any)}
                                />
                                <MenuItem
                                    icon="cash-outline"
                                    label="Earnings & withdrawals"
                                    subLabel="Wallet, driver payouts"
                                    onPress={() => router.push('/broker/earnings' as any)}
                                    showDivider={false}
                                />
                            </View>
                        </View>

                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Support & Legal</Text>
                            <View style={styles.menuContainer}>
                                <MenuItem icon="notifications-outline" label="Alert settings" onPress={() => router.push('/broker/notifications' as any)} />
                                <MenuItem icon="help-circle-outline" label="Broker Help & FAQ" color="#F59E0B" onPress={() => router.push('/broker/help' as any)} />
                                <MenuItem icon="settings-outline" label="Settings" onPress={() => router.push('/broker/settings' as any)} />
                                <MenuItem icon="document-text-outline" label="T&C & Commission Policy" showDivider={false} onPress={() => router.push('/broker/terms' as any)} />
                            </View>
                        </View>

                        <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
                            <Ionicons name="log-out-outline" size={20} color="#EF4444" />
                            <Text style={styles.logoutText}>Log Out</Text>
                        </TouchableOpacity>

                        <Text style={styles.versionText}>Version 1.0.0 · Member {memberSince(profile?.createdAt)}</Text>
                    </Animated.View>
                </ScrollView>
            </SafeAreaView>

            <ProfileEditor visible={editOpen} onClose={() => setEditOpen(false)} />

            <Modal visible={commissionOpen} transparent animationType="slide">
                <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' }}>
                    <View style={{ backgroundColor: '#fff', padding: 20, borderTopLeftRadius: 16, borderTopRightRadius: 16 }}>
                        <Text style={{ fontSize: 18, fontWeight: '700', marginBottom: 12 }}>Commission %</Text>
                        <TextInput
                            value={commissionPct}
                            onChangeText={setCommissionPct}
                            keyboardType="decimal-pad"
                            placeholder="e.g. 3"
                            style={{ borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 10, padding: 12, marginBottom: 12 }}
                        />
                        <Button title="Save" onPress={saveCommission} fullWidth />
                        <Button title="Cancel" variant="secondary" onPress={() => setCommissionOpen(false)} fullWidth style={{ marginTop: 8 }} />
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8FAFC' },
    safeArea: { flex: 1 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: theme.spacing.lg,
        paddingVertical: theme.spacing.md,
    },
    headerTitle: { fontSize: 18, fontFamily: 'PlusJakartaSans_700Bold', color: Colors.light.text },
    iconButton: {
        width: 40, height: 40, justifyContent: 'center', alignItems: 'center',
        borderRadius: 20, backgroundColor: '#FFFFFF', ...theme.shadows.light,
    },
    scrollView: { flex: 1 },
    content: { paddingBottom: 110 },
    profileSection: { alignItems: 'center', marginVertical: theme.spacing.xl },
    avatarContainer: { marginBottom: theme.spacing.md, position: 'relative' },
    avatarGradient: { width: 100, height: 100, borderRadius: 50, padding: 4, ...theme.shadows.medium },
    avatarInner: { flex: 1, backgroundColor: '#FFFFFF', borderRadius: 46, justifyContent: 'center', alignItems: 'center' },
    avatarText: { fontSize: 32, fontFamily: 'PlusJakartaSans_800ExtraBold', color: Colors.light.primary },
    verifiedBadge: { position: 'absolute', bottom: 0, right: 0, backgroundColor: '#FFFFFF', borderRadius: 12, padding: 2 },
    userName: { fontSize: 24, fontFamily: 'PlusJakartaSans_700Bold', color: Colors.light.text, marginBottom: 4 },
    userRole: { fontSize: 14, fontFamily: 'PlusJakartaSans_500Medium', color: Colors.light.textSecondary, marginBottom: theme.spacing.md },
    contactInfo: {
        flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF',
        paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, ...theme.shadows.light,
    },
    contactText: { fontSize: 12, color: Colors.light.textSecondary, fontFamily: 'PlusJakartaSans_500Medium' },
    contactDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: Colors.light.border, marginHorizontal: 8 },
    statsContainer: {
        flexDirection: 'row', marginHorizontal: theme.spacing.lg, backgroundColor: '#FFFFFF',
        borderRadius: 20, padding: theme.spacing.md, ...theme.shadows.light,
        justifyContent: 'space-between', marginBottom: theme.spacing.xl,
    },
    statCard: { flex: 1, alignItems: 'center' },
    statDivider: { width: 1, height: '80%', backgroundColor: Colors.light.border, alignSelf: 'center' },
    statValue: { fontSize: 20, fontFamily: 'PlusJakartaSans_700Bold', color: Colors.light.text, marginBottom: 2 },
    statLabel: { fontSize: 12, color: Colors.light.textSecondary, fontFamily: 'PlusJakartaSans_500Medium' },
    section: { marginBottom: theme.spacing.xl, paddingHorizontal: theme.spacing.lg },
    sectionTitle: {
        fontSize: 14, fontFamily: 'PlusJakartaSans_700Bold', color: Colors.light.textSecondary,
        marginBottom: theme.spacing.md, marginLeft: 4, textTransform: 'uppercase', letterSpacing: 0.5,
    },
    menuContainer: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: theme.spacing.sm, ...theme.shadows.light },
    menuItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: theme.spacing.md },
    menuItemLeft: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.md, flex: 1 },
    menuIcon: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
    menuText: { fontSize: 15, fontFamily: 'PlusJakartaSans_600SemiBold', color: Colors.light.text },
    menuSubText: { fontSize: 12, color: Colors.light.textSecondary, fontFamily: 'PlusJakartaSans_400Regular', marginTop: 2 },
    menuDivider: { height: 1, backgroundColor: Colors.light.border, marginHorizontal: theme.spacing.md, opacity: 0.5 },
    logoutButton: {
        marginHorizontal: theme.spacing.lg, padding: theme.spacing.md, backgroundColor: '#FEF2F2',
        borderRadius: 16, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8,
        borderWidth: 1, borderColor: '#FECACA', marginBottom: theme.spacing.lg,
    },
    logoutText: { fontSize: 15, fontFamily: 'PlusJakartaSans_600SemiBold', color: '#EF4444' },
    versionText: { textAlign: 'center', fontSize: 12, color: Colors.light.textSecondary, marginBottom: theme.spacing.xl },
});
