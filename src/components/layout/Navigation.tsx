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
          <span className="w-8 h-8 rounded-full overflow-hidden inline-flex items-center justify-center flex-shrink-0">
            <img src="/images/logo.png" alt="Saubhagya Clinic Logo" className="w-full h-full object-cover" />
          </span>
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
        </div>
      </div>


    </nav>
  );
}
