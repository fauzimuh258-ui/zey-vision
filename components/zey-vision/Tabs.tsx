"use client";

import { useId, useRef, useState } from "react";
import type { KeyboardEvent, ReactNode } from "react";
import { cx } from "../../lib/zey-vision/ui-utils";

export interface TabItem {
  id: string;
  label: string;
  content: ReactNode;
}

export interface TabsProps {
  items: TabItem[];
  defaultActiveId?: string;
  className?: string;
}

/** Roving-tabindex tabs: Left/Right (or Home/End) move both selection and
 * focus, matching the WAI-ARIA Tabs pattern. */
export function Tabs({ items, defaultActiveId, className }: TabsProps) {
  const [activeId, setActiveId] = useState<string | undefined>(defaultActiveId ?? items[0]?.id);
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const baseId = useId();

  const activeIndex = items.findIndex((item) => item.id === activeId);

  const focusTabAt = (index: number): void => {
    if (items.length === 0) return;
    const wrapped = (index + items.length) % items.length;
    const target = items[wrapped];
    if (!target) return;
    setActiveId(target.id);
    tabRefs.current[target.id]?.focus();
  };

  const onKeyDown = (event: KeyboardEvent): void => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      focusTabAt(activeIndex + 1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      focusTabAt(activeIndex - 1);
    } else if (event.key === "Home") {
      event.preventDefault();
      focusTabAt(0);
    } else if (event.key === "End") {
      event.preventDefault();
      focusTabAt(items.length - 1);
    }
  };

  return (
    <div className={className}>
      <div
        role="tablist"
        aria-label="Tabs"
        onKeyDown={onKeyDown}
        className="flex gap-1 border-b border-border"
      >
        {items.map((item) => {
          const selected = item.id === activeId;
          return (
            <button
              key={item.id}
              ref={(el: HTMLButtonElement | null) => {
                tabRefs.current[item.id] = el;
              }}
              type="button"
              role="tab"
              id={`${baseId}-tab-${item.id}`}
              aria-selected={selected}
              aria-controls={`${baseId}-panel-${item.id}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActiveId(item.id)}
              className={cx(
                "zv-ui -mb-px border-b-2 px-4 py-2.5 text-sm font-medium transition-colors duration-200 ease-in-out",
                "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
                selected
                  ? "border-accent text-foreground"
                  : "border-transparent text-foreground-muted hover:text-foreground"
              )}
            >
              {item.label}
            </button>
          );
        })}
      </div>
      {items.map((item) => (
        <div
          key={item.id}
          role="tabpanel"
          id={`${baseId}-panel-${item.id}`}
          aria-labelledby={`${baseId}-tab-${item.id}`}
          hidden={item.id !== activeId}
          className="pt-4"
        >
          {item.content}
        </div>
      ))}
    </div>
  );
}
