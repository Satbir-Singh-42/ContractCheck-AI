import React, { createContext, useContext, useState, useEffect } from 'react';

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

const MOCK_USER: User = {
  id: 'user_001',
  name: 'Arjun Sharma',
  email: 'arjun@techcorp.in',
  plan: 'free',
  uploadsUsed: 2,
  uploadsLimit: 3,
};

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

  const login = async (email: string, _password: string) => {
    await new Promise(r => setTimeout(r, 900));
    const u: User = { ...MOCK_USER, email };
    setUser(u);
    localStorage.setItem('cc_user', JSON.stringify(u));
  };

  const signup = async (name: string, email: string, _password: string) => {
    await new Promise(r => setTimeout(r, 900));
    const u: User = { ...MOCK_USER, name, email };
    setUser(u);
    localStorage.setItem('cc_user', JSON.stringify(u));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('cc_user');
  };

  const updateUser = (updates: Partial<User>) => {
    if (!user) return;
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem('cc_user', JSON.stringify(updatedUser));
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