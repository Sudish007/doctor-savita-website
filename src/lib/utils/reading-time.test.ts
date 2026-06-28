import { describe, it, expect } from "vitest";
import { calculateReadingTime } from "./reading-time";

describe("calculateReadingTime", () => {
  it("returns 1 minute for empty string", () => {
    expect(calculateReadingTime("")).toBe(1);
  });

  it("returns 1 minute for whitespace-only string", () => {
    expect(calculateReadingTime("   \n\t  ")).toBe(1);
  });

  it("returns 1 minute for a single word", () => {
    expect(calculateReadingTime("Hello")).toBe(1);
  });

  it("returns 1 minute for text under 200 words", () => {
    const text = Array(100).fill("word").join(" ");
    expect(calculateReadingTime(text)).toBe(1);
  });

  it("returns 1 minute for exactly 200 words", () => {
    const text = Array(200).fill("word").join(" ");
    expect(calculateReadingTime(text)).toBe(1);
  });

  it("returns 2 minutes for 201 words (rounds up)", () => {
    const text = Array(201).fill("word").join(" ");
    expect(calculateReadingTime(text)).toBe(2);
  });

  it("returns 2 minutes for 400 words", () => {
    const text = Array(400).fill("word").join(" ");
    expect(calculateReadingTime(text)).toBe(2);
  });

  it("returns 3 minutes for 401 words", () => {
    const text = Array(401).fill("word").join(" ");
    expect(calculateReadingTime(text)).toBe(3);
  });

  it("returns 5 minutes for 1000 words", () => {
    const text = Array(1000).fill("word").join(" ");
    expect(calculateReadingTime(text)).toBe(5);
  });

  it("handles text with multiple whitespace between words", () => {
    const text = "one   two   three   four   five";
    // split(/\s+/) on trimmed text should yield 5 words
    expect(calculateReadingTime(text)).toBe(1);
  });

  it("handles text with newlines and tabs", () => {
    const words = Array(250).fill("word").join("\n");
    expect(calculateReadingTime(words)).toBe(2);
  });

  it("correctly counts words separated by various whitespace", () => {
    const text = "a\tb\nc d  e";
    // 5 words → ceil(5/200) = 1
    expect(calculateReadingTime(text)).toBe(1);
  });
});
