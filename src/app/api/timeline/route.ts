import { NextResponse } from 'next/server';

import { supabaseAdmin } from '@/lib/supabase/admin';

/**
 * GET /api/timeline?token=xxx
 *
 * Fetches a patient timeline and its entries by the unique token.
 * Returns the timeline with all entries sorted chronologically.
 *
 * POST /api/timeline
 *
 * Creates a new timeline entry for an existing patient timeline.
 * Body: { timeline_id, entry_date, entry_type, content, score?, created_by }
 *
 * Requirements: 27.5, 27.7
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { error: 'Missing required query parameter: token' },
        { status: 400 }
      );
    }

    // Fetch the patient timeline by token
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: timeline, error: timelineError } = await (supabaseAdmin as any)
      .from('patient_timelines')
      .select('*')
      .eq('token', token)
      .single();

    if (timelineError || !timeline) {
      return NextResponse.json(
        { error: 'Timeline not found for the given token.' },
        { status: 404 }
      );
    }

    // Fetch all entries for this timeline, sorted by date ascending
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: entries, error: entriesError } = await (supabaseAdmin as any)
      .from('timeline_entries')
      .select('*')
      .eq('timeline_id', timeline.id)
      .order('entry_date', { ascending: true });

    if (entriesError) {
      console.error('[Timeline API] Error fetching entries:', entriesError);
      return NextResponse.json(
        { error: 'Failed to fetch timeline entries.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      timeline: {
        id: timeline.id,
        token: timeline.token,
        patientName: timeline.patient_name,
        phoneNumber: timeline.phone_number,
        condition: timeline.condition,
        startDate: timeline.start_date,
        isActive: timeline.is_active,
        createdAt: timeline.created_at,
      },
      entries: (entries || []).map((e: Record<string, unknown>) => ({
        id: e.id,
        timelineId: e.timeline_id,
        entryDate: e.entry_date,
        entryType: e.entry_type,
        content: e.content,
        score: e.score,
        createdBy: e.created_by,
        createdAt: e.created_at,
      })),
    });
  } catch (error) {
    console.error('[Timeline API] Unexpected error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred.' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { timeline_id, entry_date, entry_type, content, score, created_by } = body;

    // Validate required fields
    if (!timeline_id || !entry_date || !entry_type || !content || !created_by) {
      return NextResponse.json(
        { error: 'Missing required fields: timeline_id, entry_date, entry_type, content, created_by' },
        { status: 400 }
      );
    }

    // Validate entry_type
    const validTypes = ['symptom', 'remedy', 'followup', 'assessment'];
    if (!validTypes.includes(entry_type)) {
      return NextResponse.json(
        { error: `Invalid entry_type. Must be one of: ${validTypes.join(', ')}` },
        { status: 400 }
      );
    }

    // Validate created_by
    if (!['doctor', 'patient'].includes(created_by)) {
      return NextResponse.json(
        { error: 'Invalid created_by. Must be "doctor" or "patient".' },
        { status: 400 }
      );
    }

    // Validate score if provided
    if (score !== undefined && score !== null) {
      const numScore = Number(score);
      if (!Number.isInteger(numScore) || numScore < 1 || numScore > 5) {
        return NextResponse.json(
          { error: 'Invalid score. Must be an integer between 1 and 5.' },
          { status: 400 }
        );
      }
    }

    // Verify the timeline exists
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: timeline, error: timelineError } = await (supabaseAdmin as any)
      .from('patient_timelines')
      .select('id')
      .eq('id', timeline_id)
      .single();

    if (timelineError || !timeline) {
      return NextResponse.json(
        { error: 'Timeline not found for the given timeline_id.' },
        { status: 404 }
      );
    }

    // Insert the new entry
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: entry, error: insertError } = await (supabaseAdmin as any)
      .from('timeline_entries')
      .insert({
        timeline_id,
        entry_date,
        entry_type,
        content,
        score: score ?? null,
        created_by,
      })
      .select()
      .single();

    if (insertError || !entry) {
      console.error('[Timeline API] Insert error:', insertError);
      return NextResponse.json(
        { error: 'Failed to create timeline entry.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        entry: {
          id: entry.id,
          timelineId: entry.timeline_id,
          entryDate: entry.entry_date,
          entryType: entry.entry_type,
          content: entry.content,
          score: entry.score,
          createdBy: entry.created_by,
          createdAt: entry.created_at,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('[Timeline API] Unexpected error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred.' },
      { status: 500 }
    );
  }
}
