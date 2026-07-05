"use client";

import { useState, useEffect } from "react";

/**
 * Personalized time-based greeting.
 * Shows "Good morning! 🌅", "Good afternoon! ☀️", or "Good evening! 🌙"
 * with a relevant health tip.
 */

interface Greeting {
  text: string;
  emoji: string;
  tip: string;
}

function getGreeting(): Greeting {
  const hour = new Date().getHours();

  if (hour >= 5 && hour < 12) {
    return {
      text: "Good Morning",
      emoji: "🌅",
      tip: "Start your day with warm water & a healthy breakfast",
    };
  } else if (hour >= 12 && hour < 17) {
    return {
      text: "Good Afternoon",
      emoji: "☀️",
      tip: "Stay hydrated! Drink water regularly",
    };
  } else if (hour >= 17 && hour < 21) {
    return {
      text: "Good Evening",
      emoji: "🌇",
      tip: "A light walk after dinner improves digestion",
    };
  } else {
    return {
      text: "Good Night",
      emoji: "🌙",
      tip: "Aim for 7-8 hours of sleep for better immunity",
    };
  }
}

export function TimeGreeting() {
  const [greeting, setGreeting] = useState<Greeting | null>(null);

  useEffect(() => {
    setGreeting(getGreeting());
  }, []);

  if (!greeting) return null;

  return (
    <div className="px-4 py-3 md:hidden">
      <p className="text-fluid-body font-heading font-semibold text-foreground">
        {greeting.emoji} {greeting.text}!
      </p>
      <p className="text-fluid-caption text-foreground-muted mt-0.5">
        💡 {greeting.tip}
      </p>
    </div>
  );
}
