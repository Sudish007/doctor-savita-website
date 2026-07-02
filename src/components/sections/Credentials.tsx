"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";

/**
 * Credentials Section - Vertical animated timeline displaying qualifications.
 *
 * Displays educational qualifications and professional positions in chronological
 * order (earliest to most recent) with a progressive draw-in animation.
 *
 * - Center timeline on desktop (items alternate left/right)
 * - Left-aligned timeline on mobile
 * - Green-filled circle nodes for degrees, gold/amber-filled for positions
 * - Glassmorphism cards for each entry
 * - Respects prefers-reduced-motion
 *
 * Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 15.8
 */

interface CredentialItem {
  id: string;
  title: string;
  institution: string;
  year: string;
  type: "degree" | "position";
  description?: string;
}

const CREDENTIALS: CredentialItem[] = [
  {
    id: "bhms",
    title: "BHMS (Bachelor of Homeopathic Medicine and Surgery)",
    institution: "Rameshwar Das Kedia Homoeopathic College",
    year: "",
    type: "degree",
    description:
      "Comprehensive training in homeopathic medicine, pharmacology, and clinical practice.",
  },
  {
    id: "medical-officer",
    title: "Medical Officer",
    institution: "AYUSH Department, Government of Bihar",
    year: "Present",
    type: "position",
    description:
      "Serving at Primary Health Centre, Khujhwa, Siwan, Bihar — providing homeopathic care to the community.",
  },
];

/** Graduation cap icon for degree entries */
function GraduationCapIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c0 1.1 2.7 3 6 3s6-1.9 6-3v-5" />
    </svg>
  );
}

/** Briefcase/badge icon for position entries */
function BriefcaseIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  );
}

/** Single timeline item component */
function TimelineItem({
  item,
  index,
  isLast,
}: {
  item: CredentialItem;
  index: number;
  isLast: boolean;
}) {
  const itemRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(itemRef, { once: true, margin: "-50px" });
  const prefersReducedMotion = useReducedMotion();

  const isLeft = index % 2 === 0; // Alternating sides on desktop

  const itemVariants = {
    hidden: {
      opacity: 0,
      x: prefersReducedMotion ? 0 : isLeft ? -40 : 40,
      y: prefersReducedMotion ? 0 : 20,
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 200,
        damping: 25,
        delay: prefersReducedMotion ? 0 : index * 0.2,
      },
    },
  };

  const nodeColor =
    item.type === "degree"
      ? "bg-emerald-500 dark:bg-emerald-400 border-emerald-300 dark:border-emerald-600"
      : "bg-amber-500 dark:bg-amber-400 border-amber-300 dark:border-amber-600";

  const nodeGlow =
    item.type === "degree"
      ? "shadow-[0_0_12px_rgba(16,185,129,0.4)]"
      : "shadow-[0_0_12px_rgba(245,158,11,0.4)]";

  return (
    <div
      ref={itemRef}
      className={`relative flex items-start w-full ${
        /* Desktop: alternate sides. Mobile: always left-aligned layout */
        isLeft
          ? "md:flex-row-reverse md:text-right"
          : "md:flex-row md:text-left"
      }`}
    >
      {/* Year marker + Node (center column on desktop, left on mobile) */}
      <div className="absolute left-4 md:left-1/2 md:-translate-x-1/2 flex flex-col items-center z-10">
        {/* Timeline node circle */}
        <motion.div
          initial={{ scale: 0 }}
          animate={isInView ? { scale: 1 } : { scale: 0 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
            delay: prefersReducedMotion ? 0 : index * 0.2 + 0.1,
          }}
          className={`w-5 h-5 rounded-full border-[3px] ${nodeColor} ${nodeGlow}`}
        />
      </div>

      {/* Card content */}
      <motion.div
        variants={itemVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className={`w-full pl-12 md:pl-0 md:w-[calc(50%-2rem)] ${
          isLeft ? "md:mr-auto md:pr-8" : "md:ml-auto md:pl-8"
        }`}
      >
        <div className="glass-card p-5 md:p-6 rounded-2xl hover:shadow-elevation-3 transition-shadow duration-300">
          {/* Year badge */}
          {item.year && (
            <span
              className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-3 ${
                item.type === "degree"
                  ? "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300"
                  : "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300"
              }`}
            >
              {item.year}
            </span>
          )}

          {/* Icon + Title */}
          <div
            className={`flex items-start gap-3 mb-2 ${
              isLeft ? "md:flex-row-reverse" : ""
            }`}
          >
            <div
              className={`flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center ${
                item.type === "degree"
                  ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400"
                  : "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400"
              }`}
            >
              {item.type === "degree" ? (
                <GraduationCapIcon className="w-5 h-5" />
              ) : (
                <BriefcaseIcon className="w-5 h-5" />
              )}
            </div>

            <div className="flex-1">
              <h3 className="text-base md:text-lg font-heading font-semibold text-foreground leading-tight">
                {item.title}
              </h3>
            </div>
          </div>

          {/* Institution */}
          <p className="text-sm text-foreground-secondary font-medium mt-1">
            {item.institution}
          </p>

          {/* Description */}
          {item.description && (
            <p className="text-sm text-foreground-muted mt-2 leading-relaxed">
              {item.description}
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export function Credentials() {
  const t = useTranslations('credentials');
  const sectionRef = useRef<HTMLElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const prefersReducedMotion = useReducedMotion();

  return (
    <section
      id="credentials"
      ref={sectionRef}
      className="section-padding nature-overlay"
      aria-labelledby="credentials-title"
    >
      <div className="container-content">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{
            duration: prefersReducedMotion ? 0 : 0.6,
            ease: "easeOut",
          }}
          className="text-center mb-12 md:mb-16"
        >
          <h2
            id="credentials-title"
            className="text-fluid-h2 font-heading text-foreground mb-4"
          >
            {t('title')}
          </h2>
          <p className="text-foreground-secondary max-w-2xl mx-auto text-fluid-body-sm">
            A journey of dedication to homeopathic medicine and community
            healthcare.
          </p>
        </motion.div>

        {/* Timeline container */}
        <div className="relative mx-auto">
          {/* Center line (desktop) / Left line (mobile) */}
          <motion.div
            ref={lineRef}
            initial={{ scaleY: 0 }}
            animate={isInView ? { scaleY: 1 } : { scaleY: 0 }}
            transition={{
              duration: prefersReducedMotion ? 0 : 1.2,
              ease: "easeInOut",
              delay: prefersReducedMotion ? 0 : 0.1,
            }}
            className="absolute left-[1.35rem] md:left-1/2 md:-translate-x-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-emerald-400 via-primary to-amber-400 dark:from-emerald-500 dark:via-sage-400 dark:to-amber-500 origin-top rounded-full"
            aria-hidden="true"
          />

          {/* Timeline items */}
          <div className="flex flex-col gap-10 md:gap-14">
            {CREDENTIALS.map((item, index) => (
              <TimelineItem
                key={item.id}
                item={item}
                index={index}
                isLast={index === CREDENTIALS.length - 1}
              />
            ))}
          </div>
        </div>

        {/* Legend */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{
            duration: prefersReducedMotion ? 0 : 0.5,
            delay: prefersReducedMotion ? 0 : 0.8,
          }}
          className="flex items-center justify-center gap-6 mt-10 text-sm text-foreground-muted"
          aria-label="Timeline legend"
        >
          <span className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500 dark:bg-emerald-400" />
            Education
          </span>
          <span className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-amber-500 dark:bg-amber-400" />
            Position
          </span>
        </motion.div>
      </div>
    </section>
  );
}
