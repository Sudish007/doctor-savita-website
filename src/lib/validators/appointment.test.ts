import { describe, it, expect } from "vitest";
import {
  generateTimeSlots,
  getEligibleDates,
  CLINIC_HOLIDAYS,
} from "./appointment";

describe("generateTimeSlots", () => {
  it("returns exactly 18 slots for Monday (1)", () => {
    const slots = generateTimeSlots(1);
    expect(slots).toHaveLength(18);
    expect(slots[0]).toBe("09:00");
    expect(slots[slots.length - 1]).toBe("17:30");
  });

  it("returns exactly 18 slots for Saturday (6)", () => {
    const slots = generateTimeSlots(6);
    expect(slots).toHaveLength(18);
  });

  it("returns empty array for Sunday (0)", () => {
    const slots = generateTimeSlots(0);
    expect(slots).toHaveLength(0);
  });

  it("all slots are 30-minute intervals", () => {
    const slots = generateTimeSlots(1);
    const expected = [
      "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
      "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
      "15:00", "15:30", "16:00", "16:30", "17:00", "17:30",
    ];
    expect(slots).toEqual(expected);
  });

  it("returns same 18 slots for all weekdays (1-6)", () => {
    for (let day = 1; day <= 6; day++) {
      const slots = generateTimeSlots(day);
      expect(slots).toHaveLength(18);
      expect(slots[0]).toBe("09:00");
      expect(slots[17]).toBe("17:30");
    }
  });
});

describe("getEligibleDates", () => {
  it("returns exactly 60 dates", () => {
    const dates = getEligibleDates();
    expect(dates).toHaveLength(60);
  });

  it("all Sundays are disabled", () => {
    const dates = getEligibleDates();
    const sundays = dates.filter((d) => d.date.getDay() === 0);
    sundays.forEach((sunday) => {
      expect(sunday.enabled).toBe(false);
    });
  });

  it("non-Sunday, non-holiday dates are enabled", () => {
    const dates = getEligibleDates([]);
    const nonSundays = dates.filter((d) => d.date.getDay() !== 0);
    nonSundays.forEach((date) => {
      expect(date.enabled).toBe(true);
    });
  });

  it("holidays are disabled", () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    // Pick a date 5 days from now that's not a Sunday for holiday test
    let holidayDate = new Date(today);
    holidayDate.setDate(today.getDate() + 5);
    if (holidayDate.getDay() === 0) {
      holidayDate.setDate(holidayDate.getDate() + 1);
    }
    const holidayStr = holidayDate.toISOString().split("T")[0];

    const dates = getEligibleDates([holidayStr]);
    const holidayEntry = dates.find(
      (d) => d.date.toISOString().split("T")[0] === holidayStr
    );
    expect(holidayEntry).toBeDefined();
    expect(holidayEntry!.enabled).toBe(false);
  });

  it("starts from today", () => {
    const dates = getEligibleDates();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    expect(dates[0].date.getTime()).toBe(today.getTime());
  });
});

describe("CLINIC_HOLIDAYS", () => {
  it("is an empty array by default", () => {
    expect(CLINIC_HOLIDAYS).toEqual([]);
  });
});
