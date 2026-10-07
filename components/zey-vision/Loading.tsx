"use client";

import { cx } from "../../lib/zey-vision/ui-utils";

// ---------------------------------------------------------------------------
// Skeleton
// ---------------------------------------------------------------------------

export interface SkeletonProps {
  width?: string;
  height?: string;
  rounded?: boolean;
  className?: string;
}

/** Placeholder block with a shimmer sweep (see .zv-skeleton in
 * zey-vision-motion.css). Purely decorative — mark the surrounding
 * container with aria-busy="true" so screen readers know content is
 * loading (this component itself is aria-hidden). */
export function Skeleton({ width = "100%", height = "1rem", rounded = false, className }: SkeletonProps) {
  return (
    <span
      aria-hidden="true"
      className={cx("zv-skeleton block", rounded ? "rounded-full" : "rounded-sm", className)}
      style={{ width, height }}
    />
  );
}

// ---------------------------------------------------------------------------
// Spinner
// ---------------------------------------------------------------------------

type SpinnerSize = "sm" | "md" | "lg";

const SPINNER_SIZE_CLASSES: Record<SpinnerSize, string> = {
  sm: "h-4 w-4 border-2",
  md: "h-5 w-5 border-2",
  lg: "h-8 w-8 border-[3px]",
};

export interface SpinnerProps {
  size?: SpinnerSize;
  label?: string;
  className?: string;
}

/** `role="status"` + visually-hidden label so screen readers announce the
 * loading state. The spin itself keeps running under reduced-motion (see
 * the docs for why). */
export function Spinner({ size = "md", label = "Loading", className }: SpinnerProps) {
  return (
    <span role="status" className={cx("inline-flex items-center gap-2", className)}>
      <span aria-hidden="true" className={cx("zv-spinner", SPINNER_SIZE_CLASSES[size])} />
      <span className="sr-only">{label}</span>
    </span>
  );
}
