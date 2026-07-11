import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
    Animated,
    Dimensions,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { Button } from '../../components/shared/Button';
import { Input } from '../../components/shared/Input';
import { Colors } from '../../constants/Colors';
import { theme } from '../../constants/theme';
import { useAuth } from '../../contexts/AuthContext';
import { api, ApiError } from '../../utils/api';

const { height, width } = Dimensions.get('window');

export default function Login() {
    const router = useRouter();
    const { signIn } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [selectedRole, setSelectedRole] = useState<'business' | 'driver' | 'broker'>('business');
    const [submitting, setSubmitting] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
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
                easing: (t) => t * (2 - t),
            }),
        ]).start();
    }, []);

    const handleForgotPassword = async () => {
        if (!email.trim()) {
            setErrorMsg('Enter your email first');
            return;
        }
        try {
            const res = await api.forgotPassword(email.trim());
            setErrorMsg(res.message || 'If the email exists, a reset link was sent.');
        } catch (e: any) {
            setErrorMsg(e instanceof ApiError ? e.message : (e?.message || 'Request failed'));
        }
    };

    const handleLogin = async () => {
        if (!email.trim() || !password) {
            setErrorMsg('Enter email and password');
            return;
        }
        setSubmitting(true);
        setErrorMsg(null);
        try {
            const user = await signIn(email.trim(), password);
            // Frontend role mismatch warning (the role tab is just a hint; real role comes from the user record)
            const dest =
                user.role === 'BUSINESS' ? '/business/home' :
                user.role === 'DRIVER'   ? '/driver/home' :
                user.role === 'BROKER'   ? '/broker/home' :
                '/(onboarding)/onboarding-1';
            router.replace(dest as any);
        } catch (e: any) {
            const m = e instanceof ApiError ? e.message : (e?.message || 'Login failed');
            if (typeof m === 'string' && m.toLowerCase().includes('email not verified')) {
                try {
                    await api.resendOtp(email.trim().toLowerCase());
                } catch {
                    // still send them to OTP screen
                }
                router.push({
                    pathname: '/(auth)/verify-otp',
                    params: {
                        email: email.trim().toLowerCase(),
                        role: selectedRole,
                        flow: 'login',
                    },
                } as any);
                return;
            }
            setErrorMsg(m);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />

            {/* Top decorative element */}
            <View style={styles.topDecoration}>
                <Image
                    source={require('../../assets/truck-image/truck-highway-sunny-sky_23-2151998705.jpg')}
                    style={styles.headerImage}
                />
                <View style={styles.overlay} />
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    <Animated.View style={[
                        styles.content,
                        {
                            opacity: fadeAnim,
                            transform: [{ translateY: slideAnim }]
                        }
                    ]}>

                        <View style={styles.headerContainer}>
                            <View style={styles.logoRow}>
                                <View style={styles.logoContainer}>
                                    <Image
                                        source={require('../../assets/images/Applogo.png')}
                                        style={styles.logoImage}
                                        resizeMode="cover"
                                    />
                                </View>
                                {/* Removed separate text */}
                            </View>
                            <Text style={styles.welcomeTitle}>Welcome Back!</Text>
                            <Text style={styles.welcomeSubtitle}>
                                Sign in to manage your shipments and fleet
                            </Text>
                        </View>

                        <View style={styles.formContainer}>
                            <Input
                                label="Email Address"
                                value={email}
                                onChangeText={setEmail}
                                placeholder="Enter your email"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                containerStyle={styles.input}
                            />
                            <View>
                                <Input
                                    label="Password"
                                    value={password}
                                    onChangeText={setPassword}
                                    placeholder="Enter your password"
                                    secureTextEntry
                                    containerStyle={styles.input}
                                />
                                <TouchableOpacity onPress={handleForgotPassword}>
                                    <Text style={styles.forgotPassword}>Forgot Password?</Text>
                                </TouchableOpacity>
                            </View>

                            <View style={styles.roleSelectionContainer}>
                                <Text style={styles.roleLabel}>Sign in as</Text>
                                <View style={styles.roleButtonsRow}>
                                    <TouchableOpacity
                                        style={[styles.roleSelectBtn, selectedRole === 'business' && styles.roleSelectBtnActive]}
                                        onPress={() => setSelectedRole('business')}
                                    >
                                        <Text style={[styles.roleSelectBtnText, selectedRole === 'business' && styles.roleSelectBtnTextActive]}>Business</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[styles.roleSelectBtn, selectedRole === 'driver' && styles.roleSelectBtnActive]}
                                        onPress={() => setSelectedRole('driver')}
                                    >
                                        <Text style={[styles.roleSelectBtnText, selectedRole === 'driver' && styles.roleSelectBtnTextActive]}>Driver</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[styles.roleSelectBtn, selectedRole === 'broker' && styles.roleSelectBtnActive]}
                                        onPress={() => setSelectedRole('broker')}
                                    >
                                        <Text style={[styles.roleSelectBtnText, selectedRole === 'broker' && styles.roleSelectBtnTextActive]}>Broker</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            {errorMsg ? (
                                <Text style={{ color: '#EF4444', fontSize: 13, marginTop: 4 }}>
                                    {errorMsg}
                                </Text>
                            ) : null}
                            <Button
                                title={submitting ? 'Signing in…' : 'Sign In'}
                                onPress={handleLogin}
                                variant="primary"
                                fullWidth
                                style={styles.loginButton}
                                textStyle={styles.loginButtonText}
                                disabled={submitting}
                            />

                            <View style={styles.dividerContainer}>
                                <View style={styles.divider} />
                                <Text style={styles.dividerText}>Or continue with</Text>
                                <View style={styles.divider} />
                            </View>

                            <View style={styles.socialButtons}>
                                <Button
                                    title="Google"
                                    onPress={() => { }}
                                    variant="outline"
                                    style={styles.socialBtn}
                                    textStyle={styles.socialBtnText}
                                />
                                <Button
                                    title="Apple"
                                    onPress={() => { }}
                                    variant="outline"
                                    style={styles.socialBtn}
                                    textStyle={styles.socialBtnText}
                                />
                            </View>

                            <View style={styles.signupContainer}>
                                <Text style={styles.signupText}>Don't have an account? </Text>
                                <Text
                                    style={styles.signupLink}
                                    onPress={() => router.push('/(auth)/signup')}
                                >
                                    Sign Up
                                </Text>
                            </View>
                        </View>
                    </Animated.View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    topDecoration: {
        height: height * 0.35,
        width: '100%',
        position: 'absolute',
        top: 0,
        backgroundColor: '#F1F5F9',
    },
    headerImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(255,255,255,0.4)', // Heavy fade to white
    },
    keyboardView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: theme.spacing.md,
        paddingTop: height * 0.15,
        paddingBottom: theme.spacing.md,
    },
    content: {
        backgroundColor: '#FFFFFF',
        borderRadius: 32,
        padding: theme.spacing.md,
        ...theme.shadows.medium, // Floating card effect
    },
    headerContainer: {
        marginBottom: theme.spacing.xl,
    },
    logoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: theme.spacing.md,
        gap: 8,
    },
    logoContainer: {
        width: 120,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoImage: {
        width: '100%',
        height: '100%',
    },
    brandName: {
        fontSize: 24,
        fontWeight: '700',
        color: Colors.light.text,
        fontFamily: 'PlusJakartaSans_700Bold',
        display: 'none', // Hide if not removed from markup
    },
    welcomeTitle: {
        fontSize: 26,
        fontWeight: '800',
        color: Colors.light.text,
        fontFamily: 'PlusJakartaSans_800ExtraBold',
        marginBottom: theme.spacing.xs,
    },
    welcomeSubtitle: {
        fontSize: 14,
        color: Colors.light.textSecondary,
        fontFamily: 'PlusJakartaSans_400Regular',
    },
    formContainer: {
        gap: theme.spacing.md,
    },
    input: {
        marginBottom: 0,
    },
    forgotPassword: {
        alignSelf: 'flex-end',
        color: Colors.light.primary,
        fontSize: 14,
        fontWeight: '600',
        marginTop: theme.spacing.xs,
    },
    loginButton: {
        marginTop: theme.spacing.sm,
        borderRadius: 16,
    },
    loginButtonText: {
        fontSize: 16,
        fontWeight: '600',
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: theme.spacing.sm,
    },
    divider: {
        flex: 1,
        height: 1,
        backgroundColor: Colors.light.border,
    },
    dividerText: {
        paddingHorizontal: theme.spacing.sm,
        color: Colors.light.textTertiary,
        fontSize: 14,
    },
    socialButtons: {
        flexDirection: 'row',
        gap: theme.spacing.md,
    },
    socialBtn: {
        flex: 1,
        borderColor: Colors.light.border,
        borderRadius: 16,
    },
    socialBtnText: {
        color: Colors.light.text,
        fontWeight: '500',
    },
    signupContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: theme.spacing.md,
    },
    signupText: {
        color: Colors.light.textSecondary,
        fontSize: 15,
    },
    signupLink: {
        color: Colors.light.primary,
        fontSize: 15,
        fontWeight: '700',
    },
    roleSelectionContainer: {
        marginVertical: theme.spacing.sm,
    },
    roleLabel: {
        fontSize: 14,
        color: Colors.light.textSecondary,
        fontFamily: 'PlusJakartaSans_600SemiBold',
        marginBottom: theme.spacing.xs,
    },
    roleButtonsRow: {
        flexDirection: 'row',
        backgroundColor: '#F1F5F9',
        borderRadius: 12,
        padding: 4,
        gap: 4,
    },
    roleSelectBtn: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        borderRadius: 8,
    },
    roleSelectBtnActive: {
        backgroundColor: '#FFFFFF',
        ...theme.shadows.light,
    },
    roleSelectBtnText: {
        fontSize: 13,
        fontWeight: '600',
        color: Colors.light.textSecondary,
        fontFamily: 'PlusJakartaSans_600SemiBold',
    },
    roleSelectBtnTextActive: {
        color: Colors.light.primary,
    },
});
