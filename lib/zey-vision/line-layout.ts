"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export interface LineRect {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

/** Measures the visual (wrapped) line boxes of all text inside `container`,
 * using Range.getClientRects() — the standard way to find out where the
 * browser actually wrapped text, since CSS has no concept of "line 3" as
 * an addressable thing. Coordinates are viewport-relative (like
 * getBoundingClientRect), matching `position: fixed` overlays directly. */
function measureLines(container: HTMLElement): LineRect[] {
  const rects: LineRect[] = [];
  const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, {
    acceptNode: (node) =>
      node.textContent?.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT,
  });

  let node = walker.nextNode();
  while (node) {
    const range = document.createRange();
    range.selectNodeContents(node);
    const nodeRects = range.getClientRects();
    for (let i = 0; i < nodeRects.length; i++) {
      const r = nodeRects[i];
      if (r.width > 0 && r.height > 0) {
        rects.push({ top: r.top, bottom: r.bottom, left: r.left, right: r.right });
      }
    }
    node = walker.nextNode();
  }

  return rects.sort((a, b) => a.top - b.top);
}

export interface UseLineFocusResult {
  containerRef: { current: HTMLDivElement | null };
  activeLine: LineRect | null;
  moveActive: (delta: number) => void;
  clearActive: () => void;
}

/**
 * `enabled` gates the whole feature (accessibility principle: must be
 * toggle-able). Pointer-driven by default; `moveActive`/`clearActive` are
 * exposed so a consuming component can offer keyboard-operable controls
 * (see LineFocus.tsx's Previous/Next/Clear buttons) rather than this hook
 * attaching its own invisible keydown handler to the reading content —
 * that would add an unlabeled, confusing tab stop for screen reader users
 * for no benefit to them.
 */
export function useLineFocus(enabled: boolean): UseLineFocusResult {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const linesRef = useRef<LineRect[]>([]);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const remeasure = useCallback((): void => {
    if (!containerRef.current) return;
    linesRef.current = measureLines(containerRef.current);
  }, []);

  useEffect(() => {
    if (!enabled) {
      setActiveIndex(null);
      return;
    }

    remeasure();
    const container = containerRef.current;
    if (!container) return;

    const resizeObserver = new ResizeObserver(() => remeasure());
    resizeObserver.observe(container);
    // Catches content changes that don't resize the container itself
    // (e.g. text swapped in via React state) — ResizeObserver alone would
    // miss those and the cached line rects would go stale.
    const mutationObserver = new MutationObserver(() => remeasure());
    mutationObserver.observe(container, { childList: true, subtree: true, characterData: true });

    const onPointerMove = (event: PointerEvent): void => {
      const y = event.clientY;
      const index = linesRef.current.findIndex((line) => y >= line.top && y <= line.bottom);
      if (index !== -1) setActiveIndex(index);
    };

    container.addEventListener("pointermove", onPointerMove);
    return () => {
      resizeObserver.disconnect();
      mutationObserver.disconnect();
      container.removeEventListener("pointermove", onPointerMove);
    };
  }, [enabled, remeasure]);

  const moveActive = useCallback((delta: number): void => {
    setActiveIndex((current) => {
      const total = linesRef.current.length;
      if (total === 0) return null;
      const base = current ?? -1;
      return Math.max(0, Math.min(total - 1, base + delta));
    });
  }, []);

  const clearActive = useCallback((): void => setActiveIndex(null), []);

  const activeLine = activeIndex !== null ? linesRef.current[activeIndex] ?? null : null;

  return { containerRef, activeLine, moveActive, clearActive };
}
