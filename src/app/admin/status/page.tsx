'use client'

import { useState } from 'react'

type AvailabilityStatus = 'available' | 'busy' | 'off' | 'leave'

const STATUS_OPTIONS: { value: AvailabilityStatus; label: string; color: string; activeClass: string }[] = [
  {
    value: 'available',
    label: 'Available',
    color: 'bg-green-500',
    activeClass: 'bg-green-600 text-white ring-2 ring-green-400',
  },
  {
    value: 'busy',
    label: 'Busy',
    color: 'bg-yellow-500',
    activeClass: 'bg-yellow-500 text-white ring-2 ring-yellow-400',
  },
  {
    value: 'off',
    label: 'Off',
    color: 'bg-gray-500',
    activeClass: 'bg-gray-600 text-white ring-2 ring-gray-400',
  },
  {
    value: 'leave',
    label: 'Leave',
    color: 'bg-red-500',
    activeClass: 'bg-red-600 text-white ring-2 ring-red-400',
  },
]

/**
 * Admin Status page — One-tap availability toggle.
 * Calls POST /api/status with the selected status value.
 *
 * Requirements: 26.2, 26.3
 */
export default function AdminStatusPage() {
  const [currentStatus, setCurrentStatus] = useState<AvailabilityStatus>('available')
  const [lastUpdated, setLastUpdated] = useState<string>(new Date().toISOString())
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  async function handleStatusChange(status: AvailabilityStatus) {
    if (status === currentStatus) return

    setLoading(true)
    setMessage(null)
    try {
      const res = await fetch('/api/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      const data = await res.json()

      if (data.success) {
        setCurrentStatus(status)
        setLastUpdated(data.data?.updatedAt ?? new Date().toISOString())
        setMessage(`Status updated to "${status}"`)
      } else {
        setMessage(data.message || 'Failed to update status')
      }
    } catch {
      setMessage('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const currentOption = STATUS_OPTIONS.find((o) => o.value === currentStatus)

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
        Availability Status
      </h2>

      {/* Current Status Display */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Current Status</p>
        <div className="flex items-center justify-center gap-3">
          <span className={`w-4 h-4 rounded-full ${currentOption?.color}`} />
          <span className="text-2xl font-bold text-gray-900 dark:text-white capitalize">
            {currentStatus}
          </span>
        </div>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-3">
          Last updated: {new Date(lastUpdated).toLocaleString()}
        </p>
      </div>

      {/* Toggle Buttons */}
      <div className="grid grid-cols-2 gap-4">
        {STATUS_OPTIONS.map((option) => {
          const isActive = currentStatus === option.value
          return (
            <button
              key={option.value}
              onClick={() => handleStatusChange(option.value)}
              disabled={loading}
              className={`py-4 px-6 rounded-lg text-lg font-semibold transition-all disabled:opacity-50 ${
                isActive
                  ? option.activeClass
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <span className="flex items-center justify-center gap-2">
                <span className={`w-3 h-3 rounded-full ${option.color}`} />
                {option.label}
              </span>
            </button>
          )
        })}
      </div>

      {/* Feedback */}
      {message && (
        <div className="bg-gray-100 dark:bg-gray-700 rounded-lg px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
          {message}
        </div>
      )}
    </div>
  )
}
