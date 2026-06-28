"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";

/**
 * AnimatedCounter - A reusable count-up animation component.
 * Counts from 0 to a target value when the element scrolls into view.
 *
 * Features:
 * - Triggered by Intersection Observer (once: true)
 * - 2-second duration with ease-out timing
 * - Configurable suffix ("+", "%", etc.)
 * - Icon with bounce/pulse animation on counter start
 * - Numeric value rendered at 1.5x+ body text size
 *
 * Requirements: 3.6, 17.6, 21.1, 21.2, 21.3, 21.4, 21.5
 */

interface AnimatedCounterProps {
  /** Target number to count up to */
  target: number;
  /** Duration of the count-up animation in ms */
  duration?: number;
  /** Suffix appended after the number (e.g., "+", "%") */
  suffix?: string;
  /** Label displayed below the counter */
  label: string;
  /** Icon element to display above the counter */
  icon: React.ReactNode;
}

/**
 * Ease-out cubic timing function: decelerates towards the end.
 */
function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

export function AnimatedCounter({
  target,
  duration = 2000,
  suffix = "",
  label,
  icon,
}: AnimatedCounterProps) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [ref, isInView] = useIntersectionObserver<HTMLDivElement>({
    threshold: 0.3,
    once: true,
  });
  const animationFrameRef = useRef<number | null>(null);

  const startAnimation = useCallback(() => {
    if (hasAnimated) return;
    setHasAnimated(true);

    const startTime = performance.now();

    function animate(currentTime: number) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutCubic(progress);
      const currentCount = Math.round(easedProgress * target);

      setCount(currentCount);

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      }
    }

    animationFrameRef.current = requestAnimationFrame(animate);
  }, [target, duration, hasAnimated]);

  useEffect(() => {
    if (isInView && !hasAnimated) {
      startAnimation();
    }
  }, [isInView, hasAnimated, startAnimation]);

  // Cleanup animation frame on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={ref}
      className="flex flex-col items-center justify-center p-6 rounded-2xl glass-card hover:shadow-elevation-3 transition-all duration-300 hover:scale-[1.02]"
    >
      {/* Icon with bounce animation when counter starts */}
      <div
        className={`text-primary mb-3 ${
          hasAnimated ? "animate-icon-bounce" : ""
        }`}
        aria-hidden="true"
      >
        {icon}
      </div>

      {/* Counter value - at least 1.5x body text size */}
      <div className="text-3xl md:text-4xl font-heading font-bold text-foreground">
        {count}
        {suffix && <span className="text-primary">{suffix}</span>}
      </div>

      {/* Label */}
      <p className="mt-2 text-sm text-foreground-muted text-center font-medium">
        {label}
      </p>
    </div>
  );
}
