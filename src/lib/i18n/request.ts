import { getRequestConfig } from 'next-intl/server';
import { cookies } from 'next/headers';
import { defaultLocale, type Locale, locales } from './config';

/**
 * next-intl request configuration.
 * Reads locale from NEXT_LOCALE cookie (set by LanguageToggle on switch).
 * Falls back to 'en' if no cookie or invalid value.
 */
export default getRequestConfig(async ({ requestLocale }) => {
  // Try requestLocale first (from middleware if active)
  let locale = await requestLocale;

  // If not set, read from NEXT_LOCALE cookie
  if (!locale || !locales.includes(locale as Locale)) {
    try {
      const cookieStore = await cookies();
      const cookieLocale = cookieStore.get('NEXT_LOCALE')?.value;
      if (cookieLocale && locales.includes(cookieLocale as Locale)) {
        locale = cookieLocale;
      }
    } catch {
      // cookies() may fail in some contexts
    }
  }

  // Final fallback
  if (!locale || !locales.includes(locale as Locale)) {
    locale = defaultLocale;
  }

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});
