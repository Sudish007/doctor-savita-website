/**
 * Unit tests for categorizeByKeywords utility.
 * Validates: Requirements 24.3
 */

import { describe, it, expect } from 'vitest';
import { categorizeByKeywords, CATEGORY_KEYWORDS } from './categorize';

describe('categorizeByKeywords', () => {
  it('returns "immunity" as default when text is empty', () => {
    expect(categorizeByKeywords('')).toBe('immunity');
  });

  it('returns "immunity" as default when text is only whitespace', () => {
    expect(categorizeByKeywords('   ')).toBe('immunity');
  });

  it('returns "immunity" when no keywords match', () => {
    expect(categorizeByKeywords('This is a general post about life.')).toBe('immunity');
  });

  it('categorizes text with immunity keywords', () => {
    expect(categorizeByKeywords('Boost your immune system to fight cold and flu')).toBe('immunity');
  });

  it('categorizes text with skin-care keywords', () => {
    expect(categorizeByKeywords('Treating eczema and acne with homeopathy')).toBe('skin-care');
  });

  it('categorizes text with digestion keywords', () => {
    expect(categorizeByKeywords('Relief from stomach acidity and bloating')).toBe('digestion');
  });

  it('categorizes text with womens-health keywords', () => {
    expect(categorizeByKeywords('Managing pcos and menstrual irregularities in women')).toBe('womens-health');
  });

  it('categorizes text with child-care keywords', () => {
    expect(categorizeByKeywords('Homeopathic remedies for baby teething and child health')).toBe('child-care');
  });

  it('categorizes text with mental-wellness keywords', () => {
    expect(categorizeByKeywords('Managing anxiety and insomnia with natural remedies for better sleep')).toBe('mental-wellness');
  });

  it('selects category with highest keyword match count when multiple categories match', () => {
    // "skin" matches skin-care, "stress" matches mental-wellness
    // Only 1 each, so first found with highest wins
    const text = 'Dealing with stress-related skin problems like acne and psoriasis and rash';
    // skin-care has: skin, acne, psoriasis, rash = 4 matches
    // mental-wellness has: stress = 1 match
    expect(categorizeByKeywords(text)).toBe('skin-care');
  });

  it('is case-insensitive when matching keywords', () => {
    expect(categorizeByKeywords('IMMUNE SYSTEM and FEVER relief')).toBe('immunity');
    expect(categorizeByKeywords('ECZEMA Treatment')).toBe('skin-care');
  });

  it('all defined categories have at least one keyword', () => {
    for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
      expect(keywords.length).toBeGreaterThan(0);
    }
  });
});
