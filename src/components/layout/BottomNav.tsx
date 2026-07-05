"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Mobile Bottom Navigation Bar — Modern app-style navigation
 * 5 tabs: Home, Book, Queue, Learn, More
 * - Appears only on mobile (<768px)
 * - Active tab has pill background
 * - "More" opens an overlay with extra links
 */

interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: React.ReactNode;
  activeIcon: React.ReactNode;
}

const NAV_ITEMS: NavItem[] = [
  {
    id: "home", label: "Home", href: "/",
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
    activeIcon: <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22" fill="white" stroke="white"/></svg>,
  },
  {
    id: "book", label: "Book", href: "/book",
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
    activeIcon: <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="10" x2="21" y2="10" stroke="white"/></svg>,
  },
  {
    id: "queue", label: "Queue", href: "/token",
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M15 5v2"/><path d="M15 11v2"/><path d="M15 17v2"/></svg>,
    activeIcon: <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M15 5v2" stroke="white"/><path d="M15 11v2" stroke="white"/><path d="M15 17v2" stroke="white"/></svg>,
  },
  {
    id: "learn", label: "Learn", href: "/learn",
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>,
    activeIcon: <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>,
  },
  {
    id: "more", label: "More", href: "#more",
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/><circle cx="5" cy="12" r="1"/><circle cx="19" cy="12" r="1"/></svg>,
    activeIcon: <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="19" r="1.5"/><circle cx="5" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/></svg>,
  },
];

const MORE_LINKS = [
  { label: "About Dr. Savita", href: "/about", icon: "👩‍⚕️" },
  { label: "Services", href: "/services", icon: "💊" },
  { label: "Testimonials", href: "/testimonials", icon: "⭐" },
  { label: "Blog", href: "/blog", icon: "📝" },
  { label: "Contact", href: "/contact", icon: "📞" },
  { label: "My Appointments", href: "/my-appointments", icon: "📋" },
  { label: "Credentials", href: "/credentials", icon: "🎓" },
  { label: "Privacy Policy", href: "/privacy-policy", icon: "🔒" },
];

export function BottomNav() {
  const pathname = usePathname();
  const [showMore, setShowMore] = useState(false);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    if (href.startsWith("#")) return false;
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* More menu overlay */}
      <AnimatePresence>
        {showMore && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[59] bg-black/40 backdrop-blur-sm md:hidden"
              onClick={() => setShowMore(false)}
            />
            {/* Menu panel */}
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed bottom-[72px] left-3 right-3 z-[59] md:hidden
                bg-background rounded-2xl border border-border shadow-xl
                max-h-[60vh] overflow-y-auto"
            >
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-heading font-semibold text-foreground">More</h3>
                  <button
                    onClick={() => setShowMore(false)}
                    className="p-1.5 rounded-full hover:bg-background-secondary transition-colors"
                    aria-label="Close menu"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  </button>
                </div>
                <div className="grid grid-cols-1 gap-1">
                  {MORE_LINKS.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setShowMore(false)}
                      className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-colors ${
                        pathname === link.href
                          ? "bg-primary/10 text-primary"
                          : "text-foreground-secondary hover:bg-background-secondary"
                      }`}
                    >
                      <span className="text-lg">{link.icon}</span>
                      <span className="text-sm font-medium">{link.label}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Bottom navigation bar */}
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

            // "More" button opens the overlay menu
            if (item.id === "more") {
              return (
                <button
                  key={item.id}
                  onClick={() => setShowMore(!showMore)}
                  className={`relative flex flex-col items-center gap-0.5 py-1.5 px-4 rounded-2xl transition-all duration-200 active:scale-90 ${
                    showMore ? "bg-primary/10" : ""
                  }`}
                >
                  <span className={`transition-all duration-200 ${showMore ? "text-primary scale-110" : "text-foreground-muted"}`}>
                    {showMore ? item.activeIcon : item.icon}
                  </span>
                  <span className={`text-[10px] font-semibold transition-colors duration-200 ${
                    showMore ? "text-primary" : "text-foreground-muted"
                  }`}>
                    {item.label}
                  </span>
                </button>
              );
            }

            return (
              <Link
                key={item.id}
                href={item.href}
                prefetch={true}
                onClick={() => setShowMore(false)}
                className={`relative flex flex-col items-center gap-0.5 py-1.5 px-4 rounded-2xl transition-all duration-200 active:scale-90 ${
                  active ? "bg-primary/10" : ""
                }`}
                aria-current={active ? "page" : undefined}
              >
                {/* Active pill background */}
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
                <span className={`relative z-10 text-[10px] font-semibold transition-colors duration-200 ${
                  active ? "text-primary" : "text-foreground-muted"
                }`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
