"use client";

import { useEffect, useRef, useState } from "react";

export type TransitionPhase = "entering" | "entered" | "exiting" | "exited";

export interface PresenceResult {
  mounted: boolean;
  phase: TransitionPhase;
}

/** Keeps a conditionally-rendered element mounted for `durationMs` after
 * `show` becomes false, so an exit animation has time to play before the
 * node is actually removed. Drive a `data-phase={phase}` attribute with a
 * matching CSS transition preset (see zey-vision-motion.css). */
export function usePresence(show: boolean, durationMs: number): PresenceResult {
  const [mounted, setMounted] = useState(show);
  const [phase, setPhase] = useState<TransitionPhase>(show ? "entered" : "exited");
  const exitTimer = useRef<number | null>(null);
  const enterFrame = useRef<number | null>(null);

  useEffect(() => {
    if (exitTimer.current !== null) window.clearTimeout(exitTimer.current);
    if (enterFrame.current !== null) cancelAnimationFrame(enterFrame.current);

    if (show) {
      setMounted(true);
      setPhase("entering");
      // Double rAF: guarantees a paint has happened with the "entering"
      // (from) state applied before flipping to "entered" (to), so the
      // CSS transition animates instead of jumping straight to its end
      // state.
      enterFrame.current = requestAnimationFrame(() => {
        enterFrame.current = requestAnimationFrame(() => setPhase("entered"));
      });
    } else {
      setPhase((current) => (current === "exited" ? current : "exiting"));
      exitTimer.current = window.setTimeout(() => {
        setPhase("exited");
        setMounted(false);
      }, durationMs);
    }

    return () => {
      if (exitTimer.current !== null) window.clearTimeout(exitTimer.current);
      if (enterFrame.current !== null) cancelAnimationFrame(enterFrame.current);
    };
  }, [show, durationMs]);

  return { mounted, phase };
}
