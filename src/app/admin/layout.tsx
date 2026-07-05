'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'

/**
 * Admin layout — Premium admin panel with mobile bottom navigation.
 * Replaces the regular bottom nav when on /admin routes.
 */

type AdminRole = 'admin' | 'staff' | 'viewer'

const ROLE_ACCESS: Record<AdminRole, string[]> = {
  admin: ['dashboard', 'contacts', 'queue', 'status', 'videos', 'timelines', 'users', 'blogs', 'settings', 'materials'],
  staff: ['dashboard', 'contacts', 'queue', 'status'],
  viewer: ['dashboard', 'contacts'],
}

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`))
  return match ? decodeURIComponent(match[1]) : null
}

// Admin bottom nav items
const ADMIN_NAV = [
  {
    id: 'dashboard', label: 'Home', href: '/admin/dashboard',
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
  },
  {
    id: 'queue', label: 'Queue', href: '/admin/queue',
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  },
  {
    id: 'contacts', label: 'Patients', href: '/admin/contacts',
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
  },
  {
    id: 'status', label: 'Status', href: '/admin/status',
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>,
  },
  {
    id: 'more-admin', label: 'More', href: '#more-admin',
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68 1.65 1.65 0 0 0 10 3.17V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  },
]

const ADMIN_MORE_LINKS = [
  { label: 'Videos', href: '/admin/videos', icon: '🎬' },
  { label: 'Timelines', href: '/admin/timelines', icon: '📅' },
  { label: 'Users', href: '/admin/users', icon: '👥' },
  { label: 'Blogs', href: '/admin/blogs', icon: '✍️' },
  { label: 'Materials', href: '/admin/materials', icon: '📚' },
  { label: 'Settings', href: '/admin/settings', icon: '⚙️' },
  { label: 'Back to App', href: '/', icon: '🏠' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [username, setUsername] = useState<string | null>(null)
  const [role, setRole] = useState<AdminRole>('viewer')
  const [checked, setChecked] = useState(false)
  const [showMore, setShowMore] = useState(false)

  const isLoginPage = pathname === '/admin/login'

  useEffect(() => {
    const session = getCookie('admin_session')
    const storedUsername = getCookie('admin_username')
    const storedRole = getCookie('admin_role') as AdminRole | null

    if (!session && !isLoginPage) {
      router.push('/admin/login')
      return
    }

    setUsername(storedUsername || 'admin')
    setRole(storedRole || 'admin')
    setChecked(true)
  }, [isLoginPage, router])

  if (isLoginPage) return <>{children}</>

  if (!checked) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/20" />
          <p className="text-sm text-foreground-muted">Loading admin...</p>
        </div>
      </div>
    )
  }

  const currentPage = pathname.split('/admin/')[1]?.split('/')[0] || 'dashboard'
  const allowedPages = ROLE_ACCESS[role] || ROLE_ACCESS.viewer
  const hasAccess = allowedPages.includes(currentPage)

  const isNavActive = (id: string) => currentPage === id

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-20 md:pb-0">
      {/* Premium Admin Header */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-sm">
              <span className="text-white text-xs font-bold">S</span>
            </div>
            <div>
              <h1 className="text-sm font-bold text-gray-900 dark:text-white leading-tight">Admin Panel</h1>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-tight">Saubhagya Clinic</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* User badge */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-800">
              <div className="w-5 h-5 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
                <span className="text-[9px] text-white font-bold">{username?.[0]?.toUpperCase()}</span>
              </div>
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300 hidden sm:inline">{username}</span>
              <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${
                role === 'admin' ? 'bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-300' :
                role === 'staff' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300' :
                'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
              }`}>{role}</span>
            </div>

            {/* Logout */}
            <a
              href="/api/admin/logout"
              className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
              title="Logout"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            </a>
          </div>
        </div>

        {/* Desktop nav tabs */}
        <div className="hidden md:block max-w-7xl mx-auto px-4 pb-2">
          <div className="flex gap-1 overflow-x-auto">
            {ADMIN_NAV.filter(n => n.id !== 'more-admin').map(nav => (
              <Link
                key={nav.id}
                href={nav.href}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                  isNavActive(nav.id)
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                {nav.label}
              </Link>
            ))}
            {ADMIN_MORE_LINKS.filter(l => l.href !== '/').map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                  pathname === link.href
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 py-5">
        {hasAccess ? children : (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-4">
              <span className="text-2xl">🚫</span>
            </div>
            <p className="text-lg font-bold text-gray-700 dark:text-gray-300 mb-1">Access Denied</p>
            <p className="text-sm text-gray-500 mb-4">Your role ({role}) doesn&apos;t have access to this page.</p>
            <Link href="/admin/dashboard" className="inline-block px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-medium hover:bg-emerald-700 transition-colors">
              Go to Dashboard
            </Link>
          </div>
        )}
      </main>

      {/* Admin More Menu Overlay */}
      {showMore && (
        <>
          <div className="fixed inset-0 z-[59] bg-black/40 backdrop-blur-sm md:hidden" onClick={() => setShowMore(false)} />
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed bottom-[72px] left-3 right-3 z-[59] md:hidden bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xl max-h-[50vh] overflow-y-auto"
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Admin Menu</h3>
                <button onClick={() => setShowMore(false)} className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </div>
              <div className="grid grid-cols-1 gap-1">
                {ADMIN_MORE_LINKS.map(link => (
                  <Link
                    key={link.href}
                    href={link.href}
                    prefetch={true}
                    onClick={() => setShowMore(false)}
                    className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-colors ${
                      pathname === link.href
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    <span className="text-lg">{link.icon}</span>
                    <span className="text-sm font-medium">{link.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}

      {/* Admin Bottom Navigation (mobile only) */}
      <nav className="fixed bottom-0 left-0 right-0 z-[60] md:hidden" role="navigation" aria-label="Admin navigation">
        <div className="absolute inset-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 shadow-[0_-4px_20px_rgba(0,0,0,0.1)]" />
        <div className="relative flex items-center justify-around px-2 pb-[env(safe-area-inset-bottom,8px)] pt-2">
          {ADMIN_NAV.map(item => {
            const active = isNavActive(item.id)

            if (item.id === 'more-admin') {
              return (
                <button
                  key={item.id}
                  onClick={() => setShowMore(!showMore)}
                  className={`relative flex flex-col items-center gap-0.5 py-1.5 px-3 rounded-2xl transition-all active:scale-90 ${
                    showMore ? 'bg-emerald-50 dark:bg-emerald-900/20' : ''
                  }`}
                >
                  <span className={showMore ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-400 dark:text-gray-500'}>{item.icon}</span>
                  <span className={`text-[10px] font-semibold ${showMore ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-400 dark:text-gray-500'}`}>{item.label}</span>
                </button>
              )
            }

            return (
              <Link
                key={item.id}
                href={item.href}
                prefetch={true}
                onClick={() => setShowMore(false)}
                className={`relative flex flex-col items-center gap-0.5 py-1.5 px-3 rounded-2xl transition-all active:scale-90 ${
                  active ? 'bg-emerald-50 dark:bg-emerald-900/20' : ''
                }`}
              >
                <span className={`transition-all ${active ? 'text-emerald-600 dark:text-emerald-400 scale-110' : 'text-gray-400 dark:text-gray-500'}`}>{item.icon}</span>
                <span className={`text-[10px] font-semibold ${active ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-400 dark:text-gray-500'}`}>{item.label}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
