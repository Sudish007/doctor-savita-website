'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@supabase/supabase-js'

interface QueueData {
  currentToken: number
  waitingCount: number
  lastUpdated: string
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const sb = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null

/**
 * Admin Queue Management page.
 * Uses direct Supabase client for reliable reads/writes (bypasses server API issues).
 * Auto-refreshes every 10 seconds.
 */
export default function AdminQueuePage() {
  const [queue, setQueue] = useState<QueueData>({
    currentToken: 0,
    waitingCount: 0,
    lastUpdated: new Date().toISOString(),
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const fetchQueueState = useCallback(async () => {
    if (!sb) return
    try {
      const { data, error } = await sb
        .from('queue_status')
        .select('*')
        .eq('id', 1)
        .single()

      if (!error && data) {
        setQueue({
          currentToken: data.current_token ?? 0,
          waitingCount: data.waiting_count ?? 0,
          lastUpdated: data.last_updated ?? new Date().toISOString(),
        })
      }
    } catch {
      // Fallback to API
      try {
        const res = await fetch('/api/queue/state')
        if (res.ok) {
          const data = await res.json()
          setQueue({
            currentToken: data.currentToken ?? 0,
            waitingCount: data.waitingCount ?? 0,
            lastUpdated: data.lastUpdated ?? new Date().toISOString(),
          })
        }
      } catch { /* ignore */ }
    }
  }, [])

  useEffect(() => {
    fetchQueueState()
    const interval = setInterval(fetchQueueState, 10_000)
    return () => clearInterval(interval)
  }, [fetchQueueState])

  async function handleAction(action: 'next' | 'reset') {
    if (!sb) return
    setLoading(true)
    setMessage(null)

    try {
      if (action === 'next') {
        const newToken = queue.currentToken + 1
        const newWaiting = Math.max(0, queue.waitingCount - 1)

        const { error } = await sb
          .from('queue_status')
          .update({ current_token: newToken, waiting_count: newWaiting })
          .eq('id', 1)

        if (error) {
          setMessage(`Error: ${error.message}`)
        } else {
          setQueue(prev => ({
            ...prev,
            currentToken: newToken,
            waitingCount: newWaiting,
            lastUpdated: new Date().toISOString(),
          }))
          setMessage(`Now serving Token #${newToken}`)
        }
      } else {
        // Reset
        const { error } = await sb
          .from('queue_status')
          .update({ current_token: 0, waiting_count: 0 })
          .eq('id', 1)

        if (error) {
          setMessage(`Error: ${error.message}`)
        } else {
          setQueue({ currentToken: 0, waitingCount: 0, lastUpdated: new Date().toISOString() })
          setMessage('Queue has been reset.')
        }
      }
    } catch (err) {
      setMessage('Action failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const estimatedWait = queue.waitingCount * 15

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Queue Management
        </h2>
        <button
          onClick={fetchQueueState}
          className="px-3 py-1.5 text-xs font-medium rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          ↻ Refresh
        </button>
      </div>

      {/* Current Queue Status */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Now Serving</p>
            <p className="text-4xl font-bold text-green-600 dark:text-green-400">
              #{queue.currentToken}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Waiting</p>
            <p className="text-4xl font-bold text-yellow-600 dark:text-yellow-400">
              {queue.waitingCount}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Est. Wait</p>
            <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">
              {estimatedWait} min
            </p>
          </div>
        </div>

        <p className="text-xs text-gray-400 dark:text-gray-500 text-center mt-4">
          Last updated: {new Date(queue.lastUpdated).toLocaleTimeString()}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => handleAction('next')}
          disabled={loading}
          className="flex-1 py-4 px-6 text-lg font-semibold rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 transition-colors"
        >
          {loading ? 'Processing...' : '▶ Next Patient'}
        </button>
        <button
          onClick={() => handleAction('reset')}
          disabled={loading}
          className="flex-1 py-4 px-6 text-lg font-semibold rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 transition-colors"
        >
          {loading ? 'Processing...' : '↺ Reset Queue'}
        </button>
      </div>

      {/* Feedback message */}
      {message && (
        <div className="bg-gray-100 dark:bg-gray-700 rounded-lg px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
          {message}
        </div>
      )}
    </div>
  )
}
