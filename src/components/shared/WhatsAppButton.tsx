'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { usePathname } from 'next/navigation'

/**
 * Floating Appointment Button — fixed bottom-right.
 * Scrolls to appointment section on click.
 * Hidden on admin pages.
 *
 * Requirements: 9.5, 9.6, 9.7
 */

export function WhatsAppButton() {
  const prefersReducedMotion = useReducedMotion()
  const pathname = usePathname()

  // Hide on admin pages
  if (pathname?.startsWith('/admin')) return null

  function scrollToAppointment() {
    // Navigate to /book page
    window.location.href = '/book'
  }

  return (
    <motion.button
      onClick={scrollToAppointment}
      initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: 1 }}
      whileHover={prefersReducedMotion ? {} : { scale: 1.1 }}
      whileTap={prefersReducedMotion ? {} : { scale: 0.95 }}
      className="fixed bottom-5 right-5 z-50 hidden md:flex
        items-center justify-center
        w-14 h-14 rounded-full
        bg-primary text-primary-foreground
        shadow-lg hover:shadow-xl hover:bg-primary-hover
        transition-shadow duration-200
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
      aria-label="Book an Appointment"
      title="Book Appointment"
    >
      <svg
        className="w-6 h-6"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
        <line x1="16" y1="2" x2="16" y2="6"/>
        <line x1="8" y1="2" x2="8" y2="6"/>
        <line x1="3" y1="10" x2="21" y2="10"/>
        <line x1="12" y1="14" x2="12" y2="18"/>
        <line x1="10" y1="16" x2="14" y2="16"/>
      </svg>
    </motion.button>
  )
}

export default WhatsAppButton
