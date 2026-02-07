import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Dimensions,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { Button } from '../../components/shared/Button';
import { Input } from '../../components/shared/Input';
import { primary, text, textSecondary } from '../../constants/Colors';
import { theme } from '../../constants/theme';

const { width } = Dimensions.get('window');

export default function CreateShipmentStep1() {
    const router = useRouter();
    const [pickup, setPickup] = useState('');
    const [dropoff, setDropoff] = useState('');

    const handleNext = () => {
        router.push('/(business)/create-shipment-2');
    };

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
                    <Text style={styles.headerTitle}>Route Details</Text>
                    <View style={styles.placeholder} />
                </View>

                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.content}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Modern Progress Bar */}
                    <View style={styles.progressContainer}>
                        <LinearGradient
                            colors={theme.gradients.primary as any}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.progressBarFilled}
                        />
                        <View style={styles.progressBarEmpty} />
                        <View style={styles.progressBarEmpty} />
                    </View>
                    <Text style={styles.progressText}>Step 1 of 3</Text>

                    {/* Form Card */}
                    <LinearGradient
                        colors={['rgba(255, 255, 255, 0.95)', 'rgba(255, 255, 255, 0.85)']}
                        style={styles.formCard}
                    >
                        <Text style={styles.sectionTitle}>Where are you shipping?</Text>

                        <Input
                            label="Pickup Location"
                            placeholder="Enter pickup address"
                            value={pickup}
                            onChangeText={setPickup}
                            containerStyle={styles.input}
                        />

                        <View style={styles.swapIconContainer}>
                            <LinearGradient
                                colors={['rgba(59, 130, 246, 0.15)', 'rgba(96, 165, 250, 0.1)']}
                                style={styles.swapIcon}
                            >
                                <Ionicons name="swap-vertical" size={20} color={primary} />
                            </LinearGradient>
                        </View>

                        <Input
                            label="Drop Location"
                            placeholder="Enter destination address"
                            value={dropoff}
                            onChangeText={setDropoff}
                            containerStyle={styles.input}
                        />
                    </LinearGradient>

                    {/* Map Preview */}
                    <LinearGradient
                        colors={['rgba(59, 130, 246, 0.05)', 'rgba(96, 165, 250, 0.02)']}
                        style={styles.mapCard}
                    >
                        <Ionicons name="map-outline" size={48} color={primary} />
                        <Text style={styles.mapPlaceholderText}>Map Preview</Text>
                    </LinearGradient>

                    {/* Info Box */}
                    <LinearGradient
                        colors={['rgba(59, 130, 246, 0.1)', 'rgba(96, 165, 250, 0.05)']}
                        style={styles.infoBox}
                    >
                        <Ionicons name="information-circle" size={20} color={primary} />
                        <Text style={styles.infoText}>
                            Provide accurate addresses for precise cost calculation
                        </Text>
                    </LinearGradient>
                </ScrollView>

                <View style={styles.footer}>
                    <Button
                        title="Next"
                        onPress={handleNext}
                        disabled={!pickup || !dropoff}
                        variant="gradient"
                        fullWidth
                    />
                </View>
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
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        ...theme.shadows.light,
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        ...theme.typography.h3,
        color: text,
        fontWeight: '600',
    },
    placeholder: {
        width: 40,
    },
    scrollView: {
        flex: 1,
    },
    content: {
        paddingHorizontal: theme.spacing.base,
        paddingTop: theme.spacing.lg,
        paddingBottom: theme.spacing.xl,
    },
    progressContainer: {
        flexDirection: 'row',
        gap: theme.spacing.sm,
        marginBottom: theme.spacing.sm,
    },
    progressBarFilled: {
        flex: 1,
        height: 6,
        borderRadius: 3,
        ...theme.shadows.glow,
    },
    progressBarEmpty: {
        flex: 1,
        height: 6,
        backgroundColor: 'rgba(226, 232, 240, 0.5)',
        borderRadius: 3,
    },
    progressText: {
        ...theme.typography.caption,
        color: textSecondary,
        marginBottom: theme.spacing.lg,
    },
    formCard: {
        padding: theme.spacing.lg,
        borderRadius: theme.borderRadius.card,
        marginBottom: theme.spacing.base,
        ...theme.shadows.card,
    },
    sectionTitle: {
        ...theme.typography.h3,
        color: text,
        fontWeight: '600',
        marginBottom: theme.spacing.lg,
    },
    input: {
        marginBottom: 0,
    },
    swapIconContainer: {
        alignItems: 'center',
        marginVertical: theme.spacing.md,
    },
    swapIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    mapCard: {
        height: 200,
        borderRadius: theme.borderRadius.card,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: theme.spacing.base,
        ...theme.shadows.light,
    },
    mapPlaceholderText: {
        ...theme.typography.body,
        color: textSecondary,
        marginTop: theme.spacing.sm,
    },
    infoBox: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: theme.spacing.base,
        borderRadius: theme.borderRadius.md,
        gap: theme.spacing.sm,
    },
    infoText: {
        ...theme.typography.caption,
        color: text,
        flex: 1,
    },
    footer: {
        paddingHorizontal: theme.spacing.base,
        paddingVertical: theme.spacing.base,
        paddingBottom: theme.spacing.xxxl + theme.spacing.base, // Extra padding for bottom nav
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        ...theme.shadows.medium,
    },
});
