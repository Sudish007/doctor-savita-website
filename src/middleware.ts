import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Middleware for admin auth protection and pathname tracking.
 * Uses simple cookie-based auth (admin_session cookie).
 */

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Set x-pathname header for server components to read
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-pathname', pathname)

  // --- Admin route protection ---
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    const session = request.cookies.get('admin_session')?.value

    if (session !== 'authenticated') {
      const loginUrl = new URL('/admin/login', request.url)
      return NextResponse.redirect(loginUrl)
    }
  }

  // --- All other routes: pass through with pathname header ---
  return NextResponse.next({
    request: { headers: requestHeaders },
  })
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
}
