"use client";

import { useTheme as useNextTheme } from "next-themes";

/**
 * Custom hook wrapping next-themes' useTheme.
 * Provides a stable API for theme state management across the app.
 *
 * - theme: The current theme value ("light" | "dark" | "system")
 * - setTheme: Function to update the theme
 * - resolvedTheme: The actual resolved theme after system preference is applied ("light" | "dark")
 * - systemTheme: The user's OS-level preference ("light" | "dark" | undefined)
 *
 * Requirements: 18.1, 18.4, 18.5
 */
export function useTheme() {
  const { theme, setTheme, resolvedTheme, systemTheme } = useNextTheme();

  return {
    theme,
    setTheme,
    resolvedTheme,
    systemTheme,
  };
}
