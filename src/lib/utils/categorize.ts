/**
 * Auto-categorization utility for blog posts imported from WhatsApp channel.
 * Scans text for keywords matching health categories and returns the best match.
 *
 * Validates: Requirements 24.3
 */

import type { HealthCategory } from '@/types';

/**
 * Keyword map for each health category.
 * Keywords are matched case-insensitively against post text.
 */
export const CATEGORY_KEYWORDS: Record<HealthCategory, string[]> = {
  immunity: ['immune', 'immunity', 'cold', 'flu', 'fever'],
  'skin-care': ['skin', 'eczema', 'acne', 'psoriasis', 'rash'],
  digestion: ['digest', 'stomach', 'acidity', 'bloating', 'constipation'],
  'womens-health': ['women', 'pcos', 'period', 'menstrual', 'pregnancy', 'hormone'],
  'child-care': ['child', 'baby', 'kid', 'pediatric', 'teething'],
  'mental-wellness': ['mental', 'anxiety', 'stress', 'depression', 'sleep', 'insomnia'],
};

/** Default category when no keywords match */
const DEFAULT_CATEGORY: HealthCategory = 'immunity';

/**
 * Scans text for category keywords and returns the best-matching health category.
 * Counts how many keywords from each category appear in the text (case-insensitive).
 * Returns the category with the highest keyword match count.
 * If no keywords match, returns 'immunity' as the default.
 *
 * @param text - The post text to categorize
 * @returns The best-matching HealthCategory
 */
export function categorizeByKeywords(text: string): HealthCategory {
  if (!text || text.trim().length === 0) {
    return DEFAULT_CATEGORY;
  }

  const lowerText = text.toLowerCase();

  let bestCategory: HealthCategory = DEFAULT_CATEGORY;
  let bestScore = 0;

  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS) as [HealthCategory, string[]][]) {
    let score = 0;
    for (const keyword of keywords) {
      if (lowerText.includes(keyword)) {
        score++;
      }
    }

    if (score > bestScore) {
      bestScore = score;
      bestCategory = category;
    }
  }

  return bestCategory;
}
