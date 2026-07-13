import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api, ApiError, setOnUnauthorized, toBackendRole, toFrontendRole, ApiUser } from '@/utils/api';

export type UserRole = 'BUSINESS' | 'DRIVER' | 'BROKER' | null;

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  isOnline?: boolean; // For drivers
  avatar?: string;
  isVerified?: boolean;
  emailConfirmed?: boolean;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  // Backwards-compatible: takes a token + user that callers already fetched.
  login: (token: string, user: User) => Promise<void>;
  // New: hits the backend.
  signIn: (email: string, password: string) => Promise<User>;
  /** Registers via Supabase Auth email OTP — does NOT log the user in yet. */
  signUp: (params: {
    role: UserRole;
    name: string;
    email: string;
    phone?: string;
    password: string;
  }) => Promise<{ email: string; message: string }>;
  /** Completes onboarding after the 8-digit email OTP is entered. */
  verifyEmailOtp: (email: string, token: string) => Promise<User>;
  resendEmailOtp: (email: string) => Promise<string>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
  setUserRole: (role: UserRole) => Promise<void>;
  toggleDriverStatus: (isOnline: boolean, location?: { lat: number; lng: number }) => Promise<void>;
}

function apiUserToLocal(u: ApiUser): User {
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    phone: u.phone || '',
    role: toFrontendRole(u.role) as UserRole,
    avatar: u.avatarUrl || undefined,
    isOnline: u.isOnline ?? undefined,
    isVerified: u.isVerified,
    emailConfirmed: u.emailConfirmed,
  };
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
    // Hook the API client so a 401 anywhere flushes our session.
    setOnUnauthorized(() => { void hardLogout(); });
  }, []);

  const hardLogout = async () => {
    await AsyncStorage.removeItem(STORAGE_KEYS.TOKEN);
    await AsyncStorage.removeItem(STORAGE_KEYS.USER);
    await AsyncStorage.removeItem(STORAGE_KEYS.ROLE);
    setUser(null);
    setIsAuthenticated(false);
  };

  const checkAuth = async () => {
    try {
      const token = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);
      const userJson = await AsyncStorage.getItem(STORAGE_KEYS.USER);
      const savedRole = await AsyncStorage.getItem(STORAGE_KEYS.ROLE);

      if (token && userJson) {
        const userData = JSON.parse(userJson);
        try {
          const fresh = await api.me();
          const merged = { ...userData, ...apiUserToLocal(fresh) };
          await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(merged));
          await AsyncStorage.setItem(STORAGE_KEYS.ROLE, merged.role || '');
          setUser(merged);
          setIsAuthenticated(true);
        } catch (e: any) {
          // Expired/invalid token: stay logged out (hardLogout may already have run on 401).
          if (e instanceof ApiError && e.status === 401) {
            setUser(null);
            setIsAuthenticated(false);
            return;
          }
          // Network / offline: keep cached session so the app can still open.
          if (!userData.role && savedRole) {
            userData.role = savedRole as UserRole;
          }
          setUser(userData);
          setIsAuthenticated(true);
        }
      } else if (savedRole) {
        // Role hint only (not a real session) — used for first-run UX, not auth.
        setUser({ id: '', name: '', email: '', phone: '', role: savedRole as UserRole });
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const persistSession = async (token: string, localUser: User) => {
    await AsyncStorage.setItem(STORAGE_KEYS.TOKEN, token);
    await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(localUser));
    await AsyncStorage.setItem(STORAGE_KEYS.ROLE, localUser.role || '');
    setUser(localUser);
    setIsAuthenticated(true);
  };

  const login = async (token: string, userData: User) => {
    try {
      const savedRole = await AsyncStorage.getItem(STORAGE_KEYS.ROLE);
      if (!userData.role && savedRole) {
        userData.role = savedRole as UserRole;
      }
      await persistSession(token, userData);
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

  const toggleDriverStatus = async (isOnline: boolean, location?: { lat: number; lng: number }) => {
    if (user?.role !== 'DRIVER') return;
    // Push to backend; if backend rejects (e.g. verification not approved) keep local state false.
    try {
      await api.driverSetStatus(isOnline, location);
      await updateUser({ isOnline });
    } catch (e) {
      console.warn('toggleDriverStatus failed', e);
      throw e;
    }
  };

  const signIn = async (email: string, password: string): Promise<User> => {
    const res = await api.login({ email, password });
    const localUser = apiUserToLocal(res.user);
    await persistSession(res.token, localUser);
    return localUser;
  };

  const signUp = async (params: {
    role: UserRole;
    name: string;
    email: string;
    phone?: string;
    password: string;
  }): Promise<{ email: string; message: string }> => {
    if (!params.role) throw new Error('role is required');
    const res = await api.signup({
      role: toBackendRole(params.role as Exclude<UserRole, null>),
      name: params.name,
      email: params.email,
      phone: params.phone,
      password: params.password,
    });
    // Persist chosen role for the OTP screen / post-verify routing
    await AsyncStorage.setItem(STORAGE_KEYS.ROLE, params.role);
    return { email: res.email, message: res.message };
  };

  const verifyEmailOtp = async (email: string, token: string): Promise<User> => {
    const res = await api.verifyOtp({ email, token });
    const localUser = apiUserToLocal(res.user);
    await persistSession(res.token, localUser);
    return localUser;
  };

  const resendEmailOtp = async (email: string): Promise<string> => {
    const res = await api.resendOtp(email);
    return res.message;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated,
        login,
        signIn,
        signUp,
        verifyEmailOtp,
        resendEmailOtp,
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
