import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
    Animated,
    Dimensions,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { Button } from '../../components/shared/Button';
import { primary, surface, text, textSecondary, error as errorColor } from '../../constants/Colors';
import { theme } from '../../constants/theme';
import { useAuth } from '../../contexts/AuthContext';
import { ApiError } from '../../utils/api';

const { height } = Dimensions.get('window');
const OTP_LENGTH = 8;

export default function VerifyOtp() {
    const router = useRouter();
    const params = useLocalSearchParams<{ role?: string; email?: string; name?: string; flow?: string }>();
    const { verifyEmailOtp, resendEmailOtp } = useAuth();

    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [infoMsg, setInfoMsg] = useState<string | null>(null);
    const [resendTimer, setResendTimer] = useState(60);
    const [isFocused, setIsFocused] = useState(false);

    const inputRef = useRef<TextInput>(null);
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(30)).current;
    const shakeAnim = useRef(new Animated.Value(0)).current;

    const email = (params.email || '').trim().toLowerCase();
    const displayRole = params.role
        ? params.role.charAt(0).toUpperCase() + params.role.slice(1)
        : 'User';

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

        const timer = setInterval(() => {
            setResendTimer((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        setTimeout(() => {
            inputRef.current?.focus();
        }, 300);
    }, []);

    const triggerShake = (message?: string) => {
        setError(true);
        setErrorMsg(message || 'Incorrect code. Please check and try again.');
        setOtp('');
        inputRef.current?.focus();

        Animated.sequence([
            Animated.timing(shakeAnim, { toValue: 10, duration: 80, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: -10, duration: 80, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: 10, duration: 80, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: -10, duration: 80, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: 0, duration: 80, useNativeDriver: true }),
        ]).start();
    };

    const handleVerify = async () => {
        if (otp.length < OTP_LENGTH || !email) return;

        setLoading(true);
        setError(false);
        setErrorMsg(null);
        setInfoMsg(null);

        try {
            const user = await verifyEmailOtp(email, otp);
            if (user.role === 'BUSINESS') {
                router.replace('/business/home');
            } else if (user.role === 'DRIVER' || user.role === 'BROKER') {
                router.replace('/(onboarding)/verification' as any);
            } else {
                router.replace('/(auth)/login');
            }
        } catch (err: any) {
            const m = err instanceof ApiError ? err.message : (err?.message || 'Verification failed');
            triggerShake(m);
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        if (resendTimer > 0 || !email) return;
        setError(false);
        setErrorMsg(null);
        setOtp('');
        try {
            const msg = await resendEmailOtp(email);
            setInfoMsg(msg);
            setResendTimer(60);
            inputRef.current?.focus();
        } catch (err: any) {
            const m = err instanceof ApiError ? err.message : (err?.message || 'Could not resend code');
            setErrorMsg(m);
        }
    };

    const handleBoxPress = () => {
        inputRef.current?.focus();
    };

    const renderOtpBoxes = () => {
        const boxes = [];
        for (let i = 0; i < OTP_LENGTH; i++) {
            const char = otp[i] || '';
            const isActive = i === otp.length && isFocused;

            boxes.push(
                <TouchableOpacity
                    key={i}
                    style={[
                        styles.otpBox,
                        isActive && styles.otpBoxActive,
                        error && styles.otpBoxError,
                    ]}
                    onPress={handleBoxPress}
                    activeOpacity={0.8}
                >
                    <Text style={[styles.otpBoxText, error && styles.otpBoxTextError]}>
                        {char}
                    </Text>
                    {isActive && <View style={styles.cursor} />}
                </TouchableOpacity>
            );
        }
        return boxes;
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />

            <View style={styles.topDecoration}>
                <LinearGradient
                    colors={['rgba(255, 255, 255, 0.1)', '#FFFFFF']}
                    style={StyleSheet.absoluteFillObject}
                />
                <LinearGradient
                    colors={[theme.gradients.primary[0], theme.gradients.primary[1]] as any}
                    style={StyleSheet.absoluteFillObject}
                />
            </View>

            <SafeAreaView style={styles.safeArea}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
                </TouchableOpacity>

                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.keyboardView}
                >
                    <ScrollView
                        contentContainerStyle={styles.scrollContent}
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                    >
                        <Animated.View
                            style={[
                                styles.iconContainer,
                                {
                                    opacity: fadeAnim,
                                    transform: [{ translateY: slideAnim }],
                                },
                            ]}
                        >
                            <View style={styles.iconCircle}>
                                <Ionicons name="mail-outline" size={48} color={primary} />
                            </View>
                        </Animated.View>

                        <Animated.View
                            style={[
                                styles.cardWrapper,
                                {
                                    opacity: fadeAnim,
                                    transform: [
                                        { translateY: slideAnim },
                                        { translateX: shakeAnim },
                                    ],
                                },
                            ]}
                        >
                            <BlurView intensity={20} tint="light" style={styles.glassCard}>
                                <Text style={styles.title}>Verify your email</Text>
                                <Text style={styles.subtitle}>
                                    Enter the 8-digit code we sent for your{' '}
                                    <Text style={styles.boldText}>{displayRole}</Text> account to:{'\n'}
                                    <Text style={styles.highlightText}>{email || 'your email'}</Text>
                                </Text>

                                <TextInput
                                    ref={inputRef}
                                    value={otp}
                                    onChangeText={(text) => {
                                        const cleaned = text.replace(/[^0-9]/g, '').slice(0, OTP_LENGTH);
                                        setOtp(cleaned);
                                        if (error) {
                                            setError(false);
                                            setErrorMsg(null);
                                        }
                                    }}
                                    onBlur={() => setIsFocused(false)}
                                    onFocus={() => setIsFocused(true)}
                                    keyboardType="number-pad"
                                    maxLength={OTP_LENGTH}
                                    style={styles.hiddenInput}
                                    textContentType="oneTimeCode"
                                    autoComplete="one-time-code"
                                    onSubmitEditing={handleVerify}
                                />

                                <View style={styles.otpGrid}>
                                    {renderOtpBoxes()}
                                </View>

                                {errorMsg ? (
                                    <Text style={styles.errorText}>{errorMsg}</Text>
                                ) : null}
                                {infoMsg ? (
                                    <Text style={styles.infoText}>{infoMsg}</Text>
                                ) : null}

                                <View style={styles.infoAlert}>
                                    <Ionicons name="information-circle-outline" size={16} color={primary} />
                                    <Text style={styles.infoAlertText}>
                                        Check your inbox for the Trukx verification email
                                    </Text>
                                </View>

                                <Button
                                    title="Verify & Continue"
                                    onPress={handleVerify}
                                    variant="primary"
                                    fullWidth
                                    loading={loading}
                                    disabled={otp.length < OTP_LENGTH || !email}
                                    style={styles.verifyBtn}
                                />

                                <View style={styles.resendContainer}>
                                    <Text style={styles.resendLabel}>Didn't receive the code? </Text>
                                    {resendTimer > 0 ? (
                                        <Text style={styles.timerText}>Resend in {resendTimer}s</Text>
                                    ) : (
                                        <TouchableOpacity onPress={handleResend}>
                                            <Text style={styles.resendLink}>Resend Code</Text>
                                        </TouchableOpacity>
                                    )}
                                </View>
                            </BlurView>
                        </Animated.View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
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
    },
    safeArea: {
        flex: 1,
    },
    backButton: {
        width: 44,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: theme.spacing.md,
        marginTop: theme.spacing.xs,
        borderRadius: 22,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
    keyboardView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: theme.spacing.md,
        paddingTop: height * 0.05,
        paddingBottom: theme.spacing.xl,
        alignItems: 'center',
    },
    iconContainer: {
        marginBottom: theme.spacing.lg,
    },
    iconCircle: {
        width: 90,
        height: 90,
        borderRadius: 45,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        ...theme.shadows.medium,
    },
    cardWrapper: {
        width: '100%',
        maxWidth: 420,
        borderRadius: 28,
        backgroundColor: surface,
        ...theme.shadows.strong,
        overflow: 'hidden',
    },
    glassCard: {
        padding: theme.spacing.lg,
        borderRadius: 28,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.4)',
    },
    title: {
        fontSize: 22,
        fontWeight: '800',
        color: text,
        textAlign: 'center',
        marginBottom: theme.spacing.xs,
        fontFamily: 'PlusJakartaSans_800ExtraBold',
    },
    subtitle: {
        fontSize: 14,
        color: textSecondary,
        textAlign: 'center',
        lineHeight: 20,
        marginBottom: theme.spacing.xl,
        fontFamily: 'PlusJakartaSans_400Regular',
    },
    boldText: {
        fontWeight: '700',
    },
    highlightText: {
        color: primary,
        fontWeight: '700',
    },
    hiddenInput: {
        position: 'absolute',
        width: 1,
        height: 1,
        opacity: 0,
    },
    otpGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: theme.spacing.md,
        gap: 4,
    },
    otpBox: {
        flex: 1,
        height: 48,
        minWidth: 32,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        backgroundColor: '#F8FAFC',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    otpBoxActive: {
        borderColor: primary,
        borderWidth: 2,
        backgroundColor: '#FFFFFF',
    },
    otpBoxError: {
        borderColor: errorColor,
        borderWidth: 2,
        backgroundColor: '#FEF2F2',
    },
    otpBoxText: {
        fontSize: 18,
        fontWeight: '700',
        color: text,
        fontFamily: 'PlusJakartaSans_700Bold',
    },
    otpBoxTextError: {
        color: errorColor,
    },
    cursor: {
        width: 2,
        height: 18,
        backgroundColor: primary,
        position: 'absolute',
    },
    errorText: {
        fontSize: 12,
        color: errorColor,
        textAlign: 'center',
        marginBottom: theme.spacing.sm,
        fontFamily: 'PlusJakartaSans_500Medium',
    },
    infoText: {
        fontSize: 12,
        color: primary,
        textAlign: 'center',
        marginBottom: theme.spacing.sm,
        fontFamily: 'PlusJakartaSans_500Medium',
    },
    infoAlert: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: 'rgba(30, 63, 174, 0.05)',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
        marginBottom: theme.spacing.lg,
        justifyContent: 'center',
    },
    infoAlertText: {
        fontSize: 12,
        color: primary,
        fontFamily: 'PlusJakartaSans_500Medium',
        flexShrink: 1,
    },
    verifyBtn: {
        borderRadius: 16,
        marginBottom: theme.spacing.lg,
    },
    resendContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        flexWrap: 'wrap',
    },
    resendLabel: {
        fontSize: 13,
        color: textSecondary,
        fontFamily: 'PlusJakartaSans_400Regular',
    },
    timerText: {
        fontSize: 13,
        color: textSecondary,
        fontWeight: '600',
        fontFamily: 'PlusJakartaSans_600SemiBold',
    },
    resendLink: {
        fontSize: 13,
        color: primary,
        fontWeight: '700',
        fontFamily: 'PlusJakartaSans_700Bold',
    },
});
