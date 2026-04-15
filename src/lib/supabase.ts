/// <reference types="vite/client" />
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Supabase environment variables are missing! Check your .env.local file.');
}

export const supabase = createClient(
  supabaseUrl || 'https://qmxdfqfpbpvzymigmzyn.supabase.co', 
  supabaseAnonKey || 'placeholder_anon_key'
);
