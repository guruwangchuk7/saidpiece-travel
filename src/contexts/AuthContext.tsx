'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabaseClient';
import { User, Session } from '@supabase/supabase-js';
import { STAFF_ROLES, isEmailStaff } from '@/lib/auth-constants';

export interface AuthContextType {
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
    const [isStaff, setIsStaff] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [role, setRole] = useState<string | null>(null);

    // Cache to prevent redundant profile fetches during the same session
    const profileCacheRef = React.useRef<{ [key: string]: string }>({});
    // Track initialization to prevent redundant calls
    const initializationRef = React.useRef<boolean>(false);

    // Hydration-safe optimistic check
    useEffect(() => {
        const hasHint = document.cookie.split(';').some(item => item.trim().startsWith('is_staff_hint=true'));
        if (hasHint) {
            setIsStaff(true);
            setIsAdmin(true);
            setRole('staff');
        }
    }, []);

    useEffect(() => {
        if (!isSupabaseConfigured || !supabase) {
            setLoading(false);
            return;
        }

        const client = supabase;
        let mounted = true;

        const fetchProfile = async (userId: string) => {
            if (profileCacheRef.current[userId]) {
                return profileCacheRef.current[userId];
            }

            try {
                const { data: profile, error } = await client
                    .from('profiles')
                    .select('role')
                    .eq('id', userId)
                    .single();

                if (error) return 'customer';
                const result = profile?.role ?? 'customer';
                profileCacheRef.current[userId] = result;
                return result;
            } catch (err) {
                return 'customer';
            }
        };

        const updateAuthState = async (currentSession: Session | null) => {
            if (!mounted) return;
            
            const newUser = currentSession?.user ?? null;
            setSession(currentSession);
            setUser(newUser);

            if (newUser) {
                const userEmail = newUser.email?.toLowerCase();
                const isUserEmailStaff = isEmailStaff(userEmail);
                
                // Set initial optimistic role if email matches
                if (isUserEmailStaff && !isStaff) {
                    setIsStaff(true);
                    setIsAdmin(true);
                    setRole('admin');
                }

                // Deep verify profile
                const userRole = await fetchProfile(newUser.id);
                
                if (mounted) {
                    const finalRole = (userRole === 'customer' && isUserEmailStaff) ? 'admin' : userRole;
                    const finalIsStaff = STAFF_ROLES.includes(finalRole);

                    setRole(finalRole);
                    setIsAdmin(finalRole === 'admin');
                    setIsStaff(finalIsStaff);

                    // Sync cookie
                    if (finalIsStaff) {
                        document.cookie = "is_staff_hint=true; path=/; max-age=31536000; SameSite=Lax";
                    } else {
                        document.cookie = "is_staff_hint=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
                    }
                }
            } else if (typeof window !== 'undefined') {
                const isPageAdmin = window.location.pathname.startsWith('/admin');
                if (!isPageAdmin || initializationRef.current) {
                    setRole(null);
                    setIsAdmin(false);
                    setIsStaff(false);
                    document.cookie = "is_staff_hint=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
                }
            }
            
            if (mounted) {
                setLoading(false);
                initializationRef.current = true;
            }
        };

        // Safety watchdog: ensure loading doesn't stay true forever
        const safetyTimeout = setTimeout(() => {
            if (mounted && loading) {
                console.warn('[AuthProvider] Safety watchdog triggered.');
                setLoading(false);
            }
        }, 5000);

        // Single point of initialization
        client.auth.getSession().then(({ data: { session: initialSession } }) => {
            if (mounted) {
                updateAuthState(initialSession);
            }
        });

        const { data: { subscription } } = client.auth.onAuthStateChange(async (event, newSession) => {
            if (['SIGNED_IN', 'SIGNED_OUT', 'USER_UPDATED', 'TOKEN_REFRESHED'].includes(event)) {
                updateAuthState(newSession);
            }
        });

        return () => {
            mounted = false;
            subscription.unsubscribe();
            clearTimeout(safetyTimeout);
        };
    }, []);

    const signInWithGoogle = async (redirectTo?: string) => {
        if (!isSupabaseConfigured || !supabase) {
            alert('Authentication is not configured.');
            return;
        }

        // Get the current origin at runtime (favors window.location.origin on client)
        const origin = typeof window !== 'undefined' 
            ? window.location.origin 
            : (process.env.NEXT_PUBLIC_APP_URL || '');
            
        // Sanitize baseUrl (remove trailing slash if present)
        const baseUrl = origin.endsWith('/') ? origin.slice(0, -1) : origin;
        const nextPath = redirectTo || '/';
        const redirectUrl = `${baseUrl}/auth/callback?next=${encodeURIComponent(nextPath)}`;
        
        console.log('[Auth] Attempting Google Sign-In', { 
            origin, 
            nextPath, 
            redirectUrl,
            envUrl: process.env.NEXT_PUBLIC_APP_URL 
        });
        
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: redirectUrl,
                queryParams: { access_type: 'offline', prompt: 'consent' },
            },
        });

        if (error) {
            console.error('[Auth] OAuth Error:', error.message);
            alert(`Authentication Error: ${error.message}`);
        }
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
