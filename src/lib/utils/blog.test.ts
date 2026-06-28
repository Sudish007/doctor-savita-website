import { describe, it, expect } from "vitest";
import {
  sortAndPaginateArticles,
  searchArticles,
  getRelatedArticles,
  generateTitleFromPost,
} from "./blog";
import type { BlogArticle } from "@/types";

// ─── Test Helpers ────────────────────────────────────────────────────────────

function makeArticle(overrides: Partial<BlogArticle> = {}): BlogArticle {
  return {
    _id: overrides._id || `article-${Math.random().toString(36).slice(2)}`,
    title: overrides.title || "Test Article",
    slug: overrides.slug || { current: "test-article" },
    body: overrides.body || [
      {
        _type: "block",
        children: [{ text: "Default body text for testing." }],
      },
    ],
    excerpt: overrides.excerpt || "Test excerpt",
    category: overrides.category || "immunity",
    tags: overrides.tags || ["health"],
    author: overrides.author || "Dr. Savita",
    publishDate: overrides.publishDate || "2025-01-15",
    status: overrides.status || "published",
    readingTime: overrides.readingTime || 3,
    language: overrides.language || "en",
  };
}

// ─── sortAndPaginateArticles ─────────────────────────────────────────────────

describe("sortAndPaginateArticles", () => {
  it("sorts articles by publish date descending", () => {
    const articles = [
      makeArticle({ _id: "a1", publishDate: "2025-01-01" }),
      makeArticle({ _id: "a2", publishDate: "2025-03-01" }),
      makeArticle({ _id: "a3", publishDate: "2025-02-01" }),
    ];

    const result = sortAndPaginateArticles(articles, 1);
    expect(result.articles.map((a) => a._id)).toEqual(["a2", "a3", "a1"]);
  });

  it("returns 6 articles per page by default", () => {
    const articles = Array.from({ length: 10 }, (_, i) =>
      makeArticle({ _id: `a${i}`, publishDate: `2025-01-${String(i + 1).padStart(2, "0")}` })
    );

    const result = sortAndPaginateArticles(articles, 1);
    expect(result.articles.length).toBe(6);
    expect(result.totalPages).toBe(2);
    expect(result.currentPage).toBe(1);
  });

  it("returns remaining articles on last page", () => {
    const articles = Array.from({ length: 8 }, (_, i) =>
      makeArticle({ _id: `a${i}`, publishDate: `2025-01-${String(i + 1).padStart(2, "0")}` })
    );

    const result = sortAndPaginateArticles(articles, 2);
    expect(result.articles.length).toBe(2);
    expect(result.currentPage).toBe(2);
  });

  it("clamps page number to valid range", () => {
    const articles = [makeArticle({ _id: "a1" })];

    const result = sortAndPaginateArticles(articles, 99);
    expect(result.currentPage).toBe(1);
    expect(result.articles.length).toBe(1);
  });

  it("handles empty array", () => {
    const result = sortAndPaginateArticles([], 1);
    expect(result.articles).toEqual([]);
    expect(result.totalPages).toBe(1);
    expect(result.currentPage).toBe(1);
  });

  it("accepts custom perPage", () => {
    const articles = Array.from({ length: 5 }, (_, i) =>
      makeArticle({ _id: `a${i}`, publishDate: `2025-01-${String(i + 1).padStart(2, "0")}` })
    );

    const result = sortAndPaginateArticles(articles, 1, 2);
    expect(result.articles.length).toBe(2);
    expect(result.totalPages).toBe(3);
  });
});

// ─── searchArticles ──────────────────────────────────────────────────────────

describe("searchArticles", () => {
  const articles = [
    makeArticle({
      _id: "a1",
      title: "Boosting Immunity Naturally",
      body: [{ _type: "block", children: [{ text: "Eat healthy foods daily." }] }],
    }),
    makeArticle({
      _id: "a2",
      title: "Skin Care Tips",
      body: [{ _type: "block", children: [{ text: "Natural immunity boosters for skin." }] }],
    }),
    makeArticle({
      _id: "a3",
      title: "Digestion Health",
      body: [{ _type: "block", children: [{ text: "Maintain gut flora balance." }] }],
    }),
  ];

  it("returns empty array for query shorter than 2 chars", () => {
    expect(searchArticles(articles, "a")).toEqual([]);
    expect(searchArticles(articles, "")).toEqual([]);
  });

  it("matches title case-insensitively", () => {
    const results = searchArticles(articles, "immunity");
    expect(results.some((a) => a._id === "a1")).toBe(true);
  });

  it("matches body text case-insensitively", () => {
    const results = searchArticles(articles, "gut flora");
    expect(results.some((a) => a._id === "a3")).toBe(true);
  });

  it("ranks title matches higher than body-only matches", () => {
    const results = searchArticles(articles, "immunity");
    // a1 has "immunity" in title, a2 has "immunity" only in body
    const titleMatchIdx = results.findIndex((a) => a._id === "a1");
    const bodyMatchIdx = results.findIndex((a) => a._id === "a2");
    expect(titleMatchIdx).toBeLessThan(bodyMatchIdx);
  });

  it("returns max 20 results", () => {
    const manyArticles = Array.from({ length: 30 }, (_, i) =>
      makeArticle({ _id: `a${i}`, title: `Article about health tip ${i}` })
    );
    const results = searchArticles(manyArticles, "health");
    expect(results.length).toBeLessThanOrEqual(20);
  });

  it("returns no results when nothing matches", () => {
    const results = searchArticles(articles, "zzzzz");
    expect(results).toEqual([]);
  });

  it("handles string body format", () => {
    const articlesWithStringBody = [
      makeArticle({ _id: "s1", title: "Plain", body: "This is a plain string body about yoga" as any }),
    ];
    const results = searchArticles(articlesWithStringBody, "yoga");
    expect(results.length).toBe(1);
    expect(results[0]._id).toBe("s1");
  });
});

// ─── getRelatedArticles ──────────────────────────────────────────────────────

describe("getRelatedArticles", () => {
  const current = makeArticle({
    _id: "current",
    category: "immunity",
    tags: ["flu", "winter"],
    publishDate: "2025-03-01",
  });

  const others = [
    makeArticle({ _id: "r1", category: "immunity", tags: ["boost"], publishDate: "2025-02-20" }),
    makeArticle({ _id: "r2", category: "skin-care", tags: ["flu"], publishDate: "2025-02-15" }),
    makeArticle({ _id: "r3", category: "digestion", tags: ["gut"], publishDate: "2025-02-10" }),
    makeArticle({ _id: "r4", category: "digestion", tags: ["probiotic"], publishDate: "2025-02-05" }),
    makeArticle({ _id: "r5", category: "mental-wellness", tags: ["stress"], publishDate: "2025-01-30" }),
  ];

  it("returns articles sharing same category", () => {
    const allArticles = [current, ...others];
    const related = getRelatedArticles(current, allArticles);
    expect(related.some((a) => a._id === "r1")).toBe(true);
  });

  it("returns articles sharing a tag", () => {
    const allArticles = [current, ...others];
    const related = getRelatedArticles(current, allArticles);
    expect(related.some((a) => a._id === "r2")).toBe(true);
  });

  it("never returns the current article", () => {
    const allArticles = [current, ...others];
    const related = getRelatedArticles(current, allArticles);
    expect(related.every((a) => a._id !== "current")).toBe(true);
  });

  it("returns max 3 articles by default", () => {
    const manyRelated = Array.from({ length: 10 }, (_, i) =>
      makeArticle({ _id: `mr${i}`, category: "immunity", publishDate: `2025-01-${String(i + 1).padStart(2, "0")}` })
    );
    const allArticles = [current, ...manyRelated];
    const related = getRelatedArticles(current, allArticles);
    expect(related.length).toBeLessThanOrEqual(3);
  });

  it("fills with most recent articles when fewer than maxCount match", () => {
    // Only r1 matches by category, r2 by tag = 2 matches, needs 1 more fill
    const allArticles = [current, ...others];
    const related = getRelatedArticles(current, allArticles);
    expect(related.length).toBe(3);
  });

  it("respects custom maxCount", () => {
    const allArticles = [current, ...others];
    const related = getRelatedArticles(current, allArticles, 2);
    expect(related.length).toBeLessThanOrEqual(2);
  });

  it("handles empty article list", () => {
    const related = getRelatedArticles(current, [current]);
    expect(related).toEqual([]);
  });
});

// ─── generateTitleFromPost ───────────────────────────────────────────────────

describe("generateTitleFromPost", () => {
  it("returns 'Untitled Post' for empty string", () => {
    expect(generateTitleFromPost("")).toBe("Untitled Post");
  });

  it("returns 'Untitled Post' for whitespace-only string", () => {
    expect(generateTitleFromPost("   \n  ")).toBe("Untitled Post");
  });

  it("extracts first sentence terminated by period", () => {
    expect(generateTitleFromPost("Hello world. More text here.")).toBe(
      "Hello world"
    );
  });

  it("extracts first sentence terminated by newline", () => {
    expect(generateTitleFromPost("First line\nSecond line")).toBe("First line");
  });

  it("uses full text when no period or newline", () => {
    expect(generateTitleFromPost("Short title")).toBe("Short title");
  });

  it("truncates to 100 chars at word boundary", () => {
    const longSentence = Array(20).fill("longword").join(" "); // 20 * 8 + 19 spaces = 179 chars
    const result = generateTitleFromPost(longSentence + ". More text.");
    expect(result.length).toBeLessThanOrEqual(100);
    // Should not end with a trailing space (breaks at word boundary, not mid-word)
    expect(result.endsWith(" ")).toBe(false);
    // Verify truncation happened at a space boundary (each token is complete)
    const words = result.split(" ");
    words.forEach((w) => expect(w).toBe("longword"));
  });

  it("does not exceed 100 characters", () => {
    const longText = "a ".repeat(60); // 120 chars with spaces
    const result = generateTitleFromPost(longText);
    expect(result.length).toBeLessThanOrEqual(100);
  });

  it("handles period as first character gracefully", () => {
    expect(generateTitleFromPost(". after period")).toBe("Untitled Post");
  });

  it("handles newline as first character — uses text after trimming", () => {
    // After trimming, "\nsome text" becomes "some text" which is a valid sentence
    expect(generateTitleFromPost("\nsome text")).toBe("some text");
  });
});
