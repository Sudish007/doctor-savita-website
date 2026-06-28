"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

/**
 * TestimonialCarousel — Reusable auto-scrolling carousel component.
 *
 * Features:
 * - Auto-advances every 5 seconds
 * - Pauses on hover/touch interaction
 * - Next/previous arrow buttons with slide animation (<400ms)
 * - Wrap-around: forward from last → first, backward from first → last (K mod N)
 * - Shows one testimonial at a time
 * - Framer Motion AnimatePresence for transitions
 * - Respects prefers-reduced-motion
 *
 * Requirements: 7.2, 7.3, 7.4, 7.5
 */

interface TestimonialCarouselProps {
  /** Total number of items */
  itemCount: number;
  /** Render function for the active item */
  renderItem: (index: number) => React.ReactNode;
  /** Auto-scroll interval in ms (default 5000) */
  autoScrollInterval?: number;
  /** Optional className for the carousel container */
  className?: string;
}

/** Get wrap-around index: K mod N */
function wrapIndex(index: number, total: number): number {
  return ((index % total) + total) % total;
}

export function TestimonialCarousel({
  itemCount,
  renderItem,
  autoScrollInterval = 5000,
  className = "",
}: TestimonialCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [isPaused, setIsPaused] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goNext = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => wrapIndex(prev + 1, itemCount));
  }, [itemCount]);

  const goPrev = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => wrapIndex(prev - 1, itemCount));
  }, [itemCount]);

  // Auto-scroll logic
  useEffect(() => {
    if (isPaused || itemCount <= 1) return;

    timerRef.current = setInterval(goNext, autoScrollInterval);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, goNext, autoScrollInterval, itemCount]);

  // Pause on hover/touch
  const handlePointerEnter = () => setIsPaused(true);
  const handlePointerLeave = () => setIsPaused(false);

  if (itemCount === 0) return null;

  const slideVariants = {
    enter: (dir: number) => ({
      x: prefersReducedMotion ? 0 : dir > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: prefersReducedMotion ? 0 : dir > 0 ? -300 : 300,
      opacity: 0,
    }),
  };

  return (
    <div
      className={`relative ${className}`}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      role="region"
      aria-roledescription="carousel"
      aria-label="Patient testimonials"
    >
      {/* Carousel content */}
      <div className="overflow-hidden relative min-h-[280px] md:min-h-[240px]">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30, duration: 0.35 },
              opacity: { duration: 0.2 },
            }}
            className="w-full"
            role="group"
            aria-roledescription="slide"
            aria-label={`Testimonial ${currentIndex + 1} of ${itemCount}`}
          >
            {renderItem(currentIndex)}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation arrows */}
      {itemCount > 1 && (
        <>
          <button
            onClick={goPrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 md:-translate-x-4 z-10 w-10 h-10 md:w-12 md:h-12 rounded-full glass flex items-center justify-center text-foreground hover:scale-105 hover:shadow-elevation-2 transition-all duration-200 touch-target"
            aria-label="Previous testimonial"
          >
            <ChevronLeftIcon className="w-5 h-5" />
          </button>
          <button
            onClick={goNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 md:translate-x-4 z-10 w-10 h-10 md:w-12 md:h-12 rounded-full glass flex items-center justify-center text-foreground hover:scale-105 hover:shadow-elevation-2 transition-all duration-200 touch-target"
            aria-label="Next testimonial"
          >
            <ChevronRightIcon className="w-5 h-5" />
          </button>
        </>
      )}

      {/* Dot indicators */}
      {itemCount > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6" role="tablist" aria-label="Testimonial navigation">
          {Array.from({ length: itemCount }).map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setDirection(i > currentIndex ? 1 : -1);
                setCurrentIndex(i);
              }}
              role="tab"
              aria-selected={i === currentIndex}
              aria-label={`Go to testimonial ${i + 1}`}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                i === currentIndex
                  ? "bg-primary scale-125"
                  : "bg-foreground-muted/30 hover:bg-foreground-muted/60"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/** Exported helper for use in property tests */
export { wrapIndex };

/* ---- Icon Components ---- */

function ChevronLeftIcon({ className }: { className?: string }) {
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
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

function ChevronRightIcon({ className }: { className?: string }) {
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
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}
