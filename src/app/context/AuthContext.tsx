import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

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

  // Helper to fetch extended profile data from the profiles table
  const loadProfile = async (authId: string, email: string | undefined): Promise<User | null> => {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authId)
      .single();

    if (error || !profile) {
      console.warn('Profile not found for authenticated user', error);
      return null;
    }

    return {
      id: profile.id,
      name: profile.name,
      email: email || profile.email,
      plan: profile.plan === 'enterprise' ? 'pro' : profile.plan,
      uploadsUsed: profile.uploads_used || 0,
      uploadsLimit: profile.uploads_limit || 3,
    };
  };

  useEffect(() => {
    let mounted = true;

    async function getInitialSession() {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user && mounted) {
        const u = await loadProfile(session.user.id, session.user.email);
        setUser(u);
      }
      if (mounted) setIsLoading(false);
    }
    
    getInitialSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!session) {
        if (mounted) setUser(null);
      } else if (event === 'SIGNED_IN' || event === 'USER_UPDATED') {
        const u = await loadProfile(session.user.id, session.user.email);
        if (mounted) setUser(u);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error(error.message);
  };

  const signup = async (name: string, email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
        }
      }
    });
    if (error) throw new Error(error.message);
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const updateUser = async (updates: Partial<User>) => {
    if (!user) return;
    setUser({ ...user, ...updates });
    // Keep backend in sync
    if (updates.name) {
      await supabase.from('profiles').update({ name: updates.name }).eq('id', user.id);
    }
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