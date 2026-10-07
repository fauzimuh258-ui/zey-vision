"use client";

import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { ReactNode } from "react";
import { cx, useClickOutside, useEscapeKey, useFocusTrap, useScrollLock } from "../../lib/zey-vision/ui-utils";

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  className?: string;
}

export function Modal({ open, onClose, title, children, className }: ModalProps) {
  const [mounted, setMounted] = useState(false);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const titleId = useId();

  useEffect(() => setMounted(true), []);

  useFocusTrap(dialogRef, open);
  useEscapeKey(onClose, open);
  useClickOutside(dialogRef, onClose, open);
  useScrollLock(open);

  if (!mounted || !open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Fixed (non-circadian) dark scrim — a backdrop needs to dim
          regardless of theme, unlike the page's own adaptive colors. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[var(--zv-neutral-900)] opacity-40 transition-opacity duration-200 ease-in-out"
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={cx(
          "zv-modal-in relative w-full max-w-md rounded-sm border border-border bg-background p-6 shadow-md",
          className
        )}
      >
        <h2 id={titleId} className="mb-3 text-xl font-semibold">
          {title}
        </h2>
        {children}
      </div>
    </div>,
    document.body
  );
}
