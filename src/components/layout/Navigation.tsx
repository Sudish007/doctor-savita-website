"use client";

import { useCallback } from "react";
import { usePathname } from "next/navigation";
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
  { id: "appointment", href: "/book" },
  { id: "live-queue", href: "/token" },
  { id: "learn", href: "/learn" },
  { id: "contact", href: "/contact" },
];

export function Navigation() {
  const t = useTranslations('nav');
  const pathname = usePathname();

  // Smooth scroll to section or navigate to page
  const scrollToSection = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
      e.preventDefault();
      const href = e.currentTarget.getAttribute('href') || '';
      
      // If it's a full page link (starts with /), navigate
      if (href.startsWith('/')) {
        window.location.href = href;
        return;
      }
      
      const section = document.getElementById(sectionId);
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    },
    []
  );

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-background via-background to-primary/5 shadow-sm border-b border-border-light"
      role="navigation"
      aria-label="Main navigation"
    >
      {/* Teal accent line at bottom of nav */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary/40 to-transparent md:hidden" />
      <div className="container-content flex items-center justify-between h-16 md:h-18">
        {/* Logo / Doctor Name */}
        <a
          href="/"
          className="text-lg font-heading font-bold text-primary hover:text-primary-hover transition-colors whitespace-nowrap flex items-center gap-1.5"
        >
          <img src="/images/logo.png" alt="Saubhagya Clinic Logo" className="w-8 h-8 rounded-full object-cover" />
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

        {/* Right side: Theme Toggle + Language Toggle (visible on all) + Desktop extras */}
        <div className="flex items-center gap-1">
          <ThemeToggle />
          <LanguageToggle />
          {/* Desktop-only action buttons */}
          <a
            href="/book"
            className="hidden md:inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-medium bg-primary text-primary-foreground hover:bg-primary-hover transition-colors shadow-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            <span>Book</span>
          </a>
          <a
            href="/token"
            className="hidden md:inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-medium border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 5v2"/><path d="M15 11v2"/><path d="M15 17v2"/><path d="M5 5h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z"/></svg>
            <span>Token</span>
          </a>
        </div>
      </div>


    </nav>
  );
}
