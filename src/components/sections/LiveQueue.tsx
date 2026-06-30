'use client'

import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'

import { useRealtimeQueue } from '@/hooks/useRealtimeQueue'

/**
 * Live Queue Section - Displays real-time clinic queue status.
 * Token booking is handled exclusively on /token page to avoid duplicates.
 *
 * Features:
 * - "Now Serving: Token #X" with large prominent number
 * - "Patients Waiting: Y"
 * - "Estimated Wait: ~N minutes"
 * - Link to /token page for taking a token
 * - "Clinic Closed" grey/inactive state outside operating hours
 * - Green pulsing dot when clinic is open
 *
 * Requirements: 30.1, 30.3, 30.4, 30.5
 */

export function LiveQueue() {
  const {
    currentToken,
    waitingCount,
    estimatedWaitMinutes,
    isClinicOpen,
    isConnected,
  } = useRealtimeQueue()

  const prefersReducedMotion = useReducedMotion()

  return (
    <section
      id="live-queue"
      className="py-section"
      aria-label="Live queue status"
    >
      <div className="container-content max-w-2xl mx-auto">
        {/* Section heading */}
        <motion.h2
          className="text-fluid-h3 font-heading font-bold text-foreground text-center mb-8"
          initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Live Queue Status
        </motion.h2>

        {/* Glassmorphism card */}
        <motion.div
          className={`
            relative overflow-hidden rounded-2xl p-8 md:p-10
            backdrop-blur-[16px] border
            shadow-[var(--glass-shadow)]
            transition-colors duration-300
            ${isClinicOpen
              ? 'bg-[var(--glass-bg)] border-[var(--glass-border)]'
              : 'bg-muted/60 border-border-light'
            }
          `}
          initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Connection status indicator */}
          <div className="absolute top-4 right-4 flex items-center gap-1.5" aria-live="polite">
            <span
              className={`w-2 h-2 rounded-full ${
                isConnected ? 'bg-emerald-500' : 'bg-red-400 animate-pulse'
              }`}
              aria-hidden="true"
            />
            <span className="text-caption text-foreground-muted">
              {isConnected ? 'Live' : 'Reconnecting…'}
            </span>
          </div>

          {/* Clinic open/closed state */}
          {isClinicOpen ? (
            <div className="text-center space-y-6">
              {/* Open status with pulsing green dot */}
              <div className="flex items-center justify-center gap-2">
                <span className="relative flex h-3 w-3" aria-hidden="true">
                  {!prefersReducedMotion && (
                    <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
                  )}
                  <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500" />
                </span>
                <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                  Clinic Open
                </span>
              </div>

              {/* Now Serving */}
              <div>
                <p className="text-foreground-muted text-sm font-medium uppercase tracking-wide mb-1">
                  Now Serving
                </p>
                <AnimatePresence mode="wait">
                  <motion.p
                    key={currentToken}
                    className="text-5xl md:text-6xl font-heading font-bold text-primary"
                    initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: -10, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 10, scale: 0.9 }}
                    transition={{ duration: 0.35 }}
                    aria-live="polite"
                  >
                    Token #{currentToken}
                  </motion.p>
                </AnimatePresence>
              </div>

              {/* Stats row */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10 pt-2">
                <div className="text-center">
                  <p className="text-foreground-muted text-xs font-medium uppercase tracking-wide mb-0.5">Patients Waiting</p>
                  <p className="text-2xl md:text-3xl font-bold text-foreground">{waitingCount}</p>
                </div>
                <div className="hidden sm:block w-px h-10 bg-border" aria-hidden="true" />
                <div className="text-center">
                  <p className="text-foreground-muted text-xs font-medium uppercase tracking-wide mb-0.5">Estimated Wait</p>
                  <p className="text-2xl md:text-3xl font-bold text-foreground">~{estimatedWaitMinutes} min</p>
                </div>
              </div>

              {/* Take Token CTA - links to /token page */}
              <div className="pt-6 border-t border-border-light mt-4">
                <a
                  href="/token"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-base bg-primary text-primary-foreground hover:bg-primary-hover shadow-elevation-2 hover:shadow-elevation-3 transition-all touch-target"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 5v2" /><path d="M15 11v2" /><path d="M15 17v2" />
                    <path d="M5 5h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z" />
                  </svg>
                  Take Token
                </a>
                <p className="text-xs text-foreground-muted mt-2">Join the queue from home</p>
              </div>
            </div>
          ) : (
            /* Clinic Closed state */
            <div className="text-center py-4">
              <div className="flex items-center justify-center gap-2 mb-4">
                <span className="w-3 h-3 rounded-full bg-gray-400 dark:bg-gray-500" aria-hidden="true" />
                <span className="text-sm font-medium text-foreground-muted">Clinic Closed</span>
              </div>

              <p className="text-3xl md:text-4xl font-heading font-bold text-foreground-muted/60">
                Clinic Closed
              </p>
              <p className="mt-3 text-sm text-foreground-muted">
                Operating hours: Mon–Sat, 9:00 AM – 6:00 PM IST
              </p>

              {/* Take Token for next session */}
              <div className="pt-6 border-t border-border-light mt-6">
                <a
                  href="/token"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-base bg-primary text-primary-foreground hover:bg-primary-hover shadow-elevation-2 hover:shadow-elevation-3 transition-all touch-target"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 5v2" /><path d="M15 11v2" /><path d="M15 17v2" />
                    <path d="M5 5h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z" />
                  </svg>
                  Take Token
                </a>
                <p className="text-xs text-foreground-muted mt-2">Reserve your spot for the next session</p>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  )
}
