import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
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
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  // 2. Protect Admin Routes
  const isExcluded = request.nextUrl.pathname.includes('.') || 
                     request.nextUrl.pathname.startsWith('/_next/') ||
                     request.nextUrl.pathname.startsWith('/api/') ||
                     request.nextUrl.pathname === '/admin/login'

  if (request.nextUrl.pathname.startsWith('/admin') && !isExcluded) {
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    // Role check: Only staff and admin can access /admin paths
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!profile || !['staff', 'admin'].includes(profile.role)) {
       // Also check the bypass list if the user was just added and DB is laggy
       const staffEmails = (process.env.NEXT_PUBLIC_STAFF_EMAILS || 'saidpiecebhutan@gmail.com,guruwangchuk7@gmail.com')
         .split(',')
         .map(e => e.trim().toLowerCase());
       
       if (!staffEmails.includes(user.email?.toLowerCase() || '')) {
         return NextResponse.redirect(new URL('/', request.url))
       }
    }
  }

  return response
}

export const config = {
  matcher: [
    '/admin/:path*',
  ],
}
