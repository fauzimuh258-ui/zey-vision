import { describe, expect, it } from "vitest";
import { getCircadianColors, getContrastRatio, meetsWcagAA, neutral } from "./color-system";

describe("getContrastRatio / meetsWcagAA", () => {
  it("computes a known ratio (black on white is 21:1)", () => {
    expect(getContrastRatio("#000000", "#FFFFFF")).toBeCloseTo(21, 0);
  });

  it("is symmetric regardless of argument order", () => {
    const a = getContrastRatio("#1A1A1A", "#F0EAE0");
    const b = getContrastRatio("#F0EAE0", "#1A1A1A");
    expect(a).toBeCloseTo(b, 5);
  });

  it("flags a low-contrast pair as failing normal-text AA", () => {
    expect(meetsWcagAA("#D9C4A3", "#C68A55")).toBe(false);
  });

  it("flags the neutral-0/neutral-900 pair as passing AA comfortably", () => {
    expect(meetsWcagAA(neutral["900"], neutral["0"])).toBe(true);
  });
});

describe("getCircadianColors interpolation", () => {
  it("returns exactly the night color set at midnight", () => {
    const midnight = new Date("2026-01-01T00:00:00");
    const colors = getCircadianColors(midnight);
    expect(colors.background.toUpperCase()).toBe("#1A1A1A");
  });

  it("returns exactly the midday color set at noon", () => {
    const noon = new Date("2026-01-01T12:00:00");
    const colors = getCircadianColors(noon);
    expect(colors.background.toUpperCase()).toBe("#F0EAE0");
  });

  it("interpolates to a value strictly between night and midday at 09:00", () => {
    const morning = new Date("2026-01-01T09:00:00");
    const colors = getCircadianColors(morning);
    expect(colors.background.toUpperCase()).not.toBe("#1A1A1A");
    expect(colors.background.toUpperCase()).not.toBe("#F0EAE0");
  });
});
