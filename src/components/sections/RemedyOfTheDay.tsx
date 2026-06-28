"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  getRemedyOfTheDay,
  getSourceIcon,
  DEFAULT_REMEDIES,
} from "@/lib/utils/remedy-rotation";

/**
 * Remedy of the Day — Daily rotating homeopathic remedy widget.
 *
 * Features:
 * - Deterministic daily rotation at midnight IST (no repeat within 100-day window)
 * - Glassmorphism card with shimmer border animation
 * - Animated entrance: fade + scale-up on whileInView
 * - "Learn More" expansion for additional details
 * - "Share on WhatsApp" button with pre-formatted message
 *
 * Requirements: 28.1, 28.2, 28.3, 28.4, 28.5
 */

export function RemedyOfTheDay() {
  const [isExpanded, setIsExpanded] = useState(false);
  const remedy = getRemedyOfTheDay(new Date(), DEFAULT_REMEDIES);
  const sourceIcon = getSourceIcon(remedy.source);

  const shareMessage = encodeURIComponent(
    `🌿 *Remedy of the Day*\n\n` +
      `💊 *${remedy.name}*\n` +
      `${sourceIcon} Source: ${remedy.source.charAt(0).toUpperCase() + remedy.source.slice(1)}\n\n` +
      `📋 *Primary Use:* ${remedy.primaryUse}\n\n` +
      `💡 *Fun Fact:* ${remedy.funFact}\n\n` +
      `— Dr. Savita Kumari\n` +
      `🌐 Visit: drsavitakumari.com`
  );

  const whatsappUrl = `https://wa.me/?text=${shareMessage}`;

  return (
    <section
      id="remedy-of-the-day"
      className="section-padding"
      aria-labelledby="remedy-heading"
    >
      <div className="container-content flex justify-center">
        <motion.div
          className="relative w-full max-w-lg"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{
            duration: 0.6,
            type: "spring",
            stiffness: 200,
            damping: 25,
          }}
        >
          {/* Shimmer border wrapper */}
          <div className="absolute -inset-[1px] rounded-3xl shimmer-border" />

          {/* Glassmorphism card */}
          <div
            className="relative rounded-3xl p-6 md:p-8"
            style={{
              background: "var(--glass-bg)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              border: "1px solid var(--glass-border)",
              boxShadow: "var(--glass-shadow)",
            }}
          >
            {/* Header with icon and title */}
            <div className="flex items-center gap-3 mb-4">
              <span
                className="text-3xl"
                role="img"
                aria-label={`${remedy.source} source`}
              >
                {sourceIcon}
              </span>
              <div>
                <p className="text-xs uppercase tracking-wide text-foreground-muted font-medium">
                  Remedy of the Day
                </p>
                <h3
                  id="remedy-heading"
                  className="text-fluid-h4 font-heading text-foreground"
                >
                  {remedy.name}
                </h3>
              </div>
            </div>

            {/* Primary Use */}
            <div className="mb-4">
              <h4 className="text-sm font-medium text-foreground-muted mb-1">
                Primary Use
              </h4>
              <p className="text-foreground-secondary leading-relaxed">
                {remedy.primaryUse}
              </p>
            </div>

            {/* Fun Fact */}
            <div className="mb-6 p-3 rounded-xl bg-accent-light/50 dark:bg-accent-light/10 border border-accent/10">
              <p className="text-sm text-foreground-secondary">
                <span className="font-medium text-accent">💡 Fun Fact:</span>{" "}
                {remedy.funFact}
              </p>
            </div>

            {/* Expanded content */}
            <AnimatePresence>
              {isExpanded && remedy.applications && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden mb-6"
                >
                  <div className="pt-4 border-t border-border-light">
                    <h4 className="text-sm font-medium text-foreground-muted mb-2">
                      Additional Applications
                    </h4>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {remedy.applications.map((app) => (
                        <li
                          key={app}
                          className="flex items-center gap-2 text-sm text-foreground-secondary"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
                          {app}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-3 pt-3 border-t border-border-light">
                    <p className="text-xs text-foreground-muted">
                      <span className="font-medium">Source:</span>{" "}
                      {remedy.source.charAt(0).toUpperCase() + remedy.source.slice(1)}-based remedy
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Learn More button */}
              {remedy.applications && remedy.applications.length > 0 && (
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium
                    bg-primary-light dark:bg-primary-light/20
                    text-primary hover:bg-primary/10
                    dark:text-primary dark:hover:bg-primary/20
                    transition-colors duration-200 touch-target
                    focus-visible:outline-2 focus-visible:outline-primary"
                  aria-expanded={isExpanded}
                  aria-controls="remedy-details"
                >
                  {isExpanded ? "Show Less" : "Learn More"}
                </button>
              )}

              {/* Share on WhatsApp button */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium
                  bg-[#25D366] hover:bg-[#20BD5A] text-white
                  transition-colors duration-200 touch-target
                  focus-visible:outline-2 focus-visible:outline-[#25D366]"
                aria-label="Share this remedy on WhatsApp"
              >
                <WhatsAppIcon />
                Share on WhatsApp
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/** WhatsApp brand icon (inline SVG) */
function WhatsAppIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}
