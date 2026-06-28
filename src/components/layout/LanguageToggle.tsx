"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  locales,
  localeLabels,
  getStoredLocale,
  setStoredLocale,
  type Locale,
} from "@/lib/i18n/config";

/**
 * Language selector dropdown showing EN / हिं / भो.
 * Persists selection to localStorage and triggers locale change.
 *
 * Requirements: 34.2, 34.3, 34.4
 */
export function LanguageToggle() {
  const [currentLocale, setCurrentLocale] = useState<Locale>("en");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Load stored locale on mount
  useEffect(() => {
    setCurrentLocale(getStoredLocale());
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close on Escape key
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen]);

  const selectLocale = useCallback((locale: Locale) => {
    setCurrentLocale(locale);
    setStoredLocale(locale);
    setIsOpen(false);

    // Set cookie so server reads the locale on next request, then reload
    document.cookie = `NEXT_LOCALE=${locale};path=/;max-age=31536000`;
    window.location.reload();
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center gap-1 w-11 h-11 rounded-full hover:bg-primary-light dark:hover:bg-primary-light transition-colors text-sm font-medium text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-label="Change language"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span className="text-xs font-semibold">
          {localeLabels[currentLocale]}
        </span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.ul
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            role="listbox"
            aria-label="Select language"
            className="absolute right-0 top-full mt-2 w-28 rounded-lg glass-card shadow-elevation-3 overflow-hidden z-50"
          >
            {locales.map((locale) => (
              <li key={locale} role="option" aria-selected={locale === currentLocale}>
                <button
                  onClick={() => selectLocale(locale)}
                  className={`w-full px-3 py-2 text-left text-sm transition-colors hover:bg-primary-light dark:hover:bg-primary-light ${
                    locale === currentLocale
                      ? "text-primary font-semibold bg-primary-light/50"
                      : "text-foreground"
                  }`}
                >
                  {localeLabels[locale]}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
