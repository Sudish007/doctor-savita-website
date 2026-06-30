"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  getSeasonalAlert,
  SEASONAL_ALERT_STORAGE_KEY,
} from "@/lib/utils/seasonal";

/**
 * Seasonal Health Alert Banner
 *
 * Displays a dismissible, animated banner with season-appropriate health tips
 * positioned below the Navigation_Bar.
 *
 * Features:
 * - Month-based alert selection with priority logic for overlapping seasons
 * - Dismissible via X button with sessionStorage persistence
 * - Animated slide-down entrance using Framer Motion
 * - Green_Theme accent colors with seasonal icon
 * - Links to a relevant blog category or service
 *
 * Requirements: 32.1, 32.2, 32.3, 32.4, 32.5
 */

export function SeasonalAlert() {
  const [isDismissed, setIsDismissed] = useState(true); // Start hidden to avoid flash
  const [mounted, setMounted] = useState(false);
  const [customAlert, setCustomAlert] = useState<{ title: string; description: string; icon: string; link?: string } | null>(null);
  const prefersReducedMotion = useReducedMotion();

  const currentMonth = new Date().getMonth() + 1; // 1-based
  const defaultAlert = getSeasonalAlert(currentMonth);
  const alert = customAlert || defaultAlert;

  useEffect(() => {
    setMounted(true);
    // Check sessionStorage for dismissed state
    try {
      const dismissed = sessionStorage.getItem(SEASONAL_ALERT_STORAGE_KEY);
      setIsDismissed(dismissed === "true");
    } catch {
      setIsDismissed(false);
    }

    // Try to fetch custom alert from Supabase
    fetchCustomAlert();
  }, []);

  async function fetchCustomAlert() {
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
      if (!supabaseUrl || !supabaseKey) return;

      const { createClient } = await import('@supabase/supabase-js');
      const sb = createClient(supabaseUrl, supabaseKey);

      const { data } = await sb
        .from('site_settings')
        .select('value')
        .eq('key', 'seasonal_alert')
        .single();

      if (data?.value) {
        const parsed = typeof data.value === 'string' ? JSON.parse(data.value) : data.value;
        if (parsed.title && parsed.active !== false) {
          setCustomAlert(parsed);
        }
      }
    } catch {
      // Silently fall back to default seasonal alert
    }
  }

  const handleDismiss = () => {
    setIsDismissed(true);
    try {
      sessionStorage.setItem(SEASONAL_ALERT_STORAGE_KEY, "true");
    } catch {
      // Silently fail if sessionStorage is unavailable
    }
  };

  // Don't render anything until mounted (avoids hydration mismatch)
  if (!mounted) return null;

  return (
    <AnimatePresence>
      {!isDismissed && (
        <motion.div
          role="alert"
          aria-label={`Seasonal health alert: ${alert.title}`}
          className="relative overflow-hidden border-b border-border-light"
          style={{
            background: "var(--accent-light)",
          }}
          initial={
            prefersReducedMotion
              ? { opacity: 0 }
              : { height: 0, opacity: 0, y: -10 }
          }
          animate={
            prefersReducedMotion
              ? { opacity: 1 }
              : { height: "auto", opacity: 1, y: 0 }
          }
          exit={
            prefersReducedMotion
              ? { opacity: 0 }
              : { height: 0, opacity: 0, y: -10 }
          }
          transition={{
            duration: 0.4,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <div className="container-content py-3 md:py-4">
            <div className="flex items-center justify-between gap-3">
              {/* Icon + Content */}
              <div className="flex items-start sm:items-center gap-3 flex-1 min-w-0">
                {/* Seasonal Icon */}
                <span
                  className="text-2xl md:text-3xl flex-shrink-0"
                  role="img"
                  aria-hidden="true"
                >
                  {alert.icon}
                </span>

                {/* Text content */}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm md:text-base text-accent-foreground leading-snug">
                    <span className="font-semibold">{alert.title}</span>
                    <span className="hidden sm:inline"> — </span>
                    <span className="hidden sm:inline text-foreground-secondary">
                      {alert.body}
                    </span>
                  </p>
                  {/* Body visible on mobile as separate line */}
                  <p className="sm:hidden text-xs text-foreground-muted mt-0.5 line-clamp-2">
                    {alert.body}
                  </p>
                </div>
              </div>

              {/* Action link + Dismiss button */}
              <div className="flex items-center gap-2 flex-shrink-0">
                {/* Link to related content */}
                <a
                  href={alert.link.href}
                  className="hidden md:inline-flex items-center gap-1 px-3 py-1.5 rounded-lg
                    text-xs font-medium
                    bg-primary/10 hover:bg-primary/20 text-primary
                    transition-colors duration-200
                    focus-visible:outline-2 focus-visible:outline-primary"
                >
                  {alert.link.label}
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
                    aria-hidden="true"
                  >
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </a>

                {/* Dismiss X button */}
                <button
                  onClick={handleDismiss}
                  className="p-1.5 rounded-lg
                    text-foreground-muted hover:text-foreground
                    hover:bg-primary/10
                    transition-colors duration-200
                    touch-target flex items-center justify-center
                    focus-visible:outline-2 focus-visible:outline-primary"
                  aria-label="Dismiss seasonal health alert"
                  type="button"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M18 6 6 18" />
                    <path d="m6 6 12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
