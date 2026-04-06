import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabaseClient';
import { User, Session } from '@supabase/supabase-js';

// Staff list is now handled server-side in Middleware and Database RLS.
// This client-side hook now relies on the user's role in the 'profiles' table.

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;
    const client = supabase;

    let mounted = true;

    const loadSession = async () => {
      const { data } = await client.auth.getSession();
      if (!mounted) return;
      setSession(data.session);
      setUser(data.session?.user ?? null);

      if (data.session?.user) {
        // Fetch role from profile
        const { data: profile } = await client
          .from('profiles')
          .select('role')
          .eq('id', data.session.user.id)
          .single();
        if (mounted) setRole(profile?.role ?? 'customer');
      }
      setLoading(false);
    };

    loadSession();

    const { data: { subscription } } = client.auth.onAuthStateChange(async (_event, session) => {
      if (!mounted) return;
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        const { data: profile } = await client
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();
        if (mounted) setRole(profile?.role ?? 'customer');
      } else {
        if (mounted) setRole(null);
      }
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

    const nextPath = redirectTo || '/';
    const redirectUrl = `${baseUrl}/auth/callback?next=${encodeURIComponent(nextPath)}`;
    console.log('[useAuth] signInWithGoogle redirectUrl:', redirectUrl);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });

    if (error) console.error('Error logging in with Google:', error);
  };

  const signOut = async () => {
    if (!supabase) return;
    const { error } = await supabase.auth.signOut();
    if (error) console.error('Error signing out:', error);
  };

  const isStaff = role === 'staff' || role === 'admin';

  return {
    user,
    session,
    loading,
    signInWithGoogle,
    signOut,
    isStaff,
    role,
    supabaseConfigured: isSupabaseConfigured,
  };
}
