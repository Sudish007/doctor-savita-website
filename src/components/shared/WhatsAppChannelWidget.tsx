/**
 * WhatsAppChannelWidget Component
 * Promotes the "MedyFacts🩺By Dr Savita" WhatsApp channel with a Join Channel CTA.
 * Supports two variants:
 *   - compact: for sidebar placement (blog sidebar, footer)
 *   - full: for standalone sections
 *
 * Requirements: 9.1, 9.2, 9.3, 9.4, 9.7
 */

'use client'

import { motion, useReducedMotion } from 'framer-motion'

const CHANNEL_URL = 'https://whatsapp.com/channel/0029Vb5VAylJf05gA0p75W1Q'
const CHANNEL_NAME = 'MedyFacts🩺By Dr Savita'
const CHANNEL_DESCRIPTION = 'Free health tips and homeopathy insights'

interface WhatsAppChannelWidgetProps {
  /** 'compact' for sidebar/footer, 'full' for standalone section */
  variant?: 'compact' | 'full'
  /** Optional additional CSS class names */
  className?: string
}

export function WhatsAppChannelWidget({
  variant = 'compact',
  className = '',
}: WhatsAppChannelWidgetProps) {
  const prefersReducedMotion = useReducedMotion()

  if (variant === 'compact') {
    return (
      <div
        className={`rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-4 ${className}`}
      >
        <div className="flex items-center gap-3 mb-3">
          <WhatsAppIcon className="h-8 w-8 flex-shrink-0 text-[#25D366]" />
          <div className="min-w-0">
            <h4 className="text-sm font-semibold text-[var(--foreground)] truncate">
              {CHANNEL_NAME}
            </h4>
            <p className="text-xs text-[var(--foreground-muted)] leading-snug">
              {CHANNEL_DESCRIPTION}
            </p>
          </div>
        </div>
        <a
          href={CHANNEL_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center w-full min-h-[44px] min-w-[44px] px-4 py-2.5 rounded-lg
            bg-[#25D366] text-white font-medium text-sm
            hover:bg-[#20bd5a] active:bg-[#1da851]
            transition-colors duration-200
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2"
          aria-label={`Join ${CHANNEL_NAME} WhatsApp channel`}
        >
          Join Channel
        </a>
      </div>
    )
  }

  // Full variant – standalone section card
  return (
    <motion.div
      initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5 }}
      className={`rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-6 sm:p-8 
        backdrop-blur-md shadow-lg ${className}`}
    >
      <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
        {/* Icon */}
        <div className="flex-shrink-0 flex items-center justify-center w-16 h-16 rounded-full bg-[#25D366]/10">
          <WhatsAppIcon className="h-9 w-9 text-[#25D366]" />
        </div>

        {/* Content */}
        <div className="flex-1 text-center sm:text-left">
          <h3 className="text-lg font-semibold text-[var(--foreground)] mb-1">
            {CHANNEL_NAME}
          </h3>
          <p className="text-sm text-[var(--foreground-muted)] leading-relaxed">
            {CHANNEL_DESCRIPTION}
          </p>
        </div>

        {/* CTA */}
        <a
          href={CHANNEL_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center min-h-[44px] min-w-[44px] px-6 py-3 rounded-xl
            bg-[#25D366] text-white font-semibold text-base
            hover:bg-[#20bd5a] active:bg-[#1da851]
            hover:scale-[1.03] active:scale-[0.98]
            transition-all duration-200
            shadow-md hover:shadow-lg
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2"
          aria-label={`Join ${CHANNEL_NAME} WhatsApp channel`}
        >
          <WhatsAppIcon className="h-5 w-5 mr-2" />
          Join Channel
        </a>
      </div>
    </motion.div>
  )
}

/**
 * WhatsApp brand SVG icon
 */
function WhatsAppIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}

export default WhatsAppChannelWidget
