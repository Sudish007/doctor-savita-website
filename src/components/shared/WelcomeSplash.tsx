"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Welcome splash screen — shows the full Saubhagya Clinic logo on first app load.
 * Uses sessionStorage to only show once per session.
 * Fades out after 2 seconds with a smooth animation.
 */
export function WelcomeSplash() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Only show once per session
    const hasShown = sessionStorage.getItem("splash_shown");
    if (!hasShown) {
      setShow(true);
      sessionStorage.setItem("splash_shown", "1");
      // Auto-dismiss after 2.5 seconds
      setTimeout(() => setShow(false), 2500);
    }
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#1B2D23] md:hidden"
          onClick={() => setShow(false)}
        >
          {/* Logo */}
          <motion.img
            src="/images/logo.png"
            alt="Saubhagya Clinic"
            className="w-40 h-40 rounded-full object-cover shadow-2xl shadow-emerald-900/50"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />

          {/* Clinic name */}
          <motion.div
            className="mt-6 text-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <h1 className="text-2xl font-bold text-white tracking-wide">
              Saubhagya Clinic
            </h1>
            <p className="text-sm text-emerald-300/80 mt-1">Dr. Savita Kumari</p>
            <p className="text-xs text-emerald-400/60 mt-0.5 italic">
              Healing with Trust
            </p>
          </motion.div>

          {/* Loading dots */}
          <motion.div
            className="mt-8 flex gap-1.5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 rounded-full bg-emerald-400"
                animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
