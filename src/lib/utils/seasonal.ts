/**
 * Seasonal Health Alert Utilities
 *
 * Determines which seasonal health alert to show based on the current month.
 * Priority logic handles overlapping months:
 * - Feb-Mar (2-3) → 'spring' (priority over summer for Feb-Mar)
 * - Mar-May (3-5) → 'summer' (Mar goes to spring first, so effectively Apr-May only for March)
 * - Jul-Sep (7-9) → 'monsoon'
 * - Oct-Nov (10-11) → 'autumn'
 * - Nov-Jan (11-12, 1) → 'winter' (Nov goes to autumn first, so effectively Dec-Jan only for Nov)
 *
 * Requirements: 32.1, 32.2, 32.3, 32.4, 32.5
 */

export type SeasonalCategory = 'spring' | 'summer' | 'monsoon' | 'autumn' | 'winter';

export interface SeasonalAlertData {
  category: SeasonalCategory;
  title: string;
  body: string;
  icon: string;
  link: { label: string; href: string };
}

/**
 * Maps a 1-based month (1=January, 12=December) to a seasonal category.
 *
 * Priority logic for overlapping months:
 * - Month 2 (Feb): spring (priority over summer)
 * - Month 3 (Mar): spring (priority over summer)
 * - Month 4-5 (Apr-May): summer
 * - Month 7-9 (Jul-Sep): monsoon
 * - Month 10 (Oct): autumn
 * - Month 11 (Nov): autumn (priority over winter)
 * - Month 12 (Dec): winter
 * - Month 1 (Jan): winter
 * - Month 6 (Jun): defaults to summer (transition month)
 */
export function getSeasonalCategory(month: number): SeasonalCategory {
  // Priority-based mapping
  switch (month) {
    case 2:
    case 3:
      return 'spring';
    case 4:
    case 5:
    case 6:
      return 'summer';
    case 7:
    case 8:
    case 9:
      return 'monsoon';
    case 10:
    case 11:
      return 'autumn';
    case 12:
    case 1:
      return 'winter';
    default:
      // Fallback for invalid months — shouldn't happen with valid 1-12 input
      return 'summer';
  }
}

/** Seasonal alert content for each category */
const SEASONAL_ALERTS: Record<SeasonalCategory, SeasonalAlertData> = {
  monsoon: {
    category: 'monsoon',
    title: '🌧️ Monsoon Health Alert',
    body: 'Boost your immunity this monsoon! Learn about preventing waterborne diseases, dengue, and seasonal infections with homeopathic remedies.',
    icon: '🌧️',
    link: { label: 'Immunity Tips', href: '/blog?category=immunity' },
  },
  winter: {
    category: 'winter',
    title: '❄️ Winter Wellness',
    body: 'Winter care essentials: protect your skin, ease joint pain, and strengthen respiratory health naturally with homeopathy.',
    icon: '❄️',
    link: { label: 'Skin Care Tips', href: '/blog?category=skin-care' },
  },
  summer: {
    category: 'summer',
    title: '☀️ Summer Health Tips',
    body: 'Stay hydrated and prevent heat stroke this summer. Discover homeopathic solutions for dehydration, sunburn, and digestive issues.',
    icon: '☀️',
    link: { label: 'Digestion Health', href: '/blog?category=digestion' },
  },
  spring: {
    category: 'spring',
    title: '🌸 Spring Allergy Season',
    body: 'Allergy season is here! Get natural relief from pollen allergies, hay fever, and seasonal skin irritations with homeopathic care.',
    icon: '🌸',
    link: { label: 'Allergy Prevention', href: '/blog?category=immunity' },
  },
  autumn: {
    category: 'autumn',
    title: '🍂 Autumn Wellness',
    body: 'Festival season health tips: boost your immunity, manage stress, and stay energized during the festive autumn months.',
    icon: '🍂',
    link: { label: 'Immunity Boost', href: '/blog?category=immunity' },
  },
};

/**
 * Returns the seasonal alert data for a given month.
 */
export function getSeasonalAlert(month: number): SeasonalAlertData {
  const category = getSeasonalCategory(month);
  return SEASONAL_ALERTS[category];
}

/** Session storage key for dismissed state */
export const SEASONAL_ALERT_STORAGE_KEY = 'seasonal-alert-dismissed';
