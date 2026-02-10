import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import {
    Animated,
    Dimensions,
    ImageBackground,
    StatusBar,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { Button } from '../../components/shared/Button';
import { Colors } from '../../constants/Colors';
import { theme } from '../../constants/theme';

const { width, height } = Dimensions.get('window');

export default function Onboarding2() {
    const router = useRouter();
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(100)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 1000,
                delay: 200,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 1000,
                delay: 200,
                useNativeDriver: true,
                easing: (t) => t * (2 - t),
            }),
        ]).start();
    }, []);

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            <ImageBackground
                source={require('@/assets/truck-image/onboarding2.png')} // Warehouse/Tracking themed image
                style={styles.backgroundImage}
                resizeMode="cover"
            >
                <LinearGradient
                    colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.6)', 'rgba(15, 23, 42, 0.9)']}
                    locations={[0, 0.6, 1]}
                    style={styles.gradientOverlay}
                />

                <Animated.View
                    style={[
                        styles.content,
                        {
                            opacity: fadeAnim,
                            transform: [{ translateY: slideAnim }],
                        }
                    ]}
                >
                    <View style={styles.headerTextContainer}>
                        <View style={styles.logisticRow}>
                            <Text style={styles.titleWhite}>TRACK</Text>
                            <View style={styles.pillIcon}>
                                <Ionicons name="location-sharp" size={20} color={Colors.light.background} />
                            </View>
                        </View>
                        <Text style={styles.titleHighLight}>EVERY SHIPMENT</Text>
                    </View>

                    <Text style={styles.subtitle}>
                        Real-time tracking and updates for all your shipments. Stay informed every step of the way.
                    </Text>

                    <View style={styles.paginationLine}>
                        <View style={styles.inactiveLine} />
                        <View style={styles.activeLine} />
                        <View style={styles.inactiveLine} />
                    </View>

                    <View style={styles.buttonContainer}>
                        <Button
                            title="Back"
                            onPress={() => router.back()}
                            variant="outline"
                            style={[styles.button, styles.backButton]}
                            textStyle={styles.backButtonText}
                        />
                        <Button
                            title="Next"
                            onPress={() => router.push('/(onboarding)/onboarding-3')}
                            variant="primary"
                            style={[styles.button, styles.nextButton]}
                            textStyle={styles.nextButtonText}
                        />
                    </View>
                </Animated.View>
            </ImageBackground>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.light.background,
    },
    backgroundImage: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    gradientOverlay: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: '100%',
    },
    content: {
        flex: 1,
        justifyContent: 'flex-end',
        paddingHorizontal: theme.spacing.lg,
        paddingBottom: theme.spacing.xxxl,
    },
    headerTextContainer: {
        marginBottom: theme.spacing.lg,
    },
    logisticRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    titleWhite: {
        color: '#FFFFFF',
        fontSize: 32,
        fontWeight: '800',
        fontFamily: 'PlusJakartaSans_800ExtraBold',
        letterSpacing: 1,
    },
    titleHighLight: {
        color: '#FFFFFF',
        fontSize: 32,
        fontWeight: '800',
        fontFamily: 'PlusJakartaSans_800ExtraBold',
        letterSpacing: 1,
    },
    pillIcon: {
        backgroundColor: '#6366F1',
        width: 36,
        height: 24,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 8,
    },
    subtitle: {
        color: 'rgba(255, 255, 255, 0.7)',
        fontSize: 16,
        fontFamily: 'PlusJakartaSans_400Regular',
        lineHeight: 24,
        marginBottom: theme.spacing.xl,
    },
    paginationLine: {
        flexDirection: 'row',
        marginBottom: theme.spacing.xl,
        gap: 6,
    },
    activeLine: {
        width: 40,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#6366F1',
    },
    inactiveLine: {
        width: 10,
        height: 6,
        borderRadius: 3,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
    buttonContainer: {
        flexDirection: 'row',
        gap: theme.spacing.md,
    },
    button: {
        flex: 1,
        height: 56,
        borderRadius: 28,
    },
    backButton: {
        borderColor: 'rgba(255, 255, 255, 0.3)',
        borderWidth: 1,
        backgroundColor: 'transparent',
    },
    backButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    nextButton: {
        backgroundColor: '#FFFFFF',
    },
    nextButtonText: {
        color: Colors.light.primary, // Blue text for white button
        fontSize: 16,
        fontWeight: '700',
    }
});
