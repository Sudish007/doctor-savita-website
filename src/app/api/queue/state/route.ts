import { NextResponse } from 'next/server'

import { supabaseAdmin } from '@/lib/supabase/admin'

/**
 * GET /api/queue/state
 * Returns the current queue state (current token, waiting count, last updated).
 *
 * Requirements: 30.2
 */
export async function GET() {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: state, error } = await (supabaseAdmin as any)
      .from('queue_status')
      .select('*')
      .eq('id', 1)
      .single()

    if (error || !state) {
      // Return defaults if no state found
      return NextResponse.json({
        currentToken: 0,
        waitingCount: 0,
        lastUpdated: new Date().toISOString(),
      })
    }

    return NextResponse.json({
      currentToken: state.current_token ?? 0,
      waitingCount: state.waiting_count ?? 0,
      lastUpdated: state.last_updated ?? new Date().toISOString(),
    })
  } catch (error) {
    console.error('[Queue State] Unexpected error:', error)
    return NextResponse.json({
      currentToken: 0,
      waitingCount: 0,
      lastUpdated: new Date().toISOString(),
    })
  }
}
