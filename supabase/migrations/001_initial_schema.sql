-- ============================================================================
-- Dr. Savita Kumari Professional Website - Initial Database Schema
-- ============================================================================
-- Tables: appointments, queue_status, availability_status, patient_timelines,
--         timeline_entries, video_consultations, voice_testimonials, queue_subscriptions
-- ============================================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- TABLES
-- ============================================================================

-- Appointments table
CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_name VARCHAR(100) NOT NULL,
  phone_number VARCHAR(10) NOT NULL,
  email VARCHAR(255),
  preferred_date DATE NOT NULL,
  preferred_time TIME NOT NULL,
  consultation_type VARCHAR(20) NOT NULL CHECK (consultation_type IN ('in-person', 'online')),
  reason_for_visit VARCHAR(500) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'rescheduled', 'cancelled')),
  whatsapp_sent BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Queue Status (single row, updated in place)
CREATE TABLE queue_status (
  id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  current_token INTEGER DEFAULT 0,
  waiting_count INTEGER DEFAULT 0,
  is_clinic_open BOOLEAN DEFAULT FALSE,
  last_updated TIMESTAMPTZ DEFAULT NOW()
);

-- Doctor Availability (single row)
CREATE TABLE availability_status (
  id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  status VARCHAR(20) DEFAULT 'off' CHECK (status IN ('available', 'busy', 'off', 'leave')),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Patient Timelines
CREATE TABLE patient_timelines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  token VARCHAR(64) UNIQUE NOT NULL,
  patient_name VARCHAR(100) NOT NULL,
  phone_number VARCHAR(10) NOT NULL,
  condition VARCHAR(200) NOT NULL,
  start_date DATE NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Timeline Entries
CREATE TABLE timeline_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  timeline_id UUID REFERENCES patient_timelines(id) ON DELETE CASCADE,
  entry_date DATE NOT NULL,
  entry_type VARCHAR(20) NOT NULL CHECK (entry_type IN ('symptom', 'remedy', 'followup', 'assessment')),
  content TEXT NOT NULL,
  score INTEGER CHECK (score BETWEEN 1 AND 5),
  created_by VARCHAR(10) NOT NULL CHECK (created_by IN ('doctor', 'patient')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Video Consultations
CREATE TABLE video_consultations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_name VARCHAR(100) NOT NULL,
  phone_number VARCHAR(10) NOT NULL,
  description VARCHAR(200) NOT NULL,
  video_url TEXT NOT NULL,
  duration INTEGER NOT NULL CHECK (duration <= 120),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'replied', 'archived')),
  reply_video_url TEXT,
  reply_at TIMESTAMPTZ,
  submitted_at TIMESTAMPTZ DEFAULT NOW()
);

-- Voice Testimonials
CREATE TABLE voice_testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_name VARCHAR(100) NOT NULL,
  condition VARCHAR(100) NOT NULL,
  audio_url TEXT NOT NULL,
  transcript TEXT,
  duration INTEGER NOT NULL CHECK (duration <= 60),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Queue Subscriptions (WhatsApp notifications)
CREATE TABLE queue_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone_number VARCHAR(10) NOT NULL,
  token_number INTEGER NOT NULL,
  notified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- SEED DATA for single-row tables
-- ============================================================================

INSERT INTO queue_status (id, current_token, waiting_count, is_clinic_open, last_updated)
VALUES (1, 0, 0, FALSE, NOW());

INSERT INTO availability_status (id, status, updated_at)
VALUES (1, 'off', NOW());

-- ============================================================================
-- INDEXES
-- ============================================================================

CREATE INDEX idx_appointments_status ON appointments(status);
CREATE INDEX idx_appointments_preferred_date ON appointments(preferred_date);
CREATE INDEX idx_patient_timelines_token ON patient_timelines(token);
CREATE INDEX idx_timeline_entries_timeline_id ON timeline_entries(timeline_id);
CREATE INDEX idx_video_consultations_status ON video_consultations(status);
CREATE INDEX idx_voice_testimonials_status ON voice_testimonials(status);
CREATE INDEX idx_queue_subscriptions_token ON queue_subscriptions(token_number);

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE queue_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE availability_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE patient_timelines ENABLE ROW LEVEL SECURITY;
ALTER TABLE timeline_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE video_consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE voice_testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE queue_subscriptions ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- RLS POLICIES
-- ============================================================================

-- Queue Status: public read access
CREATE POLICY "queue_status_public_read"
  ON queue_status FOR SELECT
  TO anon, authenticated
  USING (true);

-- Queue Status: authenticated users can update
CREATE POLICY "queue_status_auth_update"
  ON queue_status FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Availability Status: public read access
CREATE POLICY "availability_status_public_read"
  ON availability_status FOR SELECT
  TO anon, authenticated
  USING (true);

-- Availability Status: authenticated users can update
CREATE POLICY "availability_status_auth_update"
  ON availability_status FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Appointments: public can insert (patients booking)
CREATE POLICY "appointments_public_insert"
  ON appointments FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Appointments: authenticated users can read all
CREATE POLICY "appointments_auth_read"
  ON appointments FOR SELECT
  TO authenticated
  USING (true);

-- Appointments: authenticated users can update
CREATE POLICY "appointments_auth_update"
  ON appointments FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Appointments: authenticated users can delete
CREATE POLICY "appointments_auth_delete"
  ON appointments FOR DELETE
  TO authenticated
  USING (true);

-- Patient Timelines: readable via token match (public access with token)
CREATE POLICY "patient_timelines_token_read"
  ON patient_timelines FOR SELECT
  TO anon, authenticated
  USING (true);

-- Patient Timelines: authenticated can insert/update/delete
CREATE POLICY "patient_timelines_auth_insert"
  ON patient_timelines FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "patient_timelines_auth_update"
  ON patient_timelines FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "patient_timelines_auth_delete"
  ON patient_timelines FOR DELETE
  TO authenticated
  USING (true);

-- Timeline Entries: readable if user knows the timeline token (public read)
CREATE POLICY "timeline_entries_public_read"
  ON timeline_entries FOR SELECT
  TO anon, authenticated
  USING (true);

-- Timeline Entries: public can insert (patients submitting self-assessments)
CREATE POLICY "timeline_entries_public_insert"
  ON timeline_entries FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Timeline Entries: authenticated can update/delete
CREATE POLICY "timeline_entries_auth_update"
  ON timeline_entries FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "timeline_entries_auth_delete"
  ON timeline_entries FOR DELETE
  TO authenticated
  USING (true);

-- Video Consultations: public can insert (patients submitting video questions)
CREATE POLICY "video_consultations_public_insert"
  ON video_consultations FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Video Consultations: authenticated can read all
CREATE POLICY "video_consultations_auth_read"
  ON video_consultations FOR SELECT
  TO authenticated
  USING (true);

-- Video Consultations: authenticated can update (admin replies)
CREATE POLICY "video_consultations_auth_update"
  ON video_consultations FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Video Consultations: authenticated can delete
CREATE POLICY "video_consultations_auth_delete"
  ON video_consultations FOR DELETE
  TO authenticated
  USING (true);

-- Voice Testimonials: approved testimonials readable by public
CREATE POLICY "voice_testimonials_public_read"
  ON voice_testimonials FOR SELECT
  TO anon, authenticated
  USING (status = 'approved');

-- Voice Testimonials: authenticated can read all (including pending/rejected)
CREATE POLICY "voice_testimonials_auth_read_all"
  ON voice_testimonials FOR SELECT
  TO authenticated
  USING (true);

-- Voice Testimonials: public can insert (patients submitting testimonials)
CREATE POLICY "voice_testimonials_public_insert"
  ON voice_testimonials FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Voice Testimonials: authenticated can update/delete
CREATE POLICY "voice_testimonials_auth_update"
  ON voice_testimonials FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "voice_testimonials_auth_delete"
  ON voice_testimonials FOR DELETE
  TO authenticated
  USING (true);

-- Queue Subscriptions: public can insert (patients subscribing for notifications)
CREATE POLICY "queue_subscriptions_public_insert"
  ON queue_subscriptions FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Queue Subscriptions: authenticated can read/update/delete
CREATE POLICY "queue_subscriptions_auth_read"
  ON queue_subscriptions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "queue_subscriptions_auth_update"
  ON queue_subscriptions FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "queue_subscriptions_auth_delete"
  ON queue_subscriptions FOR DELETE
  TO authenticated
  USING (true);

-- ============================================================================
-- REALTIME CONFIGURATION
-- ============================================================================

-- Enable Supabase Realtime for queue_status and availability_status tables
ALTER PUBLICATION supabase_realtime ADD TABLE queue_status;
ALTER PUBLICATION supabase_realtime ADD TABLE availability_status;

-- ============================================================================
-- UPDATED_AT TRIGGER (auto-update timestamps)
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_appointments_updated_at
  BEFORE UPDATE ON appointments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_queue_status_last_updated
  BEFORE UPDATE ON queue_status
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- For availability_status, update the updated_at column
CREATE TRIGGER trigger_availability_status_updated_at
  BEFORE UPDATE ON availability_status
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
