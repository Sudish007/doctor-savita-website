"use client";

import { useRef, useState, useCallback } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { VideoPlayer, type VideoPlayerProps } from "@/components/ui/VideoPlayer";

/**
 * Health Tips Videos — Reels/Shorts style video section.
 *
 * Features:
 * - Vertical video viewer (9:16 aspect ratio) with placeholder thumbnails
 * - Auto-play on scroll-into-view (muted), tap/click to unmute
 * - Title, duration overlay on thumbnails
 * - Vertical swipe on mobile (CSS snap scroll), horizontal scroll with arrows on desktop
 * - "Subscribe to MedyFacts" CTA after every 3rd video placeholder
 * - Glassmorphism card styling for the section
 * - Mock video data (8 entries with titles and durations)
 *
 * Requirements: 38.1, 38.2, 38.3, 38.4, 38.5, 38.7
 */

// ─── Mock Video Data ─────────────────────────────────────────────────────────

const MOCK_VIDEOS: VideoPlayerProps[] = [
  {
    id: "v1",
    title: "5 Morning Habits for Natural Immunity Boost",
    duration: "0:45",
    thumbnailGradient:
      "linear-gradient(135deg, #059669 0%, #10b981 40%, #34d399 100%)",
    category: "Immunity",
  },
  {
    id: "v2",
    title: "Home Remedies for Seasonal Allergies",
    duration: "1:12",
    thumbnailGradient:
      "linear-gradient(135deg, #047857 0%, #065f46 40%, #0d9488 100%)",
    category: "Skin Care",
  },
  {
    id: "v3",
    title: "Understanding Homeopathic Potencies Explained",
    duration: "0:58",
    thumbnailGradient:
      "linear-gradient(135deg, #14b8a6 0%, #0f766e 40%, #134e4a 100%)",
    category: "Education",
  },
  {
    id: "v4",
    title: "Quick Tips for Better Digestion After Meals",
    duration: "0:32",
    thumbnailGradient:
      "linear-gradient(135deg, #528c52 0%, #3f703f 40%, #345a34 100%)",
    category: "Digestion",
  },
  {
    id: "v5",
    title: "Natural Stress Relief: Breathing Techniques",
    duration: "1:05",
    thumbnailGradient:
      "linear-gradient(135deg, #34d399 0%, #10b981 40%, #059669 100%)",
    category: "Mental Wellness",
  },
  {
    id: "v6",
    title: "Child Health: Building Immunity Naturally",
    duration: "0:50",
    thumbnailGradient:
      "linear-gradient(135deg, #6ee7b7 0%, #34d399 40%, #10b981 100%)",
    category: "Child Care",
  },
  {
    id: "v7",
    title: "Winter Skin Care with Homeopathy",
    duration: "0:42",
    thumbnailGradient:
      "linear-gradient(135deg, #0d9488 0%, #14b8a6 40%, #5eead4 100%)",
    category: "Skin Care",
  },
  {
    id: "v8",
    title: "Women's Health: Balancing Hormones Naturally",
    duration: "1:15",
    thumbnailGradient:
      "linear-gradient(135deg, #065f46 0%, #047857 40%, #059669 100%)",
    category: "Women's Health",
  },
];

// ─── Subscribe CTA Component ─────────────────────────────────────────────────

function SubscribeCTA() {
  return (
    <div
      className="flex-shrink-0 w-[220px] sm:w-[260px] md:w-[280px] rounded-2xl overflow-hidden flex flex-col items-center justify-center p-6 text-center"
      style={{
        aspectRatio: "9 / 16",
        background: "var(--glass-bg-heavy)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        border: "1px solid var(--glass-border)",
        boxShadow: "var(--glass-shadow)",
      }}
    >
      {/* WhatsApp icon */}
      <div className="w-16 h-16 rounded-full bg-[#25D366] flex items-center justify-center mb-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="white"
          aria-hidden="true"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </div>

      <h4 className="text-foreground font-heading font-semibold text-base mb-2">
        Subscribe to MedyFacts
      </h4>
      <p className="text-foreground-muted text-sm mb-5 leading-relaxed">
        Free health tips &amp; homeopathy insights from Dr. Savita
      </p>

      <a
        href="https://whatsapp.com/channel/0029Vb5VAylJf05gA0p75W1Q"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium
          bg-[#25D366] hover:bg-[#20BD5A] text-white
          transition-colors duration-200 touch-target
          focus-visible:outline-2 focus-visible:outline-[#25D366]"
        aria-label="Join MedyFacts WhatsApp Channel"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
        Join Channel
      </a>
    </div>
  );
}

// ─── Scroll Arrow Button ─────────────────────────────────────────────────────

function ScrollArrow({
  direction,
  onClick,
  disabled,
}: {
  direction: "left" | "right";
  onClick: () => void;
  disabled: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`hidden md:flex absolute top-1/2 -translate-y-1/2 z-20
        w-10 h-10 rounded-full items-center justify-center
        bg-card/80 backdrop-blur-sm border border-card-border
        shadow-lg hover:bg-card hover:scale-105
        transition-all duration-200 touch-target
        focus-visible:outline-2 focus-visible:outline-primary
        disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100
        ${direction === "left" ? "left-2" : "right-2"}`}
      aria-label={`Scroll ${direction}`}
      type="button"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className={direction === "left" ? "rotate-180" : ""}
      >
        <path d="M5 12h14" />
        <path d="m12 5 7 7-7 7" />
      </svg>
    </button>
  );
}

// ─── Main Section Component ──────────────────────────────────────────────────

export function HealthTipsVideos() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const prefersReducedMotion = useReducedMotion();

  // Build interleaved content: video, video, video, CTA, video, video, video, CTA...
  const contentItems: Array<
    { type: "video"; data: VideoPlayerProps } | { type: "cta" }
  > = [];
  let videoCount = 0;
  for (const video of MOCK_VIDEOS) {
    contentItems.push({ type: "video", data: video });
    videoCount++;
    if (videoCount % 3 === 0) {
      contentItems.push({ type: "cta" });
    }
  }

  const updateScrollState = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  }, []);

  const scroll = useCallback(
    (direction: "left" | "right") => {
      const el = scrollContainerRef.current;
      if (!el) return;
      const scrollAmount = 300;
      el.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: prefersReducedMotion ? "auto" : "smooth",
      });
    },
    [prefersReducedMotion]
  );

  return (
    <section
      id="health-tips-videos"
      className="section-padding nature-overlay"
      aria-labelledby="health-tips-heading"
    >
      <div className="container-content">
        {/* Section Header */}
        <motion.div
          className="text-center mb-8 md:mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-block px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wide bg-accent-light text-accent-foreground mb-3">
            Health Tips Videos
          </span>
          <h2
            id="health-tips-heading"
            className="text-fluid-h3 font-heading text-foreground mb-3"
          >
            Quick Health Insights
          </h2>
          <p className="text-foreground-muted max-w-md mx-auto text-sm md:text-base">
            Bite-sized homeopathy tips from Dr. Savita — watch, learn, and stay
            healthy.
          </p>
        </motion.div>

        {/* Video Carousel with Glassmorphism wrapper */}
        <motion.div
          className="relative rounded-3xl p-4 md:p-6"
          style={{
            background: "var(--glass-bg)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            border: "1px solid var(--glass-border)",
            boxShadow: "var(--glass-shadow)",
          }}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {/* Desktop scroll arrows */}
          <ScrollArrow
            direction="left"
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
          />
          <ScrollArrow
            direction="right"
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
          />

          {/* Scrollable container */}
          {/* Mobile: vertical snap scroll (overflow-y), Desktop: horizontal scroll (overflow-x) */}
          <div
            ref={scrollContainerRef}
            className="
              flex md:flex-row flex-col
              gap-4
              overflow-y-auto md:overflow-y-visible
              md:overflow-x-auto
              max-h-[70vh] md:max-h-none
              snap-y md:snap-x snap-mandatory
              scrollbar-hide
              py-2 md:py-0 px-0 md:px-2
            "
            onScroll={updateScrollState}
            role="list"
            aria-label="Health tips video list"
          >
            {contentItems.map((item, index) => (
              <div
                key={
                  item.type === "video" ? item.data.id : `cta-${index}`
                }
                className="snap-center flex-shrink-0"
                role="listitem"
              >
                {item.type === "video" ? (
                  <VideoPlayer {...item.data} />
                ) : (
                  <SubscribeCTA />
                )}
              </div>
            ))}
          </div>

          {/* Scroll hint for mobile */}
          <div className="md:hidden flex justify-center mt-3">
            <div className="flex items-center gap-1 text-xs text-foreground-muted">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M12 5v14" />
                <path d="m19 12-7 7-7-7" />
              </svg>
              Swipe to explore
            </div>
          </div>

          {/* Desktop dot indicators */}
          <div className="hidden md:flex justify-center mt-4 gap-1.5">
            {MOCK_VIDEOS.map((_, i) => (
              <div
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-foreground-muted/30"
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
