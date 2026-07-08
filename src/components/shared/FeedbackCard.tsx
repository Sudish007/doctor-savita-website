"use client";

import { useState, useEffect } from "react";

/**
 * Post-visit feedback card.
 * - Star rating stored in localStorage
 * - If 4+ stars → prompt to leave Google review
 * - If <4 stars → thank them, suggest WhatsApp for concerns
 * - Persists across sessions so it doesn't keep asking
 */

const STORAGE_KEY = "saubhagya_feedback_submitted";

export function FeedbackCard() {
  const [rating, setRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [alreadyDone, setAlreadyDone] = useState(true); // hide by default until check

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setAlreadyDone(true);
    } else {
      setAlreadyDone(false);
    }
  }, []);

  function handleSubmit() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ rating, date: new Date().toISOString() }));
    setSubmitted(true);
  }

  // Don't show if already submitted in a previous session
  if (alreadyDone && !submitted) return null;

  if (submitted) {
    return (
      <div className="px-5 py-6 rounded-2xl bg-background-secondary border border-border text-center">
        <span className="text-3xl mb-2 block">🙏</span>
        <p className="text-fluid-body font-semibold text-foreground">Thank you!</p>
        <p className="text-fluid-caption text-foreground-muted mt-1">
          Your feedback helps us serve you better.
        </p>
        {rating >= 4 ? (
          <a
            href="https://share.google/dJHZ9F9fnstzE6zAk"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary-hover transition-colors shadow-sm"
          >
            ⭐ Rate us on Google Maps
          </a>
        ) : (
          <a
            href="https://wa.me/916204309476?text=Hi%20Dr.%20Savita%2C%20I%20have%20some%20feedback%20about%20my%20visit."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 rounded-xl bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition-colors shadow-sm"
          >
            💬 Share feedback on WhatsApp
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
      <div className="flex gap-1 mb-4 justify-center">
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
              width="36"
              height="36"
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
          onClick={handleSubmit}
          className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary-hover transition-colors shadow-sm active:scale-[0.98]"
        >
          Submit Feedback
        </button>
      )}
    </div>
  );
}
