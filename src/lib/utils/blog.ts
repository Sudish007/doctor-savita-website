/**
 * Blog utility functions for search, pagination, related articles, and title generation.
 * Validates: Requirements 8.5, 8.7, 8.9, 24.2
 */

import type { BlogArticle } from "@/types";

// ─── Pagination ──────────────────────────────────────────────────────────────

export interface PaginatedResult {
  articles: BlogArticle[];
  totalPages: number;
  currentPage: number;
}

/**
 * Sorts articles by publish date (descending) and returns a paginated slice.
 *
 * @param articles - Array of blog articles to sort and paginate
 * @param page - Page number (1-indexed)
 * @param perPage - Number of articles per page (default 6)
 * @returns Paginated result with articles, totalPages, and currentPage
 */
export function sortAndPaginateArticles(
  articles: BlogArticle[],
  page: number,
  perPage: number = 6
): PaginatedResult {
  const sorted = [...articles].sort(
    (a, b) =>
      new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
  );

  const totalPages = Math.max(1, Math.ceil(sorted.length / perPage));
  const currentPage = Math.max(1, Math.min(page, totalPages));
  const startIndex = (currentPage - 1) * perPage;
  const endIndex = startIndex + perPage;

  return {
    articles: sorted.slice(startIndex, endIndex),
    totalPages,
    currentPage,
  };
}

// ─── Search ──────────────────────────────────────────────────────────────────

/**
 * Searches articles by case-insensitive substring match in title or body text.
 * Title matches are ranked higher than body-only matches.
 * Query must be at least 2 characters. Returns max 20 results.
 *
 * @param articles - Array of blog articles to search
 * @param query - Search query string (minimum 2 characters)
 * @returns Matching articles ordered by relevance (title matches first)
 */
export function searchArticles(
  articles: BlogArticle[],
  query: string
): BlogArticle[] {
  if (!query || query.length < 2) {
    return [];
  }

  const lowerQuery = query.toLowerCase();

  const titleMatches: BlogArticle[] = [];
  const bodyOnlyMatches: BlogArticle[] = [];

  for (const article of articles) {
    const titleMatch = article.title.toLowerCase().includes(lowerQuery);
    const bodyText = extractBodyText(article.body);
    const bodyMatch = bodyText.toLowerCase().includes(lowerQuery);

    if (titleMatch) {
      titleMatches.push(article);
    } else if (bodyMatch) {
      bodyOnlyMatches.push(article);
    }
  }

  return [...titleMatches, ...bodyOnlyMatches].slice(0, 20);
}

/**
 * Extracts plain text from a Portable Text body array or string.
 * Handles both raw string bodies and Sanity Portable Text block arrays.
 */
function extractBodyText(body: any): string {
  if (typeof body === "string") {
    return body;
  }

  if (!Array.isArray(body)) {
    return "";
  }

  return body
    .filter((block: any) => block._type === "block")
    .map((block: any) =>
      (block.children || [])
        .map((child: any) => child.text || "")
        .join("")
    )
    .join(" ");
}

// ─── Related Articles ────────────────────────────────────────────────────────

/**
 * Returns up to maxCount related articles based on category and tag overlap.
 * If fewer than maxCount match, fills remaining slots with most recent articles.
 * Never returns the current article itself.
 *
 * @param currentArticle - The article to find related content for
 * @param allArticles - All available articles
 * @param maxCount - Maximum number of related articles to return (default 3)
 * @returns Array of related articles (max maxCount)
 */
export function getRelatedArticles(
  currentArticle: BlogArticle,
  allArticles: BlogArticle[],
  maxCount: number = 3
): BlogArticle[] {
  const otherArticles = allArticles.filter(
    (a) => a._id !== currentArticle._id
  );

  // Find articles sharing category or at least one tag
  const related = otherArticles.filter((article) => {
    const categoryMatch = article.category === currentArticle.category;
    const tagMatch =
      currentArticle.tags &&
      article.tags &&
      currentArticle.tags.some((tag) => article.tags.includes(tag));
    return categoryMatch || tagMatch;
  });

  if (related.length >= maxCount) {
    return related.slice(0, maxCount);
  }

  // Fill remaining slots with most recent articles (excluding current and already-included)
  const relatedIds = new Set(related.map((a) => a._id));
  const recentFill = otherArticles
    .filter((a) => !relatedIds.has(a._id))
    .sort(
      (a, b) =>
        new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
    )
    .slice(0, maxCount - related.length);

  return [...related, ...recentFill];
}

// ─── Title Generation ────────────────────────────────────────────────────────

/**
 * Generates a title from a blog post text by extracting the first sentence.
 * Truncates to max 100 characters at word boundary.
 * Empty posts return "Untitled Post".
 *
 * @param postText - The raw post text content
 * @returns Generated title string (max 100 chars)
 */
export function generateTitleFromPost(postText: string): string {
  if (!postText || postText.trim().length === 0) {
    return "Untitled Post";
  }

  const trimmed = postText.trim();

  // Extract first sentence: terminated by period, newline, or end-of-text
  const sentenceMatch = trimmed.match(/^[^\n.]+/);
  let firstSentence = sentenceMatch ? sentenceMatch[0].trim() : trimmed;

  // If the match ended because of a period, include text up to the period
  const periodIndex = trimmed.indexOf(".");
  const newlineIndex = trimmed.indexOf("\n");

  if (periodIndex >= 0 && (newlineIndex < 0 || periodIndex < newlineIndex)) {
    firstSentence = trimmed.substring(0, periodIndex).trim();
  } else if (newlineIndex >= 0) {
    firstSentence = trimmed.substring(0, newlineIndex).trim();
  }

  if (firstSentence.length === 0) {
    return "Untitled Post";
  }

  // Truncate to max 100 chars at word boundary
  if (firstSentence.length <= 100) {
    return firstSentence;
  }

  const truncated = firstSentence.substring(0, 100);
  const lastSpace = truncated.lastIndexOf(" ");

  if (lastSpace > 0) {
    return truncated.substring(0, lastSpace);
  }

  return truncated;
}
