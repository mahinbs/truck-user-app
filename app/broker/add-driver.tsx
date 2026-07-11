import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { Button } from '../../components/shared/Button';
import { Input } from '../../components/shared/Input';
import { Colors } from '../../constants/Colors';
import { theme } from '../../constants/theme';
import { api, ApiError } from '../../utils/api';

const { width } = Dimensions.get('window');

// Must match truck_types.code on the backend (scripts/seed.py)
const VEHICLE_TYPES = [
    { id: 'mini_1_2t',       name: 'Mini Truck', capacity: '1-2 Tons',   icon: 'car-outline' },
    { id: 'container_5_10t', name: 'Container',  capacity: '5-10 Tons',  icon: 'bus-outline' },
    { id: 'trailer_15_20t',  name: 'Trailer',    capacity: '15-20 Tons', icon: 'car-sport-outline' },
    { id: 'heavy_20t_plus',  name: 'Heavy Duty', capacity: '20+ Tons',   icon: 'car-sport-outline' },
];

export default function AddDriver() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [vehicleType, setVehicleType] = useState('mini_1_2t');
    const [vehicleNumber, setVehicleNumber] = useState('');
    const [licenseNumber, setLicenseNumber] = useState('');
    const [loading, setLoading] = useState(false);

    const handleAddDriver = async () => {
        if (!name || !phone || !vehicleNumber) {
            Alert.alert('Missing Info', 'Name, phone and truck number are required.');
            return;
        }
        setLoading(true);
        try {
            await api.brokerAddDriver({
                name: name.trim(),
                phone: phone.trim(),
                truckType: vehicleType,
                truckNumber: vehicleNumber.trim().toUpperCase(),
                licenseNumber: licenseNumber.trim() || undefined,
            });
            Alert.alert(
                'Driver Added',
                `${name} has been added to your network.`,
                [{ text: 'OK', onPress: () => router.back() }],
            );
        } catch (e: any) {
            Alert.alert('Failed', e instanceof ApiError ? e.message : (e?.message || 'unknown'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={theme.gradients.background as any}
                style={StyleSheet.absoluteFillObject}
            />

            <SafeAreaView style={styles.safeArea}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
                        <Ionicons name="arrow-back" size={24} color={Colors.light.text} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Add New Driver</Text>
                    <View style={styles.placeholder} />
                </View>

                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.keyboardView}
                >
                    <ScrollView
                        contentContainerStyle={styles.scrollContent}
                        showsVerticalScrollIndicator={false}
                    >
                        <View style={styles.formCard}>
                            <Text style={styles.cardTitle}>Driver Personal Info</Text>
                            <Input
                                label="Driver's Full Name"
                                value={name}
                                onChangeText={setName}
                                placeholder="Enter driver name"
                                containerStyle={styles.input}
                            />
                            <Input
                                label="Mobile Phone Number"
                                value={phone}
                                onChangeText={setPhone}
                                placeholder="Enter 10-digit number"
                                keyboardType="phone-pad"
                                containerStyle={styles.input}
                            />
                            <Input
                                label="Driving License Number"
                                value={licenseNumber}
                                onChangeText={setLicenseNumber}
                                placeholder="e.g. DL-1420230012345"
                                autoCapitalize="characters"
                                containerStyle={styles.input}
                            />

                            <Text style={[styles.cardTitle, { marginTop: theme.spacing.md }]}>Vehicle Specifications</Text>

                            <Text style={styles.selectionLabel}>Select Truck Type</Text>
                            <View style={styles.vehicleRow}>
                                {VEHICLE_TYPES.map(type => (
                                    <TouchableOpacity
                                        key={type.id}
                                        style={[
                                            styles.vehicleCard,
                                            vehicleType === type.id && styles.vehicleCardActive
                                        ]}
                                        onPress={() => setVehicleType(type.id)}
                                    >
                                        <Ionicons
                                            name={type.icon as any}
                                            size={22}
                                            color={vehicleType === type.id ? '#FFFFFF' : Colors.light.primary}
                                        />
                                        <Text style={[
                                            styles.vehicleName,
                                            vehicleType === type.id && styles.vehicleNameActive
                                        ]}>
                                            {type.name}
                                        </Text>
                                        <Text style={[
                                            styles.vehicleCapacity,
                                            vehicleType === type.id && styles.vehicleCapacityActive
                                        ]}>
                                            {type.capacity}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            <Input
                                label="Vehicle Plate Number"
                                value={vehicleNumber}
                                onChangeText={setVehicleNumber}
                                placeholder="e.g. MH-12-QP-9876"
                                autoCapitalize="characters"
                                containerStyle={styles.input}
                            />

                            <Button
                                title="Onboard Driver"
                                onPress={handleAddDriver}
                                variant="gradient"
                                fullWidth
                                loading={loading}
                                style={styles.submitBtn}
                            />
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
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
        paddingHorizontal: theme.spacing.lg,
        paddingVertical: theme.spacing.md,
    },
    headerTitle: {
        fontSize: 18,
        fontFamily: 'PlusJakartaSans_700Bold',
        color: Colors.light.text,
    },
    iconButton: {
        width: 44,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 14,
        backgroundColor: '#FFFFFF',
        ...theme.shadows.light,
    },
    placeholder: {
        width: 44,
    },
    keyboardView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: theme.spacing.lg,
        paddingBottom: 40,
    },
    formCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        padding: theme.spacing.lg,
        ...theme.shadows.medium,
    },
    cardTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: Colors.light.text,
        fontFamily: 'PlusJakartaSans_700Bold',
        marginBottom: theme.spacing.md,
    },
    input: {
        marginBottom: theme.spacing.md,
    },
    selectionLabel: {
        fontSize: 13,
        fontWeight: '600',
        color: Colors.light.textSecondary,
        fontFamily: 'PlusJakartaSans_600SemiBold',
        marginBottom: theme.spacing.xs,
    },
    vehicleRow: {
        flexDirection: 'row',
        gap: theme.spacing.sm,
        marginBottom: theme.spacing.md,
    },
    vehicleCard: {
        flex: 1,
        padding: theme.spacing.sm,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 12,
        alignItems: 'center',
        gap: 4,
    },
    vehicleCardActive: {
        backgroundColor: Colors.light.primary,
        borderColor: Colors.light.primary,
    },
    vehicleName: {
        fontSize: 12,
        fontWeight: '700',
        color: Colors.light.text,
        fontFamily: 'PlusJakartaSans_700Bold',
    },
    vehicleNameActive: {
        color: '#FFFFFF',
    },
    vehicleCapacity: {
        fontSize: 10,
        color: Colors.light.textSecondary,
    },
    vehicleCapacityActive: {
        color: 'rgba(255,255,255,0.8)',
    },
    submitBtn: {
        marginTop: theme.spacing.md,
        borderRadius: 16,
    },
});
