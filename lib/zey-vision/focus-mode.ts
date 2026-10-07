"use client";

import { useEffect, useRef, useState } from "react";

// ---------------------------------------------------------------------------
// Zen mode
// ---------------------------------------------------------------------------

const ZEN_STORAGE_KEY = "zv-zen-mode";

/** Toggles `data-zv-zen` on <html>. Pair with CSS that hides anything
 * marked `data-zv-chrome` (nav, sidebars, headers) — see
 * zey-vision-focus.css. Persists via localStorage: one local on/off flag,
 * nothing sent anywhere. */
export function useZenMode(): [boolean, (next: boolean) => void] {
  const [zen, setZenState] = useState(false);

  useEffect(() => {
    try {
      setZenState(window.localStorage.getItem(ZEN_STORAGE_KEY) === "true");
    } catch {
      // ignore — defaults to off
    }
  }, []);

  useEffect(() => {
    document.documentElement.dataset.zvZen = zen ? "true" : "false";
  }, [zen]);

  const setZen = (next: boolean): void => {
    setZenState(next);
    try {
      window.localStorage.setItem(ZEN_STORAGE_KEY, String(next));
    } catch {
      // ignore
    }
  };

  return [zen, setZen];
}

// ---------------------------------------------------------------------------
// Focus preferences (dyslexia mode, bionic reading, ruler enabled)
// ---------------------------------------------------------------------------

export interface FocusPreferences {
  dyslexiaMode: boolean;
  bionicReading: boolean;
  rulerEnabled: boolean;
}

const PREFS_KEY = "zv-focus-preferences";
const DEFAULT_PREFS: FocusPreferences = {
  dyslexiaMode: false,
  bionicReading: false,
  rulerEnabled: false,
};

function readPrefs(): FocusPreferences {
  if (typeof window === "undefined") return DEFAULT_PREFS;
  try {
    const raw = window.localStorage.getItem(PREFS_KEY);
    if (!raw) return DEFAULT_PREFS;
    const parsed = JSON.parse(raw) as Partial<FocusPreferences>;
    return { ...DEFAULT_PREFS, ...parsed };
  } catch {
    return DEFAULT_PREFS;
  }
}

function writePrefs(prefs: FocusPreferences): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
  } catch {
    // ignore
  }
}

export function useFocusPreferences(): [FocusPreferences, (patch: Partial<FocusPreferences>) => void] {
  const [prefs, setPrefsState] = useState<FocusPreferences>(DEFAULT_PREFS);

  useEffect(() => {
    setPrefsState(readPrefs());
  }, []);

  useEffect(() => {
    document.documentElement.dataset.zvDyslexia = String(prefs.dyslexiaMode);
  }, [prefs.dyslexiaMode]);

  const setPrefs = (patch: Partial<FocusPreferences>): void => {
    setPrefsState((current) => {
      const next = { ...current, ...patch };
      writePrefs(next);
      return next;
    });
  };

  return [prefs, setPrefs];
}

// ---------------------------------------------------------------------------
// Focus stats
// ---------------------------------------------------------------------------

const STATS_PREFIX = "zv-focus-stats-";

function todayKey(): string {
  const now = new Date();
  return `${STATS_PREFIX}${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

function readTodaySeconds(): number {
  if (typeof window === "undefined") return 0;
  try {
    const raw = window.localStorage.getItem(todayKey());
    return raw ? Number(raw) || 0 : 0;
  } catch {
    return 0;
  }
}

function writeTodaySeconds(seconds: number): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(todayKey(), String(Math.round(seconds)));
  } catch {
    // ignore — stats are a nice-to-have, not critical
  }
}

export interface FocusStats {
  secondsToday: number;
}

/** Accumulates time while `active` is true, ticking once a second and
 * persisting to a date-keyed localStorage entry. NOTE: old date keys
 * aren't pruned automatically — at one tiny entry per day this won't hit
 * a storage quota for a very long time, but it's not self-cleaning, which
 * is worth knowing rather than discovering later. */
export function useFocusStats(active: boolean): FocusStats {
  const [secondsToday, setSecondsToday] = useState(0);
  const interval = useRef<number | null>(null);

  useEffect(() => {
    setSecondsToday(readTodaySeconds());
  }, []);

  useEffect(() => {
    if (!active) return;

    interval.current = window.setInterval(() => {
      setSecondsToday((current) => {
        const next = current + 1;
        writeTodaySeconds(next);
        return next;
      });
    }, 1000);

    return () => {
      if (interval.current !== null) window.clearInterval(interval.current);
    };
  }, [active]);

  return { secondsToday };
}
