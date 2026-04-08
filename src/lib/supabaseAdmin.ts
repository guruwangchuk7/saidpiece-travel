import { createClient, SupabaseClient, User } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const isSupabaseAdminConfigured = Boolean(
  supabaseUrl && supabaseAnonKey && supabaseServiceRoleKey,
);

export function createSupabaseAdminClient(): SupabaseClient {
  if (!isSupabaseAdminConfigured) {
    throw new Error(
      'Supabase admin is not configured. Add NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, and SUPABASE_SERVICE_ROLE_KEY.',
    );
  }

  return createClient(supabaseUrl as string, supabaseServiceRoleKey as string, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export async function getAuthenticatedUser(accessToken: string): Promise<User> {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Supabase auth is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.',
    );
  }

  const client = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
    global: {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  });

  const { data, error } = await client.auth.getUser();
  if (error || !data.user) {
    throw new Error('Unauthorized');
  }

  return data.user;
}

export async function ensureProfile(user: User) {
  if (!user.email) {
    throw new Error('Authenticated user is missing an email address.');
  }

  const supabase = createSupabaseAdminClient();
  const fullName =
    typeof user.user_metadata?.full_name === 'string'
      ? user.user_metadata.full_name
      : typeof user.user_metadata?.name === 'string'
        ? user.user_metadata.name
        : null;

  const { error } = await supabase
    .from('profiles')
    .upsert(
      {
        id: user.id,
        email: user.email,
        full_name: fullName,
      },
      {
        onConflict: 'id',
      },
    );

  if (error) {
    throw new Error(`Failed to ensure profile: ${error.message}`);
  }
}

export async function getUserProfile(userId: string) {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  
  if (error) throw error;
  return data;
}

export async function ensureIsStaff(accessToken: string) {
  const user = await getAuthenticatedUser(accessToken);
  const profile = await getUserProfile(user.id);
  
  if (profile.role !== 'staff' && profile.role !== 'admin') {
    throw new Error('Forbidden: Staff access required');
  }
  
  return { user, profile };
}
