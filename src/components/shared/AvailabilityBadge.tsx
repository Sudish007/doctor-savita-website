'use client'

import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

import { supabase, isSupabaseConfigured, subscribeToAvailability } from '@/lib/supabase/client'
import type { AvailabilityStatus } from '@/types'

/**
 * AvailabilityBadge - Real-time availability indicator for Dr. Savita Kumari.
 * Subscribes to Supabase Realtime on the `availability_status` table.
 *
 * Status Colors:
 *   - available → green (Available Now)
 *   - busy → amber (Busy in OPD)
 *   - off → red (Off Today)
 *   - leave → grey (On Leave)
 *   - unknown → grey (Status unavailable)
 *
 * If status hasn't been updated in 8+ hours, shows fallback message.
 *
 * Requirements: 26.1, 26.3, 26.4, 26.5
 */

interface StatusConfig {
  label: string
  dotColor: string
  bgColor: string
  textColor: string
}

const STATUS_MAP: Record<AvailabilityStatus, StatusConfig> = {
  available: {
    label: 'Available Now',
    dotColor: 'bg-green-500',
    bgColor: 'bg-green-50 dark:bg-green-950/40',
    textColor: 'text-green-700 dark:text-green-300',
  },
  busy: {
    label: 'Busy in OPD',
    dotColor: 'bg-amber-500',
    bgColor: 'bg-amber-50 dark:bg-amber-950/40',
    textColor: 'text-amber-700 dark:text-amber-300',
  },
  off: {
    label: 'Off Today',
    dotColor: 'bg-red-500',
    bgColor: 'bg-red-50 dark:bg-red-950/40',
    textColor: 'text-red-700 dark:text-red-300',
  },
  leave: {
    label: 'On Leave',
    dotColor: 'bg-gray-400',
    bgColor: 'bg-gray-50 dark:bg-gray-800/40',
    textColor: 'text-gray-600 dark:text-gray-400',
  },
  unknown: {
    label: 'Status unavailable',
    dotColor: 'bg-gray-400',
    bgColor: 'bg-gray-50 dark:bg-gray-800/40',
    textColor: 'text-gray-600 dark:text-gray-400',
  },
}

const STALE_THRESHOLD_MS = 8 * 60 * 60 * 1000 // 8 hours

export function AvailabilityBadge() {
  const prefersReducedMotion = useReducedMotion()
  const [status, setStatus] = useState<AvailabilityStatus>('unknown')
  const [updatedAt, setUpdatedAt] = useState<string | null>(null)
  const [isStale, setIsStale] = useState(false)

  useEffect(() => {
    if (!supabase || !isSupabaseConfigured) return

    // Fetch initial status
    async function fetchInitialStatus() {
      try {
        const { data, error } = await supabase!
          .from('availability_status')
          .select('status, updated_at')
          .eq('id', 1)
          .single<{ status: 'available' | 'busy' | 'off' | 'leave'; updated_at: string }>()

        if (!error && data) {
          setStatus(data.status as AvailabilityStatus)
          setUpdatedAt(data.updated_at)
          checkStaleness(data.updated_at)
        }
      } catch {
        setStatus('unknown')
      }
    }

    fetchInitialStatus()

    // Subscribe to real-time updates
    const channel = subscribeToAvailability((payload) => {
      setStatus(payload.status)
      setUpdatedAt(payload.updated_at)
      checkStaleness(payload.updated_at)
    })

    return () => {
      if (channel && supabase) {
        supabase.removeChannel(channel)
      }
    }
  }, [])

  // Check staleness periodically
  useEffect(() => {
    if (!updatedAt) return

    const interval = setInterval(() => {
      checkStaleness(updatedAt)
    }, 60_000) // check every minute

    return () => clearInterval(interval)
  }, [updatedAt])

  function checkStaleness(timestamp: string) {
    const lastUpdate = new Date(timestamp).getTime()
    const now = Date.now()
    setIsStale(now - lastUpdate > STALE_THRESHOLD_MS)
  }

  const config = STATUS_MAP[isStale ? 'unknown' : status]
  const tooltipText = isStale
    ? 'Status unavailable — please call to confirm'
    : updatedAt
      ? `Last updated: ${new Date(updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
      : config.label

  return (
    <motion.div
      initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: 0.6 }}
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${config.bgColor} ${config.textColor} text-sm font-medium`}
      title={tooltipText}
      role="status"
      aria-live="polite"
      aria-label={`Doctor availability: ${isStale ? 'Status unavailable — please call to confirm' : config.label}`}
    >
      {/* Animated pulse dot */}
      <span className="relative flex h-2.5 w-2.5">
        {!prefersReducedMotion && status === 'available' && !isStale && (
          <span
            className={`absolute inline-flex h-full w-full rounded-full ${config.dotColor} opacity-75 animate-ping`}
          />
        )}
        <span
          className={`relative inline-flex h-2.5 w-2.5 rounded-full ${config.dotColor}`}
        />
      </span>

      <span className="whitespace-nowrap">
        {isStale ? 'Status unavailable — please call to confirm' : config.label}
      </span>
    </motion.div>
  )
}
