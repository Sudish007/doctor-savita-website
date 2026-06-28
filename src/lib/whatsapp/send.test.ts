import { describe, it, expect } from 'vitest'

import {
  formatAppointmentNotification,
  formatPatientAcknowledgment,
  isDuringClinicHours,
} from './send'

import type { AppointmentFormData } from '@/types'

const sampleData: AppointmentFormData = {
  patientName: 'Rahul Kumar',
  phoneNumber: '9876543210',
  email: 'rahul@example.com',
  preferredDate: '2025-07-15',
  preferredTime: '10:00',
  consultationType: 'in-person',
  reasonForVisit: 'Chronic headache and fatigue',
}

describe('formatAppointmentNotification', () => {
  it('formats a doctor-facing notification with all appointment details', () => {
    const result = formatAppointmentNotification(sampleData)

    expect(result).toContain('🏥 New Appointment Request')
    expect(result).toContain('Patient: Rahul Kumar')
    expect(result).toContain('Phone: 9876543210')
    expect(result).toContain('Date: 2025-07-15')
    expect(result).toContain('Time: 10:00')
    expect(result).toContain('Type: in-person')
    expect(result).toContain('Reason: Chronic headache and fatigue')
  })

  it('handles online consultation type', () => {
    const onlineData = { ...sampleData, consultationType: 'online' as const }
    const result = formatAppointmentNotification(onlineData)
    expect(result).toContain('Type: online')
  })
})

describe('formatPatientAcknowledgment', () => {
  it('includes "respond shortly" when during clinic hours', () => {
    const result = formatPatientAcknowledgment(sampleData, true)

    expect(result).toContain('Hi Rahul Kumar')
    expect(result).toContain('Your appointment request has been received.')
    expect(result).toContain('Dr. Savita will respond shortly.')
    expect(result).toContain('Date: 2025-07-15')
    expect(result).toContain('Time: 10:00')
    expect(result).toContain('Type: in-person')
  })

  it('includes "confirm within 12 hours" when outside clinic hours', () => {
    const result = formatPatientAcknowledgment(sampleData, false)

    expect(result).toContain('Hi Rahul Kumar')
    expect(result).toContain('Your appointment request has been received.')
    expect(result).toContain('Dr. Savita will confirm within 12 hours.')
    expect(result).toContain('Date: 2025-07-15')
    expect(result).toContain('Time: 10:00')
    expect(result).toContain('Type: in-person')
  })
})

describe('isDuringClinicHours', () => {
  it('returns true for Monday at 09:00', () => {
    // Monday, July 14, 2025 at 09:00
    const date = new Date(2025, 6, 14, 9, 0)
    expect(isDuringClinicHours(date)).toBe(true)
  })

  it('returns true for Saturday at 17:59', () => {
    // Saturday, July 19, 2025 at 17:59
    const date = new Date(2025, 6, 19, 17, 59)
    expect(isDuringClinicHours(date)).toBe(true)
  })

  it('returns false for Sunday at 10:00', () => {
    // Sunday, July 20, 2025 at 10:00
    const date = new Date(2025, 6, 20, 10, 0)
    expect(isDuringClinicHours(date)).toBe(false)
  })

  it('returns false before 09:00', () => {
    // Monday, July 14, 2025 at 08:59
    const date = new Date(2025, 6, 14, 8, 59)
    expect(isDuringClinicHours(date)).toBe(false)
  })

  it('returns false at exactly 18:00 (close time)', () => {
    // Monday, July 14, 2025 at 18:00
    const date = new Date(2025, 6, 14, 18, 0)
    expect(isDuringClinicHours(date)).toBe(false)
  })

  it('returns false after 18:00', () => {
    // Wednesday, July 16, 2025 at 21:30
    const date = new Date(2025, 6, 16, 21, 30)
    expect(isDuringClinicHours(date)).toBe(false)
  })

  it('returns true for Wednesday at 12:00 (midday)', () => {
    // Wednesday, July 16, 2025 at 12:00
    const date = new Date(2025, 6, 16, 12, 0)
    expect(isDuringClinicHours(date)).toBe(true)
  })
})
