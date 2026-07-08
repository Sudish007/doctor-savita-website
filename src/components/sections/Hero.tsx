'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import { useTranslations } from 'next-intl'

import { AvailabilityBadge } from '@/components/shared/AvailabilityBadge'

/**
 * Hero Section - Primary landing area of the website.
 *
 * Features:
 * - Full-viewport height with gradient background (green-based tones)
 * - Parallax background (50% scroll speed) using Framer Motion
 * - Animated gradient mesh blobs (15-30s cycle)
 * - Doctor name, designation, tagline, photo with fallback silhouette
 * - CTA buttons: "Book Appointment" → #appointment, "Our Services" → #services
 * - Live availability badge via Supabase Realtime
 * - Respects prefers-reduced-motion
 *
 * Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 15.3, 16.4, 26.1, 26.3, 26.4, 26.5
 */

const PHOTO_URL = '/images/dr-savita-hero.jpg'

/** Placeholder silhouette SVG rendered inline as fallback */
function PlaceholderSilhouette() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-sage-100 dark:bg-sage-800 rounded-full">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-1/2 h-1/2 text-sage-400 dark:text-sage-600"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z"
          clipRule="evenodd"
        />
      </svg>
    </div>
  )
}

export function Hero() {
  const t = useTranslations('hero')
  const tButtons = useTranslations('buttons')
  const prefersReducedMotion = useReducedMotion()
  const [imageError, setImageError] = useState(false)

  // Parallax: background moves at 50% scroll speed
  const { scrollY } = useScroll()
  const parallaxY = useTransform(scrollY, [0, 500], [0, -250])

  // Animation variants for staggered entrance
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : 0.15,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: prefersReducedMotion
      ? { opacity: 1, y: 0 }
      : { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1] as const,
      },
    },
  }

  return (
    <section
      id="home"
      className="relative min-h-[85vh] md:min-h-[70vh] lg:min-h-0 lg:py-20 flex items-center overflow-hidden"
      aria-label="Hero section"
    >
      {/* Gradient background with parallax */}
      <motion.div
        className="absolute inset-0 -z-10"
        style={{ y: prefersReducedMotion ? 0 : parallaxY }}
      >
        <div
          className="absolute inset-0"
          style={{ background: 'var(--gradient-hero)' }}
        />

        {/* Nature pattern overlay (Req 11.3) */}
        <div className="absolute inset-0 opacity-[0.08] bg-nature-pattern pointer-events-none" />
      </motion.div>

      {/* Animated gradient mesh blobs (Req 1.6, 16.4: 15-30s cycle) */}
      {!prefersReducedMotion && (
        <div className="absolute inset-0 -z-[5] overflow-hidden pointer-events-none" aria-hidden="true">
          {/* Blob 1 - top left */}
          <motion.div
            className="absolute -top-20 -left-20 w-[400px] h-[400px] rounded-full opacity-30"
            style={{
              background: 'radial-gradient(circle, var(--color-emerald-200) 0%, transparent 70%)',
            }}
            animate={{
              x: [0, 30, -20, 0],
              y: [0, -30, 20, 0],
              scale: [1, 1.05, 0.95, 1],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />

          {/* Blob 2 - center right */}
          <motion.div
            className="absolute top-1/3 -right-10 w-[350px] h-[350px] rounded-full opacity-25"
            style={{
              background: 'radial-gradient(circle, var(--color-mint-200) 0%, transparent 70%)',
            }}
            animate={{
              x: [0, -25, 15, 0],
              y: [0, 20, -25, 0],
              scale: [1, 0.95, 1.05, 1],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />

          {/* Blob 3 - bottom center */}
          <motion.div
            className="absolute -bottom-10 left-1/3 w-[300px] h-[300px] rounded-full opacity-20"
            style={{
              background: 'radial-gradient(circle, var(--color-sage-200) 0%, transparent 70%)',
            }}
            animate={{
              x: [0, 20, -30, 0],
              y: [0, -15, 10, 0],
              scale: [1, 1.03, 0.97, 1],
            }}
            transition={{
              duration: 18,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </div>
      )}

      {/* Main content */}
      <div className="container-content relative z-10 w-full py-16 md:py-0">
        <div className="flex flex-col-reverse lg:flex-row items-center gap-8 lg:gap-12">
          {/* Text content */}
          <motion.div
            className="flex-1 text-center lg:text-left"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Availability badge */}
            <motion.div variants={itemVariants} className="mb-4 flex justify-center lg:justify-start">
              <AvailabilityBadge />
            </motion.div>

            {/* Doctor name */}
            <motion.h1
              variants={itemVariants}
              className="text-fluid-h1 font-heading font-bold text-foreground"
            >
              {t('doctorName')}
            </motion.h1>

            {/* Designation */}
            <motion.p
              variants={itemVariants}
              className="mt-2 text-fluid-h5 text-foreground-secondary font-medium"
            >
              {t('designation')}
            </motion.p>

            {/* Tagline */}
            <motion.p
              variants={itemVariants}
              className="mt-4 text-fluid-body text-foreground-muted max-w-lg mx-auto lg:mx-0"
            >
              {t('tagline')}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={itemVariants}
              className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              {/* Primary CTA - Book Appointment */}
              <a
                href="#appointment"
                className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-base shadow-elevation-2 hover:bg-primary-hover hover:shadow-elevation-3 hover:scale-[1.03] transition-all duration-300 touch-target"
              >
                {tButtons('bookAppointment')}
              </a>

              {/* Secondary CTA - Our Services */}
              <a
                href="#services"
                className="inline-flex items-center justify-center px-6 py-3 rounded-xl border-2 border-primary text-primary font-semibold text-base hover:bg-primary-light hover:scale-[1.03] transition-all duration-300 touch-target"
              >
                {tButtons('ourServices')}
              </a>
            </motion.div>
          </motion.div>

          {/* Doctor photo */}
          <motion.div
            className="flex-shrink-0"
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="relative w-64 h-64 sm:w-72 sm:h-72 md:w-72 md:h-72 lg:w-80 lg:h-80">
              {/* Decorative ring */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-sage-300 to-emerald-300 dark:from-sage-700 dark:to-emerald-700 p-1">
                <div className="w-full h-full rounded-full overflow-hidden bg-background relative">
                  {imageError ? (
                    <PlaceholderSilhouette />
                  ) : (
                    <Image
                      src={PHOTO_URL}
                      alt={t('doctorName')}
                      fill
                      sizes="(max-width: 640px) 224px, (max-width: 768px) 256px, (max-width: 1024px) 288px, 320px"
                      className="object-cover object-top rounded-full"
                      priority
                      onError={() => setImageError(true)}
                    />
                  )}
                </div>
              </div>

              {/* Subtle glow behind photo */}
              {!prefersReducedMotion && (
                <motion.div
                  className="absolute inset-0 -z-10 rounded-full blur-2xl opacity-30"
                  style={{ background: 'var(--gradient-accent)' }}
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                />
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      {!prefersReducedMotion && (
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.5 }}
          aria-hidden="true"
        >
          <motion.div
            className="w-6 h-10 rounded-full border-2 border-foreground-muted/40 flex justify-center"
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <motion.div
              className="w-1.5 h-1.5 mt-2 rounded-full bg-foreground-muted/60"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            />
          </motion.div>
        </motion.div>
      )}
    </section>
  )
}
