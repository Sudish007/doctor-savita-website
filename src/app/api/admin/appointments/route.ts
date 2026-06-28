import { NextResponse } from 'next/server'

import { supabaseAdmin } from '@/lib/supabase/admin'

/**
 * GET /api/admin/appointments
 * Fetches all appointments for admin dashboard.
 *
 * PATCH /api/admin/appointments
 * Updates appointment status (confirm/reschedule) and triggers WhatsApp notification.
 *
 * Requirements: 23.4, 23.5
 */
export async function GET() {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: appointments, error } = await (supabaseAdmin as any)
      .from('appointments')
      .select('*')
      .order('preferred_date', { ascending: true })

    if (error) {
      console.error('[Admin Appointments] Fetch error:', error)
      return NextResponse.json(
        { success: false, message: 'Failed to fetch appointments' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, appointments: appointments ?? [] })
  } catch (error) {
    console.error('[Admin Appointments] Unexpected error:', error)
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const { id, action } = body as { id: string; action: 'confirm' | 'reschedule' }

    if (!id || !action || !['confirm', 'reschedule'].includes(action)) {
      return NextResponse.json(
        { success: false, message: 'Invalid request. Provide id and action (confirm/reschedule).' },
        { status: 400 }
      )
    }

    const newStatus = action === 'confirm' ? 'confirmed' : 'rescheduled'

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: updated, error } = await (supabaseAdmin as any)
      .from('appointments')
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select('*')
      .single()

    if (error || !updated) {
      console.error('[Admin Appointments] Update error:', error)
      return NextResponse.json(
        { success: false, message: 'Failed to update appointment' },
        { status: 500 }
      )
    }

    // TODO: Trigger WhatsApp confirmation notification to patient

    return NextResponse.json({
      success: true,
      message: `Appointment ${newStatus}`,
      appointment: updated,
    })
  } catch (error) {
    console.error('[Admin Appointments] Unexpected error:', error)
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    )
  }
}
