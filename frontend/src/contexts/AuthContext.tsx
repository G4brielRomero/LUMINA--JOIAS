'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  login as authLogin,
  register as authRegister,
  clearAuth,
  getStoredToken,
  getStoredUser,
  storeAuth,
  type AuthUser,
} from '@/services/auth';

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedToken = getStoredToken();
    const storedUser = getStoredUser();
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(storedUser);
    }
    setIsLoading(false);
  }, []);

  async function login(email: string, password: string): Promise<void> {
    const data = await authLogin(email, password);
    storeAuth(data.access_token, data.user);
    setToken(data.access_token);
    setUser(data.user);
  }

  async function register(name: string, email: string, password: string): Promise<void> {
    await authRegister(name, email, password);
  }

  function logout(): void {
    clearAuth();
    setToken(null);
    setUser(null);
    router.push('/login');
  }

  const isAuthenticated = !!token && !!user;

  return (
    <AuthContext.Provider
      value={{ user, token, login, register, logout, isAuthenticated, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
