'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

import { supabase, isSupabaseConfigured, subscribeToQueueStatus } from '@/lib/supabase/client'

/**
 * Custom hook for real-time queue state via Supabase Realtime.
 *
 * Subscribes to the `queue_status` table and provides:
 * - currentToken: the token currently being served
 * - waitingCount: number of patients waiting
 * - estimatedWaitMinutes: waitingCount × 15
 * - isClinicOpen: whether clinic is within operating hours (09:00-18:00 Mon-Sat)
 * - lastUpdated: ISO timestamp of the last queue update
 * - isConnected: whether the Realtime subscription is active
 *
 * Auto-detects clinic closed state outside operating hours.
 * Implements exponential backoff reconnection on subscription drop.
 *
 * Requirements: 30.1, 30.3, 30.4, 30.5
 */

interface QueueRealtimeState {
  currentToken: number
  waitingCount: number
  estimatedWaitMinutes: number
  isClinicOpen: boolean
  lastUpdated: string
  isConnected: boolean
}

/** Average consultation time per patient in minutes */
const MINUTES_PER_PATIENT = 15

/** Operating hours: 09:00 - 18:00, Monday (1) through Saturday (6) */
const OPERATING_START_HOUR = 9
const OPERATING_END_HOUR = 18

/**
 * Checks whether the current time (IST) is within clinic operating hours.
 * Operating hours: Mon-Sat, 09:00-18:00 IST.
 */
export function isWithinOperatingHours(now?: Date): boolean {
  const date = now ?? new Date()
  // Convert to IST (UTC+5:30)
  const istOffset = 5.5 * 60 // minutes
  const utcMinutes = date.getUTCHours() * 60 + date.getUTCMinutes()
  const istMinutes = utcMinutes + istOffset
  const istHour = Math.floor((istMinutes % 1440) / 60)
  // Day of week in IST
  const istTotalMinutes = date.getTime() / 60000 + istOffset
  const istDate = new Date(istTotalMinutes * 60000)
  const dayOfWeek = istDate.getUTCDay() // 0 = Sunday

  // Closed on Sunday (0)
  if (dayOfWeek === 0) return false

  return istHour >= OPERATING_START_HOUR && istHour < OPERATING_END_HOUR
}

/**
 * Calculates estimated wait time based on waiting count.
 * Formula: waitingCount × 15 minutes.
 */
export function calculateEstimatedWait(waitingCount: number): number {
  return Math.max(0, waitingCount) * MINUTES_PER_PATIENT
}

export function useRealtimeQueue(): QueueRealtimeState {
  const [state, setState] = useState<QueueRealtimeState>({
    currentToken: 0,
    waitingCount: 0,
    estimatedWaitMinutes: 0,
    isClinicOpen: false,
    lastUpdated: '',
    isConnected: false,
  })

  const reconnectAttempts = useRef(0)
  const reconnectTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const channelRef = useRef<ReturnType<typeof subscribeToQueueStatus> | null>(null)

  /** Fetch initial queue state from Supabase */
  const fetchInitialState = useCallback(async () => {
    if (!supabase || !isSupabaseConfigured) return
    try {
      const { data, error } = await supabase
        .from('queue_status')
        .select('*')
        .eq('id', 1)
        .single()

      if (error || !data) return

      const clinicOpen = isWithinOperatingHours()

      setState((prev) => ({
        ...prev,
        currentToken: data.current_token,
        waitingCount: data.waiting_count,
        estimatedWaitMinutes: calculateEstimatedWait(data.waiting_count),
        isClinicOpen: clinicOpen && data.is_clinic_open,
        lastUpdated: data.last_updated,
      }))
    } catch {
      // Silently fail on initial fetch - subscription will provide data
    }
  }, [])

  /** Subscribe to real-time queue updates with exponential backoff reconnection */
  const subscribe = useCallback(() => {
    if (!supabase || !isSupabaseConfigured) return
    // Clean up any existing channel
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current)
    }

    const channel = subscribeToQueueStatus((payload) => {
      const clinicOpen = isWithinOperatingHours()

      setState((prev) => ({
        ...prev,
        currentToken: payload.current_token,
        waitingCount: payload.waiting_count,
        estimatedWaitMinutes: calculateEstimatedWait(payload.waiting_count),
        isClinicOpen: clinicOpen && payload.is_clinic_open,
        lastUpdated: payload.last_updated,
        isConnected: true,
      }))

      // Reset reconnect attempts on successful message
      reconnectAttempts.current = 0
    })

    channelRef.current = channel

    // Monitor channel status for connection state
    channel.on('system', { event: '*' }, (payload: { status?: string; extension?: string }) => {
      if (payload.status === 'ok' || payload.extension === 'postgres_changes') {
        setState((prev) => ({ ...prev, isConnected: true }))
        reconnectAttempts.current = 0
      }
    })

    // Handle subscription errors with exponential backoff
    channel.on('system', { event: 'error' }, () => {
      setState((prev) => ({ ...prev, isConnected: false }))
      scheduleReconnect()
    })

    // Mark as connected once subscription is active
    setState((prev) => ({ ...prev, isConnected: true }))
  }, [])

  /** Schedule a reconnection with exponential backoff */
  const scheduleReconnect = useCallback(() => {
    if (reconnectTimer.current) {
      clearTimeout(reconnectTimer.current)
    }

    const attempt = reconnectAttempts.current
    // Exponential backoff: 1s, 2s, 4s, 8s, 16s, max 30s
    const delay = Math.min(1000 * Math.pow(2, attempt), 30000)

    reconnectTimer.current = setTimeout(() => {
      reconnectAttempts.current += 1
      subscribe()
    }, delay)
  }, [subscribe])

  // Periodically re-check operating hours (every minute)
  useEffect(() => {
    const interval = setInterval(() => {
      setState((prev) => {
        const clinicOpen = isWithinOperatingHours()
        if (prev.isClinicOpen !== clinicOpen) {
          return { ...prev, isClinicOpen: clinicOpen }
        }
        return prev
      })
    }, 60_000)

    return () => clearInterval(interval)
  }, [])

  // Main subscription lifecycle
  useEffect(() => {
    fetchInitialState()
    subscribe()

    return () => {
      if (channelRef.current && supabase) {
        supabase.removeChannel(channelRef.current)
      }
      if (reconnectTimer.current) {
        clearTimeout(reconnectTimer.current)
      }
    }
  }, [fetchInitialState, subscribe])

  return state
}
