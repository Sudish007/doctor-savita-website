import { redirect } from 'next/navigation'
import { headers, cookies } from 'next/headers'

/**
 * Admin layout — wraps all /admin routes.
 * Checks for admin_session cookie.
 * Unauthenticated users on admin pages are redirected to /admin/login.
 */
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const headersList = await headers()
  const pathname = headersList.get('x-pathname') || ''
  const isLoginPage = pathname.startsWith('/admin/login')

  // Skip auth check on the login page
  if (!isLoginPage) {
    const cookieStore = await cookies()
    const session = cookieStore.get('admin_session')?.value

    if (session !== 'authenticated') {
      redirect('/admin/login')
    }
  }

  // Login page renders with no admin chrome
  if (isLoginPage) {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Admin header bar */}
      <header className="sticky top-0 z-40 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
            Dr. Savita — Admin
          </h1>
          <nav className="flex items-center gap-3 text-sm flex-wrap">
            <a href="/admin/dashboard" className="text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors">
              Dashboard
            </a>
            <a href="/admin/contacts" className="text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors">
              Contacts
            </a>
            <a href="/admin/queue" className="text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors">
              Queue
            </a>
            <a href="/admin/status" className="text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors">
              Status
            </a>
            <a href="/admin/videos" className="text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors">
              Videos
            </a>
            <a href="/admin/timelines" className="text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors">
              Timelines
            </a>
            <a href="/admin/users" className="text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors">
              Users
            </a>
            <span className="w-px h-5 bg-gray-300 dark:bg-gray-600 mx-1"></span>
            <a href="/api/admin/logout" className="px-3 py-1 rounded-lg text-xs font-medium bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-300 dark:hover:bg-red-900/50 transition-colors">
              Logout
            </a>
          </nav>
        </div>
      </header>

      {/* Main content area */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {children}
      </div>
    </div>
  )
}
