import { describe, it, expect } from "vitest";
import { calculateTreatmentCost, CostEstimate } from "./cost-calculator";

describe("calculateTreatmentCost", () => {
  describe("in-person consultation", () => {
    it("calculates 1-month cost correctly", () => {
      const result = calculateTreatmentCost("in-person", 1);
      // total = 500 + (1-1)*300 + 1*400 = 500 + 0 + 400 = 900
      expect(result).toEqual({
        initialFee: 500,
        followUpFee: 300,
        monthlyKitFee: 400,
        total: 900,
        duration: 1,
      });
    });

    it("calculates 3-month cost correctly", () => {
      const result = calculateTreatmentCost("in-person", 3);
      // total = 500 + (3-1)*300 + 3*400 = 500 + 600 + 1200 = 2300
      expect(result.total).toBe(2300);
      expect(result.duration).toBe(3);
    });

    it("calculates 6-month cost correctly", () => {
      const result = calculateTreatmentCost("in-person", 6);
      // total = 500 + (6-1)*300 + 6*400 = 500 + 1500 + 2400 = 4400
      expect(result.total).toBe(4400);
      expect(result.duration).toBe(6);
    });
  });

  describe("online consultation", () => {
    it("calculates 1-month cost correctly", () => {
      const result = calculateTreatmentCost("online", 1);
      // total = 400 + (1-1)*200 + 1*400 = 400 + 0 + 400 = 800
      expect(result).toEqual({
        initialFee: 400,
        followUpFee: 200,
        monthlyKitFee: 400,
        total: 800,
        duration: 1,
      });
    });

    it("calculates 3-month cost correctly", () => {
      const result = calculateTreatmentCost("online", 3);
      // total = 400 + (3-1)*200 + 3*400 = 400 + 400 + 1200 = 2000
      expect(result.total).toBe(2000);
      expect(result.duration).toBe(3);
    });

    it("calculates 6-month cost correctly", () => {
      const result = calculateTreatmentCost("online", 6);
      // total = 400 + (6-1)*200 + 6*400 = 400 + 1000 + 2400 = 3800
      expect(result.total).toBe(3800);
      expect(result.duration).toBe(6);
    });
  });

  describe("general properties", () => {
    it("always returns a positive integer total", () => {
      const types: Array<"in-person" | "online"> = ["in-person", "online"];
      const durations: Array<1 | 3 | 6> = [1, 3, 6];

      for (const type of types) {
        for (const dur of durations) {
          const result = calculateTreatmentCost(type, dur);
          expect(result.total).toBeGreaterThan(0);
          expect(Number.isInteger(result.total)).toBe(true);
        }
      }
    });

    it("total matches the formula: initial + (dur-1)*followUp + dur*kit", () => {
      const types: Array<"in-person" | "online"> = ["in-person", "online"];
      const durations: Array<1 | 3 | 6> = [1, 3, 6];

      for (const type of types) {
        for (const dur of durations) {
          const r = calculateTreatmentCost(type, dur);
          const expected =
            r.initialFee + (dur - 1) * r.followUpFee + dur * r.monthlyKitFee;
          expect(r.total).toBe(expected);
        }
      }
    });
  });
});
