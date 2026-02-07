import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { Button } from '../../components/shared/Button';
import { Card } from '../../components/shared/Card';
import { background, primary, primaryLighter, text, textSecondary } from '../../constants/Colors';
import { theme } from '../../constants/theme';

const truckTypes = [
    { id: '1', name: 'Mini Truck', capacity: '1-2 Tons', icon: 'car' },
    { id: '2', name: 'Container', capacity: '5-10 Tons', icon: 'cube' },
    { id: '3', name: 'Trailer', capacity: '15-20 Tons', icon: 'bus' },
    { id: '4', name: 'Heavy Duty', capacity: '20+ Tons', icon: 'train' },
];

export default function CreateShipmentStep3() {
    const router = useRouter();
    const [selectedTruck, setSelectedTruck] = useState('');
    const [hasInsurance, setHasInsurance] = useState(false);

    const handleFindTrucks = () => {
        router.push('/(business)/available-trucks');
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Truck Preference</Text>
                <View style={styles.placeholder} />
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.progressContainer}>
                    <View style={styles.progressBar}>
                        <View style={[styles.progressSegment, styles.progressActive]} />
                        <View style={[styles.progressSegment, styles.progressActive]} />
                        <View style={[styles.progressSegment, styles.progressActive]} />
                    </View>
                    <Text style={styles.progressText}>Step 3 of 3</Text>
                </View>

                <Text style={styles.sectionTitle}>Select Truck Type</Text>
                <View style={styles.truckGrid}>
                    {truckTypes.map((truck) => (
                        <TouchableOpacity
                            key={truck.id}
                            onPress={() => setSelectedTruck(truck.id)}
                            activeOpacity={0.7}
                        >
                            <Card
                                style={[
                                    styles.truckCard,
                                    selectedTruck === truck.id && styles.truckCardSelected,
                                ]}
                            >
                                <View
                                    style={[
                                        styles.truckIconContainer,
                                        selectedTruck === truck.id && styles.truckIconSelected,
                                    ]}
                                >
                                    <Ionicons
                                        name={truck.icon as any}
                                        size={32}
                                        color={selectedTruck === truck.id ? primary : text}
                                    />
                                </View>
                                <Text style={styles.truckName}>{truck.name}</Text>
                                <Text style={styles.truckCapacity}>{truck.capacity}</Text>
                            </Card>
                        </TouchableOpacity>
                    ))}
                </View>

                <Card style={styles.optionsCard}>
                    <Text style={styles.optionsSectionTitle}>Additional Options</Text>

                    <TouchableOpacity
                        style={styles.option}
                        onPress={() => setHasInsurance(!hasInsurance)}
                    >
                        <View style={styles.optionLeft}>
                            <Ionicons name="shield-checkmark-outline" size={24} color={primary} />
                            <View style={styles.optionText}>
                                <Text style={styles.optionTitle}>Cargo Insurance</Text>
                                <Text style={styles.optionSubtitle}>Protect your shipment</Text>
                            </View>
                        </View>
                        <View
                            style={[
                                styles.checkbox,
                                hasInsurance && styles.checkboxActive,
                            ]}
                        >
                            {hasInsurance && (
                                <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                            )}
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.option}>
                        <View style={styles.optionLeft}>
                            <Ionicons name="calendar-outline" size={24} color={primary} />
                            <View style={styles.optionText}>
                                <Text style={styles.optionTitle}>Schedule Pickup</Text>
                                <Text style={styles.optionSubtitle}>Tomorrow, 10:00 AM</Text>
                            </View>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color={textSecondary} />
                    </TouchableOpacity>
                </Card>
            </ScrollView>

            <View style={styles.footer}>
                <Button
                    title="Find Available Trucks"
                    onPress={handleFindTrucks}
                    disabled={!selectedTruck}
                    fullWidth
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: theme.spacing.base,
        paddingVertical: theme.spacing.md,
        backgroundColor: '#FFFFFF',
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
        marginBottom: theme.spacing.lg,
    },
    progressBar: {
        flexDirection: 'row',
        gap: theme.spacing.sm,
        marginBottom: theme.spacing.sm,
    },
    progressSegment: {
        flex: 1,
        height: 4,
        backgroundColor: '#E2E8F0',
        borderRadius: 2,
    },
    progressActive: {
        backgroundColor: primary,
    },
    progressText: {
        ...theme.typography.caption,
        color: textSecondary,
    },
    sectionTitle: {
        ...theme.typography.h3,
        color: text,
        marginBottom: theme.spacing.base,
    },
    truckGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: theme.spacing.md,
        marginBottom: theme.spacing.lg,
    },
    truckCard: {
        width: '48%',
        padding: theme.spacing.base,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'transparent',
    },
    truckCardSelected: {
        borderColor: primary,
        backgroundColor: primaryLighter,
    },
    truckIconContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#F1F5F9',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: theme.spacing.sm,
    },
    truckIconSelected: {
        backgroundColor: '#FFFFFF',
    },
    truckName: {
        ...theme.typography.bodyMedium,
        color: text,
        marginBottom: theme.spacing.xs,
    },
    truckCapacity: {
        ...theme.typography.caption,
        color: textSecondary,
    },
    optionsCard: {
        padding: theme.spacing.base,
    },
    optionsSectionTitle: {
        ...theme.typography.h3,
        color: text,
        marginBottom: theme.spacing.base,
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: theme.spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
    optionLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    optionText: {
        marginLeft: theme.spacing.md,
        flex: 1,
    },
    optionTitle: {
        ...theme.typography.bodyMedium,
        color: text,
    },
    optionSubtitle: {
        ...theme.typography.caption,
        color: textSecondary,
    },
    checkbox: {
        width: 24,
        height: 24,
        borderRadius: 6,
        borderWidth: 2,
        borderColor: '#E2E8F0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkboxActive: {
        backgroundColor: primary,
        borderColor: primary,
    },
    footer: {
        paddingHorizontal: theme.spacing.base,
        paddingTop: theme.spacing.base,
        paddingBottom: 110, // Extra padding to prevent overlap with bottom nav
        backgroundColor: '#FFFFFF',
        ...theme.shadows.medium,
    },
});
