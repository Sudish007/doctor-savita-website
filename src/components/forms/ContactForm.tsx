'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'

import { contactFormSchema, type ContactFormSchema } from '@/lib/validators/contact'

/**
 * ContactForm - General inquiry form with Zod validation and glassmorphism styling.
 *
 * Features:
 * - React Hook Form with Zod manual validation (safeParse)
 * - Fields: name (max 100), email (valid format), message (max 1000) — all required
 * - Inline error messages below invalid fields
 * - On submit: calls /api/contact, shows success confirmation
 * - Glassmorphism card styling via glass-card utility
 *
 * Requirements: 10.6, 10.7, 10.8
 */

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const { register, handleSubmit, reset } = useForm<ContactFormSchema>({
    defaultValues: {
      name: '',
      email: '',
      message: '',
    },
  })

  /**
   * Validate and submit form data to /api/contact
   */
  async function validateAndSubmit(data: ContactFormSchema) {
    setSubmitError(null)

    // Validate with Zod
    const result = contactFormSchema.safeParse(data)

    if (!result.success) {
      const errors: Record<string, string> = {}
      for (const issue of result.error.issues) {
        const field = issue.path[0] as string
        if (!errors[field]) {
          errors[field] = issue.message
        }
      }
      setFieldErrors(errors)
      return
    }

    setFieldErrors({})
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(result.data),
      })

      const responseData = await response.json()

      if (!response.ok || !responseData.success) {
        setSubmitError(responseData.message || 'Something went wrong. Please try again.')
        return
      }

      // Success — show confirmation and clear form
      setIsSubmitted(true)
      reset()
    } catch {
      setSubmitError('Network error. Please check your connection and try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  /** Reset to allow sending another message */
  function handleReset() {
    setIsSubmitted(false)
    setSubmitError(null)
    setFieldErrors({})
    reset()
  }

  // ─── Success Confirmation ──────────────────────────────────────────────────
  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="glass-card p-6 md:p-8 text-center"
      >
        <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
          <svg className="w-7 h-7 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-fluid-h5 font-heading text-foreground mb-2">
          Inquiry Sent Successfully!
        </h3>
        <p className="text-foreground-muted text-fluid-body-sm mb-5">
          We&apos;ll get back to you as soon as possible.
        </p>
        <button
          onClick={handleReset}
          className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium text-sm hover:bg-primary-hover transition-colors touch-target"
        >
          Send Another Message
        </button>
      </motion.div>
    )
  }

  // ─── Form ──────────────────────────────────────────────────────────────────
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="glass-card p-6 md:p-8 h-full flex flex-col"
    >
      <h3 className="text-fluid-h5 font-heading text-foreground mb-1">
        Send Us a Message
      </h3>
      <p className="text-foreground-muted text-fluid-body-sm mb-5">
        Have a question? We&apos;d love to hear from you.
      </p>

      <form
        onSubmit={handleSubmit(validateAndSubmit)}
        noValidate
        className="space-y-4 flex-1 flex flex-col"
      >
        {/* Name */}
        <div className="space-y-1.5">
          <label htmlFor="contact-name" className="block text-fluid-body-sm font-medium text-foreground">
            Name <span className="text-destructive" aria-hidden="true">*</span>
          </label>
          <input
            id="contact-name"
            type="text"
            maxLength={100}
            placeholder="Your full name"
            aria-invalid={!!fieldErrors.name}
            aria-describedby={fieldErrors.name ? 'error-contact-name' : undefined}
            className={inputClassName(!!fieldErrors.name)}
            {...register('name')}
          />
          {fieldErrors.name && (
            <p id="error-contact-name" className="text-fluid-caption text-destructive mt-1" role="alert" aria-live="polite">
              {fieldErrors.name}
            </p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <label htmlFor="contact-email" className="block text-fluid-body-sm font-medium text-foreground">
            Email <span className="text-destructive" aria-hidden="true">*</span>
          </label>
          <input
            id="contact-email"
            type="email"
            placeholder="you@example.com"
            aria-invalid={!!fieldErrors.email}
            aria-describedby={fieldErrors.email ? 'error-contact-email' : undefined}
            className={inputClassName(!!fieldErrors.email)}
            {...register('email')}
          />
          {fieldErrors.email && (
            <p id="error-contact-email" className="text-fluid-caption text-destructive mt-1" role="alert" aria-live="polite">
              {fieldErrors.email}
            </p>
          )}
        </div>

        {/* Message */}
        <div className="space-y-1.5 flex-1 flex flex-col">
          <label htmlFor="contact-message" className="block text-fluid-body-sm font-medium text-foreground">
            Message <span className="text-destructive" aria-hidden="true">*</span>
          </label>
          <textarea
            id="contact-message"
            rows={5}
            maxLength={1000}
            placeholder="How can we help you?"
            aria-invalid={!!fieldErrors.message}
            aria-describedby={fieldErrors.message ? 'error-contact-message' : undefined}
            className={inputClassName(!!fieldErrors.message) + ' resize-none flex-1 min-h-[120px]'}
            {...register('message')}
          />
          {fieldErrors.message && (
            <p id="error-contact-message" className="text-fluid-caption text-destructive mt-1" role="alert" aria-live="polite">
              {fieldErrors.message}
            </p>
          )}
        </div>

        {/* Submit Error */}
        {submitError && (
          <p className="text-fluid-caption text-destructive text-center" role="alert">
            {submitError}
          </p>
        )}

        {/* Submit Button */}
        <motion.button
          type="submit"
          disabled={isSubmitting}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-3 px-6 rounded-xl font-medium text-base bg-primary text-primary-foreground hover:bg-primary-hover disabled:opacity-60 disabled:cursor-not-allowed transition-colors touch-target shadow-elevation-2 hover:shadow-elevation-3"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <LoadingSpinner />
              Sending...
            </span>
          ) : (
            'Send Message'
          )}
        </motion.button>
      </form>
    </motion.div>
  )
}

/** Loading spinner */
function LoadingSpinner() {
  return (
    <svg
      className="animate-spin h-5 w-5"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  )
}

/** Shared input class names */
function inputClassName(hasError: boolean): string {
  return `w-full px-4 py-3 rounded-xl text-fluid-body-sm bg-background-secondary text-foreground border ${hasError ? 'border-destructive' : 'border-border'} focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent placeholder:text-foreground-muted/60 transition-colors duration-200`
}

export default ContactForm
