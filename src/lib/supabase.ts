/// <reference types="vite/client" />

// 🚨 GIGABRAIN FIX: Force-disable chromium navigator locks to completely bypass the deadlocked state
if (typeof window !== 'undefined' && window.navigator && (window.navigator as any).locks) {
  Object.defineProperty(window.navigator, 'locks', { value: undefined, configurable: true });
}

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('⚠️ Supabase environment variables are missing! Please check your .env.local file.');
}

export const supabase = createClient(
  supabaseUrl, 
  supabaseAnonKey,
  {
    auth: {
      storageKey: 'contractcheck-auth-v2', // Ejects from any corrupted browser lock cycles
    }
  }
);
