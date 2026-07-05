"use client";

import { useState, useEffect } from "react";

export function AppointmentCountdown() {
  const [countdown, setCountdown] = useState<string | null>(null);

  useEffect(() => {
    function getNextAppointment() {
      try {
        const stored = localStorage.getItem("saubhagya_appointments");
        if (!stored) return null;
        const appointments = JSON.parse(stored);
        if (!Array.isArray(appointments) || appointments.length === 0) return null;

        const now = new Date().getTime();
        // Find the next upcoming appointment
        const upcoming = appointments
          .map((apt: any) => {
            const time = new Date(apt.date || apt.datetime || apt.time).getTime();
            return { ...apt, timestamp: time };
          })
          .filter((apt: any) => apt.timestamp > now)
          .sort((a: any, b: any) => a.timestamp - b.timestamp);

        return upcoming.length > 0 ? upcoming[0] : null;
      } catch {
        return null;
      }
    }

    function updateCountdown() {
      const next = getNextAppointment();
      if (!next) {
        setCountdown(null);
        return;
      }

      const now = new Date().getTime();
      const diff = next.timestamp - now;

      if (diff <= 0) {
        setCountdown(null);
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      if (hours > 24) {
        const days = Math.floor(hours / 24);
        setCountdown(`${days} day${days > 1 ? "s" : ""} ${hours % 24}h`);
      } else {
        setCountdown(`${hours}h ${minutes}m`);
      }
    }

    updateCountdown();
    const interval = setInterval(updateCountdown, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  if (!countdown) return null;

  return (
    <div className="px-4 pb-2">
      <div className="flex items-center gap-2 px-3 py-2 bg-teal-50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800 rounded-xl">
        <span className="text-lg">⏰</span>
        <p className="text-sm text-teal-800 dark:text-teal-200 font-medium">
          Your next appointment is in <span className="font-bold">{countdown}</span>
        </p>
      </div>
    </div>
  );
}
