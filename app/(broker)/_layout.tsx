import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, StyleSheet } from 'react-native';
import { primary, textSecondary } from '../../constants/Colors';

export default function BrokerLayout() {
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
                name="drivers"
                options={{
                    title: 'Drivers',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="people" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="loads"
                options={{
                    title: 'Loads',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="cube" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="earnings"
                options={{
                    title: 'Earnings',
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
            {/* Hide helper/detail screens from tabs */}
            <Tabs.Screen
                name="add-driver"
                options={{ href: null }}
            />
            <Tabs.Screen
                name="assign-trip"
                options={{ href: null }}
            />
            <Tabs.Screen
                name="trip-details"
                options={{ href: null }}
            />
        </Tabs>
    );
}

const styles = StyleSheet.create({
    tabBar: {
        position: 'absolute',
        bottom: 20,
        left: '5%',
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
