"use client";

/**
 * Share App button — lets patients share the app/website with family.
 * Uses Web Share API on mobile (native share sheet).
 * Falls back to WhatsApp share link.
 */
export function ShareApp() {
  const handleShare = async () => {
    const shareData = {
      title: "Saubhagya Clinic - Dr. Savita Kumari",
      text: "Book homeopathic appointments online with Dr. Savita Kumari (BHMS). Free govt. treatment + paid private consultations. Siwan, Bihar.",
      url: "https://drsavitak.netlify.app",
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // User cancelled or error
      }
    } else {
      // Fallback to WhatsApp
      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(
        `${shareData.text}\n\n${shareData.url}`
      )}`;
      window.open(whatsappUrl, "_blank");
    }
  };

  return (
    <button
      onClick={handleShare}
      className="flex items-center gap-2 px-4 py-2.5 rounded-xl
        bg-background-secondary border border-border
        text-foreground-secondary text-sm font-medium
        hover:bg-primary-light hover:text-primary hover:border-primary/30
        active:scale-95 transition-all duration-200"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
      </svg>
      Share with Family
    </button>
  );
}
