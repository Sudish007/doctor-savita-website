/**
 * Health Calendar utility for managing health awareness dates.
 * Pre-loaded with 20+ international health awareness dates.
 * Used by Vercel Cron to auto-publish template articles on scheduled dates
 * and by the homepage to display "Health Day Today" badge.
 *
 * Requirements: 37.1, 37.2, 37.3, 37.4, 37.5
 */

import type { HealthCategory } from '@/types';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface HealthCalendarEntry {
  /** Name of the health awareness day */
  name: string;
  /** Date in MM-DD format (month-day) */
  date: string;
  /** Related health category for article categorization */
  category: HealthCategory;
  /** Template article title to auto-publish */
  templateTitle: string;
  /** Whether this entry is enabled for auto-publishing (CMS toggle) */
  enabled: boolean;
}

export interface TodaysHealthDay {
  name: string;
  category: HealthCategory;
  templateTitle: string;
}

// ─── Health Calendar Data (20+ awareness dates) ──────────────────────────────

export const HEALTH_CALENDAR: HealthCalendarEntry[] = [
  {
    name: 'World Cancer Day',
    date: '02-04',
    category: 'immunity',
    templateTitle: 'World Cancer Day: Homeopathic Support for Cancer Care',
    enabled: true,
  },
  {
    name: 'International Women\'s Day',
    date: '03-08',
    category: 'womens-health',
    templateTitle: 'International Women\'s Day: Holistic Health for Women',
    enabled: true,
  },
  {
    name: 'World Tuberculosis Day',
    date: '03-24',
    category: 'immunity',
    templateTitle: 'World TB Day: Supporting Recovery with Homeopathy',
    enabled: true,
  },
  {
    name: 'World Health Day',
    date: '04-07',
    category: 'immunity',
    templateTitle: 'World Health Day: Embracing Holistic Wellness',
    enabled: true,
  },
  {
    name: 'World Homeopathy Day',
    date: '04-10',
    category: 'immunity',
    templateTitle: 'World Homeopathy Day: Celebrating Natural Healing',
    enabled: true,
  },
  {
    name: 'World Immunization Week',
    date: '04-24',
    category: 'child-care',
    templateTitle: 'World Immunization Week: Building Natural Immunity',
    enabled: true,
  },
  {
    name: 'World Asthma Day',
    date: '05-07',
    category: 'immunity',
    templateTitle: 'World Asthma Day: Homeopathic Approaches to Respiratory Health',
    enabled: true,
  },
  {
    name: 'World No Tobacco Day',
    date: '05-31',
    category: 'mental-wellness',
    templateTitle: 'World No Tobacco Day: Breaking Free with Homeopathy',
    enabled: true,
  },
  {
    name: 'International Day of Yoga',
    date: '06-21',
    category: 'mental-wellness',
    templateTitle: 'International Yoga Day: Integrating Yoga with Homeopathic Healing',
    enabled: true,
  },
  {
    name: 'World Hepatitis Day',
    date: '07-28',
    category: 'digestion',
    templateTitle: 'World Hepatitis Day: Liver Health and Homeopathy',
    enabled: true,
  },
  {
    name: 'World Breastfeeding Week',
    date: '08-01',
    category: 'child-care',
    templateTitle: 'World Breastfeeding Week: Nurturing Mother and Child Naturally',
    enabled: true,
  },
  {
    name: 'World Alzheimer\'s Day',
    date: '09-21',
    category: 'mental-wellness',
    templateTitle: 'World Alzheimer\'s Day: Cognitive Health Through Homeopathy',
    enabled: true,
  },
  {
    name: 'World Heart Day',
    date: '09-29',
    category: 'immunity',
    templateTitle: 'World Heart Day: Heart Health the Natural Way',
    enabled: true,
  },
  {
    name: 'World Mental Health Day',
    date: '10-10',
    category: 'mental-wellness',
    templateTitle: 'World Mental Health Day: Emotional Wellness with Homeopathy',
    enabled: true,
  },
  {
    name: 'World Arthritis Day',
    date: '10-12',
    category: 'immunity',
    templateTitle: 'World Arthritis Day: Managing Joint Pain Naturally',
    enabled: true,
  },
  {
    name: 'World Pneumonia Day',
    date: '11-12',
    category: 'immunity',
    templateTitle: 'World Pneumonia Day: Respiratory Care with Homeopathy',
    enabled: true,
  },
  {
    name: 'World Diabetes Day',
    date: '11-14',
    category: 'digestion',
    templateTitle: 'World Diabetes Day: Homeopathic Support for Blood Sugar Management',
    enabled: true,
  },
  {
    name: 'World AIDS Day',
    date: '12-01',
    category: 'immunity',
    templateTitle: 'World AIDS Day: Immune Support Through Natural Medicine',
    enabled: true,
  },
  {
    name: 'Universal Health Coverage Day',
    date: '12-12',
    category: 'immunity',
    templateTitle: 'Universal Health Coverage Day: Accessible Homeopathic Care for All',
    enabled: true,
  },
  {
    name: 'World Skin Health Day',
    date: '03-14',
    category: 'skin-care',
    templateTitle: 'World Skin Health Day: Treating Skin Conditions with Homeopathy',
    enabled: true,
  },
  {
    name: 'World Digestive Health Day',
    date: '05-29',
    category: 'digestion',
    templateTitle: 'World Digestive Health Day: Gut Wellness the Homeopathic Way',
    enabled: true,
  },
];

// ─── Helper Functions ────────────────────────────────────────────────────────

/**
 * Gets the current date in MM-DD format.
 * Exported separately for testability (can be mocked).
 */
export function getTodayMMDD(): string {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${month}-${day}`;
}

/**
 * Returns the health day entry for today, if one exists and is enabled.
 * Used by the cron job and homepage badge.
 */
export function getTodaysHealthDay(): TodaysHealthDay | null {
  const todayMMDD = getTodayMMDD();
  const entry = HEALTH_CALENDAR.find(
    (item) => item.date === todayMMDD && item.enabled
  );

  if (!entry) {
    return null;
  }

  return {
    name: entry.name,
    category: entry.category,
    templateTitle: entry.templateTitle,
  };
}

/**
 * Boolean helper: returns true if today is a health awareness date
 * and that date is enabled in the calendar.
 * Used by the homepage to show "Health Day Today" badge.
 */
export function isHealthDayToday(): boolean {
  return getTodaysHealthDay() !== null;
}

/**
 * Returns the health day entry for a specific MM-DD date string.
 * Useful for testing and the cron job.
 */
export function getHealthDayForDate(dateMMDD: string): HealthCalendarEntry | null {
  const entry = HEALTH_CALENDAR.find(
    (item) => item.date === dateMMDD && item.enabled
  );
  return entry ?? null;
}

/**
 * Returns all enabled health calendar entries.
 * Used for CMS listing/display.
 */
export function getEnabledHealthDays(): HealthCalendarEntry[] {
  return HEALTH_CALENDAR.filter((item) => item.enabled);
}
