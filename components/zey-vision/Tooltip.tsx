"use client";

import { cloneElement, isValidElement, useEffect, useId, useRef, useState } from "react";
import type { ReactElement, ReactNode } from "react";
import { cx } from "../../lib/zey-vision/ui-utils";

type TooltipPosition = "top" | "bottom" | "left" | "right";

const POSITION_CLASSES: Record<TooltipPosition, string> = {
  top: "bottom-full left-1/2 mb-2 -translate-x-1/2",
  bottom: "top-full left-1/2 mt-2 -translate-x-1/2",
  left: "right-full top-1/2 mr-2 -translate-y-1/2",
  right: "left-full top-1/2 ml-2 -translate-y-1/2",
};

const SHOW_DELAY_MS = 300;

export interface TooltipProps {
  content: ReactNode;
  position?: TooltipPosition;
  /** A single focusable element (e.g. a Button) — its props are merged
   * with the hover/focus/aria-describedby wiring below. */
  children: ReactElement;
}

export function Tooltip({ content, position = "top", children }: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const showTimer = useRef<number | null>(null);
  const tooltipId = useId();

  const show = (): void => {
    if (showTimer.current !== null) window.clearTimeout(showTimer.current);
    showTimer.current = window.setTimeout(() => setVisible(true), SHOW_DELAY_MS);
  };

  const hide = (): void => {
    if (showTimer.current !== null) window.clearTimeout(showTimer.current);
    setVisible(false);
  };

  useEffect(() => {
    if (!visible) return;
    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === "Escape") setVisible(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [visible]);

  useEffect(() => {
    return () => {
      if (showTimer.current !== null) window.clearTimeout(showTimer.current);
    };
  }, []);

  // The trigger can be any single element, so the extra handler props are
  // merged via a targeted cast rather than a strict prop-type match — the
  // standard, if slightly awkward, shape for a polymorphic trigger in
  // strict TypeScript.
  const trigger = isValidElement(children)
    ? cloneElement(children as ReactElement<Record<string, unknown>>, {
        onMouseEnter: show,
        onMouseLeave: hide,
        onFocus: show,
        onBlur: hide,
        "aria-describedby": visible ? tooltipId : undefined,
      })
    : children;

  return (
    <span className="relative inline-block">
      {trigger}
      {visible ? (
        <span
          role="tooltip"
          id={tooltipId}
          className={cx(
            "zv-ui zv-pop-in pointer-events-none absolute z-50 whitespace-nowrap rounded-sm border border-border bg-foreground px-2.5 py-1.5 text-xs text-background shadow-sm",
            POSITION_CLASSES[position]
          )}
        >
          {content}
        </span>
      ) : null}
    </span>
  );
}
