/**
 * Internationalization configuration for the Dr. Savita Kumari website.
 * Supports English, Hindi, and Bhojpuri with localStorage persistence.
 * Language switching completes within 500ms per requirement 34.2.
 */

export const locales = ['en', 'hi', 'bh'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

export const localeNames: Record<Locale, string> = {
  en: 'English',
  hi: 'हिंदी',
  bh: 'भोजपुरी',
};

export const localeLabels: Record<Locale, string> = {
  en: 'EN',
  hi: 'हिं',
  bh: 'भो',
};

const LOCALE_STORAGE_KEY = 'preferred-locale';

/**
 * Get the stored locale preference from localStorage.
 * Falls back to 'en' if no preference is stored or if running on the server.
 */
export function getStoredLocale(): Locale {
  if (typeof window === 'undefined') return defaultLocale;

  try {
    const stored = localStorage.getItem(LOCALE_STORAGE_KEY);
    if (stored && locales.includes(stored as Locale)) {
      return stored as Locale;
    }
  } catch {
    // localStorage may not be available (e.g., private browsing)
  }

  return defaultLocale;
}

/**
 * Persist the locale preference to localStorage.
 */
export function setStoredLocale(locale: Locale): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  } catch {
    // localStorage may not be available
  }
}

/**
 * Check if a given string is a valid locale.
 */
export function isValidLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}
