/**
 * Reading time calculation utility.
 * Validates: Requirements 8.3
 *
 * Calculates estimated reading time based on 200 words per minute,
 * rounded up to the nearest whole minute with a minimum of 1 minute.
 */

/**
 * Calculates the estimated reading time for a given text.
 *
 * @param text - The plain text content to calculate reading time for
 * @returns The estimated reading time in minutes (minimum 1)
 */
export function calculateReadingTime(text: string): number {
  if (!text || text.trim().length === 0) {
    return 1;
  }

  const words = text.trim().split(/\s+/);
  const wordCount = words.length;
  const minutes = Math.ceil(wordCount / 200);

  return Math.max(1, minutes);
}
