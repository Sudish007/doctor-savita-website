import { NextResponse } from 'next/server'

import { supabaseAdmin } from '@/lib/supabase/admin'

/**
 * PATCH /api/appointment/payment
 * Updates payment_status for an appointment after patient confirms payment.
 */
export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const { bookingId, paymentStatus } = body as {
      bookingId: string
      paymentStatus: 'paid' | 'pay_at_clinic'
    }

    if (!bookingId || !paymentStatus) {
      return NextResponse.json(
        { success: false, message: 'Missing bookingId or paymentStatus' },
        { status: 400 }
      )
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabaseAdmin as any)
      .from('appointments')
      .update({ payment_status: paymentStatus })
      .eq('id', bookingId)

    if (error) {
      console.error('[Payment API] Update error:', error)
      return NextResponse.json(
        { success: false, message: 'Failed to update payment status' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[Payment API] Unexpected error:', error)
    return NextResponse.json(
      { success: false, message: 'Unexpected error' },
      { status: 500 }
    )
  }
}
