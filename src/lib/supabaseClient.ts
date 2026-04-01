'use client';

import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

/**
 * The Supabase client configuration.
 * 🔧 FIXED: Disabling 'persistSession' to prevent "Lock broken by steal option" errors 
 * when using multiple tabs or Next.js Turbopack HMR.
 */
export const supabase: SupabaseClient | null =
  isSupabaseConfigured
    ? createClient(supabaseUrl as string, supabaseAnonKey as string, {
        auth: {
          persistSession: false, // Prevents Web Lock collisions in dev mode
          autoRefreshToken: false,
          detectSessionInUrl: false
        }
      })
    : null;

if (!isSupabaseConfigured && typeof window !== 'undefined') {
  console.warn(
    'Supabase is not configured. Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to your .env file.'
  );
}
