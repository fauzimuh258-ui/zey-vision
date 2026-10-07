"use client";

import { useEffect } from "react";
import type { ReactNode } from "react";
import { Transition } from "./Transition";
import { useAmbientLight, useBatteryAwareness, useIdleDim } from "../../lib/zey-vision/ambient";

export interface AmbientProviderProps {
  children: ReactNode;
  /** Master on/off switch — must be easy to disable per the accessibility
   * principle in the brief. Default: true. */
  enabled?: boolean;
  idleMinutes?: number;
}

/** Wraps the app to apply idle-dim, and mounts the (mostly opportunistic)
 * light/battery observers. Neither useAmbientLight nor useBatteryAwareness
 * needs its own enabled flag — they're passive observers with no visible
 * effect of their own; only the idle-dim overlay they might inform has
 * one, here. */
export function AmbientProvider({ children, enabled = true, idleMinutes = 5 }: AmbientProviderProps) {
  const idle = useIdleDim({ idleMinutes, enabled });
  const battery = useBatteryAwareness();
  // Not consumed further here — Part 1's time-based circadian system is
  // the real fallback; this is only useful on the rare device/browser
  // where the sensor actually works. Kept mounted so `lux` is available
  // if a future part wants a finer-grained brightness curve.
  useAmbientLight();

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.dataset.zvLowPower = battery.lowPower ? "true" : "false";
  }, [battery.lowPower]);

  return (
    <>
      {children}
      <Transition show={enabled && idle} preset="fade" durationMs={320}>
        <div aria-hidden="true" className="zv-idle-dim" />
      </Transition>
    </>
  );
}
