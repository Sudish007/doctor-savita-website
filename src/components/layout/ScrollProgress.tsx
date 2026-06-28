"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useScrollProgress } from "@/hooks/useScrollProgress";

/**
 * ScrollProgress — A thin progress bar fixed below the navigation bar.
 * Displays page scroll progress from 0% to 100% width using Framer Motion's
 * scaleX transform for GPU-accelerated, smooth animation.
 *
 * - 3px height, full width, green accent color (var(--primary))
 * - Fixed position below nav (top: 64px)
 * - Hidden on mobile viewports (<768px) using Tailwind responsive classes
 * - Respects prefers-reduced-motion (no spring animation, instant update)
 * - Z-index 40 (above content, below fixed modals/overlays)
 *
 * Requirements: 20.1, 20.4
 */
export default function ScrollProgress() {
  const progress = useScrollProgress();
  const shouldReduceMotion = useReducedMotion();

  return (
    <div
      className="fixed top-16 left-0 right-0 z-40 hidden md:block h-[3px] bg-border-light"
      role="progressbar"
      aria-valuenow={Math.round(progress * 100)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Page scroll progress"
    >
      <motion.div
        className="h-full origin-left bg-primary"
        style={{ scaleX: progress }}
        transition={
          shouldReduceMotion
            ? { duration: 0 }
            : { type: "spring", stiffness: 200, damping: 30 }
        }
      />
    </div>
  );
}
