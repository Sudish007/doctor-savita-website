'use client'

import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { useRealtimeQueue } from '@/hooks/useRealtimeQueue'

/**
 * Live Queue Section - Displays real-time clinic queue status.
 * "Take Token" links to /token page (single source, no duplicates).
 */

export function LiveQueue() {
  const t = useTranslations('queue')
  const {
    currentToken,
    waitingCount,
    estimatedWaitMinutes,
    isClinicOpen,
    isConnected,
  } = useRealtimeQueue()

  const prefersReducedMotion = useReducedMotion()

  return (
    <section id="live-queue" className="py-section" aria-label={t('title')}>
      <div className="container-content max-w-4xl mx-auto">
        <motion.h2
          className="text-fluid-h3 font-heading font-bold text-foreground text-center mb-8"
          initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {t('title')}
        </motion.h2>

        <motion.div
          className={`relative overflow-hidden rounded-2xl p-8 md:p-10 backdrop-blur-[16px] border shadow-[var(--glass-shadow)] transition-colors duration-300 ${
            isClinicOpen ? 'bg-[var(--glass-bg)] border-[var(--glass-border)]' : 'bg-muted/60 border-border-light'
          }`}
          initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Connection indicator */}
          <div className="absolute top-4 right-4 flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-500' : 'bg-red-400 animate-pulse'}`} />
            <span className="text-caption text-foreground-muted">{isConnected ? 'Live' : 'Reconnecting…'}</span>
          </div>

          {isClinicOpen ? (
            <div className="text-center space-y-6">
              {/* Open status */}
              <div className="flex items-center justify-center gap-2">
                <span className="relative flex h-3 w-3">
                  {!prefersReducedMotion && <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />}
                  <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500" />
                </span>
                <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">{t('clinicOpen')}</span>
              </div>

              {/* Now Serving */}
              <div>
                <p className="text-foreground-muted text-sm font-medium uppercase tracking-wide mb-1">{t('nowServing')}</p>
                <AnimatePresence mode="wait">
                  <motion.p
                    key={currentToken}
                    className="text-5xl md:text-6xl font-heading font-bold text-primary"
                    initial={{ opacity: 0, y: -10, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.9 }}
                    transition={{ duration: 0.35 }}
                  >
                    {t('token')} #{currentToken}
                  </motion.p>
                </AnimatePresence>
              </div>

              {/* Stats */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10 pt-2">
                <div className="text-center">
                  <p className="text-foreground-muted text-xs font-medium uppercase tracking-wide mb-0.5">{t('waiting')}</p>
                  <p className="text-2xl md:text-3xl font-bold text-foreground">{waitingCount}</p>
                </div>
                <div className="hidden sm:block w-px h-10 bg-border" />
                <div className="text-center">
                  <p className="text-foreground-muted text-xs font-medium uppercase tracking-wide mb-0.5">{t('estimatedWait')}</p>
                  <p className="text-2xl md:text-3xl font-bold text-foreground">~{estimatedWaitMinutes} {t('minutes')}</p>
                </div>
              </div>

              {/* Take Token CTA */}
              <div className="pt-6 border-t border-border-light mt-4">
                <a
                  href="/token"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-base bg-primary text-primary-foreground hover:bg-primary-hover shadow-elevation-2 hover:shadow-elevation-3 transition-all touch-target"
                >
                  🎟️ {t('takeToken')}
                </a>
                <p className="text-xs text-foreground-muted mt-2">{t('joinQueue')}</p>
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <div className="flex items-center justify-center gap-2 mb-4">
                <span className="w-3 h-3 rounded-full bg-gray-400" />
                <span className="text-sm font-medium text-foreground-muted">{t('clinicClosed')}</span>
              </div>
              <p className="text-3xl md:text-4xl font-heading font-bold text-foreground-muted/60">{t('clinicClosed')}</p>
              <p className="mt-3 text-sm text-foreground-muted">{t('operatingHours')}</p>

              <div className="pt-6 border-t border-border-light mt-6">
                <a
                  href="/token"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-base bg-primary text-primary-foreground hover:bg-primary-hover shadow-elevation-2 hover:shadow-elevation-3 transition-all touch-target"
                >
                  🎟️ {t('takeToken')}
                </a>
                <p className="text-xs text-foreground-muted mt-2">{t('reserveSpot')}</p>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  )
}
