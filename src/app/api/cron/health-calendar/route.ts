import { NextResponse } from 'next/server';

import { sanityClient } from '@/lib/sanity/client';
import { todayHealthCalendarQuery } from '@/lib/sanity/queries';
import {
  getTodayMMDD,
  getTodaysHealthDay,
  HEALTH_CALENDAR,
} from '@/lib/utils/health-calendar';

/**
 * GET /api/cron/health-calendar
 *
 * Vercel Cron handler that runs daily at midnight (0 0 * * *).
 * Checks if today is a health awareness date and auto-publishes
 * the associated template article in Sanity CMS.
 *
 * Security: Validates CRON_SECRET header to ensure only Vercel Cron can trigger.
 *
 * Requirements: 37.1, 37.2, 37.3, 37.4, 37.5
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

  const todayMMDD = getTodayMMDD();
  const todaysHealthDay = getTodaysHealthDay();

  // 2. If no health day today, return early
  if (!todaysHealthDay) {
    return NextResponse.json({
      published: [],
      date: todayMMDD,
      message: 'No health awareness date today.',
    });
  }

  const published: string[] = [];

  try {
    // 3. Check Sanity CMS for today's health calendar entry
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format

    // Try to fetch the health calendar entry from Sanity
    const sanityEntry = await sanityClient.fetch(todayHealthCalendarQuery, {
      today,
    }).catch(() => null);

    if (sanityEntry) {
      // If a CMS entry exists with a template article, publish it
      const articleToPublish = sanityEntry.templateArticle || sanityEntry.customArticle;

      if (articleToPublish && articleToPublish.status !== 'published') {
        // Update article status from 'scheduled' to 'published' in Sanity
        try {
          await sanityClient
            .patch(articleToPublish._id)
            .set({ status: 'published', publishDate: new Date().toISOString() })
            .commit();

          published.push(articleToPublish.title || todaysHealthDay.templateTitle);
        } catch (patchError) {
          // Sanity write requires a token with write access
          // Log the intent if write fails (read-only token scenario)
          console.log(
            `[Health Calendar Cron] Would publish: "${articleToPublish.title}" but Sanity write token not configured.`
          );
          published.push(`(pending) ${articleToPublish.title || todaysHealthDay.templateTitle}`);
        }
      } else if (articleToPublish && articleToPublish.status === 'published') {
        // Already published
        published.push(`(already published) ${articleToPublish.title}`);
      } else {
        // No article linked to this calendar date
        console.log(
          `[Health Calendar Cron] Health day "${todaysHealthDay.name}" has no linked article in Sanity.`
        );
      }
    } else {
      // No Sanity CMS entry for today — log using local calendar data
      console.log(
        `[Health Calendar Cron] Today is "${todaysHealthDay.name}". ` +
        `Template article: "${todaysHealthDay.templateTitle}". ` +
        `No Sanity CMS entry found — auto-publish skipped (create entry in Sanity studio to enable).`
      );
    }
  } catch (error) {
    // If Sanity is not connected or errors, log gracefully
    console.error('[Health Calendar Cron] Sanity error:', error);
    console.log(
      `[Health Calendar Cron] Fallback: Today is "${todaysHealthDay.name}" (${todayMMDD}). ` +
      `Connect Sanity CMS to enable auto-publishing.`
    );
  }

  return NextResponse.json({
    published,
    date: todayMMDD,
    healthDay: todaysHealthDay.name,
    templateTitle: todaysHealthDay.templateTitle,
    category: todaysHealthDay.category,
    totalCalendarEntries: HEALTH_CALENDAR.length,
  });
}
