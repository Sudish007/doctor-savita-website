/**
 * Unit tests for the remedy-rotation utility.
 * Validates: Requirements 28.1, 28.2, 28.3
 */
import { describe, it, expect } from "vitest";
import {
  getRemedyOfTheDay,
  getDayNumberIST,
  getSourceIcon,
  DEFAULT_REMEDIES,
} from "./remedy-rotation";

describe("remedy-rotation", () => {
  describe("DEFAULT_REMEDIES", () => {
    it("should contain at least 100 remedies", () => {
      expect(DEFAULT_REMEDIES.length).toBeGreaterThanOrEqual(100);
    });

    it("each remedy should have required fields", () => {
      for (const remedy of DEFAULT_REMEDIES) {
        expect(remedy.name).toBeTruthy();
        expect(remedy.primaryUse).toBeTruthy();
        expect(remedy.funFact).toBeTruthy();
        expect(["plant", "mineral", "animal"]).toContain(remedy.source);
        expect(remedy.icon).toBeTruthy();
      }
    });
  });

  describe("getDayNumberIST", () => {
    it("should return same day number for same IST date", () => {
      // Two times on the same IST day (e.g., 2024-01-15 at different hours IST)
      const date1 = new Date("2024-01-15T00:00:00+05:30");
      const date2 = new Date("2024-01-15T23:59:59+05:30");
      expect(getDayNumberIST(date1)).toBe(getDayNumberIST(date2));
    });

    it("should return different day numbers for different IST dates", () => {
      const date1 = new Date("2024-01-15T23:59:59+05:30");
      const date2 = new Date("2024-01-16T00:00:01+05:30");
      expect(getDayNumberIST(date2)).toBe(getDayNumberIST(date1) + 1);
    });
  });

  describe("getRemedyOfTheDay", () => {
    it("should be deterministic — same date returns same remedy", () => {
      const date = new Date("2024-06-15T10:00:00+05:30");
      const remedy1 = getRemedyOfTheDay(date, DEFAULT_REMEDIES);
      const remedy2 = getRemedyOfTheDay(date, DEFAULT_REMEDIES);
      expect(remedy1.name).toBe(remedy2.name);
    });

    it("should return different remedies for different dates", () => {
      const date1 = new Date("2024-06-15T10:00:00+05:30");
      const date2 = new Date("2024-06-16T10:00:00+05:30");
      const remedy1 = getRemedyOfTheDay(date1, DEFAULT_REMEDIES);
      const remedy2 = getRemedyOfTheDay(date2, DEFAULT_REMEDIES);
      expect(remedy1.name).not.toBe(remedy2.name);
    });

    it("should not repeat within any 100-day window", () => {
      const startDate = new Date("2024-01-01T12:00:00+05:30");
      const seen = new Set<string>();

      for (let i = 0; i < 100; i++) {
        const date = new Date(
          startDate.getTime() + i * 24 * 60 * 60 * 1000
        );
        const remedy = getRemedyOfTheDay(date, DEFAULT_REMEDIES);
        expect(seen.has(remedy.name)).toBe(false);
        seen.add(remedy.name);
      }
    });

    it("should throw for empty remedy list", () => {
      expect(() =>
        getRemedyOfTheDay(new Date(), [])
      ).toThrow("Remedy list cannot be empty");
    });
  });

  describe("getSourceIcon", () => {
    it("should return 🌿 for plant", () => {
      expect(getSourceIcon("plant")).toBe("🌿");
    });

    it("should return ⛰️ for mineral", () => {
      expect(getSourceIcon("mineral")).toBe("⛰️");
    });

    it("should return 🐝 for animal", () => {
      expect(getSourceIcon("animal")).toBe("🐝");
    });
  });
});
