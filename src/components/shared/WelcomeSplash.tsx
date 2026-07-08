"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Welcome splash screen — covers the blank white loading state.
 * Shows immediately on mount (before Next.js hydration completes)
 * and fades out once the page is ready.
 *
 * Uses sessionStorage so it only shows once per session.
 * On subsequent navigations within the same session, it won't appear.
 */
export function WelcomeSplash() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    // Check if already shown this session
    const hasShown = sessionStorage.getItem("splash_shown");
    if (hasShown) {
      setShow(false);
      return;
    }

    // Mark as shown
    sessionStorage.setItem("splash_shown", "1");

    // Dismiss after page is likely loaded (give it time to hydrate)
    const timer = setTimeout(() => setShow(false), 1800);
    return () => clearTimeout(timer);
  }, []);

  // Don't render anything if already dismissed
  if (!show) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="splash"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center"
          style={{ background: "#004123" }}
          onClick={() => setShow(false)}
        >
          {/* Logo */}
          <motion.div
            className="w-32 h-32 rounded-full overflow-hidden shadow-2xl"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <img
              src="/images/logo.png"
              alt="Saubhagya Clinic"
              className="w-full h-full object-cover"
            />
          </motion.div>

          {/* Text */}
          <motion.div
            className="mt-5 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.3 }}
          >
            <h1 className="text-xl font-bold text-white tracking-wide">
              Saubhagya Clinic
            </h1>
            <p className="text-sm text-emerald-300/80 mt-1">Dr. Savita Kumari</p>
            <p className="text-xs text-emerald-400/60 mt-0.5 italic">
              Healing with Trust
            </p>
          </motion.div>

          {/* Loading indicator */}
          <motion.div
            className="mt-6 flex gap-1.5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-emerald-400"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
              />
            ))}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
