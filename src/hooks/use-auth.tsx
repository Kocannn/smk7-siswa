import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { router } from 'expo-router';

import * as authApi from '@/api/auth';
import { getToken, setToken, removeToken, setStoredUser, removeStoredUser } from '@/lib/secure-store';
import { queryClient } from '@/lib/query-client';
import type { User, LoginRequest, RegisterRequest } from '@/types/user';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing token on mount
  useEffect(() => {
    async function loadUser() {
      try {
        const token = await getToken();
        if (token) {
          const currentUser = await authApi.getMe();
          setUser(currentUser);
        }
      } catch {
        await removeToken();
      } finally {
        setIsLoading(false);
      }
    }
    loadUser();
  }, []);

  const login = async (data: LoginRequest) => {
    const response = await authApi.login(data);
    await setToken(response.token);
    await setStoredUser(JSON.stringify(response.user));
    setUser(response.user);
    queryClient.clear();
    router.replace('/(app)/(tabs)');
  };

  const register = async (data: RegisterRequest) => {
    const response = await authApi.register(data);
    await setToken(response.token);
    await setStoredUser(JSON.stringify(response.user));
    setUser(response.user);
    queryClient.clear();
    router.replace('/(app)/(tabs)');
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch {
      // Ignore logout API errors
    }
    await removeToken();
    await removeStoredUser();
    setUser(null);
    queryClient.clear();
    router.replace('/(auth)/login');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
