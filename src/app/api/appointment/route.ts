import { NextResponse } from 'next/server';

import { supabaseAdmin } from '@/lib/supabase/admin';
import { appointmentFormSchema } from '@/lib/validators/appointment';
import { sendAppointmentNotifications } from '@/lib/whatsapp/send';
import type { AppointmentResponse } from '@/types';

/**
 * POST /api/appointment
 *
 * Handles appointment form submissions:
 * 1. Validates request body with Zod schema
 * 2. Stores appointment in Supabase `appointments` table
 * 3. Sends WhatsApp notification to Dr. Savita + auto-acknowledgment to patient
 * 4. Returns confirmation response with booking details
 *
 * Requirements: 6.2, 6.4, 6.6, 23.1, 23.2, 23.3
 */
export async function POST(request: Request) {
  try {
    // 1. Parse request body
    const body = await request.json();

    // 2. Validate with Zod schema
    const validation = appointmentFormSchema.safeParse(body);

    if (!validation.success) {
      // 3. On validation failure: return 400 with field errors
      const fieldErrors = validation.error.flatten().fieldErrors;
      return NextResponse.json(
        {
          success: false,
          errors: fieldErrors,
          message: 'Validation failed. Please check the form fields.',
        },
        { status: 400 }
      );
    }

    const formData = validation.data;

    // 4. Store in Supabase appointments table
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: appointment, error: dbError } = await (supabaseAdmin as any)
      .from('appointments')
      .insert({
        patient_name: formData.patientName,
        phone_number: formData.phoneNumber,
        email: formData.email || null,
        preferred_date: formData.preferredDate,
        preferred_time: formData.preferredTime,
        consultation_type: formData.consultationType,
        reason_for_visit: formData.reasonForVisit,
        status: 'pending',
        whatsapp_sent: false,
      })
      .select('id')
      .single();

    if (dbError || !appointment) {
      console.error('[Appointment API] Supabase insert error:', dbError);
      const errorResponse: AppointmentResponse = {
        success: false,
        bookingId: '',
        message: 'Failed to save appointment. Please try again or call the clinic directly.',
        whatsappSent: false,
      };
      return NextResponse.json(errorResponse, { status: 500 });
    }

    const bookingId = (appointment as { id: string }).id;

    // 5. Send WhatsApp notifications (doctor + patient acknowledgment)
    let whatsappSent = false;
    try {
      const result = await sendAppointmentNotifications({
        patientName: formData.patientName,
        phoneNumber: formData.phoneNumber,
        preferredDate: formData.preferredDate,
        preferredTime: formData.preferredTime,
        consultationType: formData.consultationType,
        reasonForVisit: formData.reasonForVisit,
      });

      whatsappSent = result.doctorNotified;

      // Update the appointment record with WhatsApp send status
      if (whatsappSent) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (supabaseAdmin as any)
          .from('appointments')
          .update({ whatsapp_sent: true })
          .eq('id', bookingId);
      }
    } catch (whatsappError) {
      // WhatsApp failure should not block the appointment booking
      console.error('[Appointment API] WhatsApp notification error:', whatsappError);
    }

    // 6. Return success response
    const dateFormatted = new Date(formData.preferredDate).toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const confirmationMessage = whatsappSent
      ? `Your appointment has been booked successfully! ` +
        `Booking ID: ${bookingId}. ` +
        `Date: ${dateFormatted}, Time: ${formData.preferredTime}, ` +
        `Type: ${formData.consultationType === 'in-person' ? 'In-Person' : 'Online'}. ` +
        `The clinic will respond within 24 hours.`
      : `Your appointment has been booked successfully! ` +
        `Booking ID: ${bookingId}. ` +
        `Date: ${dateFormatted}, Time: ${formData.preferredTime}, ` +
        `Type: ${formData.consultationType === 'in-person' ? 'In-Person' : 'Online'}. ` +
        `WhatsApp notification could not be sent. Please call the clinic directly at 9800206704 to confirm your appointment.`;

    const response: AppointmentResponse = {
      success: true,
      bookingId,
      message: confirmationMessage,
      whatsappSent,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('[Appointment API] Unexpected error:', error);
    const errorResponse: AppointmentResponse = {
      success: false,
      bookingId: '',
      message: 'An unexpected error occurred. Please try again or call the clinic directly at 9800206704.',
      whatsappSent: false,
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}
