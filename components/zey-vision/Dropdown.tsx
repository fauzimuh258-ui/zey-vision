"use client";

import { useId, useRef, useState } from "react";
import type { KeyboardEvent, ReactNode } from "react";
import { cx, useClickOutside, useEscapeKey } from "../../lib/zey-vision/ui-utils";

export interface DropdownItem {
  id: string;
  label: string;
  onSelect: () => void;
  disabled?: boolean;
}

export interface DropdownProps {
  trigger: ReactNode;
  items: DropdownItem[];
  className?: string;
}

/** Menu-button pattern: ArrowDown/Enter/Space on the trigger opens and
 * moves focus to the first item; ArrowUp/ArrowDown navigate items; Escape
 * closes and returns focus to the trigger; clicking outside closes too. */
export function Dropdown({ trigger, items, className }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const menuId = useId();

  const close = (): void => {
    setOpen(false);
    triggerRef.current?.focus();
  };

  useClickOutside(containerRef, () => setOpen(false), open);
  useEscapeKey(close, open);

  const openMenu = (): void => {
    setOpen(true);
    setActiveIndex(0);
  };

  const moveActive = (delta: number): void => {
    if (items.length === 0) return;
    setActiveIndex((current) => {
      const next = (current + delta + items.length) % items.length;
      itemRefs.current[next]?.focus();
      return next;
    });
  };

  const onTriggerKeyDown = (event: KeyboardEvent): void => {
    if (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openMenu();
      requestAnimationFrame(() => itemRefs.current[0]?.focus());
    }
  };

  const onMenuKeyDown = (event: KeyboardEvent): void => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      moveActive(1);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      moveActive(-1);
    }
  };

  return (
    <div ref={containerRef} className={cx("relative inline-block", className)}>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        onClick={() => (open ? close() : openMenu())}
        onKeyDown={onTriggerKeyDown}
        className="zv-ui"
      >
        {trigger}
      </button>
      {open ? (
        <div
          id={menuId}
          role="menu"
          onKeyDown={onMenuKeyDown}
          className="zv-pop-in absolute left-0 z-50 mt-2 min-w-[10rem] rounded-sm border border-border bg-background py-1.5 shadow-md"
        >
          {items.map((item, index) => (
            <button
              key={item.id}
              ref={(el: HTMLButtonElement | null) => {
                itemRefs.current[index] = el;
              }}
              type="button"
              role="menuitem"
              disabled={item.disabled}
              tabIndex={-1}
              onClick={() => {
                item.onSelect();
                close();
              }}
              className={cx(
                "zv-ui block w-full px-3.5 py-2 text-left text-sm text-foreground transition-colors duration-200 ease-in-out",
                "hover:bg-surface focus-visible:bg-surface focus-visible:outline-none",
                "disabled:opacity-50 disabled:cursor-not-allowed"
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
