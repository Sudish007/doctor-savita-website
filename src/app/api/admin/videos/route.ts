import { NextResponse } from 'next/server'

import { supabaseAdmin } from '@/lib/supabase/admin'

/**
 * GET /api/admin/videos
 * Fetches video consultations for admin review.
 *
 * PATCH /api/admin/videos
 * Marks a video consultation as replied.
 *
 * Requirements: 31.4, 31.5
 */
export async function GET() {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: videos, error } = await (supabaseAdmin as any)
      .from('video_consultations')
      .select('*')
      .order('submitted_at', { ascending: false })

    if (error) {
      console.error('[Admin Videos] Fetch error:', error)
      return NextResponse.json(
        { success: false, message: 'Failed to fetch video consultations' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, videos: videos ?? [] })
  } catch (error) {
    console.error('[Admin Videos] Unexpected error:', error)
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const { id, action } = body as { id: string; action: string }

    if (!id || action !== 'mark_replied') {
      return NextResponse.json(
        { success: false, message: 'Invalid request.' },
        { status: 400 }
      )
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: updated, error } = await (supabaseAdmin as any)
      .from('video_consultations')
      .update({
        status: 'replied',
        reply_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select('*')
      .single()

    if (error || !updated) {
      console.error('[Admin Videos] Update error:', error)
      return NextResponse.json(
        { success: false, message: 'Failed to update video status' },
        { status: 500 }
      )
    }

    // TODO: Send WhatsApp notification with secure viewing link

    return NextResponse.json({
      success: true,
      message: 'Video marked as replied',
      video: updated,
    })
  } catch (error) {
    console.error('[Admin Videos] Unexpected error:', error)
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    )
  }
}
