'use client'

import { useEffect, useState, useCallback } from 'react'

interface ContactInquiry {
  id: string
  name: string
  email: string
  message: string
  is_read?: boolean
  is_archived?: boolean
  created_at: string
}

/**
 * Admin Contact Inquiries page.
 * Displays all contact form submissions with mark-as-read and archive actions.
 * Auto-refreshes every 30 seconds for near real-time updates.
 */
export default function AdminContactsPage() {
  const [inquiries, setInquiries] = useState<ContactInquiry[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'unread' | 'archived'>('all')
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date())

  const fetchInquiries = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/contacts')
      if (res.ok) {
        const data = await res.json()
        setInquiries(data.inquiries ?? [])
      }
    } catch {
      // Silently fail
    } finally {
      setLoading(false)
      setLastRefresh(new Date())
    }
  }, [])

  // Initial fetch + auto-refresh every 30s
  useEffect(() => {
    fetchInquiries()
    const interval = setInterval(fetchInquiries, 30_000)
    return () => clearInterval(interval)
  }, [fetchInquiries])

  async function handleAction(id: string, action: 'read' | 'archive') {
    setActionLoading(id)
    try {
      const res = await fetch('/api/admin/contacts', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action }),
      })
      if (res.ok) {
        setInquiries((prev) =>
          prev.map((inq) =>
            inq.id === id
              ? { ...inq, ...(action === 'read' ? { is_read: true } : { is_archived: true }) }
              : inq
          )
        )
      }
    } catch {
      // Silently fail
    } finally {
      setActionLoading(null)
    }
  }

  // Filter logic
  const filtered = inquiries.filter((inq) => {
    if (filter === 'unread') return !inq.is_read && !inq.is_archived
    if (filter === 'archived') return inq.is_archived
    return !inq.is_archived
  })

  const unreadCount = inquiries.filter((i) => !i.is_read && !i.is_archived).length
  const totalCount = inquiries.filter((i) => !i.is_archived).length
  const archivedCount = inquiries.filter((i) => i.is_archived).length

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500 dark:text-gray-400">Loading inquiries...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Contact Inquiries
        </h2>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-400">
            Last updated: {lastRefresh.toLocaleTimeString()}
          </span>
          <button
            onClick={fetchInquiries}
            className="px-3 py-1.5 text-xs font-medium rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            ↻ Refresh
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Total" value={totalCount} color="blue" />
        <StatCard label="Unread" value={unreadCount} color="yellow" />
        <StatCard label="Archived" value={archivedCount} color="gray" />
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700 pb-2">
        {(['all', 'unread', 'archived'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              filter === f
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {f === 'all' ? `All (${totalCount})` : f === 'unread' ? `Unread (${unreadCount})` : `Archived (${archivedCount})`}
          </button>
        ))}
      </div>

      {/* Inquiries List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 px-4 py-8 text-center text-gray-500 dark:text-gray-400">
            No {filter === 'all' ? '' : filter} inquiries found.
          </div>
        ) : (
          filtered.map((inq) => (
            <div
              key={inq.id}
              className={`bg-white dark:bg-gray-800 rounded-lg border p-4 transition-colors ${
                !inq.is_read
                  ? 'border-green-300 dark:border-green-700 bg-green-50/30 dark:bg-green-900/10'
                  : 'border-gray-200 dark:border-gray-700'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {!inq.is_read && (
                      <span className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
                    )}
                    <h4 className="font-medium text-gray-900 dark:text-white truncate">
                      {inq.name}
                    </h4>
                    <span className="text-xs text-gray-400 flex-shrink-0">
                      {formatDate(inq.created_at)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                    {inq.email}
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                    {inq.message}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-1.5 flex-shrink-0">
                  {!inq.is_read && (
                    <button
                      onClick={() => handleAction(inq.id, 'read')}
                      disabled={actionLoading === inq.id}
                      className="px-3 py-1 text-xs font-medium rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
                    >
                      Mark Read
                    </button>
                  )}
                  {!inq.is_archived && (
                    <button
                      onClick={() => handleAction(inq.id, 'archive')}
                      disabled={actionLoading === inq.id}
                      className="px-3 py-1 text-xs font-medium rounded bg-gray-500 text-white hover:bg-gray-600 disabled:opacity-50 transition-colors"
                    >
                      Archive
                    </button>
                  )}
                  <a
                    href={`mailto:${inq.email}`}
                    className="px-3 py-1 text-xs font-medium rounded bg-green-600 text-white hover:bg-green-700 transition-colors text-center"
                  >
                    Reply
                  </a>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

function StatCard({
  label,
  value,
  color,
}: {
  label: string
  value: number
  color: 'yellow' | 'green' | 'blue' | 'gray'
}) {
  const colorClasses = {
    yellow: 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800',
    green: 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800',
    blue: 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800',
    gray: 'bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-700',
  }

  const valueClasses = {
    yellow: 'text-yellow-700 dark:text-yellow-300',
    green: 'text-green-700 dark:text-green-300',
    blue: 'text-blue-700 dark:text-blue-300',
    gray: 'text-gray-700 dark:text-gray-300',
  }

  return (
    <div className={`rounded-lg border p-4 ${colorClasses[color]}`}>
      <p className="text-sm text-gray-600 dark:text-gray-400">{label}</p>
      <p className={`text-2xl font-bold ${valueClasses[color]}`}>{value}</p>
    </div>
  )
}

function formatDate(dateStr: string): string {
  try {
    const date = new Date(dateStr)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (hours < 1) return 'Just now'
    if (hours < 24) return `${hours}h ago`
    if (days < 7) return `${days}d ago`
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
  } catch {
    return ''
  }
}
