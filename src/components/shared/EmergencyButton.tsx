"use client";

/**
 * Emergency WhatsApp button — one-tap to reach the doctor.
 * Shows prominently with a red pulse effect.
 * Sends a pre-filled emergency message.
 */
export function EmergencyButton() {
  const PHONE = "916204309476"; // Dr. Savita's number
  const message = encodeURIComponent(
    "🚨 URGENT: I need immediate medical help. Please respond as soon as possible."
  );

  return (
    <a
      href={`https://wa.me/${PHONE}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 px-4 py-3 rounded-2xl
        bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800
        hover:bg-red-100 dark:hover:bg-red-950/50
        active:scale-[0.98] transition-all"
    >
      <div className="relative">
        <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
          </svg>
        </div>
        <span className="absolute -top-0.5 -right-0.5 h-3 w-3 rounded-full bg-red-500 animate-ping" />
      </div>
      <div className="flex-1">
        <p className="text-sm font-semibold text-red-700 dark:text-red-300">Emergency Contact</p>
        <p className="text-xs text-red-600/70 dark:text-red-400/70">Tap to reach Dr. Savita on WhatsApp</p>
      </div>
    </a>
  );
}
