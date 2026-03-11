import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabaseClient';
import { User, Session } from '@supabase/supabase-js';

function getStaffEmails(): string[] {
  // Comma-separated list of staff emails (client-visible).
  // If not set, fallback to the previous hardcoded list.
  const env = process.env.NEXT_PUBLIC_STAFF_EMAILS;
  if (!env?.trim()) {
    return ['saidpiecebhutan@gmail.com', 'guruwangchuk7@gmail.com'];
  }
  return env
    .split(',')
    .map((email) => email.trim())
    .filter(Boolean);
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(!isSupabaseConfigured);

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;
    const client = supabase;

    let mounted = true;

    const loadSession = async () => {
      const { data } = await client.auth.getSession();
      if (!mounted) return;
      setSession(data.session);
      setUser(data.session?.user ?? null);
      setLoading(false);
    };

    loadSession();

    const { data: { subscription } } = client.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signInWithGoogle = async (redirectTo?: string) => {
    if (!isSupabaseConfigured || !supabase) {
      alert(
        'Authentication is not configured. Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to your .env file.'
      );
      return;
    }

    // Use the current browser origin at runtime so deployed preview builds don't
    // hardcode a localhost origin from a build-time env var.
    const baseUrl =
      typeof window !== 'undefined'
        ? window.location.origin
        : process.env.NEXT_PUBLIC_APP_URL ?? '';

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: baseUrl + (redirectTo || '/confirm-pay'),
      },
    });

    if (error) console.error('Error logging in with Google:', error);
  };

  const signOut = async () => {
    if (!supabase) return;
    const { error } = await supabase.auth.signOut();
    if (error) console.error('Error signing out:', error);
  };

  const staffEmails = getStaffEmails();
  const isStaff = !!user?.email && staffEmails.includes(user.email);

  return {
    user,
    session,
    loading,
    signInWithGoogle,
    signOut,
    isStaff,
    supabaseConfigured: isSupabaseConfigured,
    staffEmails,
  };
}
