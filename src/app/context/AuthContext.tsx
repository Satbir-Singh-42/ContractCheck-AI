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
  organization?: string;
  role?: string;
  notificationPrefs?: any;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadProfile = async (authId: string, email: string | undefined): Promise<User> => {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authId)
      .single();

    if (error || !profile) {
      // If DB replication is delayed right after signup, supply safe defaults to prevent UI crash
      return {
        id: authId,
        name: email?.split('@')[0] || 'User',
        email: email || '',
        plan: 'free',
        uploadsUsed: 0,
        uploadsLimit: 3,
        organization: '',
        role: '',
        notificationPrefs: null,
      };
    }

    return {
      id: profile.id,
      name: profile.name,
      email: email || profile.email,
      plan: profile.plan === 'enterprise' ? 'pro' : profile.plan,
      uploadsUsed: profile.uploads_used || 0,
      uploadsLimit: profile.uploads_limit || 3,
      organization: profile.organization || '',
      role: profile.role || '',
      notificationPrefs: profile.notification_prefs || null,
      profilePhoto: profile.avatar_url || undefined,
    };
  };

  useEffect(() => {
    let mounted = true;

    async function getInitialSession() {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();

        // Stale/invalid refresh token — purge and bail out cleanly
        if (error) {
          console.warn('Session error (likely stale token):', error.message);
          await supabase.auth.signOut();
          if (mounted) setIsLoading(false);
          return;
        }
        
        if (session?.user && mounted) {
          try {
             const u = await loadProfile(session.user.id, session.user.email);
             if (mounted) setUser(u);
          } catch (profileError) {
             console.warn('Profile fetch failed, using auth fallback:', profileError);
             if (mounted) {
               setUser({
                 id: session.user.id,
                 name: session.user.email?.split('@')[0] || 'User',
                 email: session.user.email || '',
                 plan: 'free',
                 uploadsUsed: 0,
                 uploadsLimit: 3,
                 organization: '',
                 role: '',
                 notificationPrefs: null,
               });
             }
          }
        }
      } catch (e) {
        console.warn('Session init failed:', e);
        // Purge any corrupted local storage tokens
        await supabase.auth.signOut();
      } finally {
        if (mounted) setIsLoading(false);
      }
    }
    
    getInitialSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED' && !session) {
        // Session gone or refresh token rejected — clear user state
        if (mounted) { setUser(null); setIsLoading(false); }
      } else if (!session) {
        if (mounted) setUser(null);
      } else if (event === 'SIGNED_IN' || event === 'USER_UPDATED' || event === 'TOKEN_REFRESHED') {
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
    const { data: { session }, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error(error.message);
    if (session?.user) {
      const u = await loadProfile(session.user.id, session.user.email);
      setUser(u);
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    const { data: { session }, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
        }
      }
    });
    if (error) throw new Error(error.message);
    if (session?.user) {
      const u = await loadProfile(session.user.id, session.user.email);
      setUser(u);
    }
  };

  const logout = async () => {
    setUser(null);
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.warn('Sign out error:', error.message);
    }
  };

  const updateUser = async (updates: Partial<User>) => {
    if (!user) return;
    setUser({ ...user, ...updates });
    // Keep backend in sync
    const dbUpdates: any = {};
    if ('name' in updates) dbUpdates.name = updates.name;
    if ('organization' in updates) dbUpdates.organization = updates.organization;
    if ('role' in updates) dbUpdates.role = updates.role;
    if ('notificationPrefs' in updates) dbUpdates.notification_prefs = updates.notificationPrefs;
    if ('profilePhoto' in updates) dbUpdates.avatar_url = updates.profilePhoto ?? null;

    if (Object.keys(dbUpdates).length > 0) {
      await supabase.from('profiles').update(dbUpdates).eq('id', user.id);
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