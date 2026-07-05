'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'

/**
 * Admin login page.
 * Authenticates against:
 * 1. Hardcoded master password (savita2025) — always works
 * 2. admin_users table in Supabase (username + password)
 */

const ADMIN_PASSWORD = 'savita2025'
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const sb = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null

export default function AdminLoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      // 1. Check master password first
      if (password === ADMIN_PASSWORD) {
        document.cookie = `admin_username=admin;path=/;max-age=86400`
        document.cookie = `admin_role=admin;path=/;max-age=86400`
        loginSuccess()
        return
      }

      // 2. Check admin_users table in Supabase
      if (sb && username.trim()) {
        const { data: user, error: dbError } = await sb
          .from('admin_users')
          .select('id, username, role, password')
          .eq('username', username.trim().toLowerCase())
          .single()

        if (!dbError && user && user.password === password) {
          document.cookie = `admin_username=${user.username};path=/;max-age=86400`
          document.cookie = `admin_role=${user.role};path=/;max-age=86400`
          loginSuccess()
          return
        }
      }

      // Failed
      setError('Invalid username or password.')
    } catch {
      setError('Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  function loginSuccess() {
    document.cookie = `admin_session=authenticated;path=/;max-age=86400`
    router.push('/admin/dashboard')
    router.refresh()
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
        <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-2">
          Admin Login
        </h1>
        <p className="text-sm text-center text-gray-500 dark:text-gray-400 mb-6">
          Sign in to manage your clinic dashboard
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
              placeholder="Enter username"
              autoComplete="username"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>

          <p className="text-xs text-center text-gray-400 dark:text-gray-500 mt-3">
            Use your username & password, or master password to login
          </p>
        </form>

        {/* Back to app link */}
        <div className="mt-6 text-center">
          <a
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-medium transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>
            Go to Homepage
          </a>
        </div>
      </div>
    </div>
  )
}
