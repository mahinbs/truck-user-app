import { DriverHeader } from '@/components/ui/DriverHeader';
import { colors, shadows, typography } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { Platform } from 'react-native';

export default function DriverTabsLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => {
        const getTitle = () => {
          if (route.name === 'home') return 'Driver Home';
          if (route.name === 'trips') return 'My Trips';
          if (route.name === 'earnings') return 'My Earnings';
          if (route.name === 'profile') return 'My Profile';
          return route.name;
        };

        return {
          headerShown: true,
          header: () => (
            <DriverHeader
              title={getTitle()}
              showBack={false}
              showGreeting={route.name === 'home'}
              userName={route.name === 'home' ? 'Raj Kumar' : undefined}
              subtitle={route.name === 'home' ? 'MH 02 AB 1234' : undefined}
              notificationCount={2}
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
        name="home"
        options={{
          title: 'Home',
          headerTitle: 'Driver Home',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons 
              name={focused ? "home" : "home-outline"} 
              size={size + 2} 
              color={color} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="trips"
        options={{
          title: 'My Trips',
          headerTitle: 'My Trips',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons 
              name={focused ? "car-sport" : "car-sport-outline"} 
              size={size + 2} 
              color={color} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="earnings"
        options={{
          title: 'Earnings',
          headerTitle: 'My Earnings',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons 
              name={focused ? "wallet" : "wallet-outline"} 
              size={size + 2} 
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
              size={size + 2} 
              color={color} 
            />
          ),
        }}
      />
      {/* Hide these routes from tab bar */}
      <Tabs.Screen
        name="trip-request"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="active-trip"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="delay-reason"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="delivery-confirmation"
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

