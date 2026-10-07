"use client";

import { useEffect, useRef, useState } from "react";

// ---------------------------------------------------------------------------
// Ambient light — Generic Sensor API when available, time-based fallback
// always. Real-world support note: AmbientLightSensor was removed from
// Chrome and was never shipped in Safari/iOS, both over fingerprinting
// concerns — `supported` will be false for the overwhelming majority of
// visitors. This hook exists for the rare case it works, not as the
// primary path; Part 1's time-based circadian system is the real fallback.
// ---------------------------------------------------------------------------

interface GenericSensorLike {
  addEventListener: (type: "reading" | "error", callback: () => void) => void;
  removeEventListener: (type: "reading" | "error", callback: () => void) => void;
  start: () => void;
  stop: () => void;
  illuminance?: number;
}

interface AmbientLightSensorConstructor {
  new (options?: { frequency?: number }): GenericSensorLike;
}

export interface AmbientLightState {
  supported: boolean;
  lux: number | null;
  error: string | null;
}

export function useAmbientLight(): AmbientLightState {
  const [state, setState] = useState<AmbientLightState>({
    supported: false,
    lux: null,
    error: null,
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const w = window as unknown as { AmbientLightSensor?: AmbientLightSensorConstructor };
    if (!w.AmbientLightSensor) return;

    let sensor: GenericSensorLike | null = null;

    try {
      sensor = new w.AmbientLightSensor({ frequency: 1 });

      const onReading = (): void => {
        setState({ supported: true, lux: sensor?.illuminance ?? null, error: null });
      };
      const onError = (): void => {
        setState({ supported: false, lux: null, error: "Sensor read failed or permission denied" });
      };

      sensor.addEventListener("reading", onReading);
      sensor.addEventListener("error", onError);
      sensor.start();

      return () => {
        sensor?.removeEventListener("reading", onReading);
        sensor?.removeEventListener("error", onError);
        sensor?.stop();
      };
    } catch {
      setState({ supported: false, lux: null, error: "AmbientLightSensor unavailable in this context" });
      return;
    }
  }, []);

  return state;
}

// ---------------------------------------------------------------------------
// Idle dim
// ---------------------------------------------------------------------------

export interface IdleDimOptions {
  /** Minutes of inactivity before dimming. Default: 5. */
  idleMinutes?: number;
  enabled?: boolean;
}

const ACTIVITY_EVENTS = ["mousemove", "keydown", "touchstart", "scroll", "wheel"] as const;

/** NOTE: activity is inferred from input events, so quiet reading with no
 * scrolling can still be (mis)read as idle — there's no way to detect
 * "eyes on screen" without a camera. Keep idleMinutes generous and make
 * sure `enabled` is easy for the consumer to turn off. */
export function useIdleDim(options: IdleDimOptions = {}): boolean {
  const { idleMinutes = 5, enabled = true } = options;
  const [idle, setIdle] = useState(false);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled) {
      setIdle(false);
      return;
    }

    const reset = (): void => {
      setIdle(false);
      if (timer.current !== null) window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setIdle(true), idleMinutes * 60 * 1000);
    };

    reset();
    ACTIVITY_EVENTS.forEach((event) => window.addEventListener(event, reset, { passive: true }));

    return () => {
      if (timer.current !== null) window.clearTimeout(timer.current);
      ACTIVITY_EVENTS.forEach((event) => window.removeEventListener(event, reset));
    };
  }, [enabled, idleMinutes]);

  return idle;
}

// ---------------------------------------------------------------------------
// 20-20-20 eye break reminder
// ---------------------------------------------------------------------------

export interface EyeBreakState {
  dueForBreak: boolean;
  dismiss: () => void;
  minutesUntilNext: number;
}

const TWENTY_MINUTES_MS = 20 * 60 * 1000;

/** Pauses while the tab is hidden (Page Visibility API) — no point
 * reminding someone to rest their eyes from a screen they're not looking
 * at, and it avoids a burst of "overdue" reminders when a backgrounded
 * tab wakes back up. */
export function useEyeBreakReminder(enabled = true): EyeBreakState {
  const [dueForBreak, setDueForBreak] = useState(false);
  const [minutesUntilNext, setMinutesUntilNext] = useState(20);
  const nextDue = useRef<number>(Date.now() + TWENTY_MINUTES_MS);

  useEffect(() => {
    if (!enabled) return;

    const tick = (): void => {
      if (document.visibilityState !== "visible") return;

      const remainingMs = nextDue.current - Date.now();
      if (remainingMs <= 0) {
        setDueForBreak(true);
      } else {
        setMinutesUntilNext(Math.ceil(remainingMs / 60000));
      }
    };

    const interval = window.setInterval(tick, 15000);
    tick();
    return () => window.clearInterval(interval);
  }, [enabled]);

  const dismiss = (): void => {
    setDueForBreak(false);
    nextDue.current = Date.now() + TWENTY_MINUTES_MS;
    setMinutesUntilNext(20);
  };

  return { dueForBreak, dismiss, minutesUntilNext };
}

// ---------------------------------------------------------------------------
// Color temperature drift
// ---------------------------------------------------------------------------

/** A plain 0-1 "warmth" signal: 0 at solar noon, 1 at midnight. Deliberately
 * independent of Part 1's exact keyframe hours (dawn/dusk anchored to real
 * sunrise/sunset) rather than importing it — this is a simple daily rhythm
 * for Part 5's own ambient effects to synchronize with, not a duplicate of
 * Part 1's color system (which already handles the actual color drift). */
export function getAmbientWarmth(date: Date = new Date()): number {
  const hour = date.getHours() + date.getMinutes() / 60;
  const distanceFromNoon = Math.abs(hour - 12);
  return distanceFromNoon / 12;
}

// ---------------------------------------------------------------------------
// Battery awareness
// ---------------------------------------------------------------------------

interface BatteryManagerLike {
  level: number;
  charging: boolean;
  addEventListener: (type: "levelchange" | "chargingchange", cb: () => void) => void;
  removeEventListener: (type: "levelchange" | "chargingchange", cb: () => void) => void;
}

export interface BatteryState {
  supported: boolean;
  lowPower: boolean;
}

const LOW_BATTERY_THRESHOLD = 0.2;

/** Real-world support note: the Battery Status API was removed from
 * Firefox and was never shipped in Safari/iOS, both over fingerprinting
 * concerns — like useAmbientLight, `supported` will be false for a large
 * share of visitors. Fails open (lowPower: false) when unsupported, since
 * showing full effects is a safer default than guessing wrong. */
export function useBatteryAwareness(): BatteryState {
  const [state, setState] = useState<BatteryState>({ supported: false, lowPower: false });

  useEffect(() => {
    const nav = navigator as unknown as { getBattery?: () => Promise<BatteryManagerLike> };
    if (!nav.getBattery) return;

    let battery: BatteryManagerLike | null = null;
    let cancelled = false;

    const update = (): void => {
      if (!battery || cancelled) return;
      setState({
        supported: true,
        lowPower: battery.level < LOW_BATTERY_THRESHOLD && !battery.charging,
      });
    };

    nav.getBattery().then((b) => {
      if (cancelled) return;
      battery = b;
      update();
      battery.addEventListener("levelchange", update);
      battery.addEventListener("chargingchange", update);
    });

    return () => {
      cancelled = true;
      battery?.removeEventListener("levelchange", update);
      battery?.removeEventListener("chargingchange", update);
    };
  }, []);

  return state;
}

// ---------------------------------------------------------------------------
// Local, on-device preference learning — an exponential moving average of
// manual adjustments, NOT machine learning. No server, no analytics; a
// single localStorage key.
// ---------------------------------------------------------------------------

const PREFERENCE_STORAGE_KEY = "zv-ambient-preference";
const LEARNING_RATE = 0.2;

interface AmbientPreference {
  brightnessOffset: number;
  sampleCount: number;
}

const DEFAULT_PREFERENCE: AmbientPreference = { brightnessOffset: 0, sampleCount: 0 };

function readPreference(): AmbientPreference {
  if (typeof window === "undefined") return DEFAULT_PREFERENCE;
  try {
    const raw = window.localStorage.getItem(PREFERENCE_STORAGE_KEY);
    if (!raw) return DEFAULT_PREFERENCE;
    const parsed = JSON.parse(raw) as Partial<AmbientPreference>;
    return {
      brightnessOffset: typeof parsed.brightnessOffset === "number" ? parsed.brightnessOffset : 0,
      sampleCount: typeof parsed.sampleCount === "number" ? parsed.sampleCount : 0,
    };
  } catch {
    return DEFAULT_PREFERENCE;
  }
}

function writePreference(pref: AmbientPreference): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(PREFERENCE_STORAGE_KEY, JSON.stringify(pref));
  } catch {
    // Storage unavailable (private browsing, quota) — learning is a nice-
    // to-have, so fail silently rather than surfacing an error.
  }
}

/** Call whenever the user manually adjusts an ambient effect away from its
 * computed value, with the signed delta they applied. */
export function recordManualAmbientAdjustment(delta: number): void {
  const current = readPreference();
  const nextOffset = current.brightnessOffset + LEARNING_RATE * (delta - current.brightnessOffset);
  writePreference({ brightnessOffset: nextOffset, sampleCount: current.sampleCount + 1 });
}

/** Returns 0 on the very first client render (matches the SSR default, to
 * avoid a hydration mismatch), then the real stored value once mounted. */
export function useLearnedAmbientOffset(): number {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    setOffset(readPreference().brightnessOffset);
  }, []);

  return offset;
}
