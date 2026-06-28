import { getRequestConfig } from 'next-intl/server';
import { defaultLocale, type Locale, locales } from './config';

/**
 * next-intl request configuration.
 * Since we use client-side locale switching (localStorage),
 * we default to English on the server and let the client
 * hydrate with the user's stored preference.
 */
export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  // Validate the locale, fall back to default if invalid
  if (!locale || !locales.includes(locale as Locale)) {
    locale = defaultLocale;
  }

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});
