import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// In Next.js 16 (Turbopack), the "proxy" file convention replaces middleware
export async function proxy(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // 1. Initialize Supabase SSR Client
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set({ name, value, ...options }))
          response = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // 2. Refresh the session (Prevents "Refresh Token Not Found" errors)
  const { data: { user } } = await supabase.auth.getUser()

  // 3. Protect Admin Routes
  const pathname = request.nextUrl.pathname
  const isExcluded = pathname.includes('.') || 
                     pathname.startsWith('/_next/') ||
                     pathname.startsWith('/api/') ||
                     pathname === '/admin/login' ||
                     pathname === '/auth/callback'

  if (pathname.startsWith('/admin') && !isExcluded) {
    if (!user) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    // Role check - Optimized
    const staffEmails = (process.env.NEXT_PUBLIC_STAFF_EMAILS || 'saidpiecebhutan@gmail.com,guruwangchuk7@gmail.com,saidpiece@gmail.com')
      .split(',')
      .map(e => e.trim().toLowerCase());
    
    const isEmailStaff = staffEmails.includes(user.email?.toLowerCase() || '');
    
    // If they aren't in the email list, we do a single database check
    if (!isEmailStaff) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      if (!profile || !['staff', 'admin', 'moderator', 'editor'].includes(profile.role)) {
        return NextResponse.redirect(new URL('/', request.url))
      }
    }
  }

  return response
}

// Next.js 16 Proxy Config
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
