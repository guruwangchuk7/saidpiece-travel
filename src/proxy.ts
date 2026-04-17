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

  if (pathname.startsWith('/admin')) {
    // If user is accessing /admin/login, let them proceed
    if (pathname === '/admin/login') {
      // If already logged in and is staff, redirect to /admin
      if (user) {
        const isStaffHint = request.cookies.get('is_staff_hint')?.value === 'true'
        if (isStaffHint) {
          return NextResponse.redirect(new URL('/admin', request.url))
        }
      }
      return response
    }

    // If not logged in, redirect to /admin/login
    if (!user) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    // Role check - Optimized with Cookie Hinting
    // This avoids slow database calls on every page navigation
    const isStaffHint = request.cookies.get('is_staff_hint')?.value === 'true'
    const staffEmails = (process.env.NEXT_PUBLIC_STAFF_EMAILS || 'saidpiecebhutan@gmail.com,guruwangchuk7@gmail.com,saidpiece@gmail.com')
        .split(',')
        .map(e => e.trim().toLowerCase());
    const isEmailStaff = staffEmails.includes(user.email?.toLowerCase() || '');

    if (!isStaffHint && !isEmailStaff) {
       // Only if NO hint and NO email match do we perform a fallback DB check
       // This handles the first login after cookies are cleared
       const { data: profile } = await supabase
         .from('profiles')
         .select('role')
         .eq('id', user.id)
         .single()

       if (!profile || !['admin', 'staff', 'moderator', 'editor'].includes(profile.role)) {
         return NextResponse.redirect(new URL('/admin/login?error=unauthorized', request.url))
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
