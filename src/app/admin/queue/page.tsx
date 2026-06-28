'use client'

import { useEffect, useState } from 'react'

interface QueueData {
  currentToken: number
  waitingCount: number
  lastUpdated: string
}

/**
 * Admin Queue Management page.
 * Provides "Next Patient" and "Reset Queue" controls with live queue status display.
 *
 * Requirements: 30.2
 */
export default function AdminQueuePage() {
  const [queue, setQueue] = useState<QueueData>({
    currentToken: 0,
    waitingCount: 0,
    lastUpdated: new Date().toISOString(),
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    fetchQueueState()
  }, [])

  async function fetchQueueState() {
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
    } catch {
      // Use default state
    }
  }

  async function handleAction(action: 'next' | 'reset') {
    setLoading(true)
    setMessage(null)
    try {
      const res = await fetch('/api/queue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      })
      const data = await res.json()

      if (data.success) {
        setQueue({
          currentToken: data.data.currentToken,
          waitingCount: data.data.waitingCount,
          lastUpdated: data.data.lastUpdated,
        })
        setMessage(data.message)
      } else {
        setMessage(data.message || 'Action failed')
      }
    } catch {
      setMessage('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const estimatedWait = queue.waitingCount * 15 // 15 min per patient

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
        Queue Management
      </h2>

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
