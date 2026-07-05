"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

/**
 * Mobile Bottom Navigation Bar — Modern app-style navigation
 * Inspired by Practo, PharmEasy, and other top Indian health apps.
 *
 * 5 tabs: Home, Book, Queue, Chat, More
 * - Appears only on mobile (<768px)
 * - Fixed at bottom with glassmorphism
 * - Active tab has animated indicator
 * - Haptic-like scale animation on tap
 */

interface NavItem {
  id: string;
  href: string;
  icon: React.ReactNode;
  activeIcon: React.ReactNode;
}

const NAV_ITEMS: NavItem[] = [
  {
    id: "home",
    href: "/",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
    activeIcon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22" fill="white" stroke="white"/>
      </svg>
    ),
  },
  {
    id: "book",
    href: "/book",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
        <line x1="16" y1="2" x2="16" y2="6"/>
        <line x1="8" y1="2" x2="8" y2="6"/>
        <line x1="3" y1="10" x2="21" y2="10"/>
        <path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/>
        <path d="M8 18h.01"/><path d="M12 18h.01"/>
      </svg>
    ),
    activeIcon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
        <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor"/>
        <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor"/>
        <line x1="3" y1="10" x2="21" y2="10" stroke="white"/>
      </svg>
    ),
  },
  {
    id: "queue",
    href: "/token",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15 5v2"/>
        <path d="M15 11v2"/>
        <path d="M15 17v2"/>
        <rect x="3" y="3" width="18" height="18" rx="2"/>
        <path d="M8 12h.01"/>
        <path d="M8 8h.01"/>
        <path d="M8 16h.01"/>
      </svg>
    ),
    activeIcon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2"/>
        <path d="M15 5v2" stroke="white"/><path d="M15 11v2" stroke="white"/><path d="M15 17v2" stroke="white"/>
      </svg>
    ),
  },
  {
    id: "learn",
    href: "/learn",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
      </svg>
    ),
    activeIcon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
      </svg>
    ),
  },
  {
    id: "more",
    href: "#more",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/>
        <circle cx="5" cy="12" r="1"/><circle cx="19" cy="12" r="1"/>
      </svg>
    ),
    activeIcon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="19" r="1.5"/>
        <circle cx="5" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/>
      </svg>
    ),
  },
];

export function BottomNav() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    if (href.startsWith("#")) return false;
    return pathname.startsWith(href);
  };

  const handleMoreClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const menuBtn = document.querySelector('[aria-label="Open navigation menu"]') as HTMLButtonElement;
    if (menuBtn) menuBtn.click();
  };

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-[60] md:hidden"
      role="navigation"
      aria-label="Bottom navigation"
    >
      {/* Fade gradient above nav */}
      <div className="absolute -top-6 left-0 right-0 h-6 bg-gradient-to-t from-background to-transparent pointer-events-none" />

      {/* Solid opaque background */}
      <div className="absolute inset-0 bg-background border-t border-border-light shadow-[0_-4px_20px_rgba(0,0,0,0.1)]" />

      {/* Navigation items */}
      <div className="relative flex items-center justify-around px-2 pb-[env(safe-area-inset-bottom,8px)] pt-2">
        {NAV_ITEMS.map((item) => {
          const active = isActive(item.href);

          // "More" button uses onClick instead of navigation
          if (item.href === "#more") {
            return (
              <button
                key={item.id}
                onClick={handleMoreClick}
                className="relative flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all duration-200 active:scale-90"
              >
                <span className="text-foreground-muted">
                  {item.icon}
                </span>
                <span className="text-[10px] font-medium text-foreground-muted">
                  More
                </span>
              </button>
            );
          }

          return (
            <Link
              key={item.id}
              href={item.href}
              prefetch={true}
              className={`relative flex flex-col items-center gap-0.5 py-1.5 px-4 rounded-2xl transition-all duration-200 active:scale-90 ${
                active ? "bg-primary/10" : ""
              }`}
              aria-current={active ? "page" : undefined}
            >
              {/* Active indicator pill */}
              {active && (
                <motion.div
                  layoutId="bottomNavIndicator"
                  className="absolute inset-0 rounded-2xl bg-primary/10"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}

              {/* Icon */}
              <span className={`relative z-10 transition-all duration-200 ${active ? "text-primary scale-110" : "text-foreground-muted"}`}>
                {active ? item.activeIcon : item.icon}
              </span>

              {/* Label */}
              <span
                className={`relative z-10 text-[10px] font-semibold transition-colors duration-200 ${
                  active ? "text-primary" : "text-foreground-muted"
                }`}
              >
                {item.id === "home" ? "Home" :
                 item.id === "book" ? "Book" :
                 item.id === "queue" ? "Queue" :
                 "Learn"}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
