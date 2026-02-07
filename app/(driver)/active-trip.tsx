import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
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
    surface,
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
    const [tripStatus, setTripStatus] = useState('in-transit');
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
                            {isCompleted && <Ionicons name="checkmark" size={12} color={surface} />}
                            {isCurrent && <View style={styles.currentDotInner} />}
                        </View>
                    </View>
                    <Text style={styles.timelineTime}>{item.time}</Text>
                </View>
                <View style={[
                    styles.timelineContent,
                    isCurrent && styles.timelineContentCurrent
                ]}>
                    <Text style={[
                        styles.timelineTitle,
                        isCurrent && styles.textPrimary
                    ]}>{item.title}</Text>
                    <Text style={styles.timelineLocation}>{item.location}</Text>
                </View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            {/* Map Placeholder Background */}
            <Image
                source={{ uri: 'https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/72.8777,19.0760,11,0/600x800?access_token=YOUR_TOKEN' }}
                style={StyleSheet.absoluteFillObject}
                resizeMode="cover"
            />
            <LinearGradient
                colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.1)', 'transparent']}
                style={styles.mapOverlay}
            />

            <SafeAreaView style={styles.safeArea}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color={text} />
                    </TouchableOpacity>
                    <View style={styles.headerTitleContainer}>
                        <Text style={styles.headerTitle}>Active Trip</Text>
                        <View style={styles.statusPill}>
                            <View style={styles.statusDot} />
                            <Text style={styles.statusText}>On Time</Text>
                        </View>
                    </View>
                    <TouchableOpacity style={styles.sosButton}>
                        <Ionicons name="warning" size={20} color={surface} />
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
                    <BlurView intensity={80} tint="light" style={styles.bottomSheetBlur}>
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
                                <View style={styles.navigationButton}>
                                    <LinearGradient
                                        colors={theme.gradients.primary as any}
                                        style={styles.navGradient}
                                    >
                                        <Ionicons name="navigate" size={20} color={surface} />
                                    </LinearGradient>
                                </View>
                            </View>

                            <View style={styles.progressCard}>
                                <LinearGradient
                                    colors={['rgba(59, 130, 246, 0.1)', 'rgba(96, 165, 250, 0.05)']}
                                    style={styles.progressGradient}
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
                            </View>

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
                    </BlurView>
                </Animated.View>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f1f5f9', // Map placeholder color
    },
    mapOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 200,
    },
    safeArea: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: theme.spacing.base,
        paddingTop: theme.spacing.base,
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        backgroundColor: surface,
        ...theme.shadows.medium,
    },
    headerTitleContainer: {
        alignItems: 'center',
        backgroundColor: surface,
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        ...theme.shadows.medium,
    },
    headerTitle: {
        ...theme.typography.bodyMedium,
        fontWeight: '700',
        color: text,
        marginBottom: 2,
    },
    statusPill: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    statusDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#10B981',
    },
    statusText: {
        ...theme.typography.caption,
        color: '#10B981',
        fontWeight: '600',
    },
    sosButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#EF4444',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 20,
        gap: 4,
        ...theme.shadows.medium,
    },
    sosText: {
        ...theme.typography.caption,
        color: surface,
        fontWeight: '700',
    },
    bottomSheet: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: height * 0.65,
        backgroundColor: surface,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        overflow: 'hidden',
        ...theme.shadows.strong,
    },
    bottomSheetBlur: {
        flex: 1,
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
        ...theme.typography.h2,
        fontSize: 24,
        color: text,
        marginBottom: 4,
    },
    tripId: {
        ...theme.typography.body,
        color: textSecondary,
    },
    navigationButton: {
        borderRadius: 25,
        overflow: 'hidden',
        ...theme.shadows.glow,
    },
    navGradient: {
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    progressCard: {
        borderRadius: theme.borderRadius.card,
        overflow: 'hidden',
        marginBottom: theme.spacing.xl,
        borderWidth: 1,
        borderColor: 'rgba(59, 130, 246, 0.1)',
    },
    progressGradient: {
        padding: theme.spacing.lg,
    },
    progressStats: {
        flexDirection: 'row',
        marginBottom: theme.spacing.md,
    },
    statItem: {
        flex: 1,
    },
    statLabel: {
        ...theme.typography.caption,
        color: textSecondary,
        marginBottom: 4,
    },
    statValue: {
        ...theme.typography.h3,
        fontSize: 18,
        color: text,
        fontWeight: '700',
    },
    statDivider: {
        width: 1,
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
        marginHorizontal: theme.spacing.lg,
    },
    progressBarBg: {
        height: 6,
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
        borderRadius: 3,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        borderRadius: 3,
    },
    sectionTitle: {
        ...theme.typography.h3,
        fontSize: 18,
        color: text,
        marginBottom: theme.spacing.lg,
        fontWeight: '600',
    },
    timelineContainer: {
        marginBottom: theme.spacing.xl,
    },
    timelineItem: {
        flexDirection: 'row',
        minHeight: 80,
    },
    timelineLeft: {
        width: 80,
        alignItems: 'flex-end',
        paddingRight: theme.spacing.md,
    },
    timelineLineContainer: {
        position: 'absolute',
        right: -7,
        top: 4,
        bottom: 0,
        alignItems: 'center',
        width: 14,
    },
    timelineLine: {
        position: 'absolute',
        top: 14,
        bottom: 0,
        width: 2,
        backgroundColor: '#E2E8F0',
    },
    timelineLineActive: {
        backgroundColor: primary,
    },
    timelineDot: {
        width: 14,
        height: 14,
        borderRadius: 7,
        backgroundColor: '#E2E8F0',
        borderWidth: 2,
        borderColor: surface,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
    },
    timelineDotCompleted: {
        backgroundColor: primary,
        width: 16,
        height: 16,
        borderRadius: 8,
        borderWidth: 0,
    },
    timelineDotCurrent: {
        backgroundColor: surface,
        borderColor: primary,
        width: 16,
        height: 16,
        borderRadius: 8,
    },
    currentDotInner: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: primary,
    },
    timelineTime: {
        ...theme.typography.caption,
        color: textSecondary,
        textAlign: 'right',
        fontSize: 12,
    },
    timelineContent: {
        flex: 1,
        paddingLeft: theme.spacing.md,
        paddingBottom: theme.spacing.lg,
    },
    timelineContentCurrent: {
        backgroundColor: 'rgba(59, 130, 246, 0.05)',
        marginRight: -theme.spacing.lg,
        paddingRight: theme.spacing.lg,
        paddingTop: theme.spacing.sm,
        marginTop: -theme.spacing.sm,
        borderTopLeftRadius: theme.borderRadius.base,
        borderBottomLeftRadius: theme.borderRadius.base,
    },
    timelineTitle: {
        ...theme.typography.bodyMedium,
        color: text,
        fontWeight: '600',
        marginBottom: 2,
    },
    textPrimary: {
        color: primary,
    },
    timelineLocation: {
        ...theme.typography.caption,
        color: textSecondary,
        fontSize: 13,
        lineHeight: 18,
    },
    actionsContainer: {
        gap: theme.spacing.md,
    },
    actionButton: {
        borderRadius: theme.borderRadius.button,
    },
});
