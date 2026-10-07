"use client";

import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cx } from "../../lib/zey-vision/ui-utils";

// ---------------------------------------------------------------------------
// Button
// ---------------------------------------------------------------------------

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

export interface ButtonProps extends ComponentPropsWithoutRef<"button"> {
  variant?: ButtonVariant;
}

const BUTTON_VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: "bg-accent text-background hover:opacity-90",
  secondary: "bg-surface text-foreground border border-border hover:bg-background",
  ghost: "bg-transparent text-foreground hover:bg-surface",
  danger: "bg-[var(--zv-color-danger-solid)] text-[var(--zv-color-on-danger)] hover:opacity-90",
};

export function Button({ variant = "primary", className, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className={cx(
        "zv-ui inline-flex min-h-[44px] items-center justify-center gap-2 rounded-sm px-4 py-2.5",
        "text-base font-medium transition-opacity duration-200 ease-in-out",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        BUTTON_VARIANT_CLASSES[variant],
        className
      )}
    />
  );
}

// ---------------------------------------------------------------------------
// Badge / Tag
// ---------------------------------------------------------------------------

type Tone = "neutral" | "success" | "warning" | "error" | "info";

const TONE_CLASSES: Record<Tone, string> = {
  neutral: "bg-surface text-foreground-muted border-border",
  success: "bg-success-bg text-success-fg border-success-border",
  warning: "bg-warning-bg text-warning-fg border-warning-border",
  error: "bg-error-bg text-error-fg border-error-border",
  info: "bg-surface text-foreground border-border",
};

export interface BadgeProps {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}

export function Badge({ children, tone = "neutral", className }: BadgeProps) {
  return (
    <span
      className={cx(
        "zv-ui zv-tabular-nums inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        TONE_CLASSES[tone],
        className
      )}
    >
      {children}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Avatar
// ---------------------------------------------------------------------------

type AvatarSize = "sm" | "md" | "lg";

const AVATAR_SIZE_CLASSES: Record<AvatarSize, string> = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-14 w-14 text-lg",
};

export interface AvatarProps {
  src?: string;
  alt?: string;
  name?: string;
  size?: AvatarSize;
  className?: string;
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1]?.[0] ?? "" : "";
  return (first + last).toUpperCase();
}

/** NOTE: pass an explicit `alt` when `src` is a meaningful image — it
 * falls back to `name` (or empty, i.e. decorative) if omitted. */
export function Avatar({ src, alt, name, size = "md", className }: AvatarProps) {
  const sizeClasses = AVATAR_SIZE_CLASSES[size];

  if (src) {
    return (
      <img
        src={src}
        alt={alt ?? name ?? ""}
        className={cx(
          "inline-block rounded-full border border-border object-cover",
          sizeClasses,
          className
        )}
      />
    );
  }

  return (
    <span
      role="img"
      aria-label={name ?? "avatar"}
      className={cx(
        "zv-ui zv-tabular-nums inline-flex items-center justify-center rounded-full border border-border bg-surface font-medium text-foreground-muted",
        sizeClasses,
        className
      )}
    >
      {name ? getInitials(name) : "?"}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Card
// ---------------------------------------------------------------------------

type CardVariant = "surface" | "border" | "elevated";

const CARD_VARIANT_CLASSES: Record<CardVariant, string> = {
  surface: "bg-surface",
  border: "bg-background border border-border",
  elevated: "bg-surface shadow-md",
};

export interface CardProps {
  variant?: CardVariant;
  children: ReactNode;
  className?: string;
}

export function Card({ variant = "surface", children, className }: CardProps) {
  return (
    <div className={cx("rounded-sm p-5", CARD_VARIANT_CLASSES[variant], className)}>
      {children}
    </div>
  );
}
