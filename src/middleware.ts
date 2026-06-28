import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

/**
 * Middleware for admin auth protection and pathname tracking.
 *
 * - For /admin routes (except /admin/login): checks for a valid Supabase
 *   auth session via cookies. If no session, redirects to /admin/login.
 * - For all other routes: passes through with x-pathname header.
 * - Locale switching is handled client-side via localStorage (no path-based i18n).
 */

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Set x-pathname header for server components to read
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-pathname', pathname)

  // --- Admin route protection ---
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    // Create a Supabase client that reads cookies from the request
    const response = NextResponse.next({
      request: { headers: requestHeaders },
    })

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              request.cookies.set(name, value)
              response.cookies.set(name, value, options)
            })
          },
        },
      }
    )

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      const loginUrl = new URL('/admin/login', request.url)
      return NextResponse.redirect(loginUrl)
    }

    return response
  }

  // --- /admin/login: pass through with pathname header ---
  if (pathname.startsWith('/admin/login')) {
    return NextResponse.next({
      request: { headers: requestHeaders },
    })
  }

  // --- All other routes: pass through with pathname header ---
  // We use client-side locale switching (localStorage) so no path-based i18n routing needed.
  return NextResponse.next({
    request: { headers: requestHeaders },
  })
}

export const config = {
  // Match all paths except static files, api routes, and Next.js internals
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
}
