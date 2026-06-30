import { NextResponse } from 'next/server'

/**
 * GET /api/admin/logout
 * Clears the admin_session cookie and redirects to login page.
 */
export async function GET() {
  const response = NextResponse.redirect(new URL('/admin/login', process.env.NEXT_PUBLIC_SITE_URL || 'https://drsavitak.netlify.app'))
  response.cookies.set('admin_session', '', {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 0, // Expire immediately
  })
  return response
}
