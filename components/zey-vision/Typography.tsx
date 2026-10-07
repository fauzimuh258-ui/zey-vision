"use client";

import type { ElementType, ReactNode } from "react";

// ---------------------------------------------------------------------------
// Prose
// ---------------------------------------------------------------------------

export interface ProseProps {
  children: ReactNode;
  className?: string;
}

export function Prose({ children, className }: ProseProps) {
  const classes = ["zv-prose", className].filter(Boolean).join(" ");
  return <div className={classes}>{children}</div>;
}

// ---------------------------------------------------------------------------
// Heading
// ---------------------------------------------------------------------------

type HeadingLevel = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

export interface HeadingProps {
  as: HeadingLevel;
  children: ReactNode;
  className?: string;
  id?: string;
}

export function Heading({ as: Tag, children, className, id }: HeadingProps) {
  return (
    <Tag className={className} id={id}>
      {children}
    </Tag>
  );
}

// ---------------------------------------------------------------------------
// Text
// ---------------------------------------------------------------------------

type TextVariant = "body" | "lead" | "small" | "ui";

export interface TextProps {
  variant?: TextVariant;
  as?: ElementType;
  children: ReactNode;
  className?: string;
}

const TEXT_VARIANT_CLASSES: Record<TextVariant, string> = {
  body: "",
  lead: "zv-text-lead",
  small: "zv-caption",
  ui: "zv-ui",
};

export function Text({ variant = "body", as: Tag = "p", children, className }: TextProps) {
  const classes = [TEXT_VARIANT_CLASSES[variant], className].filter(Boolean).join(" ");
  return <Tag className={classes || undefined}>{children}</Tag>;
}

// ---------------------------------------------------------------------------
// Em — guarded inline emphasis
// ---------------------------------------------------------------------------

const LONG_ITALIC_WORD_LIMIT = 12;

function countWords(node: unknown): number {
  if (typeof node === "string") return node.trim().split(/\s+/).filter(Boolean).length;
  if (Array.isArray(node)) {
    return node.reduce((sum: number, child: unknown) => sum + countWords(child), 0);
  }
  return 0;
}

export interface EmProps {
  children: ReactNode;
}

/** Semantic inline emphasis. No block/paragraph variant is offered on
 * purpose — italics are for a word or short phrase. In development, warns
 * (never blocks) when the wrapped text runs long, since long italic runs
 * are the specific anti-pattern the design brief calls out. */
export function Em({ children }: EmProps) {
  if (process.env.NODE_ENV !== "production") {
    const words = countWords(children);
    if (words > LONG_ITALIC_WORD_LIMIT) {
      console.warn(
        `[Zey Vision] <Em> is wrapping ${words} words. Italics are for short emphasis, not long runs — consider <Text variant="lead"> or bold instead.`
      );
    }
  }
  return <em>{children}</em>;
}

// ---------------------------------------------------------------------------
// Code — inline + block. No all-caps utility exists anywhere in this file,
// by design (see the CSS file's "Anti-patterns" note).
// ---------------------------------------------------------------------------

export interface CodeProps {
  children: ReactNode;
  block?: boolean;
  className?: string;
}

export function Code({ children, block = false, className }: CodeProps) {
  if (block) {
    return (
      <pre className={className}>
        <code>{children}</code>
      </pre>
    );
  }
  return <code className={className}>{children}</code>;
}

// ---------------------------------------------------------------------------
// TabularNum
// ---------------------------------------------------------------------------

export interface TabularNumProps {
  children: ReactNode;
  className?: string;
}

export function TabularNum({ children, className }: TabularNumProps) {
  const classes = ["zv-tabular-nums", className].filter(Boolean).join(" ");
  return <span className={classes}>{children}</span>;
}
