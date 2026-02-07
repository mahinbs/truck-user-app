import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
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
    surface,
    text,
    textSecondary
} from '../../constants/Colors';
import { theme } from '../../constants/theme';

const { width } = Dimensions.get('window');

export default function DriverProfile() {
    const router = useRouter();
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 800,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    const handleLogout = () => {
        router.replace('/');
    };

    const renderMenuItem = (icon: any, title: string, subtitle?: string, onPress?: () => void, color: string = primary) => (
        <TouchableOpacity
            style={styles.menuItem}
            activeOpacity={0.7}
            onPress={onPress}
        >
            <LinearGradient
                colors={['rgba(255, 255, 255, 0.8)', 'rgba(255, 255, 255, 0.4)']}
                style={styles.menuIconContainer}
            >
                <Ionicons name={icon} size={20} color={color} />
            </LinearGradient>
            <View style={styles.menuTextContainer}>
                <Text style={styles.menuTitle}>{title}</Text>
                {subtitle && <Text style={styles.menuSubtitle}>{subtitle}</Text>}
            </View>
            <Ionicons name="chevron-forward" size={20} color={textSecondary} />
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={theme.gradients.background as any}
                style={StyleSheet.absoluteFillObject}
            />

            <SafeAreaView style={styles.safeArea}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color={text} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Profile</Text>
                    <View style={styles.placeholderButton} />
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
                        <LinearGradient
                            colors={['rgba(255, 255, 255, 0.8)', 'rgba(255, 255, 255, 0.5)']}
                            style={styles.profileCard}
                        >
                            <BlurView intensity={20} tint="light" style={styles.profileBlur}>
                                <View style={styles.avatarContainer}>
                                    <LinearGradient
                                        colors={theme.gradients.primary as any}
                                        style={styles.avatar}
                                    >
                                        <Text style={styles.avatarText}>RK</Text>
                                    </LinearGradient>
                                    <View style={styles.editBadge}>
                                        <Ionicons name="pencil" size={12} color={surface} />
                                    </View>
                                </View>
                                <Text style={styles.name}>Rajesh Kumar</Text>
                                <Text style={styles.role}>Professional Driver</Text>

                                <View style={styles.infoRow}>
                                    <View style={styles.infoItem}>
                                        <Ionicons name="call-outline" size={14} color={textSecondary} />
                                        <Text style={styles.infoText}>+91 98765 43210</Text>
                                    </View>
                                    <View style={styles.infoDivider} />
                                    <View style={styles.infoItem}>
                                        <Ionicons name="mail-outline" size={14} color={textSecondary} />
                                        <Text style={styles.infoText}>rajesh.k@example.com</Text>
                                    </View>
                                </View>

                                <View style={styles.statsRow}>
                                    <View style={styles.statItem}>
                                        <Text style={styles.statValue}>4.8</Text>
                                        <Text style={styles.statLabel}>Rating</Text>
                                    </View>
                                    <View style={styles.statDivider} />
                                    <View style={styles.statItem}>
                                        <Text style={styles.statValue}>245</Text>
                                        <Text style={styles.statLabel}>Trips</Text>
                                    </View>
                                    <View style={styles.statDivider} />
                                    <View style={styles.statItem}>
                                        <Text style={styles.statValue}>2.5y</Text>
                                        <Text style={styles.statLabel}>Exp</Text>
                                    </View>
                                </View>
                            </BlurView>
                        </LinearGradient>

                        {/* Truck Details */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Truck Information</Text>
                            <LinearGradient
                                colors={['rgba(255, 255, 255, 0.6)', 'rgba(255, 255, 255, 0.3)']}
                                style={styles.menuCard}
                            >
                                <BlurView intensity={10} tint="light" style={styles.menuBlur}>
                                    {renderMenuItem('car-outline', 'Truck Details', 'Tata Prima 5530.S')}
                                    <View style={styles.menuDivider} />
                                    {renderMenuItem('document-text-outline', 'Documents', 'RC, Insurance, Permit', undefined, '#F59E0B')}
                                </BlurView>
                            </LinearGradient>
                        </View>

                        {/* Bank Details */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Banking</Text>
                            <LinearGradient
                                colors={['rgba(255, 255, 255, 0.6)', 'rgba(255, 255, 255, 0.3)']}
                                style={styles.menuCard}
                            >
                                <BlurView intensity={10} tint="light" style={styles.menuBlur}>
                                    {renderMenuItem('card-outline', 'Bank Account', 'HDFC Bank •••• 4589', undefined, '#10B981')}
                                </BlurView>
                            </LinearGradient>
                        </View>

                        {/* Support */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Support</Text>
                            <LinearGradient
                                colors={['rgba(255, 255, 255, 0.6)', 'rgba(255, 255, 255, 0.3)']}
                                style={styles.menuCard}
                            >
                                <BlurView intensity={10} tint="light" style={styles.menuBlur}>
                                    {renderMenuItem('help-circle-outline', 'Help & Support')}
                                    <View style={styles.menuDivider} />
                                    {renderMenuItem('settings-outline', 'Settings')}
                                </BlurView>
                            </LinearGradient>
                        </View>

                        {/* Logout */}
                        <TouchableOpacity
                            style={styles.logoutButton}
                            onPress={handleLogout}
                            activeOpacity={0.8}
                        >
                            <LinearGradient
                                colors={['rgba(239, 68, 68, 0.1)', 'rgba(239, 68, 68, 0.05)']}
                                style={styles.logoutGradient}
                            >
                                <Ionicons name="log-out-outline" size={20} color="#EF4444" />
                                <Text style={styles.logoutText}>Logout</Text>
                            </LinearGradient>
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
    },
    safeArea: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: theme.spacing.base,
        paddingVertical: theme.spacing.md,
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
    },
    placeholderButton: {
        width: 40,
    },
    headerTitle: {
        ...theme.typography.h2,
        fontSize: 20,
        color: text,
        fontWeight: '700',
    },
    scrollView: {
        flex: 1,
    },
    content: {
        paddingHorizontal: theme.spacing.base,
        paddingTop: theme.spacing.base,
        paddingBottom: 100,
    },
    profileCard: {
        borderRadius: theme.borderRadius.card,
        overflow: 'hidden',
        marginBottom: theme.spacing.xl,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.4)',
        ...theme.shadows.card,
    },
    profileBlur: {
        padding: theme.spacing.lg,
        alignItems: 'center',
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: theme.spacing.md,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        ...theme.shadows.glow,
    },
    avatarText: {
        ...theme.typography.h1,
        color: surface,
        fontSize: 32,
    },
    editBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: primary,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: surface,
    },
    name: {
        ...theme.typography.h2,
        fontSize: 24,
        color: text,
        marginBottom: 4,
    },
    role: {
        ...theme.typography.body,
        color: primary,
        fontWeight: '600',
        marginBottom: theme.spacing.md,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: theme.spacing.lg,
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    infoText: {
        ...theme.typography.caption,
        color: textSecondary,
    },
    infoDivider: {
        width: 1,
        height: 12,
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        marginHorizontal: 12,
    },
    statsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        backgroundColor: 'rgba(255, 255, 255, 0.6)',
        borderRadius: theme.borderRadius.md,
        padding: theme.spacing.md,
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
    },
    statValue: {
        ...theme.typography.h3,
        fontWeight: '700',
        color: text,
        marginBottom: 2,
    },
    statLabel: {
        ...theme.typography.caption,
        color: textSecondary,
        fontSize: 11,
    },
    statDivider: {
        width: 1,
        height: 24,
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
    },
    section: {
        marginBottom: theme.spacing.lg,
    },
    sectionTitle: {
        ...theme.typography.h3,
        fontSize: 16,
        color: text,
        marginBottom: theme.spacing.sm,
        fontWeight: '600',
        marginLeft: 4,
    },
    menuCard: {
        borderRadius: theme.borderRadius.card,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    menuBlur: {
        padding: theme.spacing.xs,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: theme.spacing.sm,
    },
    menuIconContainer: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: theme.spacing.md,
    },
    menuTextContainer: {
        flex: 1,
    },
    menuTitle: {
        ...theme.typography.bodyMedium,
        fontSize: 14,
        color: text,
        fontWeight: '500',
    },
    menuSubtitle: {
        ...theme.typography.caption,
        fontSize: 12,
        color: textSecondary,
        marginTop: 2,
    },
    menuDivider: {
        height: 1,
        backgroundColor: 'rgba(226, 232, 240, 0.5)',
        marginLeft: 56,
        marginRight: theme.spacing.sm,
    },
    logoutButton: {
        marginTop: theme.spacing.base,
        borderRadius: theme.borderRadius.button,
        overflow: 'hidden',
    },
    logoutGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: theme.spacing.md,
        gap: theme.spacing.sm,
        borderWidth: 1,
        borderColor: 'rgba(239, 68, 68, 0.2)',
        borderRadius: theme.borderRadius.button,
    },
    logoutText: {
        ...theme.typography.bodyMedium,
        color: '#EF4444',
        fontWeight: '600',
    },
    versionText: {
        ...theme.typography.caption,
        color: textSecondary,
        textAlign: 'center',
        marginTop: theme.spacing.xl,
        opacity: 0.6,
    },
});
