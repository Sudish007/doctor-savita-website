/**
 * Supabase database type definitions.
 * Generated from the schema in supabase/migrations/001_initial_schema.sql.
 */
export type Database = {
  public: {
    Tables: {
      appointments: {
        Row: {
          id: string
          patient_name: string
          phone_number: string
          email: string | null
          preferred_date: string
          preferred_time: string
          consultation_type: 'in-person' | 'online'
          reason_for_visit: string
          status: 'pending' | 'confirmed' | 'rescheduled' | 'cancelled'
          whatsapp_sent: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          patient_name: string
          phone_number: string
          email?: string | null
          preferred_date: string
          preferred_time: string
          consultation_type: 'in-person' | 'online'
          reason_for_visit: string
          status?: 'pending' | 'confirmed' | 'rescheduled' | 'cancelled'
          whatsapp_sent?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          patient_name?: string
          phone_number?: string
          email?: string | null
          preferred_date?: string
          preferred_time?: string
          consultation_type?: 'in-person' | 'online'
          reason_for_visit?: string
          status?: 'pending' | 'confirmed' | 'rescheduled' | 'cancelled'
          whatsapp_sent?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      queue_status: {
        Row: {
          id: number
          current_token: number
          waiting_count: number
          is_clinic_open: boolean
          last_updated: string
        }
        Insert: {
          id?: number
          current_token?: number
          waiting_count?: number
          is_clinic_open?: boolean
          last_updated?: string
        }
        Update: {
          id?: number
          current_token?: number
          waiting_count?: number
          is_clinic_open?: boolean
          last_updated?: string
        }
      }
      availability_status: {
        Row: {
          id: number
          status: 'available' | 'busy' | 'off' | 'leave'
          updated_at: string
        }
        Insert: {
          id?: number
          status?: 'available' | 'busy' | 'off' | 'leave'
          updated_at?: string
        }
        Update: {
          id?: number
          status?: 'available' | 'busy' | 'off' | 'leave'
          updated_at?: string
        }
      }
      patient_timelines: {
        Row: {
          id: string
          token: string
          patient_name: string
          phone_number: string
          condition: string
          start_date: string
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          token: string
          patient_name: string
          phone_number: string
          condition: string
          start_date: string
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          token?: string
          patient_name?: string
          phone_number?: string
          condition?: string
          start_date?: string
          is_active?: boolean
          created_at?: string
        }
      }
      timeline_entries: {
        Row: {
          id: string
          timeline_id: string
          entry_date: string
          entry_type: 'symptom' | 'remedy' | 'followup' | 'assessment'
          content: string
          score: number | null
          created_by: 'doctor' | 'patient'
          created_at: string
        }
        Insert: {
          id?: string
          timeline_id: string
          entry_date: string
          entry_type: 'symptom' | 'remedy' | 'followup' | 'assessment'
          content: string
          score?: number | null
          created_by: 'doctor' | 'patient'
          created_at?: string
        }
        Update: {
          id?: string
          timeline_id?: string
          entry_date?: string
          entry_type?: 'symptom' | 'remedy' | 'followup' | 'assessment'
          content?: string
          score?: number | null
          created_by?: 'doctor' | 'patient'
          created_at?: string
        }
      }
      video_consultations: {
        Row: {
          id: string
          patient_name: string
          phone_number: string
          description: string
          video_url: string
          duration: number
          status: 'pending' | 'replied' | 'archived'
          reply_video_url: string | null
          reply_at: string | null
          submitted_at: string
        }
        Insert: {
          id?: string
          patient_name: string
          phone_number: string
          description: string
          video_url: string
          duration: number
          status?: 'pending' | 'replied' | 'archived'
          reply_video_url?: string | null
          reply_at?: string | null
          submitted_at?: string
        }
        Update: {
          id?: string
          patient_name?: string
          phone_number?: string
          description?: string
          video_url?: string
          duration?: number
          status?: 'pending' | 'replied' | 'archived'
          reply_video_url?: string | null
          reply_at?: string | null
          submitted_at?: string
        }
      }
      voice_testimonials: {
        Row: {
          id: string
          patient_name: string
          condition: string
          audio_url: string
          transcript: string | null
          duration: number
          status: 'pending' | 'approved' | 'rejected'
          created_at: string
        }
        Insert: {
          id?: string
          patient_name: string
          condition: string
          audio_url: string
          transcript?: string | null
          duration: number
          status?: 'pending' | 'approved' | 'rejected'
          created_at?: string
        }
        Update: {
          id?: string
          patient_name?: string
          condition?: string
          audio_url?: string
          transcript?: string | null
          duration?: number
          status?: 'pending' | 'approved' | 'rejected'
          created_at?: string
        }
      }
      queue_subscriptions: {
        Row: {
          id: string
          phone_number: string
          token_number: number
          notified: boolean
          created_at: string
        }
        Insert: {
          id?: string
          phone_number: string
          token_number: number
          notified?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          phone_number?: string
          token_number?: number
          notified?: boolean
          created_at?: string
        }
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}
