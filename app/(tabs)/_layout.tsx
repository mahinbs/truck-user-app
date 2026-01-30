import { BusinessHeader } from '@/components/ui/BusinessHeader';
import { colors, shadows, typography } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { Platform } from 'react-native';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => {
        const getTitle = () => {
          if (route.name === 'dashboard') return 'Dashboard';
          if (route.name === 'trips') return 'My Shipments';
          if (route.name === 'payments') return 'Payments & Invoices';
          if (route.name === 'profile') return 'My Profile';
          return route.name;
        };

        return {
          headerShown: true,
          header: () => (
            <BusinessHeader
              title={getTitle()}
              showBack={false}
              showGreeting={route.name === 'dashboard'}
              userName={route.name === 'dashboard' ? 'Alex Morgan' : undefined}
              notificationCount={3}
              onSearchPress={() => {
                // TODO: Navigate to search screen
                console.log('Search pressed');
              }}
            />
          ),
          headerStyle: {
            backgroundColor: 'transparent',
            height: 0,
          },
          tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.backgroundCard,
          borderTopWidth: 0,
          height: Platform.OS === 'ios' ? 88 : 72,
          ...shadows.lg,
          elevation: 20,
        },
        tabBarLabelStyle: {
          fontSize: typography.sizes.xs,
          fontWeight: typography.weights.semibold,
          marginTop: 2,
          marginBottom: 0,
        },
        tabBarIconStyle: {
          marginTop: 2,
        },
        tabBarItemStyle: {
          paddingVertical: 4,
        },
        };
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Dashboard',
          headerTitle: 'Dashboard',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons 
              name={focused ? "grid" : "grid-outline"} 
              size={size} 
              color={color} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="trips"
        options={{
          title: 'Shipments',
          headerTitle: 'My Shipments',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons 
              name={focused ? "cube" : "cube-outline"} 
              size={size} 
              color={color} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="payments"
        options={{
          title: 'Payments',
          headerTitle: 'Payments & Invoices',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons 
              name={focused ? "wallet" : "wallet-outline"} 
              size={size} 
              color={color} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          headerTitle: 'My Profile',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons 
              name={focused ? "person-circle" : "person-circle-outline"} 
              size={size} 
              color={color} 
            />
          ),
        }}
      />
      {/* Hide these routes from tab bar */}
      <Tabs.Screen
        name="book-trip"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="trip"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="track"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="support"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}

