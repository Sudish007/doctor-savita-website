import { NextResponse } from 'next/server'

import { supabaseAdmin } from '@/lib/supabase/admin'

/**
 * GET /api/admin/contacts
 * Fetches all contact inquiries from Supabase, ordered by most recent first.
 */
export async function GET() {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabaseAdmin as any)
      .from('contact_inquiries')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100)

    if (error) {
      console.error('[Admin Contacts API] Error:', error)
      return NextResponse.json({ inquiries: [] })
    }

    return NextResponse.json({ inquiries: data ?? [] })
  } catch (error) {
    console.error('[Admin Contacts API] Unexpected error:', error)
    return NextResponse.json({ inquiries: [] })
  }
}

/**
 * PATCH /api/admin/contacts
 * Marks a contact inquiry as read or archived.
 */
export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const { id, action } = body as { id: string; action: 'read' | 'archive' }

    if (!id || !action) {
      return NextResponse.json(
        { success: false, message: 'Missing id or action' },
        { status: 400 }
      )
    }

    const updateData = action === 'read'
      ? { is_read: true }
      : { is_archived: true }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabaseAdmin as any)
      .from('contact_inquiries')
      .update(updateData)
      .eq('id', id)

    if (error) {
      return NextResponse.json(
        { success: false, message: 'Failed to update inquiry' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[Admin Contacts API] PATCH error:', error)
    return NextResponse.json(
      { success: false, message: 'Unexpected error' },
      { status: 500 }
    )
  }
}
