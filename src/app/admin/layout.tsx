'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'

/**
 * Admin layout — wraps all /admin routes.
 * Reads admin_session, admin_username, admin_role cookies.
 * Enforces role-based access. Shows logged-in user.
 */

type AdminRole = 'admin' | 'staff' | 'viewer'

// Pages accessible by role
const ROLE_ACCESS: Record<AdminRole, string[]> = {
  admin: ['dashboard', 'contacts', 'queue', 'status', 'videos', 'timelines', 'users', 'blogs', 'settings'],
  staff: ['dashboard', 'contacts', 'queue', 'status'],
  viewer: ['dashboard', 'contacts'],
}

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`))
  return match ? decodeURIComponent(match[1]) : null
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [username, setUsername] = useState<string | null>(null)
  const [role, setRole] = useState<AdminRole>('viewer')
  const [checked, setChecked] = useState(false)

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

  // Login page renders with no admin chrome
  if (isLoginPage) {
    return <>{children}</>
  }

  if (!checked) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    )
  }

  // Check if current page is allowed for this role
  const currentPage = pathname.split('/admin/')[1]?.split('/')[0] || 'dashboard'
  const allowedPages = ROLE_ACCESS[role] || ROLE_ACCESS.viewer
  const hasAccess = allowedPages.includes(currentPage)

  const navLinks = [
    { id: 'dashboard', label: 'Dashboard', href: '/admin/dashboard' },
    { id: 'contacts', label: 'Contacts', href: '/admin/contacts' },
    { id: 'queue', label: 'Queue', href: '/admin/queue' },
    { id: 'status', label: 'Status', href: '/admin/status' },
    { id: 'videos', label: 'Videos', href: '/admin/videos' },
    { id: 'timelines', label: 'Timelines', href: '/admin/timelines' },
    { id: 'users', label: 'Users', href: '/admin/users' },
    { id: 'blogs', label: 'Blogs', href: '/admin/blogs' },
    { id: 'settings', label: 'Settings', href: '/admin/settings' },
  ]

  // Filter nav links based on role
  const visibleLinks = navLinks.filter(link => allowedPages.includes(link.id))

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Admin header bar */}
      <header className="sticky top-0 z-40 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
            <a href="/" className="hover:text-green-600 transition-colors" title="Go to main website">
              Dr. Savita — Admin
            </a>
          </h1>
          <nav className="flex items-center gap-3 text-sm flex-wrap">
            {visibleLinks.map(link => (
              <a
                key={link.id}
                href={link.href}
                className={`transition-colors ${
                  currentPage === link.id
                    ? 'text-green-600 dark:text-green-400 font-medium'
                    : 'text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400'
                }`}
              >
                {link.label}
              </a>
            ))}
            <span className="w-px h-5 bg-gray-300 dark:bg-gray-600 mx-1"></span>
            {/* View main site link */}
            <a href="/" className="text-xs text-gray-500 hover:text-green-600 transition-colors" target="_blank" rel="noopener noreferrer">
              🌐 View Site
            </a>
            <span className="w-px h-5 bg-gray-300 dark:bg-gray-600 mx-1"></span>
            {/* Logged-in user display */}
            <span className="text-xs text-gray-500 dark:text-gray-400">
              👤 <span className="font-medium text-gray-700 dark:text-gray-200">{username}</span>
              <span className={`ml-1 px-1.5 py-0.5 rounded text-[10px] font-medium ${
                role === 'admin' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' :
                role === 'staff' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' :
                'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
              }`}>
                {role}
              </span>
            </span>
            <a href="/api/admin/logout" className="px-3 py-1 rounded-lg text-xs font-medium bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-300 dark:hover:bg-red-900/50 transition-colors">
              Logout
            </a>
          </nav>
        </div>
      </header>

      {/* Main content area */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {hasAccess ? (
          children
        ) : (
          <div className="text-center py-16">
            <p className="text-2xl font-bold text-gray-400 mb-2">🚫 Access Denied</p>
            <p className="text-gray-500">Your role ({role}) doesn&apos;t have access to this page.</p>
            <a href="/admin/dashboard" className="inline-block mt-4 px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700">
              Go to Dashboard
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
