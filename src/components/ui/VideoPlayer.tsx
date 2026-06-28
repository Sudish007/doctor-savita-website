"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";

/**
 * VideoPlayer — Vertical video player component (9:16 aspect ratio).
 *
 * Features:
 * - Auto-play on scroll-into-view (muted by default)
 * - Tap/click to unmute/mute toggle
 * - Title and duration overlay on thumbnail
 * - Placeholder gradient thumbnails for CMS-ready content
 *
 * Requirements: 38.1, 38.2, 38.3
 */

export interface VideoPlayerProps {
  id: string;
  title: string;
  duration: string;
  thumbnailGradient: string;
  category: string;
}

export function VideoPlayer({
  title,
  duration,
  thumbnailGradient,
  category,
}: VideoPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);

  // Intersection Observer for auto-play on scroll-into-view
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
        if (entry.isIntersecting) {
          setIsPlaying(true);
        } else {
          setIsPlaying(false);
          setIsMuted(true); // Reset mute when scrolling away
        }
      },
      { threshold: 0.6 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => !prev);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative flex-shrink-0 w-[220px] sm:w-[260px] md:w-[280px] rounded-2xl overflow-hidden cursor-pointer group"
      style={{ aspectRatio: "9 / 16" }}
      onClick={toggleMute}
      role="button"
      tabIndex={0}
      aria-label={`${title} - ${isMuted ? "tap to unmute" : "tap to mute"}`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          toggleMute();
        }
      }}
    >
      {/* Placeholder thumbnail gradient */}
      <div
        className="absolute inset-0"
        style={{ background: thumbnailGradient }}
      />

      {/* Animated "playing" indicator */}
      {isPlaying && isInView && (
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            className="flex items-end gap-[3px] h-8"
            animate={{ opacity: 1 }}
            initial={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {[0, 1, 2, 3].map((i) => (
              <motion.div
                key={i}
                className="w-[4px] rounded-full bg-white/80"
                animate={{
                  height: ["8px", "24px", "12px", "20px", "8px"],
                }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  delay: i * 0.15,
                  ease: "easeInOut",
                }}
              />
            ))}
          </motion.div>
        </div>
      )}

      {/* Play icon when not in view */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="white"
              aria-hidden="true"
            >
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          </div>
        </div>
      )}

      {/* Mute/Unmute indicator */}
      <div className="absolute top-3 right-3 z-10">
        <div
          className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center
            transition-transform duration-200 group-hover:scale-110"
        >
          {isMuted ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <line x1="23" y1="9" x2="17" y2="15" />
              <line x1="17" y1="9" x2="23" y2="15" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
            </svg>
          )}
        </div>
      </div>

      {/* Bottom gradient overlay for text readability */}
      <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/70 to-transparent" />

      {/* Title and duration overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
        <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-medium uppercase tracking-wide bg-white/20 backdrop-blur-sm text-white mb-2">
          {category}
        </span>
        <h4 className="text-white text-sm font-medium leading-snug line-clamp-2 mb-1">
          {title}
        </h4>
        <div className="flex items-center gap-2">
          <span className="text-white/70 text-xs">{duration}</span>
          <span className="w-1 h-1 rounded-full bg-white/50" />
          <span className="text-white/70 text-xs">
            {isPlaying ? "Playing" : "Tap to play"}
          </span>
        </div>
      </div>
    </div>
  );
}
