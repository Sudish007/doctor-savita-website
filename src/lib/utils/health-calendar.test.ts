/**
 * Unit tests for Health Calendar utility functions.
 * Tests the core logic for awareness date matching, badge display, and CMS toggles.
 *
 * Requirements: 37.1, 37.2, 37.3, 37.4, 37.5
 */
import { describe, expect, it, vi, afterEach } from 'vitest';

import {
  HEALTH_CALENDAR,
  getEnabledHealthDays,
  getHealthDayForDate,
  getTodaysHealthDay,
  isHealthDayToday,
  type HealthCalendarEntry,
} from './health-calendar';

describe('Health Calendar', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('HEALTH_CALENDAR constant', () => {
    it('should contain at least 20 awareness dates', () => {
      expect(HEALTH_CALENDAR.length).toBeGreaterThanOrEqual(20);
    });

    it('should have all entries with valid MM-DD format', () => {
      const mmddRegex = /^(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
      for (const entry of HEALTH_CALENDAR) {
        expect(entry.date).toMatch(mmddRegex);
      }
    });

    it('should have all entries with required fields', () => {
      for (const entry of HEALTH_CALENDAR) {
        expect(entry.name).toBeTruthy();
        expect(entry.date).toBeTruthy();
        expect(entry.category).toBeTruthy();
        expect(entry.templateTitle).toBeTruthy();
        expect(typeof entry.enabled).toBe('boolean');
      }
    });

    it('should include World Homeopathy Day on April 10', () => {
      const homeopathyDay = HEALTH_CALENDAR.find((e) => e.date === '04-10');
      expect(homeopathyDay).toBeDefined();
      expect(homeopathyDay!.name).toBe('World Homeopathy Day');
    });

    it('should include World Health Day on April 7', () => {
      const healthDay = HEALTH_CALENDAR.find((e) => e.date === '04-07');
      expect(healthDay).toBeDefined();
      expect(healthDay!.name).toBe('World Health Day');
    });

    it('should include International Day of Yoga on June 21', () => {
      const yogaDay = HEALTH_CALENDAR.find((e) => e.date === '06-21');
      expect(yogaDay).toBeDefined();
      expect(yogaDay!.name).toBe('International Day of Yoga');
    });

    it('should include World Mental Health Day on October 10', () => {
      const mentalHealthDay = HEALTH_CALENDAR.find((e) => e.date === '10-10');
      expect(mentalHealthDay).toBeDefined();
      expect(mentalHealthDay!.name).toBe('World Mental Health Day');
    });

    it('should have valid HealthCategory values', () => {
      const validCategories = [
        'immunity',
        'skin-care',
        'digestion',
        'womens-health',
        'child-care',
        'mental-wellness',
      ];
      for (const entry of HEALTH_CALENDAR) {
        expect(validCategories).toContain(entry.category);
      }
    });
  });

  describe('getHealthDayForDate', () => {
    it('should return the entry for World Homeopathy Day', () => {
      const result = getHealthDayForDate('04-10');
      expect(result).not.toBeNull();
      expect(result!.name).toBe('World Homeopathy Day');
      expect(result!.category).toBe('immunity');
    });

    it('should return null for a date with no awareness day', () => {
      const result = getHealthDayForDate('01-15');
      expect(result).toBeNull();
    });

    it('should return null for an invalid date string', () => {
      const result = getHealthDayForDate('invalid');
      expect(result).toBeNull();
    });

    it('should respect the enabled flag', () => {
      // Temporarily disable an entry by modifying the array
      const originalEntry = HEALTH_CALENDAR.find((e) => e.date === '04-10')!;
      const originalEnabled = originalEntry.enabled;
      originalEntry.enabled = false;

      const result = getHealthDayForDate('04-10');
      expect(result).toBeNull();

      // Restore
      originalEntry.enabled = originalEnabled;
    });
  });

  describe('getTodaysHealthDay', () => {
    it('should return health day info when today matches a calendar date', () => {
      // Mock Date to April 10 (World Homeopathy Day)
      vi.useFakeTimers();
      vi.setSystemTime(new Date(2025, 3, 10)); // Month is 0-indexed: 3 = April

      const result = getTodaysHealthDay();
      expect(result).not.toBeNull();
      expect(result!.name).toBe('World Homeopathy Day');
      expect(result!.category).toBe('immunity');
      expect(result!.templateTitle).toContain('World Homeopathy Day');

      vi.useRealTimers();
    });

    it('should return null when today is not a health awareness date', () => {
      // Mock Date to January 15 (no awareness date)
      vi.useFakeTimers();
      vi.setSystemTime(new Date(2025, 0, 15)); // Jan 15

      const result = getTodaysHealthDay();
      expect(result).toBeNull();

      vi.useRealTimers();
    });
  });

  describe('isHealthDayToday', () => {
    it('should return true on a health awareness date', () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date(2025, 3, 7)); // April 7 - World Health Day

      expect(isHealthDayToday()).toBe(true);

      vi.useRealTimers();
    });

    it('should return false when no health awareness date matches', () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date(2025, 0, 2)); // January 2 - no event

      expect(isHealthDayToday()).toBe(false);

      vi.useRealTimers();
    });
  });

  describe('getEnabledHealthDays', () => {
    it('should return only enabled entries', () => {
      const enabled = getEnabledHealthDays();
      for (const entry of enabled) {
        expect(entry.enabled).toBe(true);
      }
    });

    it('should return all entries when all are enabled', () => {
      // Default state: all enabled
      const enabled = getEnabledHealthDays();
      expect(enabled.length).toBe(HEALTH_CALENDAR.length);
    });
  });

  describe('CMS toggle per date (enable/disable)', () => {
    it('should exclude disabled entries from getTodaysHealthDay', () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date(2025, 3, 10)); // April 10

      const entry = HEALTH_CALENDAR.find((e) => e.date === '04-10')!;
      const originalEnabled = entry.enabled;

      // Disable the entry
      entry.enabled = false;
      expect(getTodaysHealthDay()).toBeNull();
      expect(isHealthDayToday()).toBe(false);

      // Re-enable
      entry.enabled = true;
      expect(getTodaysHealthDay()).not.toBeNull();
      expect(isHealthDayToday()).toBe(true);

      // Restore
      entry.enabled = originalEnabled;
      vi.useRealTimers();
    });
  });
});
