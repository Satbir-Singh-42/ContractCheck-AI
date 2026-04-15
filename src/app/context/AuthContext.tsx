import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiLogin, apiSignup, apiLogout } from '../../lib/api';

export interface User {
  id: string;
  name: string;
  email: string;
  plan: 'free' | 'pro';
  uploadsUsed: number;
  uploadsLimit: number;
  profilePhoto?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('cc_user');
    if (stored) {
      try { setUser(JSON.parse(stored)); } catch { /* ignore */ }
    }
    setIsLoading(false);
  }, []);

  const persistUser = (u: User) => {
    setUser(u);
    localStorage.setItem('cc_user', JSON.stringify(u));
  };

  const login = async (email: string, password: string) => {
    const res = await apiLogin({ email, password });
    const u: User = {
      id: res.user.id,
      name: res.user.name,
      email: res.user.email,
      plan: res.user.plan === 'enterprise' ? 'pro' : res.user.plan,
      uploadsUsed: res.user.uploads_used,
      uploadsLimit: res.user.uploads_limit,
    };
    persistUser(u);
  };

  const signup = async (name: string, email: string, password: string) => {
    const res = await apiSignup({ name, email, password });
    const u: User = {
      id: res.user.id,
      name: res.user.name,
      email: res.user.email,
      plan: res.user.plan === 'enterprise' ? 'pro' : res.user.plan,
      uploadsUsed: res.user.uploads_used,
      uploadsLimit: res.user.uploads_limit,
    };
    persistUser(u);
  };

  const logout = () => {
    apiLogout();
    setUser(null);
    localStorage.removeItem('cc_user');
  };

  const updateUser = (updates: Partial<User>) => {
    if (!user) return;
    persistUser({ ...user, ...updates });
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}