"use client";

import type { ReactNode } from "react";
import { cx } from "../../lib/zey-vision/ui-utils";

type AlertVariant = "info" | "success" | "warning" | "error";

const ALERT_VARIANT_CLASSES: Record<AlertVariant, string> = {
  info: "bg-surface text-foreground border-border",
  success: "bg-success-bg text-success-fg border-success-border",
  warning: "bg-warning-bg text-warning-fg border-warning-border",
  error: "bg-error-bg text-error-fg border-error-border",
};

const ALERT_ICONS: Record<AlertVariant, ReactNode> = {
  info: (
    <svg viewBox="0 0 20 20" aria-hidden="true" className="h-5 w-5 shrink-0">
      <circle cx="10" cy="10" r="8" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <line x1="10" y1="9" x2="10" y2="14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="10" cy="6.25" r="1" fill="currentColor" />
    </svg>
  ),
  success: (
    <svg viewBox="0 0 20 20" aria-hidden="true" className="h-5 w-5 shrink-0">
      <circle cx="10" cy="10" r="8" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M6.5 10.5l2.3 2.3 4.7-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  warning: (
    <svg viewBox="0 0 20 20" aria-hidden="true" className="h-5 w-5 shrink-0">
      <path
        d="M10 3.5l8 13.5H2l8-13.5z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <line x1="10" y1="9" x2="10" y2="12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="10" cy="15" r="0.9" fill="currentColor" />
    </svg>
  ),
  error: (
    <svg viewBox="0 0 20 20" aria-hidden="true" className="h-5 w-5 shrink-0">
      <circle cx="10" cy="10" r="8" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <line x1="7.5" y1="7.5" x2="12.5" y2="12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="12.5" y1="7.5" x2="7.5" y2="12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
};

export interface AlertProps {
  variant?: AlertVariant;
  title?: string;
  children: ReactNode;
  onDismiss?: () => void;
  className?: string;
}

/** `role="alert"` for warning/error (urgent, interrupts), `role="status"`
 * for info/success (polite). Assumes the Alert mounts/unmounts dynamically —
 * a screen reader only announces aria-live regions on change, not on a
 * page's initial render. */
export function Alert({ variant = "info", title, children, onDismiss, className }: AlertProps) {
  const isUrgent = variant === "warning" || variant === "error";

  return (
    <div
      role={isUrgent ? "alert" : "status"}
      className={cx("flex items-start gap-3 rounded-sm border p-4", ALERT_VARIANT_CLASSES[variant], className)}
    >
      {ALERT_ICONS[variant]}
      <div className="flex-1 text-sm">
        {title ? <p className="zv-ui font-medium">{title}</p> : null}
        <div>{children}</div>
      </div>
      {onDismiss ? (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss"
          className="shrink-0 rounded-sm p-1 opacity-70 transition-opacity duration-200 ease-in-out hover:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
        >
          <svg aria-hidden="true" viewBox="0 0 20 20" className="h-4 w-4">
            <line x1="4" y1="4" x2="16" y2="16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="16" y1="4" x2="4" y2="16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      ) : null}
    </div>
  );
}
