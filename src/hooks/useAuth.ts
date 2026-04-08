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
  const [isAdmin, setIsAdmin] = useState(false);
  const [isStaff, setIsStaff] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      console.warn('[useAuth] Supabase not configured, skipping auth initialization.');
      setLoading(false);
      return;
    }

    const client = supabase;
    let mounted = true;

    const fetchProfile = async (userId: string) => {
      try {
        const { data: profile, error } = await client
          .from('profiles')
          .select('role')
          .eq('id', userId)
          .single();
        
        if (error) {
          console.warn('[useAuth] Error fetching profile:', error.message);
          return 'customer';
        }
        return profile?.role ?? 'customer';
      } catch (err) {
        console.error('[useAuth] Exception fetching profile:', err);
        return 'customer';
      }
    };

    const loadSession = async () => {
      try {
        const { data: { session: currentSession }, error: sessionError } = await client.auth.getSession();
        
        if (sessionError) {
          console.error('[useAuth] Error getting session:', sessionError.message);
        }

        if (!mounted) return;
        
        setSession(currentSession);
        setUser(currentSession?.user ?? null);

        if (currentSession?.user) {
          const userRole = await fetchProfile(currentSession.user.id);
          
          if (mounted) {
            const staffEmails = (process.env.NEXT_PUBLIC_STAFF_EMAILS || 'saidpiecebhutan@gmail.com,guruwangchuk7@gmail.com,saidpiece@gmail.com')
              .split(',')
              .map(e => e.trim().toLowerCase());
            
            const isEmailStaff = staffEmails.includes(currentSession.user.email?.toLowerCase() || '');
            const finalRole = (userRole === 'customer' && isEmailStaff) ? 'admin' : userRole;

            setRole(finalRole);
            setIsAdmin(finalRole === 'admin');
            setIsStaff(['admin', 'staff', 'moderator', 'editor'].includes(finalRole));
            console.log(`[useAuth] Logged in: ${currentSession.user.email}, Role: ${finalRole} (DB: ${userRole}, Email Match: ${isEmailStaff})`);
          }
        }
      } catch (err) {
        console.error('[useAuth] loadSession failed:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadSession();

    const { data: { subscription } } = client.auth.onAuthStateChange(async (_event, session) => {
      if (!mounted) return;
      
      console.log(`[useAuth] Auth state change event: ${_event}`);
      setSession(session);
      setUser(session?.user ?? null);

      try {
        if (session?.user) {
          const userRole = await fetchProfile(session.user.id);
          
          if (mounted) {
            const staffEmails = (process.env.NEXT_PUBLIC_STAFF_EMAILS || 'saidpiecebhutan@gmail.com,guruwangchuk7@gmail.com,saidpiece@gmail.com')
              .split(',')
              .map(e => e.trim().toLowerCase());
            
            const isEmailStaff = staffEmails.includes(session.user.email?.toLowerCase() || '');
            const finalRole = (userRole === 'customer' && isEmailStaff) ? 'admin' : userRole;

            setRole(finalRole);
            setIsAdmin(finalRole === 'admin');
            setIsStaff(['admin', 'staff', 'moderator', 'editor'].includes(finalRole));
          }
        } else {
          if (mounted) {
            setRole(null);
            setIsAdmin(false);
            setIsStaff(false);
          }
        }
      } catch (err) {
        console.error('[useAuth] onAuthStateChange callback failed:', err);
      } finally {
        if (mounted) setLoading(false);
      }
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

  return {
    user,
    session,
    loading,
    signInWithGoogle,
    signOut,
    isStaff,
    isAdmin,
    role,
    supabaseConfigured: isSupabaseConfigured,
  };
}
