"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";

/**
 * About Section - Dr. Savita Kumari's biography, treatment principles,
 * profile photo, and statistics bento grid with animated counters.
 *
 * Layout:
 * - Desktop (md+): Photo left, text right in a 2-column grid
 * - Mobile: Photo top, text below (stacked)
 * - Statistics Bento Grid below the bio
 *
 * Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 17.6, 21.1, 21.2, 21.3, 21.4, 21.5
 */

// Icons for statistics counters
function ClockIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function PeopleIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  );
}

function ChartIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  );
}

// Stagger animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut" as const,
    },
  },
};

export function About() {
  const t = useTranslations('about');
  const [imageError, setImageError] = useState(false);

  return (
    <section
      id="about"
      className="section-padding nature-overlay"
      aria-labelledby="about-heading"
    >
      <div className="container-content">
        {/* Section Title */}
        <motion.h2
          id="about-heading"
          className="text-fluid-h2 font-heading text-center mb-6 md:mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
        >
          {t('title')}
        </motion.h2>

        {/* Main Content Grid: Photo + Bio */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-start mb-8 md:mb-10"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {/* Photo - Premium Doctor Badge Style */}
          <motion.div variants={itemVariants} className="flex justify-center">
            <div className="relative">
              {/* Outer glow ring */}
              <div className="absolute -inset-2 bg-gradient-to-br from-primary/30 via-emerald-200/40 to-teal-300/30 rounded-3xl blur-sm"></div>
              {/* Photo container */}
              <div className="relative w-72 h-96 rounded-2xl overflow-hidden border-4 border-white dark:border-gray-700 shadow-xl bg-gray-100 dark:bg-gray-800">
                {!imageError ? (
                  <Image
                    src="/images/dr-savita-profile.jpg"
                    alt="Dr. Savita Kumari"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover object-top"
                    priority={false}
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-primary-light dark:bg-primary-light/20" aria-label="Dr. Savita Kumari - photo placeholder">
                    <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-primary/40">
                      <circle cx="12" cy="8" r="4" /><path d="M20 21a8 8 0 0 0-16 0" />
                    </svg>
                  </div>
                )}
              </div>
              {/* Badge label */}
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-primary text-primary-foreground text-xs font-bold rounded-full shadow-lg whitespace-nowrap">
                Medical Officer | Govt. of Bihar
              </div>
            </div>
          </motion.div>

          {/* Biography Text - Right on desktop, below on mobile */}
          <motion.div variants={itemVariants} className="space-y-5">
            {/* Biography */}
            <div className="space-y-4">
              <p className="text-foreground-secondary leading-relaxed text-lg">
                {t('bioParagraph1')}
              </p>
              {t('bioParagraph2') && (
                <div className="grid grid-cols-3 gap-3 pt-2">
                  <div className="text-center p-3 rounded-xl bg-primary/5 border border-primary/10">
                    <span className="text-2xl mb-1 block">🌱</span>
                    <p className="text-xs font-medium text-foreground">Root Cause Focus</p>
                  </div>
                  <div className="text-center p-3 rounded-xl bg-primary/5 border border-primary/10">
                    <span className="text-2xl mb-1 block">🎯</span>
                    <p className="text-xs font-medium text-foreground">Personalized Care</p>
                  </div>
                  <div className="text-center p-3 rounded-xl bg-primary/5 border border-primary/10">
                    <span className="text-2xl mb-1 block">💚</span>
                    <p className="text-xs font-medium text-foreground">No Side Effects</p>
                  </div>
                </div>
              )}
            </div>

            {/* Treatment Principles - integrated into quote above */}

            {/* Quote */}
            <blockquote className="border-l-4 border-primary pl-4 py-2 bg-primary/5 rounded-r-lg">
              <p className="text-foreground-secondary leading-relaxed italic text-sm">
                &ldquo;{t('bioParagraph2')}&rdquo;
              </p>
            </blockquote>
          </motion.div>
        </motion.div>

        {/* Statistics Bento Grid */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          <motion.div variants={itemVariants}>
            <AnimatedCounter
              target={3}
              suffix="+"
              label={t('yearsExperience')}
              icon={<ClockIcon />}
            />
          </motion.div>
          <motion.div variants={itemVariants}>
            <AnimatedCounter
              target={1000}
              suffix="+"
              label={t('patientsTreated')}
              icon={<PeopleIcon />}
            />
          </motion.div>
          <motion.div variants={itemVariants}>
            <AnimatedCounter
              target={7}
              label={t('specializations')}
              icon={<HeartIcon />}
            />
          </motion.div>
          <motion.div variants={itemVariants}>
            <AnimatedCounter
              target={95}
              suffix="%"
              label={t('successRate')}
              icon={<ChartIcon />}
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
