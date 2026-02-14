import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import {
    Animated,
    Dimensions,
    Image,
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

export default function Onboarding1() {
    const router = useRouter();
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(100)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 1000,
                useNativeDriver: true,
                easing: (t) => t * (2 - t), // easeOutQuad
            }),
        ]).start();
    }, []);

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            <ImageBackground
                // Using a placeholder image that resembles a truck on a winding road
                source={require('@/assets/truck-image/onboarding1.png')}
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
                        <Text style={styles.titleHighLight}>FLEXIBLE</Text>
                        <View style={styles.logisticRow}>
                            <Text style={styles.titleWhite}>L</Text>
                            <View style={styles.iconContainer}>
                                <Image source={require('../../assets/images/Applogo.png')} style={styles.logoImage} resizeMode="contain" />
                            </View>
                            <Text style={styles.titleBlue}>GISTIC</Text>
                        </View>
                        <View style={styles.cargoRow}>
                            <Text style={styles.titleWhite}>& CARG</Text>
                            <View style={styles.pillIcon}>
                                <Ionicons name="arrow-forward" size={20} color={Colors.light.background} />
                            </View>
                            <Text style={styles.titleWhite}> DELIVERY</Text>
                        </View>
                    </View>

                    <Text style={styles.subtitle}>
                        Fleet management and build bridge{'\n'}between shipper & driver.
                    </Text>

                    <View style={styles.paginationLine}>
                        <View style={styles.activeLine} />
                        <View style={styles.inactiveLine} />
                        <View style={styles.inactiveLine} />
                    </View>

                    <View style={styles.buttonContainer}>
                        <Button
                            title="Next"
                            onPress={() => router.push('/(onboarding)/onboarding-2')}
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
        justifyContent: 'flex-end',
        alignSelf: 'flex-start',
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
        paddingHorizontal: theme.spacing.lg, // Keep padding
        paddingBottom: theme.spacing.xxxl,
    },
    headerTextContainer: {
        marginBottom: theme.spacing.md, // Recude spacing
    },
    titleHighLight: {
        color: '#FFFFFF',
        fontSize: width < 380 ? 28 : 32, // Responsive font size
        fontWeight: '800',
        fontFamily: 'PlusJakartaSans_800ExtraBold',
        letterSpacing: 1,
    },
    logisticRow: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap', // Allow wrapping
    },
    titleWhite: {
        color: '#FFFFFF',
        fontSize: width < 380 ? 28 : 32,
        fontWeight: '800',
        fontFamily: 'PlusJakartaSans_800ExtraBold',
        letterSpacing: 1,
    },
    titleBlue: {
        color: '#6366F1',
        fontSize: width < 380 ? 28 : 32,
        fontWeight: '800',
        fontFamily: 'PlusJakartaSans_800ExtraBold',
        letterSpacing: 1,
    },
    cargoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
    },
    iconContainer: {
        flexDirection: 'row',
        marginHorizontal: 4,
        alignItems: 'center',
    },
    logoImage: {
        width: 60,
        height: 60,
        transform: [{ scale: 1.5 }],
    },
    pillIcon: {
        backgroundColor: '#6366F1',
        width: width < 380 ? 32 : 36, // Responsive width
        height: width < 380 ? 32 : 36, // Responsive height (equal to width)
        borderRadius: width < 380 ? 16 : 18, // Half of size for perfect circle
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 4,
    },
    subtitle: {
        color: 'rgba(255, 255, 255, 0.7)',
        fontSize: width < 380 ? 14 : 16,
        fontFamily: 'PlusJakartaSans_400Regular',
        lineHeight: 24,
        marginBottom: theme.spacing.lg,
    },
    paginationLine: {
        flexDirection: 'row',
        marginBottom: theme.spacing.lg,
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
    nextButton: {
        backgroundColor: '#FFFFFF',
    },
    nextButtonText: {
        color: Colors.light.primary,
        fontSize: 16,
        fontWeight: '700',
    }
});
