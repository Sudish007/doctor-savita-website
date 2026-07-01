"use client";

import { useRef, useState, useCallback } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { TestimonialCarousel } from "@/components/ui/TestimonialCarousel";
import type { Testimonial } from "@/types";

/**
 * Testimonials Section — Patient reviews with carousel and voice testimonial support.
 *
 * Features:
 * - Auto-scrolling carousel (5s interval, pause on hover)
 * - Next/previous arrows with slide animation (<400ms)
 * - Wrap-around navigation (last→first, first→last)
 * - Aggregate rating summary (average to 1 decimal, total count)
 * - Audio testimonials with play button, waveform visualization, duration indicator
 * - "Submit Review" CTA button
 * - Glassmorphism card styling
 * - Framer Motion for slide transitions
 *
 * Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7, 25.1, 25.4
 */

// ─── Sample Testimonials Data ─────────────────────────────────────────────────

const TESTIMONIALS: Testimonial[] = [
  {
    id: "t1",
    patientName: "Rajesh K.",
    condition: "Chronic migraine and headaches",
    reviewText:
      "After years of suffering from severe migraines, Dr. Savita's homeopathic treatment gave me relief within 3 months. Her approach is gentle and she truly listens to every symptom. I feel like a new person now.",
    rating: 5,
  },
  {
    id: "t2",
    patientName: "Sunita Devi",
    condition: "Skin eczema and allergies",
    reviewText:
      "My daughter had persistent eczema that did not respond to allopathic creams. Dr. Savita prescribed constitutional remedies and within 6 weeks, the skin cleared beautifully. Highly recommend her patience and expertise.",
    rating: 5,
  },
  {
    id: "t3",
    patientName: "Amit S.",
    condition: "Digestive issues and acidity",
    reviewText:
      "I was dealing with chronic acidity and bloating. Dr. Savita's holistic treatment addressed the root cause, not just symptoms. Her AYUSH-approved protocols are safe and effective. I am grateful for her care.",
    rating: 4,
  },
  {
    id: "t4",
    patientName: "Priya M.",
    condition: "Anxiety and sleep disorders",
    reviewText:
      "Dr. Savita helped me manage my anxiety without heavy medications. The homeopathic remedies she prescribed helped me sleep better and feel calmer. She is very compassionate and knowledgeable.",
    rating: 5,
    isAudio: true,
    audioUrl: "/audio/testimonial-priya.mp3",
    audioDuration: 34,
  },
  {
    id: "t5",
    patientName: "Mohammad I.",
    condition: "Joint pain and arthritis",
    reviewText:
      "At my age, joint pain was constant. Dr. Savita's treatment reduced inflammation significantly. I can now walk comfortably again. The video consultation option was very convenient for me.",
    rating: 4,
  },
  {
    id: "t6",
    patientName: "Kavita R.",
    condition: "Women's health and hormonal issues",
    reviewText:
      "Dr. Savita treated my PCOS with great care and understanding. Her treatment plan was comprehensive and she followed up regularly. I saw real improvements within 2 months.",
    rating: 5,
    isAudio: true,
    audioUrl: "/audio/testimonial-kavita.mp3",
    audioDuration: 42,
  },
];

// ─── Helper Functions ─────────────────────────────────────────────────────────

/** Calculate aggregate rating: average to 1 decimal place */
export function calculateAggregateRating(testimonials: Testimonial[]): {
  average: number;
  count: number;
} {
  if (testimonials.length === 0) return { average: 0, count: 0 };
  const sum = testimonials.reduce((acc, t) => acc + t.rating, 0);
  const average = Math.round((sum / testimonials.length) * 10) / 10;
  return { average, count: testimonials.length };
}

/** Format audio duration in m:ss format */
function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

// ─── Sub-Components ───────────────────────────────────────────────────────────

/** Star Rating Display */
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <StarIcon key={i} filled={i < rating} />
      ))}
    </div>
  );
}

function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={filled ? 0 : 1.5}
      className={`w-5 h-5 ${
        filled
          ? "text-amber-400 dark:text-amber-300"
          : "text-foreground-muted/40"
      }`}
      aria-hidden="true"
    >
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

/** Aggregate Rating Summary */
function AggregateRating({
  average,
  count,
}: {
  average: number;
  count: number;
}) {
  return (
    <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
      <div className="flex items-center gap-2">
        <span className="text-3xl md:text-4xl font-heading font-bold text-foreground">
          {average.toFixed(1)}
        </span>
        <div className="flex flex-col">
          <StarRating rating={Math.round(average)} />
          <span className="text-sm text-foreground-muted mt-0.5">
            {count} patient {count === 1 ? "review" : "reviews"}
          </span>
        </div>
      </div>
    </div>
  );
}

/** Audio Testimonial Player */
function AudioPlayer({
  audioUrl,
  duration,
}: {
  audioUrl: string;
  duration: number;
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const togglePlay = useCallback(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(audioUrl);
      audioRef.current.addEventListener("ended", () => setIsPlaying(false));
    }

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(() => setIsPlaying(false));
      setIsPlaying(true);
    }
  }, [isPlaying, audioUrl]);

  return (
    <div className="flex items-center gap-3 mt-3 p-3 rounded-xl bg-primary-light/50 dark:bg-primary-light/20">
      {/* Play/Pause button */}
      <button
        onClick={togglePlay}
        className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary-hover transition-colors duration-200 touch-target"
        aria-label={isPlaying ? "Pause audio testimonial" : "Play audio testimonial"}
      >
        {isPlaying ? <PauseIcon className="w-4 h-4" /> : <PlayIcon className="w-4 h-4 ml-0.5" />}
      </button>

      {/* Waveform visualization */}
      <div className="flex items-center gap-[3px] flex-1 h-8" aria-hidden="true">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className={`w-[3px] rounded-full transition-all duration-200 ${
              isPlaying
                ? "bg-primary animate-pulse"
                : "bg-primary/40"
            }`}
            style={{
              height: `${Math.max(20, Math.sin(i * 0.8) * 60 + 50)}%`,
              animationDelay: isPlaying ? `${i * 50}ms` : "0ms",
            }}
          />
        ))}
      </div>

      {/* Duration */}
      <span className="text-sm font-medium text-foreground-secondary flex-shrink-0">
        {formatDuration(duration)}
      </span>
    </div>
  );
}

/** Single Testimonial Card */
function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <div className="glass-card p-6 md:p-8 rounded-2xl max-w-2xl mx-auto">
      {/* Header: name, condition, rating */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          {/* Avatar/Initials */}
          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-heading font-semibold text-lg">
            {testimonial.patientName.charAt(0)}
          </div>
          <div>
            <h4 className="text-base font-heading font-semibold text-foreground">
              {testimonial.patientName}
            </h4>
            <p className="text-sm text-foreground-muted line-clamp-1">
              {testimonial.condition}
            </p>
          </div>
        </div>
        <StarRating rating={testimonial.rating} />
      </div>

      {/* Review text */}
      <blockquote className="text-foreground-secondary leading-relaxed text-fluid-body-sm italic">
        &ldquo;{testimonial.reviewText}&rdquo;
      </blockquote>

      {/* Audio player for voice testimonials */}
      {testimonial.isAudio && testimonial.audioUrl && testimonial.audioDuration && (
        <AudioPlayer
          audioUrl={testimonial.audioUrl}
          duration={testimonial.audioDuration}
        />
      )}

      {/* Voice testimonial badge */}
      {testimonial.isAudio && (
        <div className="flex items-center gap-1.5 mt-3">
          <MicrophoneIcon className="w-4 h-4 text-primary" />
          <span className="text-xs font-medium text-primary">Voice Testimonial</span>
        </div>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function Testimonials() {
  const t = useTranslations('testimonials');
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const prefersReducedMotion = useReducedMotion();

  const { average, count } = calculateAggregateRating(TESTIMONIALS);

  return (
    <section
      id="testimonials"
      ref={sectionRef}
      className="section-padding nature-overlay"
      aria-labelledby="testimonials-title"
    >
      <div className="container-content">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{
            duration: prefersReducedMotion ? 0 : 0.6,
            ease: "easeOut",
          }}
          className="text-center mb-10 md:mb-14"
        >
          <h2
            id="testimonials-title"
            className="text-fluid-h2 font-heading text-foreground mb-4"
          >
            {t('title')}
          </h2>
          <p className="text-foreground-secondary max-w-2xl mx-auto text-fluid-body-sm mb-6">
            Real stories from patients who found relief through homeopathic
            treatment.
          </p>

          {/* Aggregate rating */}
          <div className="flex justify-center">
            <AggregateRating average={average} count={count} />
          </div>
        </motion.div>

        {/* Testimonial Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{
            duration: prefersReducedMotion ? 0 : 0.6,
            ease: "easeOut",
            delay: prefersReducedMotion ? 0 : 0.2,
          }}
          className="max-w-full mx-auto px-6 md:px-10"
        >
          <TestimonialCarousel
            itemCount={TESTIMONIALS.length}
            renderItem={(index) => (
              <TestimonialCard testimonial={TESTIMONIALS[index]} />
            )}
            autoScrollInterval={5000}
          />
        </motion.div>

        {/* Submit Review CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{
            duration: prefersReducedMotion ? 0 : 0.5,
            ease: "easeOut",
            delay: prefersReducedMotion ? 0 : 0.4,
          }}
          className="text-center mt-10 md:mt-14"
        >
          <a
            href="#submit-review"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary-hover hover:scale-[1.03] active:scale-[0.98] transition-all duration-200 shadow-elevation-2 hover:shadow-elevation-3 touch-target"
          >
            <PenIcon className="w-4 h-4" />
            Submit a Review
          </a>
          <p className="text-sm text-foreground-muted mt-3">
            Share your experience to help other patients
          </p>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Icon Components ──────────────────────────────────────────────────────────

function PlayIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

function PauseIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
    </svg>
  );
}

function MicrophoneIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" y1="19" x2="12" y2="23" />
      <line x1="8" y1="23" x2="16" y2="23" />
    </svg>
  );
}

function PenIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
    </svg>
  );
}
