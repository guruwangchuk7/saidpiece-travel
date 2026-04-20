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
    // 3. Authenticate User
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    // Handle Auth Error or No User
    if (authError || !user) {
      if (pathname === '/admin/login') return response
      const loginUrl = new URL('/admin/login', request.url)
      if (pathname !== '/admin') loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }

    // 4. If already logged in and hitting /admin/login, bypass to dashboard
    if (pathname === '/admin/login') {
      const isStaffHint = request.cookies.get('is_staff_hint')?.value === 'true'
      if (isStaffHint || isEmailStaff(user.email)) {
        return NextResponse.redirect(new URL('/admin', request.url))
      }
    }

    // 5. Authorization Check (Staff Only)
    const isStaffHint = request.cookies.get('is_staff_hint')?.value === 'true'
    const isUserEmailStaff = isEmailStaff(user.email)

    // Robust Role Verification
    if (!isStaffHint && !isUserEmailStaff) {
       // Deep verify against profiles table
       const { data: profile, error: profileError } = await supabase
         .from('profiles')
         .select('role')
         .eq('id', user.id)
         .single()

       const role = profile?.role || 'customer'
       if (profileError || !STAFF_ROLES.includes(role)) {
         return NextResponse.redirect(new URL('/admin/login?error=unauthorized', request.url))
       }
       
       // Optimization: Set/Refresh the hint cookie for future request bypasses
       response.cookies.set('is_staff_hint', 'true', { 
         path: '/', 
         maxAge: 31536000, 
         sameSite: 'lax',
         secure: process.env.NODE_ENV === 'production'
       })
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
