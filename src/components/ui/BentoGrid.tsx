"use client";

import { ReactNode } from "react";

/**
 * Reusable asymmetric Bento Grid container.
 * - 3-column CSS Grid on desktop (≥1024px)
 * - 2-column symmetric grid on tablet (768–1024px)
 * - Single column stack on mobile (<768px)
 *
 * Requirements: 17.1, 17.2, 17.3
 */

interface BentoGridProps {
  children: ReactNode;
  className?: string;
}

export function BentoGrid({ children, className = "" }: BentoGridProps) {
  return (
    <div
      className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 lg:gap-6 ${className}`}
    >
      {children}
    </div>
  );
}

interface BentoGridItemProps {
  children: ReactNode;
  className?: string;
  /** Number of columns to span on desktop (lg). Default 1. */
  colSpan?: 1 | 2;
  /** Number of rows to span on desktop (lg). Default 1. */
  rowSpan?: 1 | 2;
}

export function BentoGridItem({
  children,
  className = "",
  colSpan = 1,
  rowSpan = 1,
}: BentoGridItemProps) {
  const colClass = colSpan === 2 ? "lg:col-span-2" : "";
  const rowClass = rowSpan === 2 ? "lg:row-span-2" : "";

  return (
    <div className={`${colClass} ${rowClass} ${className}`}>{children}</div>
  );
}
