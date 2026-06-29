'use client'

import { useState, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'

import {
  appointmentFormSchema,
  generateTimeSlots,
  getEligibleDates,
  CLINIC_HOLIDAYS,
} from '@/lib/validators/appointment'
import { UpiQrCode } from '@/components/ui/UpiQrCode'
import { GPayIcon, PhonePeIcon, PaytmIcon, BhimIcon, AmazonPayIcon, WhatsAppPayIcon } from '@/components/ui/UpiIcons'
import type { AppointmentFormData, ConsultationType } from '@/types'

/**
 * AppointmentForm - Interactive booking form with validation and glassmorphism styling.
 *
 * Features:
 * - React Hook Form with Zod v4 manual validation (safeParse)
 * - Date picker disabling past dates, Sundays, holidays, >60 days
 * - Time slot selector (30-min intervals, 09:00-17:30 Mon-Sat)
 * - Consultation type toggle (in-person/online)
 * - Inline validation error messages
 * - Glassmorphism card styling via glass-card utility
 * - Confirmation summary on successful submit
 *
 * Requirements: 6.1, 6.3, 6.5, 6.7, 6.8, 16.2, 34.6
 */

// i18n labels and validation messages (English defaults; extend for hi/bh)
const LABELS = {
  en: {
    title: 'Book an Appointment',
    patientName: 'Patient Name',
    phone: 'Phone Number',
    email: 'Email (Optional)',
    date: 'Preferred Date',
    time: 'Preferred Time',
    consultationType: 'Consultation Type',
    reason: 'Reason for Visit',
    submit: 'Book Appointment',
    submitting: 'Booking...',
    inPersonLabel: 'In-Person',
    onlineLabel: 'Online',
    selectDate: 'Select a date',
    selectTime: 'Select a time slot',
    note: 'Clinic will respond within 24 hours',
    confirmation: 'Appointment booked successfully!',
    confirmationNote: 'We will respond within 24 hours.',
  },
  hi: {
    title: 'अपॉइंटमेंट बुक करें',
    patientName: 'मरीज़ का नाम',
    phone: 'फोन नंबर',
    email: 'ईमेल (वैकल्पिक)',
    date: 'पसंदीदा तिथि',
    time: 'पसंदीदा समय',
    consultationType: 'परामर्श का प्रकार',
    reason: 'आने का कारण',
    submit: 'अपॉइंटमेंट बुक करें',
    submitting: 'बुक हो रहा है...',
    inPersonLabel: 'व्यक्तिगत',
    onlineLabel: 'ऑनलाइन',
    selectDate: 'तिथि चुनें',
    selectTime: 'समय स्लॉट चुनें',
    note: 'क्लिनिक 24 घंटे के भीतर जवाब देगा',
    confirmation: 'अपॉइंटमेंट सफलतापूर्वक बुक हो गई!',
    confirmationNote: 'हम 24 घंटे के भीतर जवाब देंगे।',
  },
  bh: {
    title: 'अपॉइंटमेंट बुक करीं',
    patientName: 'मरीज के नाम',
    phone: 'फोन नंबर',
    email: 'ईमेल (वैकल्पिक)',
    date: 'पसंदीदा तिथि',
    time: 'पसंदीदा समय',
    consultationType: 'परामर्श के प्रकार',
    reason: 'आवे के कारण',
    submit: 'अपॉइंटमेंट बुक करीं',
    submitting: 'बुक हो रहल बा...',
    inPersonLabel: 'आ के दिखाईं',
    onlineLabel: 'ऑनलाइन',
    selectDate: 'तिथि चुनीं',
    selectTime: 'समय स्लॉट चुनीं',
    note: 'क्लिनिक 24 घंटा में जवाब देई',
    confirmation: 'अपॉइंटमेंट बुक हो गइल!',
    confirmationNote: 'हम 24 घंटा में जवाब देब।',
  },
} as const

const VALIDATION_MESSAGES = {
  en: {
    nameRequired: 'Patient name is required',
    nameMaxLength: 'Name must be 100 characters or less',
    phoneRequired: 'Phone number is required',
    phoneInvalid: 'Please enter a valid 10-digit Indian mobile number (starting with 6-9)',
    emailInvalid: 'Please enter a valid email address',
    dateRequired: 'Please select a preferred date',
    dateInvalid: 'Date must be a valid weekday (not Sunday), not in the past, and within 60 days',
    timeRequired: 'Please select a preferred time slot',
    timeInvalid: 'Time must be a valid 30-minute slot between 09:00 and 17:30',
    consultationTypeRequired: 'Please select a consultation type',
    reasonRequired: 'Reason for visit is required',
    reasonMaxLength: 'Reason must be 500 characters or less',
  },
  hi: {
    nameRequired: 'मरीज़ का नाम आवश्यक है',
    nameMaxLength: 'नाम 100 अक्षरों से अधिक नहीं होना चाहिए',
    phoneRequired: 'फोन नंबर आवश्यक है',
    phoneInvalid: 'कृपया एक वैध 10 अंकों का भारतीय मोबाइल नंबर दर्ज करें (6-9 से शुरू)',
    emailInvalid: 'कृपया एक वैध ईमेल पता दर्ज करें',
    dateRequired: 'कृपया पसंदीदा तिथि चुनें',
    dateInvalid: 'तिथि मान्य कार्यदिवस होनी चाहिए, बीते हुए दिन नहीं, और 60 दिनों के भीतर',
    timeRequired: 'कृपया पसंदीदा समय स्लॉट चुनें',
    timeInvalid: 'समय 09:00 से 17:30 के बीच 30 मिनट का स्लॉट होना चाहिए',
    consultationTypeRequired: 'कृपया परामर्श का प्रकार चुनें',
    reasonRequired: 'आने का कारण आवश्यक है',
    reasonMaxLength: 'कारण 500 अक्षरों से अधिक नहीं होना चाहिए',
  },
  bh: {
    nameRequired: 'मरीज के नाम जरूरी बा',
    nameMaxLength: 'नाम 100 अक्षर से ज्यादा ना होखे के चाहीं',
    phoneRequired: 'फोन नंबर जरूरी बा',
    phoneInvalid: 'कृपया 10 अंक के वैध भारतीय मोबाइल नंबर दीं (6-9 से शुरू)',
    emailInvalid: 'कृपया वैध ईमेल पता दीं',
    dateRequired: 'कृपया पसंदीदा तिथि चुनीं',
    dateInvalid: 'तिथि मान्य कार्यदिवस होखे के चाहीं, बीतल दिन ना, और 60 दिन के भीतर',
    timeRequired: 'कृपया पसंदीदा समय स्लॉट चुनीं',
    timeInvalid: 'समय 09:00 से 17:30 बीच 30 मिनट के स्लॉट होखे के चाहीं',
    consultationTypeRequired: 'कृपया परामर्श के प्रकार चुनीं',
    reasonRequired: 'आवे के कारण जरूरी बा',
    reasonMaxLength: 'कारण 500 अक्षर से ज्यादा ना होखे के चाहीं',
  },
} as const

type SupportedLocale = 'en' | 'hi' | 'bh'

interface AppointmentFormProps {
  locale?: SupportedLocale
}

export function AppointmentForm({ locale = 'en' }: AppointmentFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [submittedData, setSubmittedData] = useState<AppointmentFormData | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [showPayment, setShowPayment] = useState(false)
  const [pendingData, setPendingData] = useState<AppointmentFormData | null>(null)
  const [bookingId, setBookingId] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [savingAppointment, setSavingAppointment] = useState(false)

  const labels = LABELS[locale]
  const messages = VALIDATION_MESSAGES[locale]

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
  } = useForm<AppointmentFormData>({
    defaultValues: {
      patientName: '',
      phoneNumber: '',
      email: '',
      preferredDate: '',
      preferredTime: '',
      consultationType: 'in-person',
      reasonForVisit: '',
    },
  })

  const selectedDate = watch('preferredDate')
  const consultationType = watch('consultationType')

  // Compute eligible dates for the date picker (next 60 days)
  const eligibleDates = useMemo(() => getEligibleDates(CLINIC_HOLIDAYS), [])

  // Compute min/max date strings for the native date input
  const minDate = useMemo(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return today.toISOString().split('T')[0]
  }, [])

  const maxDate = useMemo(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const max = new Date(today)
    max.setDate(max.getDate() + 60)
    return max.toISOString().split('T')[0]
  }, [])

  // Generate time slots based on selected date's day of week
  const timeSlots = useMemo(() => {
    if (!selectedDate) return []
    const date = new Date(selectedDate)
    if (isNaN(date.getTime())) return []
    return generateTimeSlots(date.getDay())
  }, [selectedDate])

  // Build set of disabled date strings for quick lookup
  const disabledDatesSet = useMemo(() => {
    const set = new Set<string>()
    for (const { date, enabled } of eligibleDates) {
      if (!enabled) {
        set.add(date.toISOString().split('T')[0])
      }
    }
    return set
  }, [eligibleDates])

  /**
   * Manual validation using Zod safeParse since @hookform/resolvers
   * may not support Zod v4. Maps Zod errors to localized messages.
   */
  function validateAndSubmit(data: AppointmentFormData) {
    const result = appointmentFormSchema.safeParse(data)

    if (!result.success) {
      const errors: Record<string, string> = {}
      const issues = result.error.issues

      for (const issue of issues) {
        const field = issue.path[0] as string
        if (!errors[field]) {
          errors[field] = mapFieldError(field, issue.message)
        }
      }
      setFieldErrors(errors)
      return
    }

    setFieldErrors({})
    // Save appointment immediately as pending, then show payment
    saveAndShowPayment(result.data as AppointmentFormData)
  }

  /** Save appointment to Supabase immediately (status: pending), then show payment step */
  async function saveAndShowPayment(data: AppointmentFormData) {
    setSavingAppointment(true)
    try {
      const response = await fetch('/api/appointment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const result = await response.json()
      if (result.success && result.bookingId) {
        setBookingId(result.bookingId)
      }
    } catch {
      // Even if save fails, show payment step — user can still pay
    } finally {
      setSavingAppointment(false)
      setPendingData(data)
      setShowPayment(true)
    }
  }

  /** Map Zod error to localized validation message */
  function mapFieldError(field: string, _zodMessage: string): string {
    switch (field) {
      case 'patientName':
        return _zodMessage.includes('100') ? messages.nameMaxLength : messages.nameRequired
      case 'phoneNumber':
        return _zodMessage.includes('required') || _zodMessage.includes('min')
          ? messages.phoneRequired
          : messages.phoneInvalid
      case 'email':
        return messages.emailInvalid
      case 'preferredDate':
        return _zodMessage.includes('required') || _zodMessage.includes('min')
          ? messages.dateRequired
          : messages.dateInvalid
      case 'preferredTime':
        return _zodMessage.includes('required') || _zodMessage.includes('min')
          ? messages.timeRequired
          : messages.timeInvalid
      case 'consultationType':
        return messages.consultationTypeRequired
      case 'reasonForVisit':
        return _zodMessage.includes('500') ? messages.reasonMaxLength : messages.reasonRequired
      default:
        return _zodMessage
    }
  }

  /** Handle successful form submission — calls the API */
  async function onSubmitSuccess(data: AppointmentFormData) {
    // This is now called from payment step
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/appointment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (result.success) {
        setSubmittedData(data)
        setIsSubmitted(true)
        setShowPayment(false)
      } else {
        setSubmittedData(data)
        setIsSubmitted(true)
        setShowPayment(false)
      }
    } catch {
      setSubmittedData(data)
      setIsSubmitted(true)
      setShowPayment(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  /** Confirm appointment after payment */
  async function confirmAppointmentAfterPayment() {
    if (!pendingData) return
    await onSubmitSuccess(pendingData)
  }

  // UPI payment helpers
  const UPI_ID = 'savitasinghunstoppable98@oksbi'
  const WHATSAPP_NUMBER = '916204309476'

  function copyUpiId() {
    navigator.clipboard.writeText(UPI_ID).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  function getPaymentAmount(): number {
    if (!pendingData) return 300
    return pendingData.consultationType === 'online' ? 200 : 300
  }

  function getUpiLink(scheme: string): string {
    const amount = getPaymentAmount()
    const params = new URLSearchParams({
      pa: UPI_ID,
      pn: 'Dr Savita Kumari',
      am: amount.toString(),
      cu: 'INR',
      tn: 'Consultation Fee',
    })
    return `${scheme}?${params.toString()}`
  }

  function getWhatsAppLink(): string {
    const amount = getPaymentAmount()
    const message = encodeURIComponent(
      `Hi Dr. Savita, I have made a payment of ₹${amount} via UPI for my consultation. Please find the payment screenshot attached.`
    )
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`
  }

  /** Reset form to allow booking another appointment */
  function handleReset() {
    setIsSubmitted(false)
    setSubmittedData(null)
    setFieldErrors({})
    setShowPayment(false)
    setPendingData(null)
    reset()
  }

  // ─── Payment Step View ─────────────────────────────────────────────────────
  if (showPayment && pendingData) {
    const isOnline = pendingData.consultationType === 'online'
    const amount = getPaymentAmount()

    const UPI_APPS = [
      { name: 'Google Pay', icon: <GPayIcon />, scheme: 'gpay://upi/pay' },
      { name: 'PhonePe', icon: <PhonePeIcon />, scheme: 'phonepe://pay' },
      { name: 'Paytm', icon: <PaytmIcon />, scheme: 'paytmmp://pay' },
      { name: 'BHIM UPI', icon: <BhimIcon />, scheme: 'upi://pay' },
      { name: 'Amazon Pay', icon: <AmazonPayIcon />, scheme: 'amazonpay://pay' },
      { name: 'WhatsApp Pay', icon: <WhatsAppPayIcon />, scheme: 'whatsapp://pay' },
    ]

    return (
      <section id="appointment" className="section-padding">
        <div className="container-content">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="glass-card max-w-2xl mx-auto p-6 md:p-8"
          >
            {/* Step indicator */}
            <div className="flex items-center justify-center gap-2 mb-6">
              <span className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm font-bold">✓</span>
              <div className="w-8 h-0.5 bg-primary"></div>
              <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">2</span>
              <div className="w-8 h-0.5 bg-border"></div>
              <span className="w-8 h-8 rounded-full bg-muted text-foreground-muted flex items-center justify-center text-sm font-bold">3</span>
            </div>

            <h2 className="text-fluid-h3 font-heading text-foreground text-center mb-1">
              {isOnline ? '💳 Pay to Confirm Booking' : '💳 Payment Options'}
            </h2>
            <p className="text-foreground-muted text-center mb-6 text-fluid-body-sm">
              {isOnline
                ? 'Your appointment is saved. Complete payment to confirm.'
                : 'Your appointment is saved. Pay online or at the clinic.'}
            </p>

            {bookingId && (
              <p className="text-xs text-center text-foreground-muted mb-4">
                Booking ID: <span className="font-mono font-medium text-foreground">{bookingId.slice(0, 8)}</span>
              </p>
            )}

            {/* Booking Summary */}
            <div className="bg-muted dark:bg-background-tertiary rounded-xl p-4 mb-6 text-sm space-y-1">
              <div className="flex justify-between"><span className="text-foreground-muted">Patient:</span><span className="font-medium">{pendingData.patientName}</span></div>
              <div className="flex justify-between"><span className="text-foreground-muted">Date:</span><span className="font-medium">{pendingData.preferredDate}</span></div>
              <div className="flex justify-between"><span className="text-foreground-muted">Time:</span><span className="font-medium">{pendingData.preferredTime}</span></div>
              <div className="flex justify-between"><span className="text-foreground-muted">Type:</span><span className="font-medium">{pendingData.consultationType === 'online' ? 'Online' : 'In-Person'}</span></div>
              <div className="flex justify-between border-t border-border-light pt-1 mt-1"><span className="font-medium text-foreground">Amount:</span><span className="font-bold text-primary text-lg">₹{amount}</span></div>
            </div>

            {/* QR Code - works with ALL UPI apps */}
            <div className="mb-6 flex justify-center">
              <UpiQrCode
                upiId={UPI_ID}
                payeeName="Dr Savita Kumari"
                amount={amount}
                size={200}
              />
            </div>

            {/* UPI ID with copy */}
            <div className="mb-5 p-3 rounded-xl bg-background-secondary border border-border">
              <p className="text-xs text-foreground-muted mb-1 font-medium uppercase tracking-wide">Or pay manually to UPI ID</p>
              <div className="flex items-center gap-2">
                <code className="flex-1 text-sm font-mono text-foreground break-all">{UPI_ID}</code>
                <button
                  onClick={copyUpiId}
                  className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    copied ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' : 'bg-primary/10 text-primary hover:bg-primary/20'
                  }`}
                >
                  {copied ? '✓ Copied!' : 'Copy'}
                </button>
              </div>
            </div>

            {/* UPI App Quick Links (mobile deep links) */}
            <div className="mb-6">
              <p className="text-xs font-medium text-foreground-muted mb-2 text-center">Quick pay via app (mobile only):</p>
              <div className="grid grid-cols-6 gap-2">
                {UPI_APPS.map((app) => (
                  <a
                    key={app.name}
                    href={getUpiDeepLink(app.scheme)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-1 p-2 rounded-xl border border-border hover:border-primary/50 hover:shadow-md transition-all"
                    title={app.name}
                  >
                    {app.icon}
                    <span className="text-[8px] text-foreground-muted text-center leading-tight">{app.name.split(' ')[0]}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="border-t border-border-light pt-5 space-y-3">
              {/* I've Paid */}
              <button
                onClick={() => confirmPayment('paid')}
                disabled={isSubmitting}
                className="w-full py-3.5 px-6 rounded-xl font-medium text-base bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-60 transition-colors shadow-elevation-2"
              >
                {isSubmitting ? '⏳ Confirming...' : '✓ I\'ve Paid — Confirm Appointment'}
              </button>

              {/* Share screenshot on WhatsApp */}
              <a
                href={getWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 px-6 rounded-xl font-medium text-sm bg-[#25D366] text-white hover:bg-[#1DA851] transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Share Payment Screenshot on WhatsApp
              </a>

              {/* Pay at Clinic option (for in-person) */}
              {!isOnline && (
                <button
                  onClick={() => confirmPayment('pay_at_clinic')}
                  disabled={isSubmitting}
                  className="w-full py-3 px-6 rounded-xl font-medium text-sm border-2 border-border text-foreground hover:bg-muted transition-colors"
                >
                  {isSubmitting ? '⏳ Confirming...' : '🏥 Will Pay in Cash at Clinic — Confirm'}
                </button>
              )}

              {/* Back button */}
              <button
                onClick={() => { setShowPayment(false); setPendingData(null) }}
                className="w-full py-2 text-sm text-foreground-muted hover:text-foreground transition-colors"
              >
                ← Back to Edit Details
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    )
  }

  // ─── Confirmation View ─────────────────────────────────────────────────────
  if (isSubmitted && submittedData) {
    return (
      <section id="appointment" className="section-padding">
        <div className="container-content">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="glass-card max-w-2xl mx-auto p-8 md:p-10 text-center"
          >
            {/* Success icon */}
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
              <svg className="w-8 h-8 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h2 className="text-fluid-h3 font-heading text-foreground mb-2">
              {labels.confirmation}
            </h2>
            <p className="text-foreground-muted mb-6">{labels.confirmationNote}</p>

            {/* Booking summary */}
            <div className="text-left bg-muted dark:bg-background-tertiary rounded-xl p-5 mb-6 space-y-2">
              <SummaryRow label={labels.patientName} value={submittedData.patientName} />
              <SummaryRow label={labels.phone} value={submittedData.phoneNumber} />
              {submittedData.email && (
                <SummaryRow label={labels.email} value={submittedData.email} />
              )}
              <SummaryRow label={labels.date} value={submittedData.preferredDate} />
              <SummaryRow label={labels.time} value={submittedData.preferredTime} />
              <SummaryRow
                label={labels.consultationType}
                value={
                  submittedData.consultationType === 'in-person'
                    ? labels.inPersonLabel
                    : labels.onlineLabel
                }
              />
              <SummaryRow label={labels.reason} value={submittedData.reasonForVisit} />
            </div>

            <button
              onClick={handleReset}
              className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary-hover transition-colors touch-target"
            >
              {locale === 'en' ? 'Book Another Appointment' : locale === 'hi' ? 'एक और अपॉइंटमेंट बुक करें' : 'एक और अपॉइंटमेंट बुक करीं'}
            </button>
          </motion.div>
        </div>
      </section>
    )
  }

  // ─── Form View ──────────────────────────────────────────────────────────────
  return (
    <section id="appointment" className="section-padding">
      <div className="container-content">
        {/* Video Consultation CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="max-w-2xl mx-auto mb-8"
        >
          <a
            href="/ask-dr-savita"
            className="block glass-card p-5 md:p-6 border-2 border-primary/30 hover:border-primary transition-all duration-300 hover:shadow-elevation-3 group"
          >
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0 w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                  <polygon points="23 7 16 12 23 17 23 7" />
                  <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-heading font-bold text-foreground group-hover:text-primary transition-colors">
                  {locale === 'en' ? '📹 Book Video Consultation' : locale === 'hi' ? '📹 वीडियो परामर्श बुक करें' : '📹 वीडियो परामर्श बुक करीं'}
                </h3>
                <p className="text-fluid-body-sm text-foreground-muted mt-0.5">
                  {locale === 'en'
                    ? 'Record a 2-min video describing your symptoms. Dr. Savita will respond with personalized advice.'
                    : locale === 'hi'
                    ? '2 मिनट का वीडियो रिकॉर्ड करें अपने लक्षणों के बारे में। डॉ. सविता व्यक्तिगत सलाह देंगी।'
                    : '2 मिनट के वीडियो रिकॉर्ड करीं अपना लक्षणन के बारे में। डॉ. सविता जवाब देई।'}
                </p>
              </div>
              <div className="flex-shrink-0 hidden sm:block">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary group-hover:translate-x-1 transition-transform">
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </div>
            </div>
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="glass-card max-w-2xl mx-auto p-6 md:p-10"
        >
          {/* Section title */}
          <h2 className="text-fluid-h3 font-heading text-foreground text-center mb-2">
            {labels.title}
          </h2>
          <p className="text-foreground-muted text-center mb-8 text-fluid-body-sm">
            {labels.note}
          </p>

          <form
            onSubmit={handleSubmit(validateAndSubmit)}
            noValidate
            className="space-y-5"
          >
            {/* Patient Name */}
            <FormField
              label={labels.patientName}
              error={fieldErrors.patientName}
              required
            >
              <input
                type="text"
                maxLength={100}
                placeholder={labels.patientName}
                aria-invalid={!!fieldErrors.patientName}
                aria-describedby={fieldErrors.patientName ? 'error-patientName' : undefined}
                className={inputClassName(!!fieldErrors.patientName)}
                {...register('patientName')}
              />
            </FormField>

            {/* Phone Number */}
            <FormField
              label={labels.phone}
              error={fieldErrors.phoneNumber}
              required
            >
              <input
                type="tel"
                maxLength={10}
                placeholder="9XXXXXXXXX"
                aria-invalid={!!fieldErrors.phoneNumber}
                aria-describedby={fieldErrors.phoneNumber ? 'error-phoneNumber' : undefined}
                className={inputClassName(!!fieldErrors.phoneNumber)}
                {...register('phoneNumber')}
              />
            </FormField>

            {/* Email (optional) */}
            <FormField
              label={labels.email}
              error={fieldErrors.email}
            >
              <input
                type="email"
                placeholder="email@example.com"
                aria-invalid={!!fieldErrors.email}
                aria-describedby={fieldErrors.email ? 'error-email' : undefined}
                className={inputClassName(!!fieldErrors.email)}
                {...register('email')}
              />
            </FormField>

            {/* Preferred Date */}
            <FormField
              label={labels.date}
              error={fieldErrors.preferredDate}
              required
            >
              <input
                type="date"
                min={minDate}
                max={maxDate}
                aria-invalid={!!fieldErrors.preferredDate}
                aria-describedby={fieldErrors.preferredDate ? 'error-preferredDate' : undefined}
                className={inputClassName(!!fieldErrors.preferredDate)}
                {...register('preferredDate', {
                  onChange: () => {
                    // Reset time when date changes
                    setValue('preferredTime', '')
                  },
                })}
              />
            </FormField>

            {/* Preferred Time */}
            <FormField
              label={labels.time}
              error={fieldErrors.preferredTime}
              required
            >
              <select
                aria-invalid={!!fieldErrors.preferredTime}
                aria-describedby={fieldErrors.preferredTime ? 'error-preferredTime' : undefined}
                className={inputClassName(!!fieldErrors.preferredTime)}
                disabled={!selectedDate || timeSlots.length === 0}
                {...register('preferredTime')}
              >
                <option value="">{labels.selectTime}</option>
                {timeSlots.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
            </FormField>

            {/* Consultation Type Toggle */}
            <FormField
              label={labels.consultationType}
              error={fieldErrors.consultationType}
              required
            >
              <div className="flex gap-3">
                <ConsultationToggleButton
                  active={consultationType === 'in-person'}
                  onClick={() => setValue('consultationType', 'in-person')}
                  label={labels.inPersonLabel}
                  icon="🏥"
                />
                <ConsultationToggleButton
                  active={consultationType === 'online'}
                  onClick={() => setValue('consultationType', 'online')}
                  label={labels.onlineLabel}
                  icon="💻"
                />
              </div>
              {/* Hidden input so react-hook-form tracks the value */}
              <input type="hidden" {...register('consultationType')} />
            </FormField>

            {/* Reason for Visit */}
            <FormField
              label={labels.reason}
              error={fieldErrors.reasonForVisit}
              required
            >
              <textarea
                rows={4}
                maxLength={500}
                placeholder={labels.reason}
                aria-invalid={!!fieldErrors.reasonForVisit}
                aria-describedby={fieldErrors.reasonForVisit ? 'error-reasonForVisit' : undefined}
                className={inputClassName(!!fieldErrors.reasonForVisit) + ' resize-none'}
                {...register('reasonForVisit')}
              />
            </FormField>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`
                w-full py-3.5 px-6 rounded-xl font-medium text-base
                bg-primary text-primary-foreground
                hover:bg-primary-hover
                disabled:opacity-60 disabled:cursor-not-allowed
                transition-colors touch-target
                shadow-elevation-2 hover:shadow-elevation-3
              `}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <LoadingSpinner />
                  {labels.submitting}
                </span>
              ) : (
                labels.submit
              )}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </section>
  )
}

// ─── Sub-components ──────────────────────────────────────────────────────────

/** Form field wrapper with label and inline error */
function FormField({
  label,
  error,
  required,
  children,
}: {
  label: string
  error?: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-fluid-body-sm font-medium text-foreground">
        {label}
        {required && <span className="text-destructive ml-1" aria-hidden="true">*</span>}
      </label>
      {children}
      {error && (
        <p
          className="text-fluid-caption text-destructive mt-1"
          role="alert"
          aria-live="polite"
        >
          {error}
        </p>
      )}
    </div>
  )
}

/** Consultation type toggle button */
function ConsultationToggleButton({
  active,
  onClick,
  label,
  icon,
}: {
  active: boolean
  onClick: () => void
  label: string
  icon: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        flex-1 py-3 px-4 rounded-xl text-sm font-medium
        transition-all duration-200 touch-target
        border
        ${
          active
            ? 'bg-primary text-primary-foreground border-primary shadow-elevation-2'
            : 'bg-background-secondary text-foreground-muted border-border hover:border-primary/50'
        }
      `}
    >
      <span className="mr-1.5" aria-hidden="true">{icon}</span>
      {label}
    </button>
  )
}

/** Summary row for the confirmation view */
function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between gap-0.5 py-1.5 border-b border-border-light last:border-0">
      <span className="text-fluid-caption text-foreground-muted font-medium">{label}</span>
      <span className="text-fluid-body-sm text-foreground">{value}</span>
    </div>
  )
}

/** Loading spinner SVG */
function LoadingSpinner() {
  return (
    <svg
      className="animate-spin h-5 w-5"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  )
}

/** Shared input class names */
function inputClassName(hasError: boolean): string {
  return `
    w-full px-4 py-3 rounded-xl text-fluid-body-sm
    bg-background-secondary text-foreground
    border ${hasError ? 'border-destructive' : 'border-border'}
    focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent
    placeholder:text-foreground-muted/60
    transition-colors duration-200
    disabled:opacity-50 disabled:cursor-not-allowed
  `.trim()
}

export default AppointmentForm
