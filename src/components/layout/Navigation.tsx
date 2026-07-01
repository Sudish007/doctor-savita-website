"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { ThemeToggle } from "./ThemeToggle";
import { LanguageToggle } from "./LanguageToggle";

/**
 * Responsive sticky navigation with glassmorphism effect.
 * - Fixed at top with backdrop-filter blur (16px)
 * - Hamburger menu for mobile (<768px) with animated overlay
 * - Smooth-scroll to sections on link click
 * - Active section highlighting via Intersection Observer
 * - Includes ThemeToggle and LanguageToggle
 *
 * Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 16.1, 18.2, 20.2, 20.3, 34.4
 */

const NAV_LINKS = [
  { id: "about", href: "/about" },
  { id: "services", href: "/services" },
  { id: "testimonials", href: "/testimonials" },
  { id: "blog", href: "/blog" },
  { id: "contact", href: "/contact" },
];

export function Navigation() {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  // Smooth scroll to section or navigate to page
  const scrollToSection = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
      e.preventDefault();
      const href = e.currentTarget.getAttribute('href') || '';
      
      // If it's a full page link (starts with /), navigate
      if (href.startsWith('/')) {
        window.location.href = href;
        setIsMobileMenuOpen(false);
        return;
      }
      
      const section = document.getElementById(sectionId);
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
      // Close mobile menu if open
      setIsMobileMenuOpen(false);
    },
    []
  );

  // Close menu on click outside
  useEffect(() => {
    if (!isMobileMenuOpen) return;

    function handleClickOutside(event: MouseEvent) {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobileMenuOpen]);

  return (
    <nav
      ref={navRef}
      className="fixed top-0 left-0 right-0 z-50 bg-background shadow-sm border-b border-border-light"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="container-content flex items-center justify-between h-16 md:h-18">
        {/* Logo / Doctor Name */}
        <a
          href="/"
          className="text-lg font-heading font-bold text-primary hover:text-primary-hover transition-colors whitespace-nowrap flex items-center gap-1.5"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0"><path d="M12 2v20"/><path d="M8 6c0-1.1.9-2 2-2h4a2 2 0 0 1 0 4h-4a2 2 0 0 0 0 4h4a2 2 0 0 1 0 4h-4a2 2 0 0 1-2-2"/></svg>
          Saubhagya Clinic
        </a>

        {/* Desktop Navigation Links */}
        <ul className="hidden md:flex items-center gap-1 lg:gap-2">
          {NAV_LINKS.map((link) => (
            <li key={link.id}>
              <a
                href={link.href}
                onClick={(e) => scrollToSection(e, link.id)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? "text-primary bg-primary-light/60 dark:bg-primary-light/20 border-b-2 border-primary"
                    : "text-foreground-secondary hover:text-primary hover:bg-primary-light/40 dark:hover:bg-primary-light/10"
                }`}
                aria-current={pathname === link.href ? "page" : undefined}
              >
                {t(link.id)}
              </a>
            </li>
          ))}
        </ul>

        {/* Right side: Appointment CTA + Theme Toggle + Language Toggle + Hamburger */}
        <div className="flex items-center gap-1">
          {/* Action buttons */}
          <a
            href="/book"
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-medium bg-primary text-primary-foreground hover:bg-primary-hover transition-colors shadow-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            <span className="hidden sm:inline">Book</span>
          </a>
          <a
            href="/token"
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-medium border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 5v2"/><path d="M15 11v2"/><path d="M15 17v2"/><path d="M5 5h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z"/></svg>
            <span className="hidden sm:inline">Token</span>
          </a>
          <ThemeToggle />
          <LanguageToggle />

          {/* Hamburger Menu Button (mobile only) */}
          <button
            className="flex md:hidden items-center justify-center w-11 h-11 rounded-full hover:bg-primary-light dark:hover:bg-primary-light transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-foreground"
            >
              {isMobileMenuOpen ? (
                <>
                  {/* X / Close icon */}
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </>
              ) : (
                <>
                  {/* Hamburger icon */}
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="fixed inset-0 top-16 z-40 md:hidden"
          >
            {/* Backdrop - fully opaque to block content behind */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-background"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Menu Content */}
            <motion.ul
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, delay: 0.05 }}
              className="relative flex flex-col items-center justify-center gap-2 pt-8 pb-12 px-6 bg-background"
            >
              {NAV_LINKS.map((link, index) => (
                <motion.li
                  key={link.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{
                    duration: 0.2,
                    delay: 0.05 + index * 0.04,
                  }}
                  className="w-full"
                >
                  <a
                    href={link.href}
                    onClick={(e) => scrollToSection(e, link.id)}
                    className={`block w-full text-center px-4 py-3 rounded-xl text-lg font-medium transition-colors ${
                      pathname === link.href
                        ? "text-primary bg-primary-light/60 dark:bg-primary-light/20"
                        : "text-foreground-secondary hover:text-primary hover:bg-primary-light/40 dark:hover:bg-primary-light/10"
                    }`}
                    aria-current={pathname === link.href ? "page" : undefined}
                  >
                    {t(link.id)}
                  </a>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
