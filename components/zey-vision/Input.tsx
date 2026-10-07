"use client";

import { useId } from "react";
import type { ComponentPropsWithoutRef } from "react";
import { cx } from "../../lib/zey-vision/ui-utils";

const INPUT_BASE_CLASSES =
  "w-full rounded-sm border border-border bg-background px-3.5 py-2.5 text-base text-foreground placeholder:text-foreground-muted " +
  "transition-[border-color,box-shadow] duration-200 ease-in-out " +
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent " +
  "disabled:opacity-50 disabled:cursor-not-allowed";

// ---------------------------------------------------------------------------
// TextInput
// ---------------------------------------------------------------------------

export interface TextInputProps extends ComponentPropsWithoutRef<"input"> {
  label: string;
  hint?: string;
}

export function TextInput({ label, hint, id, className, ...props }: TextInputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const hintId = hint ? `${inputId}-hint` : undefined;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={inputId} className="zv-ui text-sm font-medium text-foreground">
        {label}
      </label>
      <input
        {...props}
        id={inputId}
        aria-describedby={hintId}
        className={cx(INPUT_BASE_CLASSES, className)}
      />
      {hint ? (
        <span id={hintId} className="zv-caption">
          {hint}
        </span>
      ) : null}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Textarea
// ---------------------------------------------------------------------------

export interface TextareaProps extends ComponentPropsWithoutRef<"textarea"> {
  label: string;
  hint?: string;
}

export function Textarea({ label, hint, id, className, rows = 4, ...props }: TextareaProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const hintId = hint ? `${inputId}-hint` : undefined;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={inputId} className="zv-ui text-sm font-medium text-foreground">
        {label}
      </label>
      <textarea
        {...props}
        id={inputId}
        rows={rows}
        aria-describedby={hintId}
        className={cx(INPUT_BASE_CLASSES, "resize-y", className)}
      />
      {hint ? (
        <span id={hintId} className="zv-caption">
          {hint}
        </span>
      ) : null}
    </div>
  );
}

// ---------------------------------------------------------------------------
// SearchInput
// ---------------------------------------------------------------------------

export interface SearchInputProps extends Omit<ComponentPropsWithoutRef<"input">, "type"> {
  label: string;
  onClear?: () => void;
}

export function SearchInput({
  label,
  onClear,
  id,
  className,
  value,
  ...props
}: SearchInputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const showClear = Boolean(onClear && value);

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={inputId} className="sr-only">
        {label}
      </label>
      <div className="relative">
        <svg
          aria-hidden="true"
          viewBox="0 0 20 20"
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground-muted"
        >
          <circle cx="8.5" cy="8.5" r="6" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <line
            x1="13"
            y1="13"
            x2="17.5"
            y2="17.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
        <input
          {...props}
          id={inputId}
          type="search"
          value={value}
          placeholder={label}
          className={cx(INPUT_BASE_CLASSES, "pl-9", showClear ? "pr-9" : "", className)}
        />
        {showClear ? (
          <button
            type="button"
            onClick={onClear}
            aria-label="Clear search"
            className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-sm p-1 text-foreground-muted transition-colors duration-200 ease-in-out hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
          >
            <svg aria-hidden="true" viewBox="0 0 20 20" className="h-3.5 w-3.5">
              <line
                x1="4"
                y1="4"
                x2="16"
                y2="16"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <line
                x1="16"
                y1="4"
                x2="4"
                y2="16"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        ) : null}
      </div>
    </div>
  );
}
