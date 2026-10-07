"use client";

import { useEffect, useRef } from "react";

export function cx(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

/** Calls `handler` on Escape keydown while `enabled`. */
export function useEscapeKey(handler: () => void, enabled: boolean): void {
  useEffect(() => {
    if (!enabled) return;
    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === "Escape") handler();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [handler, enabled]);
}

/** Calls `handler` on a pointerdown outside `ref.current`, while `enabled`. */
export function useClickOutside<T extends HTMLElement>(
  ref: { current: T | null },
  handler: () => void,
  enabled: boolean
): void {
  useEffect(() => {
    if (!enabled) return;
    const onPointerDown = (event: PointerEvent): void => {
      const el = ref.current;
      if (el && event.target instanceof Node && !el.contains(event.target)) {
        handler();
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [ref, handler, enabled]);
}

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

/** Traps Tab/Shift+Tab focus cycling within `containerRef` while `active`,
 * moves focus into it, and restores focus to the previously-focused
 * element on deactivation. */
export function useFocusTrap<T extends HTMLElement>(
  containerRef: { current: T | null },
  active: boolean
): void {
  const previouslyFocused = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!active) return;
    previouslyFocused.current = document.activeElement as HTMLElement | null;

    const container = containerRef.current;
    const focusables = container
      ? Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR))
      : [];
    focusables[0]?.focus();

    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key !== "Tab" || !container) return;
      const current = Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
      if (current.length === 0) return;

      const first = current[0];
      const last = current[current.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      previouslyFocused.current?.focus();
    };
  }, [active, containerRef]);
}

/** Locks body scroll while `locked` is true (for modals). */
export function useScrollLock(locked: boolean): void {
  useEffect(() => {
    if (!locked) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [locked]);
}
