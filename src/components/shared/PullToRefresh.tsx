"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";

/**
 * Pull-to-refresh — native app feel.
 * Shows a spinner when user pulls down from the top of the page.
 * Reloads the page on release.
 */
export function PullToRefresh() {
  const [pulling, setPulling] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const startY = useRef(0);
  const threshold = 80;

  useEffect(() => {
    let active = false;

    function handleTouchStart(e: TouchEvent) {
      // Only activate if scrolled to top
      if (window.scrollY === 0) {
        startY.current = e.touches[0].clientY;
        active = true;
      }
    }

    function handleTouchMove(e: TouchEvent) {
      if (!active) return;
      const currentY = e.touches[0].clientY;
      const diff = currentY - startY.current;

      if (diff > 0 && diff < 150) {
        setPulling(true);
        setPullDistance(diff);
      }
    }

    function handleTouchEnd() {
      if (!active) return;
      active = false;

      if (pullDistance >= threshold) {
        // Refresh the page
        window.location.reload();
      }

      setPulling(false);
      setPullDistance(0);
    }

    document.addEventListener("touchstart", handleTouchStart, { passive: true });
    document.addEventListener("touchmove", handleTouchMove, { passive: true });
    document.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, [pullDistance]);

  if (!pulling || pullDistance < 20) return null;

  const progress = Math.min(pullDistance / threshold, 1);

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 z-[9998] flex items-center justify-center md:hidden"
      style={{ height: pullDistance * 0.5 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: progress }}
    >
      <div
        className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent"
        style={{
          transform: `rotate(${pullDistance * 3}deg)`,
          opacity: progress,
        }}
      />
    </motion.div>
  );
}
