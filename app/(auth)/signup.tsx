import { Ionicons } from '@expo/vector-icons';
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

const { height } = Dimensions.get('window');

type UserRole = 'business' | 'driver' | 'broker' | null;

export default function Signup() {
    const router = useRouter();
    const [step, setStep] = useState<'role' | 'details'>('role');
    const [selectedRole, setSelectedRole] = useState<UserRole>(null);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const fadeAnim = useRef(new Animated.Value(0)).current;

    // Animation for transitions
    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
        }).start();
    }, [step]);

    const handleRoleSelect = (role: UserRole) => {
        setSelectedRole(role);
    };

    const handleContinue = () => {
        if (selectedRole) {
            setStep('details');
            fadeAnim.setValue(0); // Reset for fade in
        }
    };

    const handleSignup = () => {
        router.push({
            pathname: '/(auth)/verify-otp',
            params: {
                role: selectedRole,
                name: name,
                email: email,
                phone: phone,
                flow: 'signup'
            }
        } as any);
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
                    <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
                        {step === 'role' ? (
                            <>
                                {/* Role Selection */}
                                <View style={styles.headerContainer}>
                                    <View style={styles.logoRow}>
                                        <View style={styles.logoContainer}>
                                            <Image
                                                source={require('../../assets/images/Applogo.png')}
                                                style={styles.logoImage}
                                                resizeMode="cover"
                                            />
                                        </View>
                                        <Text style={styles.brandName}>Join Trukx</Text>
                                    </View>
                                    <Text style={styles.title}>Choose Account Type</Text>
                                    <Text style={styles.subtitle}>
                                        Select how you'll be using the platform
                                    </Text>
                                </View>

                                <View style={styles.rolesContainer}>
                                    <TouchableOpacity
                                        activeOpacity={0.8}
                                        onPress={() => handleRoleSelect('business')}
                                        style={[
                                            styles.roleCard,
                                            selectedRole === 'business' && styles.roleCardSelected,
                                        ]}
                                    >
                                        <View
                                            style={[
                                                styles.roleIconContainer,
                                                selectedRole === 'business' && styles.roleIconSelected,
                                            ]}
                                        >
                                            <Ionicons
                                                name="business"
                                                size={32}
                                                color={selectedRole === 'business' ? '#FFFFFF' : Colors.light.primary}
                                            />
                                        </View>
                                        <View style={styles.roleInfo}>
                                            <Text
                                                style={[
                                                    styles.roleTitle,
                                                    selectedRole === 'business' && styles.roleTitleSelected,
                                                ]}
                                            >
                                                Business
                                            </Text>
                                            <Text
                                                style={[
                                                    styles.roleDescription,
                                                    selectedRole === 'business' && styles.roleDescriptionSelected,
                                                ]}
                                            >
                                                Book trucks & manage shipments
                                            </Text>
                                        </View>
                                        <View style={[
                                            styles.radioCircle,
                                            selectedRole === 'business' && styles.radioActive
                                        ]}>
                                            {selectedRole === 'business' && <View style={styles.radioInner} />}
                                        </View>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        activeOpacity={0.8}
                                        onPress={() => handleRoleSelect('driver')}
                                        style={[
                                            styles.roleCard,
                                            selectedRole === 'driver' && styles.roleCardSelected,
                                        ]}
                                    >
                                        <View
                                            style={[
                                                styles.roleIconContainer,
                                                selectedRole === 'driver' && styles.roleIconSelected,
                                            ]}
                                        >
                                            <Ionicons
                                                name="car"
                                                size={32}
                                                color={selectedRole === 'driver' ? '#FFFFFF' : Colors.light.primary}
                                            />
                                        </View>
                                        <View style={styles.roleInfo}>
                                            <Text
                                                style={[
                                                    styles.roleTitle,
                                                    selectedRole === 'driver' && styles.roleTitleSelected,
                                                ]}
                                            >
                                                Driver
                                            </Text>
                                            <Text
                                                style={[
                                                    styles.roleDescription,
                                                    selectedRole === 'driver' && styles.roleDescriptionSelected,
                                                ]}
                                            >
                                                Accept trips & drive shipments
                                            </Text>
                                        </View>
                                        <View style={[
                                            styles.radioCircle,
                                            selectedRole === 'driver' && styles.radioActive
                                        ]}>
                                            {selectedRole === 'driver' && <View style={styles.radioInner} />}
                                        </View>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        activeOpacity={0.8}
                                        onPress={() => handleRoleSelect('broker')}
                                        style={[
                                            styles.roleCard,
                                            selectedRole === 'broker' && styles.roleCardSelected,
                                        ]}
                                    >
                                        <View
                                            style={[
                                                styles.roleIconContainer,
                                                selectedRole === 'broker' && styles.roleIconSelected,
                                            ]}
                                        >
                                            <Ionicons
                                                name="people"
                                                size={32}
                                                color={selectedRole === 'broker' ? '#FFFFFF' : Colors.light.primary}
                                            />
                                        </View>
                                        <View style={styles.roleInfo}>
                                            <Text
                                                style={[
                                                    styles.roleTitle,
                                                    selectedRole === 'broker' && styles.roleTitleSelected,
                                                ]}
                                            >
                                                Broker
                                            </Text>
                                            <Text
                                                style={[
                                                    styles.roleDescription,
                                                    selectedRole === 'broker' && styles.roleDescriptionSelected,
                                                ]}
                                            >
                                                Manage drivers & assign loads
                                            </Text>
                                        </View>
                                        <View style={[
                                            styles.radioCircle,
                                            selectedRole === 'broker' && styles.radioActive
                                        ]}>
                                            {selectedRole === 'broker' && <View style={styles.radioInner} />}
                                        </View>
                                    </TouchableOpacity>
                                </View>

                                <View style={styles.roleFooter}>
                                    <View style={styles.loginContainer}>
                                        <Text style={styles.loginText}>Already have an account? </Text>
                                        <Text
                                            style={styles.loginLink}
                                            onPress={() => router.push('/(auth)/login')}
                                        >
                                            Sign In
                                        </Text>
                                    </View>

                                    <Button
                                        title="Continue"
                                        onPress={handleContinue}
                                        variant="primary"
                                        fullWidth
                                        disabled={!selectedRole}
                                        style={styles.continueButton}
                                        textStyle={styles.buttonText}
                                    />
                                </View>
                            </>
                        ) : (
                            <>
                                {/* Details Form */}
                                <View style={styles.headerContainer}>
                                    <TouchableOpacity onPress={() => setStep('role')} style={styles.backButton}>
                                        <Ionicons name="arrow-back" size={24} color={Colors.light.text} />
                                    </TouchableOpacity>
                                    <Text style={styles.title}>Create Account</Text>
                                    <Text style={styles.subtitle}>
                                        Enter your details to sign up as{' '}
                                        {selectedRole === 'business' ? 'Business' : selectedRole === 'driver' ? 'Driver' : 'Broker'}
                                    </Text>
                                </View>

                                <View style={styles.formContainer}>
                                    <Input
                                        label="Full Name"
                                        value={name}
                                        onChangeText={setName}
                                        placeholder="Enter your full name"
                                        containerStyle={styles.input}
                                    />
                                    <Input
                                        label="Email"
                                        value={email}
                                        onChangeText={setEmail}
                                        placeholder="Enter your email"
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                        containerStyle={styles.input}
                                    />
                                    <Input
                                        label="Phone"
                                        value={phone}
                                        onChangeText={setPhone}
                                        placeholder="Enter your phone number"
                                        keyboardType="phone-pad"
                                        containerStyle={styles.input}
                                    />
                                    <Input
                                        label="Password"
                                        value={password}
                                        onChangeText={setPassword}
                                        placeholder="Create a password"
                                        secureTextEntry
                                        containerStyle={styles.input}
                                    />

                                    <Button
                                        title="Create Account"
                                        onPress={handleSignup}
                                        variant="primary"
                                        fullWidth
                                        style={styles.signupButton}
                                        textStyle={styles.buttonText}
                                    />

                                    <View style={styles.loginContainer}>
                                        <Text style={styles.loginText}>Already have an account? </Text>
                                        <Text
                                            style={styles.loginLink}
                                            onPress={() => router.push('/(auth)/login')}
                                        >
                                            Sign In
                                        </Text>
                                    </View>
                                </View>
                            </>
                        )}
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
        backgroundColor: 'rgba(255, 255, 255, 0.23)',
    },
    keyboardView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: theme.spacing.md,
        paddingTop: height * 0.15,
        paddingBottom: theme.spacing.xl,
    },
    content: {
        backgroundColor: '#FFFFFF',
        borderRadius: 32,
        padding: theme.spacing.md,
        ...theme.shadows.medium,
        minHeight: 400,
    },
    headerContainer: {
        marginBottom: theme.spacing.lg,
    },
    logoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2,
    },
    logoContainer: {
        width: 100,
        height: 60,
    },
    logoImage: {
        width: '100%',
        height: '100%',
    },
    brandName: {
        fontSize: 16,
        fontWeight: '700',
        color: Colors.light.primary,
        fontFamily: 'PlusJakartaSans_700Bold',
    },
    title: {
        fontSize: 24,
        fontWeight: '800',
        color: Colors.light.text,
        fontFamily: 'PlusJakartaSans_800ExtraBold',
        marginBottom: theme.spacing.xs,
    },
    subtitle: {
        fontSize: 14,
        color: Colors.light.textSecondary,
        fontFamily: 'PlusJakartaSans_400Regular',
    },
    rolesContainer: {
        gap: theme.spacing.md,
        marginBottom: theme.spacing.xl,
    },
    roleCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: theme.spacing.md,
        borderRadius: 20,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: Colors.light.border,
        ...theme.shadows.light,
    },
    roleCardSelected: {
        borderColor: Colors.light.primary,
        backgroundColor: '#F8FAFC',
        borderWidth: 2,
    },
    roleIconContainer: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#F1F5F9',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: theme.spacing.md,
    },
    roleIconSelected: {
        backgroundColor: Colors.light.primary,
    },
    roleInfo: {
        flex: 1,
    },
    roleTitle: {
        ...theme.typography.h3,
        fontSize: 16,
        color: Colors.light.text,
        marginBottom: 2,
    },
    roleTitleSelected: {
        color: Colors.light.primary,
        fontWeight: '700',
    },
    roleDescription: {
        ...theme.typography.body,
        fontSize: 13,
        color: Colors.light.textSecondary,
    },
    roleDescriptionSelected: {
        color: Colors.light.text,
    },
    radioCircle: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: Colors.light.border,
        justifyContent: 'center',
        alignItems: 'center',
    },
    radioActive: {
        borderColor: Colors.light.primary,
    },
    radioInner: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: Colors.light.primary,
    },
    continueButton: {
        marginTop: theme.spacing.lg,
        borderRadius: 16,
    },
    formContainer: {
        gap: theme.spacing.lg,
    },
    input: {
        marginBottom: 0,
    },
    signupButton: {
        marginTop: theme.spacing.sm,
        borderRadius: 16,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '600',
    },
    loginContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    loginText: {
        color: Colors.light.textSecondary,
        fontSize: 15,
    },
    loginLink: {
        color: Colors.light.primary,
        fontSize: 15,
        fontWeight: '700',
    },
    backButton: {
        marginBottom: theme.spacing.md,
    },
    roleFooter: {
        marginTop: 'auto',
    }
});
