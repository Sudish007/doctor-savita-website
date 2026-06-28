import { createClient } from '@supabase/supabase-js'

import type { Database } from '@/types/database'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

/** Whether Supabase is properly configured */
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey && !supabaseUrl.includes('placeholder'))

/**
 * Browser Supabase client for use in client components.
 * Uses the anon key with Row Level Security policies.
 * Returns null if Supabase is not configured.
 */
export const supabase = isSupabaseConfigured
  ? createClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
      realtime: {
        params: {
          eventsPerSecond: 10,
        },
      },
    })
  : null

/**
 * Subscribe to real-time changes on the queue_status table.
 * Returns the channel for cleanup in useEffect, or null if Supabase is not configured.
 */
export function subscribeToQueueStatus(
  callback: (payload: { current_token: number; waiting_count: number; is_clinic_open: boolean; last_updated: string }) => void
) {
  if (!supabase) return null

  const channel = supabase
    .channel('queue-status-changes')
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'queue_status',
      },
      (payload) => {
        callback(payload.new as { current_token: number; waiting_count: number; is_clinic_open: boolean; last_updated: string })
      }
    )
    .subscribe()

  return channel
}

/**
 * Subscribe to real-time changes on the availability_status table.
 * Returns the channel for cleanup in useEffect, or null if Supabase is not configured.
 */
export function subscribeToAvailability(
  callback: (payload: { status: 'available' | 'busy' | 'off' | 'leave'; updated_at: string }) => void
) {
  if (!supabase) return null

  const channel = supabase
    .channel('availability-status-changes')
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'availability_status',
      },
      (payload) => {
        callback(payload.new as { status: 'available' | 'busy' | 'off' | 'leave'; updated_at: string })
      }
    )
    .subscribe()

  return channel
}
