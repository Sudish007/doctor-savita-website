"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

/**
 * Floating sticky "Book Appointment" card that appears after scrolling past the hero.
 * Only visible on mobile. Like Swiggy's address bar — always accessible.
 */
export function StickyBookCard() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    function handleScroll() {
      // Show after scrolling 400px (past the hero)
      setIsVisible(window.scrollY > 400);
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.25 }}
          className="fixed top-[68px] left-3 right-3 z-40 md:hidden"
        >
          <Link
            href="/book"
            className="flex items-center gap-3 px-4 py-3 rounded-2xl
              bg-primary/95 backdrop-blur-sm text-primary-foreground
              shadow-lg shadow-primary/20
              active:scale-[0.98] transition-transform"
          >
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
                <line x1="12" y1="14" x2="12" y2="18"/>
                <line x1="10" y1="16" x2="14" y2="16"/>
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold">Book Appointment</p>
              <p className="text-[11px] opacity-80">Morning & evening slots available</p>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-70">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
