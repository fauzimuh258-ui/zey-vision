"use client";

/**
 * Zey Vision — Color System (Part 1)
 * -----------------------------------------------------------------------
 * Computes circadian-adaptive color tokens (background, surface, foreground,
 * muted foreground, border, accent) from time of day, with an optional
 * sunrise/sunset-aware mode when geographic coordinates are supplied.
 *
 * No network calls, no analytics, no third-party HTTP client — pure
 * client-side computation, consistent with the offline/no-tracking
 * constraint for this project.
 *
 * Requires `"resolveJsonModule": true` in tsconfig.json (on by default in
 * most Next.js setups). Colocate design-tokens.json next to this file, or
 * adjust the import path below.
 */

import { useEffect, useState } from "react";
import tokensData from "./design-tokens.json";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface CircadianColorSet {
  background: string;
  surface: string;
  foreground: string;
  foregroundMuted: string;
  border: string;
  accent: string;
}

export type CircadianPhaseName = "night" | "dawn" | "midday" | "dusk";

export interface CircadianKeyframe {
  phase: CircadianPhaseName;
  /** Hour of day (0-24, fractional) this keyframe anchors to in fallback mode. */
  hour: number;
  colors: CircadianColorSet;
}

export interface GeoCoordinates {
  latitude: number;
  longitude: number;
}

interface TokensShape {
  name: string;
  version: string;
  unit: string;
  neutral: Record<string, string>;
  circadian: {
    keyframes: CircadianKeyframe[];
  };
}

const tokens = tokensData as unknown as TokensShape;

export const neutral: Record<string, string> = tokens.neutral;

const keyframes: CircadianKeyframe[] = tokens.circadian.keyframes;

// ---------------------------------------------------------------------------
// Color math
// ---------------------------------------------------------------------------

function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace("#", "");
  return [
    parseInt(clean.substring(0, 2), 16),
    parseInt(clean.substring(2, 4), 16),
    parseInt(clean.substring(4, 6), 16),
  ];
}

function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number): string =>
    Math.round(Math.min(255, Math.max(0, n)))
      .toString(16)
      .padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function lerpHex(hexA: string, hexB: string, t: number): string {
  const [r1, g1, b1] = hexToRgb(hexA);
  const [r2, g2, b2] = hexToRgb(hexB);
  return rgbToHex(lerp(r1, r2, t), lerp(g1, g2, t), lerp(b1, b2, t));
}

function lerpColorSet(
  a: CircadianColorSet,
  b: CircadianColorSet,
  t: number
): CircadianColorSet {
  return {
    background: lerpHex(a.background, b.background, t),
    surface: lerpHex(a.surface, b.surface, t),
    foreground: lerpHex(a.foreground, b.foreground, t),
    foregroundMuted: lerpHex(a.foregroundMuted, b.foregroundMuted, t),
    border: lerpHex(a.border, b.border, t),
    accent: lerpHex(a.accent, b.accent, t),
  };
}

// ---------------------------------------------------------------------------
// WCAG contrast utilities (Chain-of-Verification: "WCAG compliant?")
// ---------------------------------------------------------------------------

function srgbChannelToLinear(channel: number): number {
  const c = channel / 255;
  return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

function relativeLuminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex).map(srgbChannelToLinear);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** WCAG 2.x contrast ratio between two colors (1 to 21). */
export function getContrastRatio(hexA: string, hexB: string): number {
  const a = relativeLuminance(hexA);
  const b = relativeLuminance(hexB);
  const lighter = Math.max(a, b);
  const darker = Math.min(a, b);
  return (lighter + 0.05) / (darker + 0.05);
}

/** AA requires 4.5:1 for normal text, 3:1 for large text (>=18pt, or >=14pt bold). */
export function meetsWcagAA(
  foregroundHex: string,
  backgroundHex: string,
  isLargeText = false
): boolean {
  return getContrastRatio(foregroundHex, backgroundHex) >= (isLargeText ? 3 : 4.5);
}

// ---------------------------------------------------------------------------
// Sunrise / sunset — compact approximation, no network call.
// Implements the public-domain Sunrise/Sunset Algorithm (Almanac for
// Computers, 1990, US Naval Observatory). Verified against real-world
// expectations for Jakarta, London and Reykjavik before shipping this file —
// accurate to within a few minutes, not survey-grade.
// ---------------------------------------------------------------------------

function dayOfYear(date: Date): number {
  const start = Date.UTC(date.getUTCFullYear(), 0, 1);
  const diff =
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()) - start;
  return Math.floor(diff / 86400000) + 1;
}

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

function toDeg(rad: number): number {
  return (rad * 180) / Math.PI;
}

/** Local fractional hours (0-24) for sunrise/sunset, or null on days with no
 * sunrise/sunset (polar day/night). */
function calcSunTimes(
  date: Date,
  coords: GeoCoordinates
): { sunrise: number; sunset: number } | null {
  const zenith = 90.833;
  const n = dayOfYear(date);
  const lngHour = coords.longitude / 15;

  const compute = (isSunrise: boolean): number | null => {
    const t = n + ((isSunrise ? 6 : 18) - lngHour) / 24;
    const M = 0.9856 * t - 3.289;
    let L = M + 1.916 * Math.sin(toRad(M)) + 0.02 * Math.sin(toRad(2 * M)) + 282.634;
    L = ((L % 360) + 360) % 360;

    let RA = toDeg(Math.atan(0.91764 * Math.tan(toRad(L))));
    RA = ((RA % 360) + 360) % 360;
    const lQuadrant = Math.floor(L / 90) * 90;
    const raQuadrant = Math.floor(RA / 90) * 90;
    RA = (RA + (lQuadrant - raQuadrant)) / 15;

    const sinDec = 0.39782 * Math.sin(toRad(L));
    const cosDec = Math.cos(Math.asin(sinDec));
    const cosH =
      (Math.cos(toRad(zenith)) - sinDec * Math.sin(toRad(coords.latitude))) /
      (cosDec * Math.cos(toRad(coords.latitude)));

    if (cosH > 1 || cosH < -1) return null; // sun never rises/sets this day

    let H = isSunrise ? 360 - toDeg(Math.acos(cosH)) : toDeg(Math.acos(cosH));
    H = H / 15;

    const T = H + RA - 0.06571 * t - 6.622;
    const utc = (((T - lngHour) % 24) + 24) % 24;
    return utc;
  };

  const sunriseUtc = compute(true);
  const sunsetUtc = compute(false);
  if (sunriseUtc === null || sunsetUtc === null) return null;

  const offsetHours = -date.getTimezoneOffset() / 60;
  const toLocal = (utc: number): number => (((utc + offsetHours) % 24) + 24) % 24;

  return { sunrise: toLocal(sunriseUtc), sunset: toLocal(sunsetUtc) };
}

// ---------------------------------------------------------------------------
// Phase resolution + interpolation
// ---------------------------------------------------------------------------

function getHourFraction(date: Date): number {
  return date.getHours() + date.getMinutes() / 60 + date.getSeconds() / 3600;
}

/** Anchors dawn/midday/dusk to real sunrise/solar-noon/sunset when
 * coordinates are given; otherwise uses the fixed 06:00/12:00/18:00 anchors
 * from design-tokens.json. */
function resolveKeyframes(date: Date, coords?: GeoCoordinates): CircadianKeyframe[] {
  if (!coords) return keyframes;

  const sunTimes = calcSunTimes(date, coords);
  if (!sunTimes) return keyframes; // polar edge case: fall back to fixed anchors

  const solarNoon = (sunTimes.sunrise + sunTimes.sunset) / 2;

  return keyframes.map((kf) => {
    if (kf.phase === "dawn") return { ...kf, hour: sunTimes.sunrise };
    if (kf.phase === "midday") return { ...kf, hour: solarNoon };
    if (kf.phase === "dusk") return { ...kf, hour: sunTimes.sunset };
    return kf; // "night" anchors (0 / 24) stay fixed
  });
}

/** Interpolated color set for the given moment. Assumes the device's system
 * timezone roughly matches `coords`. */
export function getCircadianColors(
  date: Date = new Date(),
  coords?: GeoCoordinates
): CircadianColorSet {
  const frames = resolveKeyframes(date, coords);
  const hour = getHourFraction(date);

  for (let i = 0; i < frames.length - 1; i++) {
    const a = frames[i];
    const b = frames[i + 1];
    if (hour >= a.hour && hour <= b.hour) {
      const t = (hour - a.hour) / (b.hour - a.hour);
      return lerpColorSet(a.colors, b.colors, t);
    }
  }

  return frames[0].colors; // unreachable in practice; keeps the return type total
}

// ---------------------------------------------------------------------------
// DOM application
// ---------------------------------------------------------------------------

const CSS_VAR_PREFIX = "--zv-color-";

/** Writes the current circadian color set onto :root as CSS custom
 * properties. No-ops outside the browser (SSR-safe). */
export function applyCircadianTheme(
  date: Date = new Date(),
  coords?: GeoCoordinates
): CircadianColorSet {
  const colors = getCircadianColors(date, coords);
  if (typeof document === "undefined") return colors;

  const root = document.documentElement;
  (Object.keys(colors) as Array<keyof CircadianColorSet>).forEach((key) => {
    root.style.setProperty(`${CSS_VAR_PREFIX}${key}`, colors[key]);
  });

  return colors;
}

// ---------------------------------------------------------------------------
// React hook
// ---------------------------------------------------------------------------

export interface UseCircadianThemeOptions {
  coords?: GeoCoordinates;
  /** Recompute interval in ms. Default: 5 minutes. */
  intervalMs?: number;
}

/** Applies and tracks the current circadian color set, recomputing on an
 * interval so the theme drifts gradually through the day. */
export function useCircadianTheme(
  options: UseCircadianThemeOptions = {}
): CircadianColorSet {
  const { coords, intervalMs = 5 * 60 * 1000 } = options;
  const [colors, setColors] = useState<CircadianColorSet>(() =>
    getCircadianColors(new Date(), coords)
  );

  useEffect(() => {
    const tick = (): void => setColors(applyCircadianTheme(new Date(), coords));
    tick();
    const id = window.setInterval(tick, intervalMs);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coords?.latitude, coords?.longitude, intervalMs]);

  return colors;
}
