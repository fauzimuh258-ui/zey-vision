"use client";

import type { ReactNode } from "react";
import { usePresence } from "../../lib/zey-vision/motion";

type TransitionPreset = "fade" | "scale" | "slide" | "blur";

export interface TransitionProps {
  show: boolean;
  preset?: TransitionPreset;
  /** Must match the CSS preset's own transition-duration (see
   * zey-vision-motion.css) so the exit unmount timing lines up. */
  durationMs?: number;
  children: ReactNode;
  className?: string;
}

export function Transition({
  show,
  preset = "fade",
  durationMs = 200,
  children,
  className,
}: TransitionProps) {
  const { mounted, phase } = usePresence(show, durationMs);
  if (!mounted) return null;

  const classes = [`zv-transition-${preset}`, className].filter(Boolean).join(" ");

  return (
    <div data-phase={phase} className={classes}>
      {children}
    </div>
  );
}
