import { describe, it, expect } from 'vitest';
import {
  getSeasonalCategory,
  getSeasonalAlert,
  SEASONAL_ALERT_STORAGE_KEY,
  type SeasonalCategory,
} from './seasonal';

/**
 * Unit tests for seasonal health alert utilities.
 * Requirements: 32.1, 32.2, 32.3, 32.4, 32.5
 */

describe('getSeasonalCategory', () => {
  it('maps January to winter', () => {
    expect(getSeasonalCategory(1)).toBe('winter');
  });

  it('maps February to spring (priority over summer)', () => {
    expect(getSeasonalCategory(2)).toBe('spring');
  });

  it('maps March to spring (priority over summer)', () => {
    expect(getSeasonalCategory(3)).toBe('spring');
  });

  it('maps April to summer', () => {
    expect(getSeasonalCategory(4)).toBe('summer');
  });

  it('maps May to summer', () => {
    expect(getSeasonalCategory(5)).toBe('summer');
  });

  it('maps June to summer', () => {
    expect(getSeasonalCategory(6)).toBe('summer');
  });

  it('maps July to monsoon', () => {
    expect(getSeasonalCategory(7)).toBe('monsoon');
  });

  it('maps August to monsoon', () => {
    expect(getSeasonalCategory(8)).toBe('monsoon');
  });

  it('maps September to monsoon', () => {
    expect(getSeasonalCategory(9)).toBe('monsoon');
  });

  it('maps October to autumn', () => {
    expect(getSeasonalCategory(10)).toBe('autumn');
  });

  it('maps November to autumn (priority over winter)', () => {
    expect(getSeasonalCategory(11)).toBe('autumn');
  });

  it('maps December to winter', () => {
    expect(getSeasonalCategory(12)).toBe('winter');
  });

  it('every month (1-12) maps to exactly one category', () => {
    const validCategories: SeasonalCategory[] = ['spring', 'summer', 'monsoon', 'autumn', 'winter'];
    for (let month = 1; month <= 12; month++) {
      const result = getSeasonalCategory(month);
      expect(validCategories).toContain(result);
    }
  });
});

describe('getSeasonalAlert', () => {
  it('returns alert data with required fields for each season', () => {
    for (let month = 1; month <= 12; month++) {
      const alert = getSeasonalAlert(month);
      expect(alert).toHaveProperty('category');
      expect(alert).toHaveProperty('title');
      expect(alert).toHaveProperty('body');
      expect(alert).toHaveProperty('icon');
      expect(alert).toHaveProperty('link');
      expect(alert.link).toHaveProperty('label');
      expect(alert.link).toHaveProperty('href');
    }
  });

  it('body text is at most 200 characters for each season', () => {
    for (let month = 1; month <= 12; month++) {
      const alert = getSeasonalAlert(month);
      expect(alert.body.length).toBeLessThanOrEqual(200);
    }
  });

  it('returns monsoon alert for July', () => {
    const alert = getSeasonalAlert(7);
    expect(alert.category).toBe('monsoon');
    expect(alert.title).toContain('Monsoon');
    expect(alert.icon).toBe('🌧️');
  });

  it('returns winter alert for December', () => {
    const alert = getSeasonalAlert(12);
    expect(alert.category).toBe('winter');
    expect(alert.title).toContain('Winter');
    expect(alert.icon).toBe('❄️');
  });

  it('returns summer alert for May', () => {
    const alert = getSeasonalAlert(5);
    expect(alert.category).toBe('summer');
    expect(alert.title).toContain('Summer');
    expect(alert.icon).toBe('☀️');
  });

  it('returns spring alert for February', () => {
    const alert = getSeasonalAlert(2);
    expect(alert.category).toBe('spring');
    expect(alert.title).toContain('Spring');
    expect(alert.icon).toBe('🌸');
  });

  it('returns autumn alert for October', () => {
    const alert = getSeasonalAlert(10);
    expect(alert.category).toBe('autumn');
    expect(alert.title).toContain('Autumn');
    expect(alert.icon).toBe('🍂');
  });
});

describe('SEASONAL_ALERT_STORAGE_KEY', () => {
  it('equals "seasonal-alert-dismissed"', () => {
    expect(SEASONAL_ALERT_STORAGE_KEY).toBe('seasonal-alert-dismissed');
  });
});
