/**
 * Shared TypeScript types and interfaces for Dr. Savita Kumari's website.
 * Central type definitions used across all components and services.
 */

// ─── Locale & Theme ──────────────────────────────────────────────────────────

/** Supported languages: English, Hindi, Bhojpuri */
export type Locale = 'en' | 'hi' | 'bh';

/** Color theme modes */
export type ThemeMode = 'light' | 'dark';

// ─── Navigation ──────────────────────────────────────────────────────────────

export interface SectionLink {
  id: string;
  label: Record<Locale, string>;
  href: string;
}

export interface NavigationProps {
  sections: SectionLink[];
  currentLocale: Locale;
}

// ─── Hero Section ────────────────────────────────────────────────────────────

export type AvailabilityStatus = 'available' | 'busy' | 'off' | 'leave' | 'unknown';

export interface HeroProps {
  doctorName: string;
  designation: string;
  tagline: string;
  photoUrl: string;
  availabilityStatus: AvailabilityStatus;
}

// ─── Services ────────────────────────────────────────────────────────────────

export interface ServiceCard {
  id: string;
  title: Record<Locale, string>;
  description: Record<Locale, string>;
  icon: string;
  gridSpan: { cols: number; rows: number };
  bodyRegions: string[];
}

// ─── Appointment ─────────────────────────────────────────────────────────────

export type ConsultationType = 'in-person' | 'online';

export interface AppointmentFormData {
  patientName: string;
  phoneNumber: string;
  email?: string;
  preferredDate: string;
  preferredTime: string;
  consultationType: ConsultationType;
  reasonForVisit: string;
}

export interface AppointmentResponse {
  success: boolean;
  bookingId: string;
  message: string;
  whatsappSent: boolean;
}

// ─── Chat ────────────────────────────────────────────────────────────────────

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  suggestedService?: string;
}

// ─── Blog ────────────────────────────────────────────────────────────────────

export type HealthCategory =
  | 'immunity'
  | 'skin-care'
  | 'digestion'
  | 'womens-health'
  | 'child-care'
  | 'mental-wellness';

export interface BlogArticle {
  _id: string;
  title: string;
  slug: { current: string };
  body: any[];
  excerpt: string;
  featuredImage?: any;
  category: HealthCategory;
  tags: string[];
  author: string;
  publishDate: string;
  status: 'draft' | 'published' | 'scheduled';
  scheduledDate?: string;
  readingTime: number;
  language: Locale;
}

// ─── Queue ───────────────────────────────────────────────────────────────────

export interface QueueState {
  currentToken: number;
  waitingCount: number;
  estimatedWaitMinutes: number;
  isClinicOpen: boolean;
  lastUpdated: string;
}

// ─── Patient Timeline ────────────────────────────────────────────────────────

export interface TimelineEntry {
  id: string;
  patientToken: string;
  date: string;
  type: 'symptom' | 'remedy' | 'followup' | 'assessment';
  content: string;
  score?: 1 | 2 | 3 | 4 | 5;
  createdBy: 'doctor' | 'patient';
}

export interface PatientTimeline {
  token: string;
  patientName: string;
  condition: string;
  startDate: string;
  entries: TimelineEntry[];
}

// ─── Video Consultation ──────────────────────────────────────────────────────

export interface VideoQuestion {
  id: string;
  patientName: string;
  phoneNumber: string;
  description: string;
  videoUrl: string;
  duration: number;
  status: 'pending' | 'replied' | 'archived';
  submittedAt: string;
  replyVideoUrl?: string;
  replyAt?: string;
}

// ─── Contact ─────────────────────────────────────────────────────────────────

export interface ContactFormRequest {
  name: string;
  email: string;
  message: string;
}

// ─── Testimonials ────────────────────────────────────────────────────────────

export interface Testimonial {
  id: string;
  patientName: string;
  condition: string;
  reviewText: string;
  rating: 1 | 2 | 3 | 4 | 5;
  isAudio?: boolean;
  audioUrl?: string;
  audioDuration?: number;
  transcript?: string;
}
