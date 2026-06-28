import { NextResponse } from 'next/server';

import { supabaseAdmin } from '@/lib/supabase/admin';
import { sendWhatsAppNotification } from '@/lib/whatsapp/send';

/**
 * GET /api/cron/reminders
 *
 * Vercel Cron handler that runs daily at 9:00 AM (0 9 * * *).
 * Checks for active patient timelines where the last assessment entry
 * was 7+ days ago, and sends a WhatsApp reminder to each patient
 * with a direct link to submit their weekly self-assessment.
 *
 * Security: Validates CRON_SECRET header to ensure only Vercel Cron can trigger.
 *
 * Requirements: 27.7
 */
export async function GET(request: Request) {
  // 1. Verify the request comes from Vercel Cron via CRON_SECRET header
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json(
      { error: 'Unauthorized. Invalid CRON_SECRET.' },
      { status: 401 }
    );
  }

  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const sevenDaysAgoISO = sevenDaysAgo.toISOString().split('T')[0];

  try {
    // 2. Fetch all active patient timelines
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: timelines, error: timelinesError } = await (supabaseAdmin as any)
      .from('patient_timelines')
      .select('id, token, patient_name, phone_number')
      .eq('is_active', true);

    if (timelinesError) {
      console.error('[Reminders Cron] Error fetching timelines:', timelinesError);
      return NextResponse.json(
        { error: 'Failed to fetch active timelines.' },
        { status: 500 }
      );
    }

    if (!timelines || timelines.length === 0) {
      return NextResponse.json({
        reminded: 0,
        message: 'No active timelines found.',
      });
    }

    const reminded: string[] = [];
    const skipped: string[] = [];
    const failed: string[] = [];

    // 3. For each active timeline, check if last assessment was 7+ days ago
    for (const timeline of timelines) {
      try {
        // Get the most recent assessment entry for this timeline
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data: lastAssessment, error: assessmentError } = await (supabaseAdmin as any)
          .from('timeline_entries')
          .select('entry_date')
          .eq('timeline_id', timeline.id)
          .eq('entry_type', 'assessment')
          .order('entry_date', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (assessmentError) {
          console.error(
            `[Reminders Cron] Error fetching last assessment for ${timeline.token}:`,
            assessmentError
          );
          failed.push(timeline.patient_name);
          continue;
        }

        // If no assessment yet, or last assessment was 7+ days ago, send reminder
        const needsReminder =
          !lastAssessment || lastAssessment.entry_date <= sevenDaysAgoISO;

        if (!needsReminder) {
          skipped.push(timeline.patient_name);
          continue;
        }

        // 4. Send WhatsApp reminder with link to their timeline
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://drsavitakumari.com';
        const timelineLink = `${baseUrl}/my-journey/${timeline.token}`;

        const message =
          `🌿 Hi ${timeline.patient_name},\n\n` +
          `It's time for your weekly self-assessment! ` +
          `Please take a moment to update how you're feeling.\n\n` +
          `📋 Submit your assessment here:\n${timelineLink}\n\n` +
          `Your feedback helps Dr. Savita track your healing progress. 💚`;

        const patientPhone = `+91${timeline.phone_number}`;
        const sent = await sendWhatsAppNotification(patientPhone, message);

        if (sent) {
          reminded.push(timeline.patient_name);
        } else {
          console.error(
            `[Reminders Cron] Failed to send WhatsApp to ${timeline.patient_name} (${patientPhone})`
          );
          failed.push(timeline.patient_name);
        }
      } catch (entryError) {
        console.error(
          `[Reminders Cron] Error processing timeline ${timeline.token}:`,
          entryError
        );
        failed.push(timeline.patient_name);
      }
    }

    return NextResponse.json({
      reminded: reminded.length,
      skipped: skipped.length,
      failed: failed.length,
      details: { reminded, skipped, failed },
      date: now.toISOString(),
    });
  } catch (error) {
    console.error('[Reminders Cron] Unexpected error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred during reminder processing.' },
      { status: 500 }
    );
  }
}
