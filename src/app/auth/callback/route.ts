import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { enforceRateLimit, getClientIp } from '@/lib/apiSecurity';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  // if "next" is in param, use it as the redirect path
  const next = searchParams.get('next') ?? '/';

  // 1. Rate Limiting for Auth Callback (Prevention of code exchange abuse)
  const clientIp = getClientIp(request);
  const rateLimit = await enforceRateLimit({
    key: `auth-callback:${clientIp}`,
    limit: 5,
    windowMs: 15 * 60 * 1000, // 5 attempts per 15 minutes as requested
  });

  if (rateLimit) {
    return NextResponse.redirect(`${origin}?auth_error=TooManyAttempts`);
  }

  // 2. Open Redirect Protection
  // Ensure "next" is a relative path starting with / and not // (which browsers interpret as a protocol-relative absolute URL)
  const safeNext = (next.startsWith('/') && !next.startsWith('//')) ? next : '/';

  if (code) {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            } catch {
              // The `setAll` method was called from a Server Component.
              // This can be ignored if you have middleware refreshing
              // user sessions.
            }
          },
        },
      }
    );
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${safeNext}`);
    }
  }

  // Return the user to the root with an error parameter
  return NextResponse.redirect(`${origin}?auth_error=CodeExchangeFailed`);
}
