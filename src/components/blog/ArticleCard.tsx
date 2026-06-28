'use client';

import Link from 'next/link';
import type { BlogArticle, HealthCategory } from '@/types';

/**
 * Category display configuration with label and color classes.
 */
const CATEGORY_CONFIG: Record<HealthCategory, { label: string; className: string }> = {
  immunity: { label: 'Immunity', className: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300' },
  'skin-care': { label: 'Skin Care', className: 'bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-300' },
  digestion: { label: 'Digestion', className: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300' },
  'womens-health': { label: "Women's Health", className: 'bg-pink-100 text-pink-800 dark:bg-pink-900/40 dark:text-pink-300' },
  'child-care': { label: 'Child Care', className: 'bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-300' },
  'mental-wellness': { label: 'Mental Wellness', className: 'bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-300' },
};

interface ArticleCardProps {
  article: BlogArticle;
}

/**
 * ArticleCard component displaying blog article preview with glassmorphism styling.
 * Shows title, excerpt (150 chars), publish date, category badge, and thumbnail.
 * Responsive: 3 columns desktop, 2 tablet, 1 mobile (controlled by parent grid).
 *
 * Requirements: 8.2, 8.4, 8.6
 */
export function ArticleCard({ article }: ArticleCardProps) {
  const categoryConfig = CATEGORY_CONFIG[article.category];
  const excerpt = article.excerpt.length > 150
    ? article.excerpt.slice(0, 150) + '…'
    : article.excerpt;

  const formattedDate = new Date(article.publishDate).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <Link
      href={`/blog/${article.slug.current}`}
      className="group block rounded-xl overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-lg focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2"
      style={{
        background: 'var(--glass-bg)',
        border: '1px solid var(--card-border)',
        boxShadow: 'var(--glass-shadow)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
    >
      {/* Thumbnail */}
      <div className="relative w-full h-48 overflow-hidden bg-[var(--muted)]">
        {article.featuredImage ? (
          <img
            src={article.featuredImage}
            alt={article.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg
              className="w-16 h-16 text-[var(--foreground-muted)] opacity-40"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="p-5 space-y-3">
        {/* Category Badge + Date */}
        <div className="flex items-center justify-between gap-2">
          <span
            className={`inline-block px-2.5 py-0.5 text-xs font-medium rounded-full ${categoryConfig.className}`}
          >
            {categoryConfig.label}
          </span>
          <time
            dateTime={article.publishDate}
            className="text-xs text-[var(--foreground-muted)]"
          >
            {formattedDate}
          </time>
        </div>

        {/* Title */}
        <h3 className="text-base font-semibold text-[var(--card-foreground)] line-clamp-2 group-hover:text-[var(--primary)] transition-colors duration-200">
          {article.title}
        </h3>

        {/* Excerpt */}
        <p className="text-sm text-[var(--foreground-muted)] line-clamp-3 leading-relaxed">
          {excerpt}
        </p>
      </div>
    </Link>
  );
}
