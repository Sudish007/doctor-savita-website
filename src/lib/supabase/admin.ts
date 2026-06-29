import { createClient } from '@supabase/supabase-js'

import type { Database } from '@/types/database'

type SupabaseAdminClient = ReturnType<typeof createClient<Database>>

let supabaseAdminClient: SupabaseAdminClient | null = null

function getSupabaseAdminClient() {
  if (supabaseAdminClient) {
    return supabaseAdminClient
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set')
  }

  supabaseAdminClient = createClient<Database>(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })

  return supabaseAdminClient
}

/**
 * Server-side admin Supabase client using the service role key.
 * Bypasses Row Level Security — use only in server-side code (API routes, server components).
 * NEVER expose this client to the browser.
 */
export const supabaseAdmin = new Proxy({} as SupabaseAdminClient, {
  get(_target, prop, receiver) {
    return Reflect.get(getSupabaseAdminClient(), prop, receiver)
  },
})
