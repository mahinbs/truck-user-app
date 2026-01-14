import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type UserRole = 'BUSINESS' | 'DRIVER' | null;

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  isOnline?: boolean; // For drivers
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (token: string, user: User) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
  setUserRole: (role: UserRole) => Promise<void>;
  toggleDriverStatus: (isOnline: boolean) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEYS = {
  TOKEN: '@truckflow_token',
  USER: '@truckflow_user',
  ROLE: '@truckflow_role',
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check for existing session on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);
      const userJson = await AsyncStorage.getItem(STORAGE_KEYS.USER);
      const savedRole = await AsyncStorage.getItem(STORAGE_KEYS.ROLE);

      if (token && userJson) {
        const userData = JSON.parse(userJson);
        // Use saved role if user doesn't have one
        if (!userData.role && savedRole) {
          userData.role = savedRole as UserRole;
        }
        setUser(userData);
        setIsAuthenticated(true);
      } else if (savedRole) {
        // If no user but role is saved, set user with role
        setUser({ id: '', name: '', email: '', phone: '', role: savedRole as UserRole });
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (token: string, userData: User) => {
    try {
      // Get saved role if userData doesn't have one
      const savedRole = await AsyncStorage.getItem(STORAGE_KEYS.ROLE);
      if (!userData.role && savedRole) {
        userData.role = savedRole as UserRole;
      }
      
      await AsyncStorage.setItem(STORAGE_KEYS.TOKEN, token);
      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
      setUser(userData);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.TOKEN);
      await AsyncStorage.removeItem(STORAGE_KEYS.USER);
      // Don't remove role on logout - user might want to keep it for next login
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
  };

  const updateUser = async (userData: Partial<User>) => {
    try {
      if (!user) return;

      const updatedUser = { ...user, ...userData };
      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));
      setUser(updatedUser);
    } catch (error) {
      console.error('Update user failed:', error);
      throw error;
    }
  };

  const setUserRole = async (role: UserRole) => {
    try {
      // Save role to AsyncStorage so it persists even if user doesn't exist yet
      await AsyncStorage.setItem(STORAGE_KEYS.ROLE, role || '');
      
      // Also update user if it exists
      if (user) {
        await updateUser({ role });
      } else {
        // If no user exists, just update the state
        setUser({ id: '', name: '', email: '', phone: '', role });
      }
    } catch (error) {
      console.error('Set user role failed:', error);
      throw error;
    }
  };

  const toggleDriverStatus = async (isOnline: boolean) => {
    if (user?.role !== 'DRIVER') return;
    await updateUser({ isOnline });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated,
        login,
        logout,
        updateUser,
        setUserRole,
        toggleDriverStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

