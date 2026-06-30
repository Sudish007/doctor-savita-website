import { Resend } from 'resend'

/**
 * Email notification service using Resend.
 * Set RESEND_API_KEY env var to activate.
 * 
 * Free tier: 100 emails/day, 3000/month.
 * Sign up at https://resend.com
 */

const resend = new Resend(process.env.RESEND_API_KEY || 're_9VjQe1RX_8tZYhnfmjRHKa9dfMaLB3TeP')

const FROM_EMAIL = 'Dr. Savita Clinic <onboarding@resend.dev>'
const DOCTOR_EMAIL = 'sudishdreams@gmail.com'

interface AppointmentEmailData {
  patientName: string
  phoneNumber: string
  preferredDate: string
  preferredTime: string
  consultationType: string
  reasonForVisit: string
  paymentStatus?: string
}

/**
 * Send appointment confirmation email to patient (if email provided)
 */
export async function sendPatientConfirmationEmail(
  patientEmail: string,
  data: AppointmentEmailData
): Promise<boolean> {
  // resend always available

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: patientEmail,
      subject: `✅ Appointment Confirmed — ${data.preferredDate}`,
      html: `
        <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #059669;">✅ Appointment Confirmed</h2>
          <p>Dear <strong>${data.patientName}</strong>,</p>
          <p>Your appointment has been booked successfully with Dr. Savita Kumari.</p>
          
          <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 16px; margin: 16px 0;">
            <p style="margin: 4px 0;"><strong>📅 Date:</strong> ${data.preferredDate}</p>
            <p style="margin: 4px 0;"><strong>🕐 Time:</strong> ${data.preferredTime}</p>
            <p style="margin: 4px 0;"><strong>📋 Type:</strong> ${data.consultationType === 'online' ? 'Online' : 'In-Person'}</p>
            <p style="margin: 4px 0;"><strong>💬 Reason:</strong> ${data.reasonForVisit}</p>
            ${data.paymentStatus ? `<p style="margin: 4px 0;"><strong>💳 Payment:</strong> ${data.paymentStatus === 'paid' ? 'Paid via UPI' : 'Pay at Clinic'}</p>` : ''}
          </div>
          
          <p><strong>📍 Clinic:</strong> Saubhagya Multispeciality Clinic, Near BL Public School, Village Pipra, Siwan</p>
          <p><strong>📞 Contact:</strong> +91 62043 09476</p>
          
          <p style="color: #666; font-size: 13px;">Please arrive 10 minutes before your scheduled time. The clinic will contact you within 24 hours to confirm.</p>
          
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
          <p style="color: #999; font-size: 12px;">Dr. Savita Kumari (BHMS) | Medical Officer, AYUSH Dept., Govt. of Bihar</p>
        </div>
      `,
    })
    return true
  } catch (error) {
    console.error('[Email] Failed to send patient email:', error)
    return false
  }
}

/**
 * Send new appointment notification to doctor
 */
export async function sendDoctorNotificationEmail(data: AppointmentEmailData): Promise<boolean> {
  // resend always available

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: DOCTOR_EMAIL,
      subject: `🆕 New Appointment: ${data.patientName} — ${data.preferredDate}`,
      html: `
        <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #2563eb;">🆕 New Appointment Booking</h2>
          
          <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 12px; padding: 16px; margin: 16px 0;">
            <p style="margin: 4px 0;"><strong>👤 Patient:</strong> ${data.patientName}</p>
            <p style="margin: 4px 0;"><strong>📞 Phone:</strong> ${data.phoneNumber}</p>
            <p style="margin: 4px 0;"><strong>📅 Date:</strong> ${data.preferredDate}</p>
            <p style="margin: 4px 0;"><strong>🕐 Time:</strong> ${data.preferredTime}</p>
            <p style="margin: 4px 0;"><strong>📋 Type:</strong> ${data.consultationType}</p>
            <p style="margin: 4px 0;"><strong>💬 Reason:</strong> ${data.reasonForVisit}</p>
            ${data.paymentStatus ? `<p style="margin: 4px 0;"><strong>💳 Payment:</strong> ${data.paymentStatus}</p>` : ''}
          </div>
          
          <p><a href="https://drsavitak.netlify.app/admin/dashboard" style="display: inline-block; padding: 10px 20px; background: #059669; color: white; text-decoration: none; border-radius: 8px;">View in Admin Panel →</a></p>
          
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
          <p style="color: #999; font-size: 12px;">This is an automated notification from drsavitak.netlify.app</p>
        </div>
      `,
    })
    return true
  } catch (error) {
    console.error('[Email] Failed to send doctor notification:', error)
    return false
  }
}

/**
 * Send contact form inquiry notification to doctor
 */
export async function sendContactInquiryEmail(name: string, email: string, message: string): Promise<boolean> {
  // resend always available

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: DOCTOR_EMAIL,
      subject: `📩 New Inquiry from ${name}`,
      html: `
        <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #7c3aed;">📩 New Contact Inquiry</h2>
          
          <div style="background: #faf5ff; border: 1px solid #e9d5ff; border-radius: 12px; padding: 16px; margin: 16px 0;">
            <p style="margin: 4px 0;"><strong>👤 Name:</strong> ${name}</p>
            <p style="margin: 4px 0;"><strong>📧 Email:</strong> ${email}</p>
            <p style="margin: 8px 0;"><strong>💬 Message:</strong></p>
            <p style="background: white; padding: 12px; border-radius: 8px; border: 1px solid #e5e7eb;">${message}</p>
          </div>
          
          <p><a href="https://drsavitak.netlify.app/admin/contacts" style="display: inline-block; padding: 10px 20px; background: #7c3aed; color: white; text-decoration: none; border-radius: 8px;">View in Admin →</a></p>
          <p><a href="mailto:${email}" style="color: #7c3aed;">Reply to ${name} →</a></p>
        </div>
      `,
    })
    return true
  } catch (error) {
    console.error('[Email] Failed to send contact inquiry email:', error)
    return false
  }
}
