'use client';

import { useState, useCallback, useMemo } from 'react';
import type { BlogArticle, HealthCategory } from '@/types';
import { sortAndPaginateArticles, searchArticles } from '@/lib/utils/blog';
import { ArticleCard } from './ArticleCard';
import { BlogSearch } from './BlogSearch';

const CATEGORIES: { key: HealthCategory; label: string }[] = [
  { key: 'immunity', label: 'Immunity' },
  { key: 'skin-care', label: 'Skin Care' },
  { key: 'digestion', label: 'Digestion' },
  { key: 'womens-health', label: "Women's Health" },
  { key: 'child-care', label: 'Child Care' },
  { key: 'mental-wellness', label: 'Mental Wellness' },
];

interface BlogListingClientProps {
  articles: BlogArticle[];
}

/**
 * Client component handling blog search, category filtering, and pagination.
 * Uses sortAndPaginateArticles and searchArticles utilities.
 *
 * Requirements: 8.1, 8.2, 8.4, 8.5, 8.6, 8.7, 8.8
 */
export function BlogListingClient({ articles }: BlogListingClientProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<HealthCategory | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  }, []);

  const handleCategorySelect = useCallback((category: HealthCategory | null) => {
    setSelectedCategory((prev) => (prev === category ? null : category));
    setCurrentPage(1);
    setSearchQuery('');
  }, []);

  // Apply filters: search first, then category
  const filteredArticles = useMemo(() => {
    let result = articles;

    if (searchQuery.length >= 2) {
      result = searchArticles(result, searchQuery);
    }

    if (selectedCategory) {
      result = result.filter((a) => a.category === selectedCategory);
    }

    return result;
  }, [articles, searchQuery, selectedCategory]);

  // Paginate the filtered results
  const { articles: paginatedArticles, totalPages, currentPage: page } = useMemo(
    () => sortAndPaginateArticles(filteredArticles, currentPage, 6),
    [filteredArticles, currentPage]
  );

  const isSearchActive = searchQuery.length >= 2;
  const hasNoResults = filteredArticles.length === 0;

  return (
    <div className="space-y-8">
      {/* Search and Category Filters */}
      <div className="space-y-4">
        <BlogSearch onSearch={handleSearch} placeholder="Search health articles..." />

        {/* Category Filter Pills */}
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
          {CATEGORIES.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => handleCategorySelect(key)}
              aria-pressed={selectedCategory === key}
              className={`px-3 py-1.5 text-sm rounded-full font-medium transition-all duration-200 touch-target
                ${
                  selectedCategory === key
                    ? 'bg-[var(--primary)] text-[var(--primary-foreground)] shadow-sm'
                    : 'bg-[var(--muted)] text-[var(--foreground-muted)] hover:bg-[var(--primary-light)] hover:text-[var(--primary)]'
                }`}
            >
              {label}
            </button>
          ))}
          {selectedCategory && (
            <button
              type="button"
              onClick={() => handleCategorySelect(null)}
              className="px-3 py-1.5 text-sm rounded-full font-medium text-[var(--destructive)] bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 transition-all duration-200 touch-target"
            >
              Clear filter
            </button>
          )}
        </div>
      </div>

      {/* No Results State */}
      {hasNoResults && (
        <div className="text-center py-16 space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[var(--muted)]">
            <svg
              className="w-8 h-8 text-[var(--foreground-muted)]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-[var(--foreground)]">
            No articles found
          </h3>
          <p className="text-sm text-[var(--foreground-muted)] max-w-md mx-auto">
            {isSearchActive
              ? `No results for "${searchQuery}". Try a different keyword or browse by category below.`
              : 'No articles match the selected category.'}
          </p>
          {/* Category Browse Suggestion */}
          <div className="pt-4">
            <p className="text-sm text-[var(--foreground-muted)] mb-3">Browse by category:</p>
            <div className="flex flex-wrap justify-center gap-2">
              {CATEGORIES.map(({ key, label }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    handleCategorySelect(key);
                  }}
                  className="px-3 py-1.5 text-sm rounded-full font-medium bg-[var(--muted)] text-[var(--foreground-muted)] hover:bg-[var(--primary-light)] hover:text-[var(--primary)] transition-all duration-200 touch-target"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Article Grid */}
      {!hasNoResults && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedArticles.map((article) => (
            <ArticleCard key={article._id} article={article} />
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {!hasNoResults && totalPages > 1 && (
        <nav aria-label="Blog pagination" className="flex items-center justify-center gap-2 pt-4">
          {/* Previous Button */}
          <button
            type="button"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            aria-label="Previous page"
            className="px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 touch-target
              disabled:opacity-40 disabled:cursor-not-allowed
              bg-[var(--background-secondary)] text-[var(--foreground)] border border-[var(--border)]
              hover:bg-[var(--primary-light)] hover:text-[var(--primary)]"
          >
            ← Previous
          </button>

          {/* Page Numbers */}
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={pageNum}
                type="button"
                onClick={() => setCurrentPage(pageNum)}
                aria-label={`Page ${pageNum}`}
                aria-current={page === pageNum ? 'page' : undefined}
                className={`w-9 h-9 text-sm font-medium rounded-lg transition-all duration-200
                  ${
                    page === pageNum
                      ? 'bg-[var(--primary)] text-[var(--primary-foreground)] shadow-sm'
                      : 'bg-[var(--background-secondary)] text-[var(--foreground-muted)] border border-[var(--border)] hover:bg-[var(--primary-light)] hover:text-[var(--primary)]'
                  }`}
              >
                {pageNum}
              </button>
            ))}
          </div>

          {/* Next Button */}
          <button
            type="button"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            aria-label="Next page"
            className="px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 touch-target
              disabled:opacity-40 disabled:cursor-not-allowed
              bg-[var(--background-secondary)] text-[var(--foreground)] border border-[var(--border)]
              hover:bg-[var(--primary-light)] hover:text-[var(--primary)]"
          >
            Next →
          </button>
        </nav>
      )}
    </div>
  );
}
