'use client';

import { useAuthContext } from '@/contexts/AuthContext';

/**
 * useAuth hook (Refactored to use AuthContext)
 * 
 * This hook now acts as a proxy to the global AuthContext.
 * Use this in components to access authentication state without
 * triggering multiple session lookups.
 */
export function useAuth() {
  return useAuthContext();
}
