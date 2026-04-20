import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { STAFF_ROLES, isEmailStaff } from '@/lib/auth-constants'

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

  const pathname = request.nextUrl.pathname

  // 2. Protect Admin Routes
  if (pathname.startsWith('/admin')) {
    // 3. Refresh/Get the session
    const { data: { user } } = await supabase.auth.getUser()

    // If user is accessing /admin/login, let them proceed
    if (pathname === '/admin/login') {
      if (user) {
        const isStaffHint = request.cookies.get('is_staff_hint')?.value === 'true'
        if (isStaffHint || isEmailStaff(user.email)) {
          return NextResponse.redirect(new URL('/admin', request.url))
        }
      }
      return response
    }

    // If not logged in, redirect to /admin/login
    if (!user) {
      const loginUrl = new URL('/admin/login', request.url)
      // Pass the current path as a redirect parameter for better UX
      if (pathname !== '/admin') {
          loginUrl.searchParams.set('redirect', pathname)
      }
      return NextResponse.redirect(loginUrl)
    }

    // Role check - Optimized with Cookie Hinting and Email Whitelist
    const isStaffHint = request.cookies.get('is_staff_hint')?.value === 'true'
    const isUserEmailStaff = isEmailStaff(user.email)

    if (!isStaffHint && !isUserEmailStaff) {
       // Only hit DB if absolutely necessary
       const { data: profile } = await supabase
         .from('profiles')
         .select('role')
         .eq('id', user.id)
         .single()

       if (!profile || !STAFF_ROLES.includes(profile.role)) {
         return NextResponse.redirect(new URL('/admin/login?error=unauthorized', request.url))
       }
       
       // Optimization: Set the hint cookie for future requests
       response.cookies.set('is_staff_hint', 'true', { path: '/', maxAge: 31536000, sameSite: 'lax' })
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
