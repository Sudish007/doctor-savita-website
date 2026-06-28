import { createClient } from '@supabase/supabase-js'

import type { Database } from '@/types/database'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

/**
 * Server-side admin Supabase client using the service role key.
 * Bypasses Row Level Security — use only in server-side code (API routes, server components).
 * NEVER expose this client to the browser.
 */
export const supabaseAdmin = createClient<Database>(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})
