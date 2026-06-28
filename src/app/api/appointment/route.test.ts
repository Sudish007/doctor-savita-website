import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock Supabase admin client
const mockSingle = vi.fn();
const mockSelect = vi.fn(() => ({ single: mockSingle }));
const mockInsert = vi.fn(() => ({ select: mockSelect }));
const mockEq = vi.fn();
const mockUpdate = vi.fn(() => ({ eq: mockEq }));
const mockFrom = vi.fn((table: string) => ({
  insert: mockInsert,
  update: mockUpdate,
  select: mockSelect,
}));

vi.mock('@/lib/supabase/admin', () => ({
  supabaseAdmin: { from: (...args: unknown[]) => mockFrom(...args) },
}));

// Mock WhatsApp send utility
const mockSendAppointmentNotifications = vi.fn();
vi.mock('@/lib/whatsapp/send', () => ({
  sendAppointmentNotifications: (...args: unknown[]) => mockSendAppointmentNotifications(...args),
}));

import { POST } from './route';

// Helper to create a valid appointment request body
function validBody() {
  // Use a future Monday date within 60 days
  const today = new Date();
  const daysUntilMonday = ((1 - today.getDay() + 7) % 7) || 7;
  const futureMonday = new Date(today);
  futureMonday.setDate(today.getDate() + daysUntilMonday);
  const dateStr = futureMonday.toISOString().split('T')[0];

  return {
    patientName: 'Test Patient',
    phoneNumber: '9876543210',
    email: 'test@example.com',
    preferredDate: dateStr,
    preferredTime: '10:00',
    consultationType: 'in-person' as const,
    reasonForVisit: 'General consultation',
  };
}

function createRequest(body: unknown): Request {
  return new Request('http://localhost:3000/api/appointment', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

describe('POST /api/appointment', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Default: Supabase insert succeeds
    mockSingle.mockResolvedValue({
      data: { id: 'test-booking-id-123' },
      error: null,
    });
    // Default: WhatsApp notifications succeed
    mockSendAppointmentNotifications.mockResolvedValue({
      doctorNotified: true,
      patientAcknowledged: true,
    });
    // Default: update succeeds
    mockEq.mockResolvedValue({ data: null, error: null });
  });

  it('returns 400 with field errors for invalid data', async () => {
    const response = await POST(createRequest({
      patientName: '',
      phoneNumber: '123', // invalid
      preferredDate: '',
      preferredTime: '',
      consultationType: 'invalid',
      reasonForVisit: '',
    }));

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.success).toBe(false);
    expect(data.errors).toBeDefined();
    expect(data.message).toContain('Validation failed');
  });

  it('returns 200 with booking details on successful submission', async () => {
    const response = await POST(createRequest(validBody()));

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.bookingId).toBe('test-booking-id-123');
    expect(data.whatsappSent).toBe(true);
    expect(data.message).toContain('booked successfully');
    expect(data.message).toContain('test-booking-id-123');
  });

  it('stores appointment in Supabase with correct fields', async () => {
    const body = validBody();
    await POST(createRequest(body));

    expect(mockFrom).toHaveBeenCalledWith('appointments');
    expect(mockInsert).toHaveBeenCalledWith({
      patient_name: body.patientName,
      phone_number: body.phoneNumber,
      email: body.email,
      preferred_date: body.preferredDate,
      preferred_time: body.preferredTime,
      consultation_type: body.consultationType,
      reason_for_visit: body.reasonForVisit,
      status: 'pending',
      whatsapp_sent: false,
    });
  });

  it('sends WhatsApp notifications with appointment data', async () => {
    const body = validBody();
    await POST(createRequest(body));

    expect(mockSendAppointmentNotifications).toHaveBeenCalledWith({
      patientName: body.patientName,
      phoneNumber: body.phoneNumber,
      preferredDate: body.preferredDate,
      preferredTime: body.preferredTime,
      consultationType: body.consultationType,
      reasonForVisit: body.reasonForVisit,
    });
  });

  it('updates whatsapp_sent in Supabase when WhatsApp succeeds', async () => {
    await POST(createRequest(validBody()));

    // Should call update on appointments table
    expect(mockFrom).toHaveBeenCalledWith('appointments');
    expect(mockUpdate).toHaveBeenCalledWith({ whatsapp_sent: true });
    expect(mockEq).toHaveBeenCalledWith('id', 'test-booking-id-123');
  });

  it('returns 500 when Supabase insert fails', async () => {
    mockSingle.mockResolvedValue({
      data: null,
      error: { message: 'DB error', code: '23505' },
    });

    const response = await POST(createRequest(validBody()));

    expect(response.status).toBe(500);
    const data = await response.json();
    expect(data.success).toBe(false);
    expect(data.whatsappSent).toBe(false);
    expect(data.message).toContain('Failed to save appointment');
  });

  it('returns success with whatsappSent=false when WhatsApp fails', async () => {
    mockSendAppointmentNotifications.mockResolvedValue({
      doctorNotified: false,
      patientAcknowledged: false,
    });

    const response = await POST(createRequest(validBody()));

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.whatsappSent).toBe(false);
    expect(data.message).toContain('call the clinic directly');
    expect(data.message).toContain('9800206704');
  });

  it('returns success with whatsappSent=false when WhatsApp throws', async () => {
    mockSendAppointmentNotifications.mockRejectedValue(new Error('Network error'));

    const response = await POST(createRequest(validBody()));

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.whatsappSent).toBe(false);
    expect(data.message).toContain('call the clinic directly');
  });

  it('handles null email (optional field)', async () => {
    const body = { ...validBody(), email: '' };
    await POST(createRequest(body));

    expect(mockInsert).toHaveBeenCalledWith(
      expect.objectContaining({ email: null })
    );
  });

  it('returns confirmation message with booking summary for success', async () => {
    const response = await POST(createRequest(validBody()));
    const data = await response.json();

    expect(data.message).toContain('Booking ID');
    expect(data.message).toContain('Date:');
    expect(data.message).toContain('Time:');
    expect(data.message).toContain('Type:');
    expect(data.message).toContain('In-Person');
  });

  it('returns 500 on unexpected errors (e.g., JSON parse failure)', async () => {
    // Create a request that will fail on .json()
    const badRequest = new Request('http://localhost:3000/api/appointment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: 'not valid json{{{',
    });

    const response = await POST(badRequest);

    expect(response.status).toBe(500);
    const data = await response.json();
    expect(data.success).toBe(false);
    expect(data.message).toContain('unexpected error');
  });
});
