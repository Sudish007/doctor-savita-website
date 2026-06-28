"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ThemeProviderProps } from "next-themes";

/**
 * ThemeProvider wraps next-themes ThemeProvider with project defaults.
 * - attribute="class" works with Tailwind's darkMode: "class" strategy
 * - defaultTheme="system" respects prefers-color-scheme (Req 18.5)
 * - enableSystem allows automatic OS-level preference detection
 * - storageKey="theme" persists preference in localStorage (Req 18.4)
 */
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem={true}
      storageKey="theme"
      disableTransitionOnChange={false}
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}
