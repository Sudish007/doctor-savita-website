"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { BentoGrid, BentoGridItem } from "@/components/ui/BentoGrid";

/**
 * Services & Treatments Bento Grid section.
 * - 7 service cards with inline SVG icons
 * - Asymmetric grid layout with varied tile sizes
 * - Glassmorphism card styling
 * - Expandable cards showing treatment approach on click
 * - Staggered whileInView entrance animations (100ms delay)
 * - Hover: scale 1.02x, shadow elevation, green border glow
 * - AYUSH-approved protocols note
 * - In-person and online consultation info
 *
 * Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 17.1, 17.2, 17.3, 17.4, 17.5
 */

interface ServiceData {
  id: string;
  titleKey: string;
  descriptionKey: string;
  treatmentApproachKey: string;
  icon: React.ReactNode;
  colSpan: 1 | 2;
  rowSpan: 1 | 2;
}

// --- Inline SVG Icons ---

const HeartbeatIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="32"
    height="32"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M3 12h4l3-9 4 18 3-9h4" />
  </svg>
);

const ShieldIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="32"
    height="32"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="M9 12l2 2 4-4" />
  </svg>
);

const StomachIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="32"
    height="32"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M6 6c0-2 2-4 5-4s5 2 5 4c0 3-2 5-2 8s1 4 1 6c0 2-2 4-5 4s-4-2-4-4c0-2 1-3 1-6S6 9 6 6z" />
  </svg>
);

const LungsIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="32"
    height="32"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M12 4v8" />
    <path d="M12 12c-3 0-5 2-5 5s1 5 4 5c2 0 1-2 1-5" />
    <path d="M12 12c3 0 5 2 5 5s-1 5-4 5c-2 0-1-2-1-5" />
    <path d="M10 8H8c-1 0-2 .5-2 2" />
    <path d="M14 8h2c1 0 2 .5 2 2" />
  </svg>
);

const FemaleIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="32"
    height="32"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <circle cx="12" cy="8" r="5" />
    <path d="M12 13v8" />
    <path d="M9 18h6" />
  </svg>
);

const BabyIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="32"
    height="32"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="8" />
    <path d="M9 10h.01" />
    <path d="M15 10h.01" />
    <path d="M9.5 15a3.5 3.5 0 0 0 5 0" />
    <path d="M12 4c-1-2 1-3 2-2" />
  </svg>
);

const BrainIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="32"
    height="32"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M12 4.5a4.5 4.5 0 0 0-4.5 4.5c0 1.5.5 2.5 1.5 3.5L12 16l3-3.5c1-1 1.5-2 1.5-3.5A4.5 4.5 0 0 0 12 4.5z" />
    <path d="M12 16v5" />
    <path d="M8 9c-2 0-3 1-3 3s2 3 3 3" />
    <path d="M16 9c2 0 3 1 3 3s-2 3-3 3" />
  </svg>
);

// --- Service Data ---

const SERVICES: ServiceData[] = [
  {
    id: "chronic-diseases",
    titleKey: "chronicDiseasesTitle",
    descriptionKey: "chronicDiseasesDesc",
    treatmentApproachKey: "chronicDiseasesApproach",
    icon: <HeartbeatIcon />,
    colSpan: 2,
    rowSpan: 1,
  },
  {
    id: "skin-disorders",
    titleKey: "skinDisordersTitle",
    descriptionKey: "skinDisordersDesc",
    treatmentApproachKey: "skinDisordersApproach",
    icon: <ShieldIcon />,
    colSpan: 1,
    rowSpan: 1,
  },
  {
    id: "digestive-issues",
    titleKey: "digestiveIssuesTitle",
    descriptionKey: "digestiveIssuesDesc",
    treatmentApproachKey: "digestiveIssuesApproach",
    icon: <StomachIcon />,
    colSpan: 1,
    rowSpan: 1,
  },
  {
    id: "respiratory-ailments",
    titleKey: "respiratoryAilmentsTitle",
    descriptionKey: "respiratoryAilmentsDesc",
    treatmentApproachKey: "respiratoryAilmentsApproach",
    icon: <LungsIcon />,
    colSpan: 1,
    rowSpan: 2,
  },
  {
    id: "womens-health",
    titleKey: "womensHealthTitle",
    descriptionKey: "womensHealthDesc",
    treatmentApproachKey: "womensHealthApproach",
    icon: <FemaleIcon />,
    colSpan: 1,
    rowSpan: 1,
  },
  {
    id: "child-health",
    titleKey: "childHealthTitle",
    descriptionKey: "childHealthDesc",
    treatmentApproachKey: "childHealthApproach",
    icon: <BabyIcon />,
    colSpan: 1,
    rowSpan: 1,
  },
  {
    id: "mental-wellness",
    titleKey: "mentalWellnessTitle",
    descriptionKey: "mentalWellnessDesc",
    treatmentApproachKey: "mentalWellnessApproach",
    icon: <BrainIcon />,
    colSpan: 1,
    rowSpan: 1,
  },
];

export function Services() {
  const t = useTranslations('services');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const prefersReducedMotion = useReducedMotion();

  const toggleCard = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: prefersReducedMotion ? 0 : i * 0.1,
        duration: prefersReducedMotion ? 0 : 0.5,
        ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
      },
    }),
  };

  const expandVariants = {
    hidden: { height: 0, opacity: 0 },
    visible: {
      height: "auto",
      opacity: 1,
      transition: { duration: 0.3, ease: "easeOut" as const },
    },
    exit: {
      height: 0,
      opacity: 0,
      transition: { duration: 0.2, ease: "easeIn" as const },
    },
  };

  return (
    <section
      id="services"
      className="section-padding nature-overlay"
      aria-labelledby="services-heading"
    >
      <div className="container-content">
        {/* Section Header */}
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10 md:mb-14"
        >
          <h2
            id="services-heading"
            className="text-fluid-h2 text-foreground mb-4"
          >
            {t('title')}
          </h2>
          <p className="text-foreground-secondary max-w-2xl mx-auto text-fluid-body">
            {t('subtitle')}
          </p>
        </motion.div>

        {/* Bento Grid */}
        <BentoGrid>
          {SERVICES.map((service, index) => (
            <BentoGridItem
              key={service.id}
              colSpan={service.colSpan}
              rowSpan={service.rowSpan}
            >
              <motion.div
                custom={index}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-30px" }}
                whileHover={
                  prefersReducedMotion
                    ? {}
                    : {
                        scale: 1.02,
                        boxShadow:
                          "0 10px 15px rgba(0,0,0,0.05), 0 4px 6px rgba(0,0,0,0.04), 0 2px 4px rgba(0,0,0,0.03), 0 1px 2px rgba(0,0,0,0.02)",
                      }
                }
                className={`glass-card p-5 md:p-6 cursor-pointer h-full flex flex-col transition-shadow duration-200 hover:border-primary/40 hover:shadow-glow-green ${
                  expandedId === service.id
                    ? "border-primary/40 shadow-glow-green"
                    : ""
                }`}
                onClick={() => toggleCard(service.id)}
                role="button"
                tabIndex={0}
                aria-expanded={expandedId === service.id}
                aria-controls={`${service.id}-details`}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    toggleCard(service.id);
                  }
                }}
              >
                {/* Icon */}
                <div className="text-primary mb-3 flex-shrink-0">
                  {service.icon}
                </div>

                {/* Title */}
                <h3 className="text-fluid-h5 text-foreground mb-2">
                  {t(service.titleKey)}
                </h3>

                {/* Description */}
                <p className="text-foreground-secondary text-fluid-body-sm leading-relaxed flex-grow">
                  {t(service.descriptionKey)}
                </p>

                {/* Expand indicator */}
                <div className="mt-3 flex items-center gap-1 text-primary text-sm font-medium">
                  <span>
                    {expandedId === service.id
                      ? t('hideDetails')
                      : t('viewApproach')}
                  </span>
                  <motion.svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    animate={{
                      rotate: expandedId === service.id ? 180 : 0,
                    }}
                    transition={{ duration: 0.2 }}
                    aria-hidden="true"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </motion.svg>
                </div>

                {/* Expandable Treatment Approach */}
                <AnimatePresence initial={false}>
                  {expandedId === service.id && (
                    <motion.div
                      id={`${service.id}-details`}
                      variants={expandVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="overflow-hidden"
                    >
                      <div className="pt-3 mt-3 border-t border-border-light">
                        <p className="text-foreground-muted text-fluid-body-sm leading-relaxed">
                          {t(service.treatmentApproachKey)}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </BentoGridItem>
          ))}
        </BentoGrid>

        {/* Footer Notes */}
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-30px" }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-10 md:mt-14 text-center space-y-3"
        >
          <p className="text-foreground-secondary text-fluid-body-sm flex items-center justify-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-primary flex-shrink-0"
              aria-hidden="true"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            <span>
              {t('ayushNote')}
            </span>
          </p>
          <p className="text-foreground-muted text-fluid-caption flex items-center justify-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-accent flex-shrink-0"
              aria-hidden="true"
            >
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span>
              {t('consultationNote')}
            </span>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
