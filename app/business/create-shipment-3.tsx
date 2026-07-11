import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    Modal,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { draftToShipmentPayload, useShipmentDraft } from '../../contexts/CreateShipmentContext';
import { api } from '../../utils/api';
import { Button } from '../../components/shared/Button';
import { Card } from '../../components/shared/Card';
import { background, primary, primaryLighter, text, textSecondary, warning } from '../../constants/Colors';
import { theme } from '../../constants/theme';

const ICONS: Record<string, string> = {
    mini_1_2t: 'van-utility',
    container_5_10t: 'truck',
    trailer_15_20t: 'truck-trailer',
    heavy_20t_plus: 'truck-flatbed',
};

type TruckChoice = { id: string; name: string; capacity: string; icon: string };

const { width } = Dimensions.get('window');
const SPACING = theme.spacing.base; // 16
const GAP = theme.spacing.md; // 12 or 16
const ITEM_WIDTH = (width - (SPACING * 2) - GAP) / 2;

function defaultPickupTime(): Date {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    d.setHours(10, 0, 0, 0);
    return d;
}

function formatPickupLabel(d: Date): string {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const time = d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    if (d.toDateString() === tomorrow.toDateString()) return `Tomorrow, ${time}`;
    return d.toLocaleString([], {
        weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit',
    });
}

function formatInr(n: number) {
    return `₹${Math.round(n).toLocaleString('en-IN')}`;
}

type Quote = {
    basePrice?: number;
    insurancePct?: number;
    insuranceSurcharge?: number;
    urgentSurcharge?: number;
    totalFare?: number;
    customerPaysTotal?: number;
};

export default function CreateShipmentStep3() {
    const router = useRouter();
    const { draft, set } = useShipmentDraft();
    const [selectedTruck, setSelectedTruck] = useState(draft.truckType);
    const [hasInsurance, setHasInsurance] = useState(draft.hasInsurance);
    const [isUrgent, setIsUrgent] = useState(draft.isUrgent);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [truckTypes, setTruckTypes] = useState<TruckChoice[]>([]);
    const [pickupAt, setPickupAt] = useState<Date>(() =>
        draft.pickupAt ? new Date(draft.pickupAt) : defaultPickupTime(),
    );
    const [showPickupPicker, setShowPickupPicker] = useState(false);
    const [quote, setQuote] = useState<Quote | null>(null);
    const [quoteLoading, setQuoteLoading] = useState(false);

    useEffect(() => {
        api.truckTypes()
            .then((rows: any[]) => {
                setTruckTypes(rows.map((r) => ({
                    id: r.code,
                    name: r.label,
                    capacity: r.maxWeightKg ? `up to ${r.maxWeightKg} kg` : '—',
                    icon: ICONS[r.code] || 'truck',
                })));
            })
            .catch(() => {
                setTruckTypes([
                    { id: 'mini_1_2t', name: 'Mini Truck', capacity: '1-2 Tons', icon: 'van-utility' },
                    { id: 'container_5_10t', name: 'Container', capacity: '5-10 Tons', icon: 'truck' },
                ]);
            });
    }, []);

    // Persist toggles + pickup time into the draft
    useEffect(() => {
        set({ hasInsurance, isUrgent, pickupAt: pickupAt.toISOString() });
    }, [hasInsurance, isUrgent, pickupAt]);

    useEffect(() => {
        if (!selectedTruck || !draft.pickupAddress?.trim() || !draft.dropoffAddress?.trim()) {
            setQuote(null);
            return;
        }
        const weight = parseFloat(draft.weightKg);
        if (!Number.isFinite(weight)) {
            setQuote(null);
            return;
        }

        let cancelled = false;
        setQuoteLoading(true);
        api.quoteShipment(draftToShipmentPayload({
            ...draft,
            truckType: selectedTruck,
            hasInsurance,
            isUrgent,
            pickupAt: pickupAt.toISOString(),
        }))
            .then((q: Quote) => { if (!cancelled) setQuote(q); })
            .catch(() => { if (!cancelled) setQuote(null); })
            .finally(() => { if (!cancelled) setQuoteLoading(false); });
        return () => { cancelled = true; };
    }, [
        selectedTruck, hasInsurance, isUrgent, pickupAt,
        draft.weightKg, draft.pickupAddress, draft.dropoffAddress,
        draft.dimensions, draft.loadType, draft.notes,
    ]);

    const onPickupChange = (event: { type?: string }, date?: Date) => {
        if (Platform.OS === 'android') setShowPickupPicker(false);
        if (event.type === 'dismissed') return;
        if (date) {
            const min = new Date(Date.now() + 30 * 60 * 1000);
            setPickupAt(date < min ? min : date);
        }
    };

    const handleFindTrucks = () => {
        setErrorMsg(null);
        if (!selectedTruck) {
            setErrorMsg('Pick a truck type');
            return;
        }
        if (!draft.pickupAddress?.trim() || !draft.dropoffAddress?.trim()) {
            setErrorMsg('Go back and enter pickup & dropoff addresses.');
            return;
        }
        if (!draft.weightKg?.trim() || !Number.isFinite(parseFloat(draft.weightKg))) {
            setErrorMsg('Go back and enter load weight.');
            return;
        }
        set({
            truckType: selectedTruck,
            hasInsurance,
            isUrgent,
            pickupAt: pickupAt.toISOString(),
        });
        router.push({
            pathname: '/business/available-trucks',
            params: { urgent: isUrgent ? 'true' : 'false' },
        } as any);
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
                            style={{ width: ITEM_WIDTH }}
                        >
                            <Card
                                style={[
                                    styles.truckCard,
                                    selectedTruck === truck.id && styles.truckCardSelected,
                                ]}
                                padding={theme.spacing.sm}
                            >
                                <View
                                    style={[
                                        styles.truckIconContainer,
                                        selectedTruck === truck.id && styles.truckIconSelected,
                                    ]}
                                >
                                    <MaterialCommunityIcons
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

                {/* Priority Options - Urgent Load */}
                <Card style={[styles.optionsCard, isUrgent ? styles.urgentCard : undefined]}>
                    <View style={styles.urgentHeader}>
                        <View style={styles.urgentTitleRow}>
                            <Ionicons name="flash" size={20} color={isUrgent ? warning : textSecondary} />
                            <Text style={styles.optionsSectionTitle}>Priority Options</Text>
                        </View>
                        {isUrgent && (
                            <View style={styles.urgentBadge}>
                                <Text style={styles.urgentBadgeText}>URGENT</Text>
                            </View>
                        )}
                    </View>

                    <View style={styles.option}>
                        <View style={styles.optionLeft}>
                            <View style={styles.optionText}>
                                <Text style={styles.optionTitle}>Mark as Urgent Load</Text>
                                <Text style={styles.optionSubtitle}>Faster matching, higher driver payout</Text>

                                {isUrgent && (
                                    <View style={styles.urgentBenefits}>
                                        <View style={styles.benefitItem}>
                                            <Ionicons name="checkmark-circle" size={12} color={warning} />
                                            <Text style={styles.benefitText}>Priority notification to drivers</Text>
                                        </View>
                                        <View style={styles.benefitItem}>
                                            <Ionicons name="checkmark-circle" size={12} color={warning} />
                                            <Text style={styles.benefitText}>Top placement in driver app</Text>
                                        </View>
                                        <View style={styles.benefitItem}>
                                            <Ionicons name="trending-up" size={12} color={warning} />
                                            <Text style={styles.benefitText}>~12% Surcharge applied</Text>
                                        </View>
                                    </View>
                                )}
                            </View>
                        </View>
                        <Switch
                            value={isUrgent}
                            onValueChange={setIsUrgent}
                            trackColor={{ false: '#E2E8F0', true: warning }}
                            thumbColor={'#FFFFFF'}
                        />
                    </View>
                </Card>

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
                                <Text style={styles.optionSubtitle}>
                                    {hasInsurance && quote?.insuranceSurcharge != null
                                        ? `+${formatInr(quote.insuranceSurcharge)} (${quote.insurancePct ?? 0}% of base fare)`
                                        : quote?.insurancePct != null
                                            ? `${quote.insurancePct}% of base fare when added`
                                            : 'Protect your shipment'}
                                </Text>
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

                    <TouchableOpacity
                        style={[styles.option, styles.optionLast]}
                        onPress={() => setShowPickupPicker(true)}
                    >
                        <View style={styles.optionLeft}>
                            <Ionicons name="calendar-outline" size={24} color={primary} />
                            <View style={styles.optionText}>
                                <Text style={styles.optionTitle}>Schedule Pickup</Text>
                                <Text style={styles.optionSubtitle}>{formatPickupLabel(pickupAt)}</Text>
                            </View>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color={textSecondary} />
                    </TouchableOpacity>
                </Card>

                {quoteLoading ? (
                    <ActivityIndicator color={primary} style={{ marginTop: theme.spacing.md }} />
                ) : quote?.totalFare != null ? (
                    <Card style={styles.priceCard}>
                        <Text style={styles.priceTitle}>Estimated fare</Text>
                        <View style={styles.priceRow}>
                            <Text style={styles.priceLabel}>Base fare</Text>
                            <Text style={styles.priceValue}>{formatInr(quote.basePrice ?? 0)}</Text>
                        </View>
                        {hasInsurance && (quote.insuranceSurcharge ?? 0) > 0 ? (
                            <View style={styles.priceRow}>
                                <Text style={styles.priceLabel}>
                                    Cargo insurance ({quote.insurancePct ?? 0}%)
                                </Text>
                                <Text style={styles.priceValue}>
                                    +{formatInr(quote.insuranceSurcharge ?? 0)}
                                </Text>
                            </View>
                        ) : null}
                        {isUrgent && (quote.urgentSurcharge ?? 0) > 0 ? (
                            <View style={styles.priceRow}>
                                <Text style={styles.priceLabel}>Urgent surcharge</Text>
                                <Text style={styles.priceValue}>
                                    +{formatInr(quote.urgentSurcharge ?? 0)}
                                </Text>
                            </View>
                        ) : null}
                        <View style={[styles.priceRow, styles.priceTotalRow]}>
                            <Text style={styles.priceTotalLabel}>Total (incl. GST)</Text>
                            <Text style={styles.priceTotalValue}>
                                {formatInr(quote.customerPaysTotal ?? quote.totalFare ?? 0)}
                            </Text>
                        </View>
                    </Card>
                ) : null}
            </ScrollView>

            {showPickupPicker && Platform.OS === 'android' ? (
                <DateTimePicker
                    value={pickupAt}
                    mode="datetime"
                    minimumDate={new Date(Date.now() + 30 * 60 * 1000)}
                    onChange={onPickupChange}
                />
            ) : null}

            {Platform.OS === 'ios' || Platform.OS === 'web' ? (
                <Modal
                    visible={showPickupPicker}
                    transparent
                    animationType="slide"
                    onRequestClose={() => setShowPickupPicker(false)}
                >
                    <View style={styles.pickerBackdrop}>
                        <View style={styles.pickerSheet}>
                            <View style={styles.pickerHeader}>
                                <TouchableOpacity onPress={() => setShowPickupPicker(false)}>
                                    <Text style={styles.pickerDone}>Done</Text>
                                </TouchableOpacity>
                            </View>
                            <DateTimePicker
                                value={pickupAt}
                                mode="datetime"
                                display={Platform.OS === 'web' ? 'default' : 'spinner'}
                                minimumDate={new Date(Date.now() + 30 * 60 * 1000)}
                                onChange={onPickupChange}
                            />
                        </View>
                    </View>
                </Modal>
            ) : null}

            <View style={styles.footer}>
                {errorMsg ? (
                    <Text style={{ color: '#EF4444', marginBottom: 10, fontSize: 13 }}>{errorMsg}</Text>
                ) : null}
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
        width: '100%', // Controlled by parent
        padding: theme.spacing.md,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: theme.borderRadius.md,
        backgroundColor: '#FFFFFF',
    },
    truckCardSelected: {
        borderColor: primary,
        backgroundColor: primaryLighter,
        borderWidth: 2,
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
    optionLast: {
        borderBottomWidth: 0,
    },
    priceCard: {
        marginTop: theme.spacing.lg,
        padding: theme.spacing.base,
    },
    priceTitle: {
        ...theme.typography.h3,
        color: text,
        marginBottom: theme.spacing.sm,
    },
    priceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 4,
    },
    priceLabel: {
        ...theme.typography.caption,
        color: textSecondary,
    },
    priceValue: {
        ...theme.typography.bodyMedium,
        color: text,
    },
    priceTotalRow: {
        marginTop: theme.spacing.sm,
        paddingTop: theme.spacing.sm,
        borderTopWidth: 1,
        borderTopColor: '#F1F5F9',
    },
    priceTotalLabel: {
        ...theme.typography.bodyMedium,
        color: text,
        fontWeight: '700',
    },
    priceTotalValue: {
        ...theme.typography.bodyMedium,
        color: primary,
        fontWeight: '700',
    },
    pickerBackdrop: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.4)',
    },
    pickerSheet: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        paddingBottom: 24,
    },
    pickerHeader: {
        alignItems: 'flex-end',
        padding: theme.spacing.base,
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
    pickerDone: {
        color: primary,
        fontWeight: '600',
        fontSize: 16,
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
        paddingBottom: 120, // Increased padding to clear bottom nav
        backgroundColor: '#FFFFFF',
        ...theme.shadows.medium,
    },
    // Urgent Load Styles
    urgentCard: {
        borderColor: warning,
        borderWidth: 1,
        backgroundColor: 'rgba(245, 158, 11, 0.05)',
    },
    urgentHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing.xs,
    },
    urgentTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.xs,
    },
    urgentBadge: {
        backgroundColor: warning,
        paddingHorizontal: theme.spacing.sm,
        paddingVertical: 4,
        borderRadius: 4,
    },
    urgentBadgeText: {
        color: '#FFFFFF',
        fontSize: 10,
        fontWeight: '700',
    },
    urgentBenefits: {
        marginTop: theme.spacing.sm,
        gap: 4,
    },
    benefitItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    benefitText: {
        fontSize: 11,
        color: textSecondary,
        fontWeight: '500',
    },
});
