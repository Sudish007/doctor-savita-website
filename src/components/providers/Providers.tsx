"use client";

import { NextIntlClientProvider } from "next-intl";
import { ThemeProvider } from "./ThemeProvider";

interface ProvidersProps {
  children: React.ReactNode;
  locale: string;
  messages: Record<string, unknown>;
}

/**
 * Providers wrapper combines all client-side providers (theme, i18n).
 * This is a single client boundary wrapping the app's children in root layout.
 * - ThemeProvider: dark/light mode with localStorage persistence (Req 18.1)
 * - NextIntlClientProvider: i18n for English/Hindi/Bhojpuri (Req 34.1)
 */
export function Providers({ children, locale, messages }: ProvidersProps) {
  return (
    <ThemeProvider>
      <NextIntlClientProvider locale={locale} messages={messages}>
        {children}
      </NextIntlClientProvider>
    </ThemeProvider>
  );
}
