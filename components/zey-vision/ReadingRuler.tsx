"use client";

import { useEffect, useRef, useState } from "react";

export interface ReadingRulerProps {
  /** Ruler band height in pixels. Default: 48. */
  heightPx?: number;
  /** Whether the ruler is active. Default: true — wire this to a toggle. */
  enabled?: boolean;
}

/** A horizontal band that follows the pointer, fading (never hiding) the
 * rest of the page — a reading-tracking aid. Reuses the current circadian
 * background color from Part 1, so the dimming overlay always matches the
 * active theme automatically. */
export function ReadingRuler({ heightPx = 48, enabled = true }: ReadingRulerProps) {
  const [y, setY] = useState<number | null>(null);
  const frame = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const handleMove = (event: PointerEvent): void => {
      if (frame.current !== null) cancelAnimationFrame(frame.current);
      frame.current = requestAnimationFrame(() => setY(event.clientY));
    };

    window.addEventListener("pointermove", handleMove);
    return () => {
      window.removeEventListener("pointermove", handleMove);
      if (frame.current !== null) cancelAnimationFrame(frame.current);
    };
  }, [enabled]);

  if (!enabled || y === null) return null;

  return (
    <>
      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          left: 0,
          right: 0,
          top: 0,
          height: Math.max(0, y - heightPx / 2),
          background: "var(--zv-color-background)",
          opacity: 0.55,
          pointerEvents: "none",
          zIndex: 40,
          transition: "height 80ms linear",
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          left: 0,
          right: 0,
          top: y + heightPx / 2,
          bottom: 0,
          background: "var(--zv-color-background)",
          opacity: 0.55,
          pointerEvents: "none",
          zIndex: 40,
          transition: "top 80ms linear",
        }}
      />
    </>
  );
}
