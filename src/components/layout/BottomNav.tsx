"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  { label: "About", href: "/about", icon: "🩺", desc: "Dr. Savita's profile" },
  { label: "Services", href: "/services", icon: "🌿", desc: "Treatments offered" },
  { label: "Reminders", href: "/reminders", icon: "⏰", desc: "Medicine alerts" },
  { label: "Testimonials", href: "/testimonials", icon: "💬", desc: "Patient reviews" },
  { label: "Blog", href: "/blog", icon: "📰", desc: "Health articles" },
  { label: "Contact", href: "/contact", icon: "📲", desc: "Get in touch" },
  { label: "Appointments", href: "/my-appointments", icon: "🗓️", desc: "Your bookings" },
  { label: "Credentials", href: "/credentials", icon: "🏅", desc: "Certifications" },
  { label: "Admin Panel", href: "/admin", icon: "⚙️", desc: "Manage clinic" },
  { label: "Privacy", href: "/privacy-policy", icon: "🛡️", desc: "Data policy" },
];

export function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [showMore, setShowMore] = useState(false);

  // Aggressively prefetch all routes on mount for instant navigation
  useEffect(() => {
    const allRoutes = [
      ...NAV_ITEMS.filter(i => i.href !== "#more").map(i => i.href),
      ...MORE_LINKS.map(l => l.href),
    ];
    allRoutes.forEach(route => router.prefetch(route));
  }, [router]);

  // Hide on admin pages (admin has its own bottom nav)
  if (pathname?.startsWith("/admin")) return null;

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
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              transition={{ duration: 0.15 }}
              className="fixed bottom-[72px] left-3 right-3 z-[59] md:hidden
                bg-background rounded-3xl border border-border shadow-2xl
                max-h-[65vh] overflow-y-auto"
            >
              <div className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-heading font-bold text-foreground">Explore</h3>
                  <button
                    onClick={() => setShowMore(false)}
                    className="w-8 h-8 rounded-full bg-background-secondary flex items-center justify-center hover:bg-primary/10 transition-colors"
                    aria-label="Close menu"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {MORE_LINKS.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      prefetch={true}
                      onClick={() => setShowMore(false)}
                      className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl transition-all active:scale-95 ${
                        pathname === link.href
                          ? "bg-primary/10 ring-1 ring-primary/30"
                          : "bg-background-secondary hover:bg-primary/5"
                      }`}
                    >
                      <span className="text-2xl">{link.icon}</span>
                      <span className="text-[11px] font-semibold text-foreground text-center leading-tight">{link.label}</span>
                      <span className="text-[9px] text-foreground-muted text-center leading-tight">{link.desc}</span>
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
                  <div
                    className="absolute inset-0 rounded-2xl bg-primary/10"
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
