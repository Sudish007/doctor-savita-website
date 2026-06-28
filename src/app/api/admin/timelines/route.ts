import { NextResponse } from 'next/server'

import { supabaseAdmin } from '@/lib/supabase/admin'

/**
 * GET /api/admin/timelines
 * Fetches patient timelines with summary info for admin dashboard.
 *
 * Requirements: 27.5
 */
export async function GET() {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: timelines, error } = await (supabaseAdmin as any)
      .from('patient_timelines')
      .select('*')
      .order('start_date', { ascending: false })

    if (error) {
      console.error('[Admin Timelines] Fetch error:', error)
      return NextResponse.json(
        { success: false, message: 'Failed to fetch timelines' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, timelines: timelines ?? [] })
  } catch (error) {
    console.error('[Admin Timelines] Unexpected error:', error)
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    )
  }
}
