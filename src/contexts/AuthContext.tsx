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

    // Use a ref to prevent concurrent updateAuthState calls
    const initializationRef = React.useRef<boolean>(false);

    useEffect(() => {
        if (!isSupabaseConfigured || !supabase) {
            console.warn('[AuthProvider] Supabase not configured.');
            setLoading(false);
            return;
        }

        const client = supabase;
        let mounted = true;

        // Safety watchdog: ensure loading is NEVER stuck forever
        const safetyTimeout = setTimeout(() => {
            if (mounted && loading) {
                console.warn('[AuthProvider] Safety timeout reached. Forcing loading state to false.');
                setLoading(false);
            }
        }, 6000); 

        const fetchProfile = async (userId: string) => {
            try {
                const { data: profile, error } = await client
                    .from('profiles')
                    .select('role')
                    .eq('id', userId)
                    .single();

                if (error) {
                    console.warn('[AuthProvider] Profile fetch error:', error.message);
                    return 'customer';
                }
                return profile?.role ?? 'customer';
            } catch (err) {
                console.error('[AuthProvider] Profile exception:', err);
                return 'customer';
            }
        };

        const updateAuthState = async (currentSession: Session | null) => {
            if (!mounted) return;
            
            console.log(`[AuthProvider] Updating auth state. User: ${currentSession?.user?.email ?? 'none'}`);
            
            setSession(currentSession);
            setUser(currentSession?.user ?? null);

            if (currentSession?.user) {
                // Optimization: Check email list FIRST (faster than DB)
                const staffEmails = (process.env.NEXT_PUBLIC_STAFF_EMAILS || 'saidpiecebhutan@gmail.com,guruwangchuk7@gmail.com,saidpiece@gmail.com')
                    .split(',')
                    .map(e => e.trim().toLowerCase());
                
                const isEmailStaff = staffEmails.includes(currentSession.user.email?.toLowerCase() || '');
                
                // If they are email-staff, we can optimistically set isStaff=true to prevent UI lag
                if (isEmailStaff) {
                    setIsStaff(true);
                    setIsAdmin(true);
                }

                const userRole = await fetchProfile(currentSession.user.id);
                
                if (mounted) {
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
            
            if (mounted) {
                setLoading(false);
                initializationRef.current = true;
                clearTimeout(safetyTimeout);
            }
        };

        // Subscription for auth changes
        const { data: { subscription } } = client.auth.onAuthStateChange(async (event, newSession) => {
            console.log(`[AuthProvider] onAuthStateChange: ${event}`);
            
            // If we are already initializing via getSession, don't double-call unless the event is significant
            if (event === 'SIGNED_OUT' || event === 'SIGNED_IN' || !initializationRef.current) {
                await updateAuthState(newSession);
            }
        });

        // initial session check
        client.auth.getSession()
            .then(({ data: { session: initialSession }, error }) => {
                if (!initializationRef.current) {
                    if (error) {
                        console.error('[AuthProvider] session error:', error.message);
                        updateAuthState(null);
                    } else {
                        updateAuthState(initialSession);
                    }
                }
            })
            .catch(err => {
                console.error('[AuthProvider] session exception:', err);
                if (!initializationRef.current) updateAuthState(null);
            });

        return () => {
            mounted = false;
            clearTimeout(safetyTimeout);
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
