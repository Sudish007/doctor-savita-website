/**
 * WhatsApp notification utility via Twilio REST API.
 * Uses fetch directly to avoid adding the twilio package as a dependency.
 *
 * Validates: Requirements 6.2, 6.6, 23.1, 23.2
 */

import type { AppointmentFormData } from '@/types'

// ─── Configuration ───────────────────────────────────────────────────────────

const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID!
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN!
const TWILIO_WHATSAPP_FROM = process.env.TWILIO_WHATSAPP_FROM || 'whatsapp:+14155238886'

/** Dr. Savita's WhatsApp number */
const DOCTOR_WHATSAPP = 'whatsapp:+919971585873'

/** Retry configuration */
const RETRY_CONFIG = {
  maxRetries: 1,
  delayMs: 5000,
} as const

// ─── Core Send Function ──────────────────────────────────────────────────────

/**
 * Sends a WhatsApp message via the Twilio REST API.
 * Retries once after 5 seconds on failure.
 *
 * @param to - Recipient phone number in E.164 format (e.g., "+919876543210")
 * @param message - Plain text message body
 * @returns true if the message was sent successfully, false otherwise
 */
export async function sendWhatsAppNotification(
  to: string,
  message: string
): Promise<boolean> {
  const formattedTo = to.startsWith('whatsapp:') ? to : `whatsapp:${to}`

  for (let attempt = 0; attempt <= RETRY_CONFIG.maxRetries; attempt++) {
    if (attempt > 0) {
      await delay(RETRY_CONFIG.delayMs)
    }

    try {
      const success = await callTwilioApi(formattedTo, message)
      if (success) return true
    } catch {
      // Continue to retry
    }
  }

  return false
}

/**
 * Makes the actual HTTP call to the Twilio Messages API.
 */
async function callTwilioApi(to: string, body: string): Promise<boolean> {
  const url = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`

  const params = new URLSearchParams({
    To: to,
    From: TWILIO_WHATSAPP_FROM,
    Body: body,
  })

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${btoa(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`)}`,
    },
    body: params.toString(),
  })

  if (!response.ok) {
    const errorBody = await response.text().catch(() => 'Unknown error')
    console.error(`[WhatsApp] Twilio API error (${response.status}): ${errorBody}`)
    return false
  }

  return true
}

// ─── Message Formatting ──────────────────────────────────────────────────────

/**
 * Formats the doctor-facing notification message for a new appointment request.
 */
export function formatAppointmentNotification(data: AppointmentFormData): string {
  return `🏥 New Appointment Request

Patient: ${data.patientName}
Phone: ${data.phoneNumber}
Date: ${data.preferredDate}
Time: ${data.preferredTime}
Type: ${data.consultationType}
Reason: ${data.reasonForVisit}`
}

/**
 * Formats the patient-facing acknowledgment message.
 * Content varies based on whether the submission is during clinic hours.
 */
export function formatPatientAcknowledgment(
  data: AppointmentFormData,
  isDuringHours: boolean
): string {
  const responseNote = isDuringHours
    ? 'Dr. Savita will respond shortly.'
    : 'Dr. Savita will confirm within 12 hours.'

  return `Hi ${data.patientName},

Your appointment request has been received. ${responseNote}

📅 Date: ${data.preferredDate}
⏰ Time: ${data.preferredTime}
🏥 Type: ${data.consultationType}

Thank you for choosing Dr. Savita Kumari's clinic.`
}

// ─── Clinic Hours Utility ────────────────────────────────────────────────────

/**
 * Returns true if the given timestamp falls within clinic operating hours:
 * Monday through Saturday, 09:00 to 18:00 (IST).
 */
export function isDuringClinicHours(timestamp: Date): boolean {
  // Day of week: 0 = Sunday, 6 = Saturday
  const day = timestamp.getDay()
  if (day === 0) return false // Sunday — closed

  const hours = timestamp.getHours()
  const minutes = timestamp.getMinutes()
  const timeInMinutes = hours * 60 + minutes

  const openTime = 9 * 60   // 09:00
  const closeTime = 18 * 60 // 18:00

  return timeInMinutes >= openTime && timeInMinutes < closeTime
}

// ─── Orchestrator ────────────────────────────────────────────────────────────

/**
 * Orchestrates sending both the doctor notification and patient acknowledgment.
 * Sends messages in parallel for efficiency.
 *
 * @param data - The appointment form data
 * @returns Object indicating whether each notification was successfully sent
 */
export async function sendAppointmentNotifications(
  data: AppointmentFormData
): Promise<{ doctorNotified: boolean; patientAcknowledged: boolean }> {
  const duringHours = isDuringClinicHours(new Date())

  const doctorMessage = formatAppointmentNotification(data)
  const patientMessage = formatPatientAcknowledgment(data, duringHours)

  const patientWhatsApp = `+91${data.phoneNumber}`

  const [doctorNotified, patientAcknowledged] = await Promise.all([
    sendWhatsAppNotification(DOCTOR_WHATSAPP, doctorMessage),
    sendWhatsAppNotification(patientWhatsApp, patientMessage),
  ])

  return { doctorNotified, patientAcknowledged }
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
