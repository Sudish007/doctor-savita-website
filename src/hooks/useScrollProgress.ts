"use client";

import { useState, useEffect, useCallback, useRef } from "react";

/**
 * Custom hook that returns scroll progress as a value from 0 to 1.
 * Uses requestAnimationFrame for throttling to ensure smooth 60fps updates.
 * Cleans up the event listener on unmount.
 *
 * Requirements: 20.1, 20.4
 */
export function useScrollProgress(): number {
  const [progress, setProgress] = useState(0);
  const rafId = useRef<number | null>(null);

  const handleScroll = useCallback(() => {
    if (rafId.current !== null) return;

    rafId.current = requestAnimationFrame(() => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;
      const totalScrollable = scrollHeight - clientHeight;

      if (totalScrollable <= 0) {
        setProgress(0);
      } else {
        setProgress(Math.min(scrollTop / totalScrollable, 1));
      }

      rafId.current = null;
    });
  }, []);

  useEffect(() => {
    // Calculate initial progress
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafId.current !== null) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, [handleScroll]);

  return progress;
}
