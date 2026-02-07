import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import {
    Animated,
    Dimensions,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import {
    primary,
    text,
    textSecondary
} from '../../constants/Colors';
import { theme } from '../../constants/theme';

const { width } = Dimensions.get('window');

export default function DriverProfile() {
    const router = useRouter();
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(20)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 600,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 600,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    const MenuItem = ({ icon, label, subLabel, color = primary, showDivider = true, onPress }: any) => (
        <>
            <TouchableOpacity style={styles.menuItem} onPress={onPress}>
                <View style={styles.menuItemLeft}>
                    <View style={[styles.menuIcon, { backgroundColor: `${color}15` }]}>
                        <Ionicons name={icon} size={20} color={color} />
                    </View>
                    <View>
                        <Text style={styles.menuText}>{label}</Text>
                        {subLabel && <Text style={styles.menuSubText}>{subLabel}</Text>}
                    </View>
                </View>
                <Ionicons name="chevron-forward" size={18} color={textSecondary} />
            </TouchableOpacity>
            {showDivider && <View style={styles.menuDivider} />}
        </>
    );

    const handleLogout = () => {
        router.replace('/');
    };

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={theme.gradients.background as any}
                style={StyleSheet.absoluteFillObject}
            />

            <SafeAreaView style={styles.safeArea}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity
                        onPress={() => router.back()}
                        style={styles.iconButton}
                    >
                        <Ionicons name="arrow-back" size={24} color={text} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Profile</Text>
                    <TouchableOpacity style={styles.iconButton}>
                        <Ionicons name="create-outline" size={24} color={primary} />
                    </TouchableOpacity>
                </View>

                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.content}
                    showsVerticalScrollIndicator={false}
                >
                    <Animated.View
                        style={{
                            opacity: fadeAnim,
                            transform: [{ translateY: slideAnim }],
                        }}
                    >
                        {/* Profile Info */}
                        <View style={styles.profileSection}>
                            <View style={styles.avatarContainer}>
                                <LinearGradient
                                    colors={theme.gradients.primary as any}
                                    style={styles.avatarGradient}
                                >
                                    <View style={styles.avatarInner}>
                                        <Text style={styles.avatarText}>RK</Text>
                                    </View>
                                </LinearGradient>
                                <View style={styles.verifiedBadge}>
                                    <Ionicons name="checkmark-circle" size={20} color="#10B981" />
                                </View>
                            </View>

                            <Text style={styles.userName}>Rajesh Kumar</Text>
                            <Text style={styles.userRole}>Professional Driver</Text>

                            <View style={styles.contactInfo}>
                                <Text style={styles.contactText}>rajesh.k@example.com</Text>
                                <View style={styles.contactDot} />
                                <Text style={styles.contactText}>+91 98765 43210</Text>
                            </View>
                        </View>

                        {/* Stats */}
                        <View style={styles.statsContainer}>
                            <View style={styles.statCard}>
                                <Text style={styles.statValue}>245</Text>
                                <Text style={styles.statLabel}>Trips</Text>
                            </View>
                            <View style={styles.statDivider} />
                            <View style={styles.statCard}>
                                <Text style={[styles.statValue, { color: '#F59E0B' }]}>4.8</Text>
                                <Text style={styles.statLabel}>Rating</Text>
                            </View>
                            <View style={styles.statDivider} />
                            <View style={styles.statCard}>
                                <Text style={[styles.statValue, { color: primary }]}>2.5y</Text>
                                <Text style={styles.statLabel}>Exp</Text>
                            </View>
                        </View>

                        {/* Truck Information */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Truck Information</Text>
                            <View style={styles.menuContainer}>
                                <MenuItem
                                    icon="car-outline"
                                    label="Truck Details"
                                    subLabel="Tata Prima 5530.S"
                                />
                                <MenuItem
                                    icon="document-text-outline"
                                    label="Documents"
                                    subLabel="RC, Insurance, Permit"
                                    color="#F59E0B"
                                    showDivider={false}
                                />
                            </View>
                        </View>

                        {/* Banking */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Banking</Text>
                            <View style={styles.menuContainer}>
                                <MenuItem
                                    icon="card-outline"
                                    label="Bank Account"
                                    subLabel="HDFC Bank •••• 4589"
                                    color="#10B981"
                                    showDivider={false}
                                />
                            </View>
                        </View>

                        {/* Support */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Support & Settings</Text>
                            <View style={styles.menuContainer}>
                                <MenuItem icon="help-circle-outline" label="Help & Support" color="#F59E0B" />
                                <MenuItem icon="settings-outline" label="Settings" showDivider={false} />
                            </View>
                        </View>

                        {/* Logout */}
                        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                            <Ionicons name="log-out-outline" size={20} color="#EF4444" />
                            <Text style={styles.logoutText}>Log Out</Text>
                        </TouchableOpacity>

                        <Text style={styles.versionText}>Version 1.0.0</Text>
                    </Animated.View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    safeArea: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: theme.spacing.lg,
        paddingVertical: theme.spacing.md,
    },
    headerTitle: {
        fontSize: 18,
        fontFamily: 'PlusJakartaSans_700Bold',
        color: text,
    },
    iconButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        backgroundColor: '#FFFFFF',
        ...theme.shadows.light,
    },
    scrollView: {
        flex: 1,
    },
    content: {
        paddingBottom: 110,
    },
    profileSection: {
        alignItems: 'center',
        marginVertical: theme.spacing.xl,
    },
    avatarContainer: {
        marginBottom: theme.spacing.md,
        position: 'relative',
    },
    avatarGradient: {
        width: 100,
        height: 100,
        borderRadius: 50,
        padding: 4,
        ...theme.shadows.medium,
    },
    avatarInner: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderRadius: 46,
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: {
        fontSize: 32,
        fontFamily: 'PlusJakartaSans_800ExtraBold',
        color: primary,
    },
    verifiedBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 2,
    },
    userName: {
        fontSize: 24,
        fontFamily: 'PlusJakartaSans_700Bold',
        color: text,
        marginBottom: 4,
    },
    userRole: {
        fontSize: 14,
        fontFamily: 'PlusJakartaSans_500Medium',
        color: textSecondary,
        marginBottom: theme.spacing.md,
    },
    contactInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        ...theme.shadows.light,
    },
    contactText: {
        fontSize: 12,
        color: textSecondary,
        fontFamily: 'PlusJakartaSans_500Medium',
    },
    contactDot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        marginHorizontal: 8,
    },
    statsContainer: {
        flexDirection: 'row',
        marginHorizontal: theme.spacing.lg,
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: theme.spacing.md,
        ...theme.shadows.light,
        justifyContent: 'space-between',
        marginBottom: theme.spacing.xl,
    },
    statCard: {
        flex: 1,
        alignItems: 'center',
    },
    statDivider: {
        width: 1,
        height: '80%',
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        alignSelf: 'center',
    },
    statValue: {
        fontSize: 20,
        fontFamily: 'PlusJakartaSans_700Bold',
        color: text,
        marginBottom: 2,
    },
    statLabel: {
        fontSize: 12,
        color: textSecondary,
        fontFamily: 'PlusJakartaSans_500Medium',
    },
    section: {
        marginBottom: theme.spacing.xl,
        paddingHorizontal: theme.spacing.lg,
    },
    sectionTitle: {
        fontSize: 14,
        fontFamily: 'PlusJakartaSans_700Bold',
        color: textSecondary,
        marginBottom: theme.spacing.md,
        marginLeft: 4,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    menuContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: theme.spacing.sm,
        ...theme.shadows.light,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: theme.spacing.md,
    },
    menuItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.md,
        flex: 1,
    },
    menuIcon: {
        width: 40,
        height: 40,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    menuText: {
        fontSize: 15,
        fontFamily: 'PlusJakartaSans_600SemiBold',
        color: text,
    },
    menuSubText: {
        fontSize: 12,
        color: textSecondary,
        fontFamily: 'PlusJakartaSans_400Regular',
        marginTop: 2,
    },
    menuDivider: {
        height: 1,
        backgroundColor: 'rgba(226, 232, 240, 0.5)',
        marginHorizontal: theme.spacing.md,
    },
    logoutButton: {
        marginHorizontal: theme.spacing.lg,
        padding: theme.spacing.md,
        backgroundColor: '#FEF2F2',
        borderRadius: 16,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
        borderWidth: 1,
        borderColor: '#FECACA',
        marginBottom: theme.spacing.lg,
    },
    logoutText: {
        fontSize: 15,
        fontFamily: 'PlusJakartaSans_600SemiBold',
        color: '#EF4444',
    },
    versionText: {
        textAlign: 'center',
        fontSize: 12,
        color: textSecondary,
        fontFamily: 'PlusJakartaSans_400Regular',
        marginBottom: theme.spacing.xl,
        opacity: 0.6,
    },
});
