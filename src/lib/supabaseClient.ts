import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Only create if we have the variables, otherwise export a dummy or handle it in the hook
export const supabase = (supabaseUrl && supabaseAnonKey)
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null as any;

if (!supabase && typeof window !== 'undefined') {
    console.warn('Supabase URL or Anon Key is missing. Please add them to your .env file to enable authentication.');
}
