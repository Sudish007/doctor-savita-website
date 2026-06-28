/**
 * Health categories used across multiple Sanity schemas.
 */
export const HEALTH_CATEGORIES = [
  'immunity',
  'skin-care',
  'digestion',
  'womens-health',
  'child-care',
  'mental-wellness',
] as const;

export type HealthCategory = (typeof HEALTH_CATEGORIES)[number];
