"use client";

import { useState } from "react";

/**
 * Post-visit feedback card — asks patients to rate their visit.
 * Shows after they've been to the clinic (could be triggered by queue completion).
 * Simple star rating + optional comment + Google review redirect.
 */
export function FeedbackCard() {
  const [rating, setRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [hoveredStar, setHoveredStar] = useState(0);

  if (submitted) {
    return (
      <div className="px-5 py-6 rounded-2xl bg-background-secondary border border-border text-center">
        <span className="text-3xl mb-2 block">🙏</span>
        <p className="text-fluid-body font-semibold text-foreground">Thank you!</p>
        <p className="text-fluid-caption text-foreground-muted mt-1">
          Your feedback helps us serve you better.
        </p>
        {rating >= 4 && (
          <a
            href="https://g.page/r/YOUR_GOOGLE_REVIEW_LINK/review"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-3 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:bg-primary-hover transition-colors"
          >
            ⭐ Rate us on Google
          </a>
        )}
      </div>
    );
  }

  return (
    <div className="px-5 py-6 rounded-2xl bg-background-secondary border border-border">
      <h3 className="text-fluid-body font-heading font-semibold text-foreground mb-1">
        How was your visit?
      </h3>
      <p className="text-fluid-caption text-foreground-muted mb-4">
        Your feedback helps Dr. Savita improve her care
      </p>

      {/* Star rating */}
      <div className="flex gap-1 mb-4">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onMouseEnter={() => setHoveredStar(star)}
            onMouseLeave={() => setHoveredStar(0)}
            onClick={() => setRating(star)}
            className="p-1 transition-transform hover:scale-110 active:scale-95"
            aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill={(hoveredStar || rating) >= star ? "#EAB308" : "none"}
              stroke={(hoveredStar || rating) >= star ? "#EAB308" : "currentColor"}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-foreground-muted"
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          </button>
        ))}
      </div>

      {rating > 0 && (
        <button
          onClick={() => setSubmitted(true)}
          className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground font-medium text-sm hover:bg-primary-hover transition-colors"
        >
          Submit Feedback
        </button>
      )}
    </div>
  );
}
