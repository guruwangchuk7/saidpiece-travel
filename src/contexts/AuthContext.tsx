'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabaseClient';
import { User, Session } from '@supabase/supabase-js';

interface AuthContextType {
    user: User | null;
    session: Session | null;
    loading: boolean;
    isStaff: boolean;
    isAdmin: boolean;
    role: string | null;
    supabaseConfigured: boolean;
    signInWithGoogle: (redirectTo?: string) => Promise<void>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);
    const [role, setRole] = useState<string | null>(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isStaff, setIsStaff] = useState(false);

    useEffect(() => {
        if (!isSupabaseConfigured || !supabase) {
            console.warn('[AuthProvider] Supabase not configured, skipping auth initialization.');
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
                    console.warn('[AuthProvider] Error fetching profile:', error.message);
                    return 'customer';
                }
                return profile?.role ?? 'customer';
            } catch (err) {
                console.error('[AuthProvider] Exception fetching profile:', err);
                return 'customer';
            }
        };

        const updateAuthState = async (currentSession: Session | null) => {
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
                }
            } else {
                setRole(null);
                setIsAdmin(false);
                setIsStaff(false);
            }
            setLoading(false);
        };

        // Initial session check with robust error handling
        client.auth.getSession()
            .then(({ data: { session: initialSession }, error }) => {
                if (error) {
                    console.error('[AuthProvider] Initial session error:', error.message);
                    // If refresh token is missing, we should explicitly sign out to clear stale cookies
                    if (error.message.includes('Refresh Token Not Found') || error.status === 400) {
                        client.auth.signOut();
                    }
                    updateAuthState(null);
                } else {
                    updateAuthState(initialSession);
                }
            })
            .catch(err => {
                console.error('[AuthProvider] Critical error during session fetch:', err);
                updateAuthState(null);
            });

        // Listen for changes
        const { data: { subscription } } = client.auth.onAuthStateChange(async (_event, newSession) => {
            console.log(`[AuthProvider] Auth state change event: ${_event}`);
            
            // Handle cases where the session might be invalid leading to Refresh Token errors
            try {
                await updateAuthState(newSession);
            } catch (authError) {
                console.error('[AuthProvider] Error updating auth state on change:', authError);
                setLoading(false);
            }
        });

        return () => {
            mounted = false;
            subscription.unsubscribe();
        };
    }, []);

    const signInWithGoogle = async (redirectTo?: string) => {
        if (!isSupabaseConfigured || !supabase) {
            alert('Authentication is not configured.');
            return;
        }
        const baseUrl = typeof window !== 'undefined' ? window.location.origin : process.env.NEXT_PUBLIC_APP_URL ?? '';
        const nextPath = redirectTo || '/';
        const redirectUrl = `${baseUrl}/auth/callback?next=${encodeURIComponent(nextPath)}`;
        
        await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: redirectUrl,
                queryParams: { access_type: 'offline', prompt: 'consent' },
            },
        });
    };

    const signOut = async () => {
        if (!supabase) return;
        await supabase.auth.signOut();
    };

    return (
        <AuthContext.Provider value={{
            user, session, loading, isStaff, isAdmin, role,
            supabaseConfigured: isSupabaseConfigured,
            signInWithGoogle, signOut
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuthContext() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuthContext must be used within an AuthProvider');
    }
    return context;
}
