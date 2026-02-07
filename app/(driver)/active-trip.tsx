import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import {
    Animated,
    Dimensions,
    Image,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { Button } from '../../components/shared/Button';
import {
    primary,
    text,
    textSecondary
} from '../../constants/Colors';
import { theme } from '../../constants/theme';

const { width, height } = Dimensions.get('window');

const tripTimeline = [
    {
        id: '1',
        title: 'Pickup',
        location: 'Mumbai Port Trust, Maharashtra',
        time: '10:00 AM',
        status: 'completed',
        isLast: false,
    },
    {
        id: '2',
        title: 'Checkpost',
        location: 'Vashi Check Naka',
        time: '12:30 PM',
        status: 'completed',
        isLast: false,
    },
    {
        id: '3',
        title: 'Halt',
        location: 'Food Mall, Pune Expressway',
        time: '02:00 PM',
        status: 'current',
        isLast: false,
    },
    {
        id: '4',
        title: 'Drop',
        location: 'Transport Nagar, Delhi',
        time: 'Est. Dec 17',
        status: 'pending',
        isLast: true,
    },
];

export default function ActiveTrip() {
    const router = useRouter();
    const slideAnim = useRef(new Animated.Value(height)).current;

    useEffect(() => {
        Animated.spring(slideAnim, {
            toValue: 0,
            useNativeDriver: true,
            damping: 20,
            stiffness: 90,
        }).start();
    }, []);

    const renderTimelineItem = (item: any, index: number) => {
        const isCompleted = item.status === 'completed';
        const isCurrent = item.status === 'current';

        return (
            <View key={item.id} style={styles.timelineItem}>
                <View style={styles.timelineLeft}>
                    <View style={styles.timelineLineContainer}>
                        {!item.isLast && (
                            <View style={[
                                styles.timelineLine,
                                isCompleted && styles.timelineLineActive
                            ]} />
                        )}
                        <View style={[
                            styles.timelineDot,
                            isCompleted && styles.timelineDotCompleted,
                            isCurrent && styles.timelineDotCurrent,
                        ]}>
                            {isCompleted && <Ionicons name="checkmark" size={10} color="#FFFFFF" />}
                            {isCurrent && <View style={styles.currentDotInner} />}
                        </View>
                    </View>
                </View>
                <View style={styles.timelineContent}>
                    <View style={styles.timelineHeader}>
                        <Text style={[
                            styles.timelineTitle,
                            isCurrent && styles.textPrimary
                        ]}>{item.title}</Text>
                        <Text style={styles.timelineTime}>{item.time}</Text>
                    </View>
                    <Text style={styles.timelineLocation}>{item.location}</Text>
                </View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            {/* Map Placeholder Background */}
            <View style={styles.mapContainer}>
                <Image
                    source={{ uri: 'https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/72.8777,19.0760,11,0/600x800?access_token=placeholder' }}
                    style={StyleSheet.absoluteFillObject}
                    resizeMode="cover"
                />
                <LinearGradient
                    colors={['rgba(0,0,0,0.6)', 'transparent', 'transparent']}
                    style={styles.mapOverlay}
                />
                {/* Map Fallback Content since URL requires token */}
                <View style={[StyleSheet.absoluteFillObject, styles.mapFallback]}>
                    <Ionicons name="map" size={64} color={textSecondary} style={{ opacity: 0.2 }} />
                </View>
            </View>

            <SafeAreaView style={styles.safeArea}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color={text} />
                    </TouchableOpacity>

                    <View style={styles.headerTitleContainer}>
                        <BlurView intensity={80} tint="light" style={styles.headerTitleBlur}>
                            <Text style={styles.headerTitle}>Active Trip</Text>
                            <View style={styles.statusPill}>
                                <View style={styles.statusDot} />
                                <Text style={styles.statusText}>On Time</Text>
                            </View>
                        </BlurView>
                    </View>

                    <TouchableOpacity style={styles.sosButton}>
                        <Ionicons name="warning" size={20} color="#FFFFFF" />
                        <Text style={styles.sosText}>SOS</Text>
                    </TouchableOpacity>
                </View>

                {/* Bottom Sheet */}
                <Animated.View
                    style={[
                        styles.bottomSheet,
                        { transform: [{ translateY: slideAnim }] }
                    ]}
                >
                    <View style={styles.handleIndicator} />

                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.sheetContent}
                    >
                        <View style={styles.tripHeader}>
                            <View>
                                <Text style={styles.tripRoute}>Mumbai → Delhi</Text>
                                <Text style={styles.tripId}>Trip #TRK-8924</Text>
                            </View>
                            <TouchableOpacity style={styles.navigationButton}>
                                <LinearGradient
                                    colors={theme.gradients.primary as any}
                                    style={styles.navGradient}
                                >
                                    <Ionicons name="navigate" size={24} color="#FFFFFF" />
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>

                        <LinearGradient
                            colors={['rgba(59, 130, 246, 0.08)', 'rgba(96, 165, 250, 0.04)']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.progressCard}
                        >
                            <View style={styles.progressStats}>
                                <View style={styles.statItem}>
                                    <Text style={styles.statLabel}>Distance Left</Text>
                                    <Text style={styles.statValue}>850 km</Text>
                                </View>
                                <View style={styles.statDivider} />
                                <View style={styles.statItem}>
                                    <Text style={styles.statLabel}>Est. Arrival</Text>
                                    <Text style={styles.statValue}>28 hrs</Text>
                                </View>
                            </View>
                            <View style={styles.progressBarBg}>
                                <LinearGradient
                                    colors={theme.gradients.primary as any}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    style={[styles.progressBarFill, { width: '45%' }]}
                                />
                            </View>
                        </LinearGradient>

                        <Text style={styles.sectionTitle}>Trip Timeline</Text>
                        <View style={styles.timelineContainer}>
                            {tripTimeline.map(renderTimelineItem)}
                        </View>

                        <View style={styles.actionsContainer}>
                            <Button
                                title="Update Status"
                                onPress={() => { }}
                                variant="outline"
                                style={styles.actionButton}
                            />
                            <Button
                                title="Contact Support"
                                onPress={() => { }}
                                variant="secondary"
                                style={styles.actionButton}
                            />
                        </View>
                    </ScrollView>
                </Animated.View>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    mapContainer: {
        ...StyleSheet.absoluteFillObject,
        height: height * 0.5,
    },
    mapOverlay: {
        ...StyleSheet.absoluteFillObject,
    },
    mapFallback: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#E2E8F0',
        zIndex: -1,
    },
    safeArea: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        paddingHorizontal: theme.spacing.lg,
        paddingTop: theme.spacing.md,
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        backgroundColor: '#FFFFFF',
        ...theme.shadows.medium,
    },
    headerTitleContainer: {
        borderRadius: 20,
        overflow: 'hidden',
        ...theme.shadows.medium,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
    },
    headerTitleBlur: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 16,
        fontFamily: 'PlusJakartaSans_700Bold',
        color: text,
        marginBottom: 2,
    },
    statusPill: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    statusDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#10B981',
    },
    statusText: {
        fontSize: 12,
        color: '#10B981',
        fontFamily: 'PlusJakartaSans_600SemiBold',
    },
    sosButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#EF4444',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 20,
        gap: 6,
        ...theme.shadows.medium,
    },
    sosText: {
        fontSize: 14,
        color: '#FFFFFF',
        fontFamily: 'PlusJakartaSans_700Bold',
    },
    bottomSheet: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: height * 0.7,
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        ...theme.shadows.strong,
        elevation: 20,
    },
    handleIndicator: {
        width: 40,
        height: 4,
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        borderRadius: 2,
        alignSelf: 'center',
        marginTop: 12,
        marginBottom: 8,
    },
    sheetContent: {
        padding: theme.spacing.lg,
        paddingBottom: 40,
    },
    tripHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing.lg,
    },
    tripRoute: {
        fontSize: 24,
        fontFamily: 'PlusJakartaSans_700Bold',
        color: text,
        marginBottom: 4,
    },
    tripId: {
        fontSize: 14,
        fontFamily: 'PlusJakartaSans_500Medium',
        color: textSecondary,
    },
    navigationButton: {
        borderRadius: 28,
        overflow: 'hidden',
        ...theme.shadows.glow,
        elevation: 10,
    },
    navGradient: {
        width: 56,
        height: 56,
        justifyContent: 'center',
        alignItems: 'center',
    },
    progressCard: {
        borderRadius: 20,
        padding: theme.spacing.lg,
        marginBottom: theme.spacing.xl,
        borderWidth: 1,
        borderColor: 'rgba(59, 130, 246, 0.15)',
    },
    progressStats: {
        flexDirection: 'row',
        marginBottom: theme.spacing.md,
    },
    statItem: {
        flex: 1,
    },
    statLabel: {
        fontSize: 12,
        color: textSecondary,
        marginBottom: 4,
        fontFamily: 'PlusJakartaSans_500Medium',
    },
    statValue: {
        fontSize: 18,
        color: text,
        fontFamily: 'PlusJakartaSans_700Bold',
    },
    statDivider: {
        width: 1,
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
        marginHorizontal: theme.spacing.lg,
    },
    progressBarBg: {
        height: 8,
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        borderRadius: 4,
    },
    sectionTitle: {
        fontSize: 18,
        color: text,
        marginBottom: theme.spacing.lg,
        fontFamily: 'PlusJakartaSans_600SemiBold',
    },
    timelineContainer: {
        marginBottom: theme.spacing.xl,
    },
    timelineItem: {
        flexDirection: 'row',
        paddingBottom: theme.spacing.lg,
    },
    timelineLeft: {
        width: 30,
        alignItems: 'center',
        marginRight: theme.spacing.md,
    },
    timelineLineContainer: {
        alignItems: 'center',
        height: '100%',
    },
    timelineLine: {
        position: 'absolute',
        top: 0,
        bottom: -20,
        width: 2,
        backgroundColor: '#E2E8F0',
        zIndex: -1,
    },
    timelineLineActive: {
        backgroundColor: '#10B981',
    },
    timelineDot: {
        width: 18,
        height: 18,
        borderRadius: 9,
        backgroundColor: '#E2E8F0',
        borderWidth: 2,
        borderColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
        marginBottom: 4,
    },
    timelineDotCompleted: {
        backgroundColor: '#10B981',
        borderColor: '#DCFCE7',
        borderWidth: 0,
    },
    timelineDotCurrent: {
        backgroundColor: '#FFFFFF',
        borderColor: primary,
        borderWidth: 2,
        width: 20,
        height: 20,
        borderRadius: 10,
    },
    currentDotInner: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: primary,
    },
    timelineContent: {
        flex: 1,
        paddingTop: 2,
    },
    timelineHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 2,
    },
    timelineTitle: {
        fontSize: 15,
        fontFamily: 'PlusJakartaSans_600SemiBold',
        color: text,
    },
    textPrimary: {
        color: primary,
        fontFamily: 'PlusJakartaSans_700Bold',
    },
    timelineTime: {
        fontSize: 12,
        color: textSecondary,
        fontFamily: 'PlusJakartaSans_500Medium',
    },
    timelineLocation: {
        fontSize: 13,
        color: textSecondary,
        fontFamily: 'PlusJakartaSans_400Regular',
    },
    actionsContainer: {
        gap: theme.spacing.md,
    },
    actionButton: {
        borderRadius: 12,
    },
});
