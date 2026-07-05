"use client";

import { useState, useEffect } from "react";

/**
 * Live Clinic Status Widget — Shows if the clinic is currently open/closed.
 * Based on Dr. Savita's schedule:
 * - Mon-Sat: 6:00-8:00 AM & 3:00-6:00 PM
 * - Sunday: 10:00 AM - 5:00 PM
 */

interface ClinicSlot {
  open: number; // hours in 24h
  close: number;
}

const SCHEDULE: Record<number, ClinicSlot[]> = {
  0: [{ open: 10, close: 17 }], // Sunday
  1: [{ open: 6, close: 8 }, { open: 15, close: 18 }], // Monday
  2: [{ open: 6, close: 8 }, { open: 15, close: 18 }],
  3: [{ open: 6, close: 8 }, { open: 15, close: 18 }],
  4: [{ open: 6, close: 8 }, { open: 15, close: 18 }],
  5: [{ open: 6, close: 8 }, { open: 15, close: 18 }],
  6: [{ open: 6, close: 8 }, { open: 15, close: 18 }], // Saturday
};

function getClinicStatus(): { isOpen: boolean; nextSlot: string } {
  const now = new Date();
  const day = now.getDay();
  const hour = now.getHours();
  const minute = now.getMinutes();
  const currentTime = hour + minute / 60;

  const slots = SCHEDULE[day];

  for (const slot of slots) {
    if (currentTime >= slot.open && currentTime < slot.close) {
      const closeHour = slot.close > 12 ? slot.close - 12 : slot.close;
      const ampm = slot.close >= 12 ? "PM" : "AM";
      return { isOpen: true, nextSlot: `Closes at ${closeHour}:00 ${ampm}` };
    }
  }

  // Find next opening
  for (const slot of slots) {
    if (currentTime < slot.open) {
      const openHour = slot.open > 12 ? slot.open - 12 : slot.open;
      const ampm = slot.open >= 12 ? "PM" : "AM";
      return { isOpen: false, nextSlot: `Opens at ${openHour}:00 ${ampm}` };
    }
  }

  return { isOpen: false, nextSlot: "Opens tomorrow morning" };
}

export function ClinicStatus() {
  const [status, setStatus] = useState<{ isOpen: boolean; nextSlot: string } | null>(null);

  useEffect(() => {
    setStatus(getClinicStatus());
    const interval = setInterval(() => setStatus(getClinicStatus()), 60000);
    return () => clearInterval(interval);
  }, []);

  if (!status) return null;

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${
      status.isOpen
        ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
        : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
    }`}>
      <span className="relative flex h-2 w-2">
        {status.isOpen && (
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75" />
        )}
        <span className={`relative inline-flex rounded-full h-2 w-2 ${
          status.isOpen ? "bg-green-500" : "bg-red-500"
        }`} />
      </span>
      <span>{status.isOpen ? "Open Now" : "Closed"}</span>
      <span className="opacity-70">• {status.nextSlot}</span>
    </div>
  );
}
