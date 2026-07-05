"use client";

import { useState, useEffect } from "react";

/**
 * Offline indicator banner.
 * Listens to navigator.onLine and online/offline events.
 * Shows a fixed banner at the top when the device is offline.
 */
export function OfflineIndicator() {
  const [isOffline, setIsOffline] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Set initial state
    setIsOffline(!navigator.onLine);

    function handleOffline() {
      setIsOffline(true);
      setIsDismissed(false);
    }

    function handleOnline() {
      setIsOffline(false);
      setIsDismissed(false);
    }

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, []);

  if (!isOffline || isDismissed) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[9999] flex items-center justify-between px-4 py-2 bg-orange-600 text-white text-sm font-medium shadow-md"
      role="alert"
      aria-live="assertive"
    >
      <span>You&apos;re offline. Some features may not work.</span>
      <button
        onClick={() => setIsDismissed(true)}
        className="ml-4 p-1 rounded hover:bg-orange-700 transition-colors focus:outline-none focus:ring-2 focus:ring-white"
        aria-label="Dismiss offline notification"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  );
}
