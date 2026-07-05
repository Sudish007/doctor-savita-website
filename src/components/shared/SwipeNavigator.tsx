"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";

/**
 * SwipeNavigator — enables horizontal swipe between bottom nav tabs.
 * Swipe left = next tab, swipe right = previous tab.
 * Like Instagram's tab switching.
 */

const TAB_ORDER = ["/", "/book", "/token", "/learn"];

export function SwipeNavigator({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    function handleTouchStart(e: TouchEvent) {
      touchStartX.current = e.changedTouches[0].screenX;
    }

    function handleTouchEnd(e: TouchEvent) {
      touchEndX.current = e.changedTouches[0].screenX;
      handleSwipe();
    }

    function handleSwipe() {
      const diff = touchStartX.current - touchEndX.current;
      const threshold = 80; // Minimum swipe distance

      if (Math.abs(diff) < threshold) return;

      const currentIndex = TAB_ORDER.indexOf(pathname);
      if (currentIndex === -1) return;

      if (diff > 0) {
        // Swipe left → next tab
        const nextIndex = Math.min(currentIndex + 1, TAB_ORDER.length - 1);
        if (nextIndex !== currentIndex) router.push(TAB_ORDER[nextIndex]);
      } else {
        // Swipe right → previous tab
        const prevIndex = Math.max(currentIndex - 1, 0);
        if (prevIndex !== currentIndex) router.push(TAB_ORDER[prevIndex]);
      }
    }

    container.addEventListener("touchstart", handleTouchStart, { passive: true });
    container.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchend", handleTouchEnd);
    };
  }, [pathname, router]);

  return (
    <div ref={containerRef} className="min-h-screen">
      {children}
    </div>
  );
}
