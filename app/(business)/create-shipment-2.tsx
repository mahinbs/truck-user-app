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
import { Input } from '../../components/shared/Input';
import { background, primary, text, textSecondary } from '../../constants/Colors';
import { theme } from '../../constants/theme';

export default function CreateShipmentStep2() {
    const router = useRouter();
    const [weight, setWeight] = useState('');
    const [loadType, setLoadType] = useState('');
    const [dimensions, setDimensions] = useState('');
    const [notes, setNotes] = useState('');

    const handleNext = () => {
        router.push('/(business)/create-shipment-3');
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Load Details</Text>
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
                        <View style={styles.progressSegment} />
                    </View>
                    <Text style={styles.progressText}>Step 2 of 3</Text>
                </View>

                <Card style={styles.formCard}>
                    <Text style={styles.sectionTitle}>Tell us about your load</Text>

                    <Input
                        label="Weight (kg)"
                        placeholder="Enter weight in kilograms"
                        value={weight}
                        onChangeText={setWeight}
                        keyboardType="numeric"
                    />

                    <Input
                        label="Load Type"
                        placeholder="e.g., Electronics, Furniture, etc."
                        value={loadType}
                        onChangeText={setLoadType}
                    />

                    <Input
                        label="Dimensions"
                        placeholder="Length x Width x Height (optional)"
                        value={dimensions}
                        onChangeText={setDimensions}
                    />

                    <Input
                        label="Additional Notes"
                        placeholder="Any special instructions..."
                        value={notes}
                        onChangeText={setNotes}
                        multiline
                        numberOfLines={4}
                        style={styles.notesInput}
                    />
                </Card>

                {/* Common Load Types */}
                <Card style={styles.suggestionsCard}>
                    <Text style={styles.suggestionsTitle}>Common Load Types</Text>
                    <View style={styles.chipContainer}>
                        <TouchableOpacity
                            style={styles.chip}
                            onPress={() => setLoadType('Electronics')}
                        >
                            <Text style={styles.chipText}>Electronics</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.chip}
                            onPress={() => setLoadType('Furniture')}
                        >
                            <Text style={styles.chipText}>Furniture</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.chip}
                            onPress={() => setLoadType('Construction Material')}
                        >
                            <Text style={styles.chipText}>Construction Material</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.chip}
                            onPress={() => setLoadType('FMCG')}
                        >
                            <Text style={styles.chipText}>FMCG</Text>
                        </TouchableOpacity>
                    </View>
                </Card>
            </ScrollView>

            <View style={styles.footer}>
                <Button
                    title="Next"
                    onPress={handleNext}
                    disabled={!weight || !loadType}
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
    formCard: {
        padding: theme.spacing.lg,
        marginBottom: theme.spacing.base,
    },
    sectionTitle: {
        ...theme.typography.h3,
        color: text,
        marginBottom: theme.spacing.lg,
    },
    notesInput: {
        height: 100,
        textAlignVertical: 'top',
    },
    suggestionsCard: {
        padding: theme.spacing.base,
    },
    suggestionsTitle: {
        ...theme.typography.bodyMedium,
        color: text,
        marginBottom: theme.spacing.md,
    },
    chipContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: theme.spacing.sm,
    },
    chip: {
        paddingHorizontal: theme.spacing.base,
        paddingVertical: theme.spacing.sm,
        backgroundColor: '#EFF6FF',
        borderRadius: theme.borderRadius.full,
        borderWidth: 1,
        borderColor: primary,
    },
    chipText: {
        ...theme.typography.caption,
        color: primary,
    },
    footer: {
        paddingHorizontal: theme.spacing.base,
        paddingTop: theme.spacing.base,
        paddingBottom: 110, // Extra padding to prevent overlap with bottom nav
        backgroundColor: '#FFFFFF',
        ...theme.shadows.medium,
    },
});
