import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, StyleSheet } from 'react-native';
import { primary, textSecondary } from '../../constants/Colors';

export default function BusinessLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: primary,
                tabBarInactiveTintColor: textSecondary,
                tabBarStyle: styles.tabBar,
                tabBarBackground: () => (
                    <BlurView
                        intensity={10}
                        style={StyleSheet.absoluteFill}
                        tint="light"
                    />
                ),
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: '500',
                },
            }}
        >
            <Tabs.Screen
                name="home"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="home" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="shipments"
                options={{
                    title: 'Shipments',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="cube" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="wallet"
                options={{
                    title: 'Wallet',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="wallet" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profile',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="person" size={size} color={color} />
                    ),
                }}
            />
            {/* Hide other screens from tabs */}
            <Tabs.Screen
                name="create-shipment-1"
                options={{ href: null }}
            />
            <Tabs.Screen
                name="create-shipment-2"
                options={{ href: null }}
            />
            <Tabs.Screen
                name="create-shipment-3"
                options={{ href: null }}
            />
            <Tabs.Screen
                name="available-trucks"
                options={{ href: null }}
            />
            <Tabs.Screen
                name="booking-confirmation"
                options={{ href: null }}
            />
            <Tabs.Screen
                name="tracking"
                options={{ href: null }}
            />
            <Tabs.Screen
                name="booking-success"
                options={{ href: null }}
            />
            <Tabs.Screen
                name="booking-failure"
                options={{ href: null }}
            />
        </Tabs>
    );
}

const styles = StyleSheet.create({
    tabBar: {
        position: 'absolute',
        bottom: 20,
        left: '5%', // Center with percentage margins
        right: '5%',
        height: 65,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.85)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.12,
        shadowRadius: 16,
        elevation: 6,
        paddingBottom: Platform.OS === 'ios' ? 10 : 8,
    },
});
