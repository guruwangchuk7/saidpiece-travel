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
    const initializationRef = React.useRef<boolean>(false);

    // Hydration-safe optimistic check
    useEffect(() => {
        const hasHint = document.cookie.split(';').some(item => item.trim().startsWith('is_staff_hint=true'));
        if (hasHint && !initializationRef.current) {
            setIsStaff(true);
            setIsAdmin(true);
            setRole('staff');
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (!isSupabaseConfigured || !supabase) {
            setLoading(false);
            return;
        }

        const client = supabase;
        let mounted = true;

        // Optimized safety watchdog
        const safetyTimeout = setTimeout(() => {
            if (mounted && loading) {
                console.warn('[AuthProvider] Safety timeout. Forcing loading false.');
                setLoading(false);
            }
        }, 3000); // Reduced to 3s for better responsiveness

        const fetchProfile = async (userId: string) => {
            // Check cache first
            if (profileCacheRef.current[userId]) {
                return profileCacheRef.current[userId];
            }

            try {
                const { data: profile, error } = await client
                    .from('profiles')
                    .select('role')
                    .eq('id', userId)
                    .single();

                if (error) {
                    return 'customer';
                }
                
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
                
                // Optimistic staff status if email is in whitelist
                if (isUserEmailStaff) {
                    setIsStaff(true);
                    setIsAdmin(true);
                    // Ensure cookie is set immediately for proxy synchronization
                    document.cookie = "is_staff_hint=true; path=/; max-age=31536000; SameSite=Lax";
                }

                const userRole = await fetchProfile(newUser.id);
                
                if (mounted) {
                    const finalRole = (userRole === 'customer' && isUserEmailStaff) ? 'admin' : userRole;
                    const finalIsStaff = STAFF_ROLES.includes(finalRole);

                    setRole(finalRole);
                    setIsAdmin(finalRole === 'admin');
                    setIsStaff(finalIsStaff);

                    // Sync cookie with actual DB role
                    if (finalIsStaff) {
                        document.cookie = "is_staff_hint=true; path=/; max-age=31536000; SameSite=Lax";
                    } else {
                        document.cookie = "is_staff_hint=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
                    }
                }
            } else {
                setRole(null);
                setIsAdmin(false);
                setIsStaff(false);
                document.cookie = "is_staff_hint=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
            }
            
            if (mounted) {
                setLoading(false);
                initializationRef.current = true;
            }
        };

        // Subscription for auth changes
        const { data: { subscription } } = client.auth.onAuthStateChange(async (event, newSession) => {
            if (event === 'SIGNED_OUT' || event === 'SIGNED_IN' || event === 'USER_UPDATED' || event === 'TOKEN_REFRESHED') {
                await updateAuthState(newSession);
            } else if (!initializationRef.current) {
                await updateAuthState(newSession);
            }
        });

        // initial session check
        client.auth.getSession()
            .then(({ data: { session: initialSession } }) => {
                if (mounted && !initializationRef.current) {
                    updateAuthState(initialSession);
                }
            })
            .catch(err => {
                if (mounted) updateAuthState(null);
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
