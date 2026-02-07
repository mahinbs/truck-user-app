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
    View
} from 'react-native';
import { Colors } from '../../constants/Colors';
import { theme } from '../../constants/theme';

const { width } = Dimensions.get('window');

export default function Profile() {
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

    const MenuItem = ({ icon, label, color = Colors.light.primary, showDivider = true, onPress }: any) => (
        <>
            <TouchableOpacity style={styles.menuItem} onPress={onPress}>
                <View style={styles.menuItemLeft}>
                    <View style={[styles.menuIcon, { backgroundColor: `${color}15` }]}>
                        <Ionicons name={icon} size={20} color={color} />
                    </View>
                    <Text style={styles.menuText}>{label}</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={Colors.light.textSecondary} />
            </TouchableOpacity>
            {showDivider && <View style={styles.menuDivider} />}
        </>
    );

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
                        <Ionicons name="arrow-back" size={24} color={Colors.light.text} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Profile</Text>
                    <TouchableOpacity style={styles.iconButton}>
                        <Ionicons name="create-outline" size={24} color={Colors.light.primary} />
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
                        {/* Profile Info - Light & Clean */}
                        <View style={styles.profileSection}>
                            <View style={styles.avatarContainer}>
                                <LinearGradient
                                    colors={theme.gradients.primary as any}
                                    style={styles.avatarGradient}
                                >
                                    <View style={styles.avatarInner}>
                                        <Text style={styles.avatarText}>JD</Text>
                                    </View>
                                </LinearGradient>
                                <View style={styles.verifiedBadge}>
                                    <Ionicons name="checkmark-circle" size={20} color="#10B981" />
                                </View>
                            </View>

                            <Text style={styles.userName}>John Doe</Text>
                            <Text style={styles.userRole}>Business Account</Text>

                            <View style={styles.contactInfo}>
                                <Text style={styles.contactText}>john.doe@example.com</Text>
                                <View style={styles.contactDot} />
                                <Text style={styles.contactText}>+91 98765 43210</Text>
                            </View>
                        </View>

                        {/* Stats - Horizontal Scroll or Grid */}
                        <View style={styles.statsContainer}>
                            <View style={styles.statCard}>
                                <Text style={styles.statValue}>48</Text>
                                <Text style={styles.statLabel}>Total</Text>
                            </View>
                            <View style={styles.statDivider} />
                            <View style={styles.statCard}>
                                <Text style={[styles.statValue, { color: '#10B981' }]}>42</Text>
                                <Text style={styles.statLabel}>Completed</Text>
                            </View>
                            <View style={styles.statDivider} />
                            <View style={styles.statCard}>
                                <Text style={[styles.statValue, { color: '#F59E0B' }]}>6</Text>
                                <Text style={styles.statLabel}>Active</Text>
                            </View>
                        </View>

                        {/* Menu Sections */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Account Settings</Text>
                            <View style={styles.menuContainer}>
                                <MenuItem icon="person-outline" label="Edit Profile" />
                                <MenuItem icon="shield-checkmark-outline" label="Security & Privacy" />
                                <MenuItem icon="notifications-outline" label="Notifications" />
                                <MenuItem icon="wallet-outline" label="Payment Methods" color="#10B981" showDivider={false} />
                            </View>
                        </View>

                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Support & Legal</Text>
                            <View style={styles.menuContainer}>
                                <MenuItem icon="help-circle-outline" label="Help Center" color="#F59E0B" />
                                <MenuItem icon="document-text-outline" label="Terms & Conditions" showDivider={false} />
                            </View>
                        </View>

                        {/* Logout */}
                        <TouchableOpacity style={styles.logoutButton}>
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
        color: Colors.light.text,
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
        color: Colors.light.primary,
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
        color: Colors.light.text,
        marginBottom: 4,
    },
    userRole: {
        fontSize: 14,
        fontFamily: 'PlusJakartaSans_500Medium',
        color: Colors.light.textSecondary,
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
        color: Colors.light.textSecondary,
        fontFamily: 'PlusJakartaSans_500Medium',
    },
    contactDot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: Colors.light.border,
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
        backgroundColor: Colors.light.border,
        alignSelf: 'center',
    },
    statValue: {
        fontSize: 20,
        fontFamily: 'PlusJakartaSans_700Bold',
        color: Colors.light.text,
        marginBottom: 2,
    },
    statLabel: {
        fontSize: 12,
        color: Colors.light.textSecondary,
        fontFamily: 'PlusJakartaSans_500Medium',
    },
    section: {
        marginBottom: theme.spacing.xl,
        paddingHorizontal: theme.spacing.lg,
    },
    sectionTitle: {
        fontSize: 14,
        fontFamily: 'PlusJakartaSans_700Bold',
        color: Colors.light.textSecondary,
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
        color: Colors.light.text,
    },
    menuDivider: {
        height: 1,
        backgroundColor: Colors.light.border,
        marginHorizontal: theme.spacing.md,
        opacity: 0.5,
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
        color: Colors.light.textSecondary,
        fontFamily: 'PlusJakartaSans_400Regular',
        marginBottom: theme.spacing.xl,
    },
});
