import { NextResponse } from 'next/server'

import { supabaseAdmin } from '@/lib/supabase/admin'

/** Valid availability statuses */
const VALID_STATUSES = ['available', 'busy', 'off', 'leave'] as const
type StatusValue = (typeof VALID_STATUSES)[number]

/**
 * POST /api/status
 *
 * Updates Dr. Savita's live availability status.
 * The change is stored in the availability_status table and broadcast
 * via Supabase Realtime to all connected clients.
 *
 * Body: { status: 'available' | 'busy' | 'off' | 'leave' }
 *
 * Requirements: 26.2, 26.3
 */
export async function POST(request: Request) {
  try {
    // 1. Parse and validate request body
    const body = await request.json()
    const { status } = body as { status: string }

    if (!status || !VALID_STATUSES.includes(status as StatusValue)) {
      return NextResponse.json(
        {
          success: false,
          message: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}`,
        },
        { status: 400 }
      )
    }

    // 2. Update availability_status table (single row, id=1)
    const now = new Date().toISOString()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: updatedStatus, error: updateError } = await (supabaseAdmin as any)
      .from('availability_status')
      .update({
        status,
        updated_at: now,
      })
      .eq('id', 1)
      .select('*')
      .single()

    if (updateError || !updatedStatus) {
      console.error('[Status API] Failed to update availability status:', updateError)
      return NextResponse.json(
        {
          success: false,
          message: 'Failed to update status. Please try again.',
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: `Status updated to "${status}"`,
      data: {
        status: updatedStatus.status,
        updatedAt: updatedStatus.updated_at,
      },
    })
  } catch (error) {
    console.error('[Status API] Unexpected error:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'An unexpected error occurred. Please try again.',
      },
      { status: 500 }
    )
  }
}
