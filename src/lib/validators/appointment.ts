import { z } from "zod";

/**
 * Zod validation schema for the appointment booking form.
 * Validates: Requirements 6.1, 6.5, 6.7, 6.8
 */

/**
 * Validates that a date string is a valid ISO date that is:
 * - Not in the past
 * - Not a Sunday
 * - Not more than 60 days ahead
 */
function isEligibleDate(dateStr: string): boolean {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return false;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Not in the past
  if (date < today) return false;

  // Not a Sunday (0 = Sunday)
  if (date.getDay() === 0) return false;

  // Not more than 60 days ahead
  const maxDate = new Date(today);
  maxDate.setDate(maxDate.getDate() + 60);
  if (date > maxDate) return false;

  return true;
}

/**
 * Validates that a time string is in HH:mm format and falls within
 * valid 30-minute appointment slots: 09:00 to 17:30.
 */
function isValidTimeSlot(time: string): boolean {
  const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
  if (!timeRegex.test(time)) return false;

  const [hours, minutes] = time.split(":").map(Number);

  // Must be 30-minute intervals
  if (minutes !== 0 && minutes !== 30) return false;

  // Valid range: 09:00 to 17:30
  const totalMinutes = hours * 60 + minutes;
  const startMinutes = 9 * 60; // 09:00 = 540
  const endMinutes = 17 * 60 + 30; // 17:30 = 1050

  return totalMinutes >= startMinutes && totalMinutes <= endMinutes;
}

export const appointmentFormSchema = z.object({
  patientName: z
    .string()
    .min(1, { message: "Patient name is required" })
    .max(100, { message: "Patient name must be 100 characters or fewer" }),

  phoneNumber: z
    .string()
    .regex(/^[6-9]\d{9}$/, {
      message: "Phone number must be a valid 10-digit Indian mobile number starting with 6-9",
    }),

  email: z
    .string()
    .email({ message: "Please enter a valid email address" })
    .optional()
    .or(z.literal("")),

  preferredDate: z
    .string()
    .min(1, { message: "Preferred date is required" })
    .refine(isEligibleDate, {
      message: "Date must be a valid weekday (not Sunday), not in the past, and within 60 days",
    }),

  preferredTime: z
    .string()
    .min(1, { message: "Preferred time is required" })
    .refine(isValidTimeSlot, {
      message: "Time must be a valid 30-minute slot between 09:00 and 17:30",
    }),

  consultationType: z.enum(["in-person", "online"], {
    message: "Consultation type must be 'in-person' or 'online'",
  }),

  reasonForVisit: z
    .string()
    .min(1, { message: "Reason for visit is required" })
    .max(500, { message: "Reason for visit must be 500 characters or fewer" }),
});

export type AppointmentFormSchema = z.infer<typeof appointmentFormSchema>;

// Export utility functions for reuse
export { isEligibleDate, isValidTimeSlot };

/**
 * Configurable list of clinic holidays (ISO date strings: "YYYY-MM-DD").
 * Empty by default; can be populated from CMS or environment config.
 */
export const CLINIC_HOLIDAYS: string[] = [];

/**
 * Generates available 30-minute time slots for a given day of the week.
 * Mon-Sat (1-6): returns 18 slots from 09:00 to 17:30.
 * Sunday (0): returns an empty array (clinic closed).
 *
 * @param dayOfWeek - 0 (Sunday) through 6 (Saturday)
 * @returns Array of time strings in "HH:mm" format
 */
export function generateTimeSlots(dayOfWeek: number): string[] {
  // Sunday — clinic closed
  if (dayOfWeek === 0) return [];

  const slots: string[] = [];
  const startHour = 9;
  const startMinute = 0;
  const endHour = 17;
  const endMinute = 30;

  let hour = startHour;
  let minute = startMinute;

  while (hour < endHour || (hour === endHour && minute <= endMinute)) {
    const hh = String(hour).padStart(2, "0");
    const mm = String(minute).padStart(2, "0");
    slots.push(`${hh}:${mm}`);

    minute += 30;
    if (minute >= 60) {
      minute = 0;
      hour += 1;
    }
  }

  return slots;
}

/**
 * Returns the next 60 days with enabled/disabled status.
 * A date is disabled if it is a Sunday or falls on a clinic holiday.
 *
 * @param holidays - Optional array of ISO date strings ("YYYY-MM-DD") to disable
 * @returns Array of objects with date and enabled flag
 */
export function getEligibleDates(
  holidays: string[] = CLINIC_HOLIDAYS
): { date: Date; enabled: boolean }[] {
  const results: { date: Date; enabled: boolean }[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const holidaySet = new Set(holidays);

  for (let i = 0; i < 60; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);

    const isSunday = date.getDay() === 0;
    const dateStr = date.toISOString().split("T")[0];
    const isHoliday = holidaySet.has(dateStr);

    results.push({
      date: new Date(date),
      enabled: !isSunday && !isHoliday,
    });
  }

  return results;
}
