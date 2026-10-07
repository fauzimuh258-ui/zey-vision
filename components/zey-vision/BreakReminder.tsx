"use client";

import { Button } from "./primitives";
import { Transition } from "./Transition";

export interface BreakReminderProps {
  show: boolean;
  onDismiss: () => void;
  title?: string;
  message?: string;
}

/** Gentle, dismissible, non-blocking nudge — deliberately NOT a Modal: it
 * doesn't trap focus or block interaction, since the brief calls for
 * "gentle (tidak mengganggu)," not an interruption. */
export function BreakReminder({
  show,
  onDismiss,
  title = "Time for an eye break",
  message = "Look at something 20 feet (6 meters) away for 20 seconds.",
}: BreakReminderProps) {
  return (
    <Transition show={show} preset="slide" durationMs={200}>
      <div
        role="status"
        className="zv-ui fixed bottom-4 right-4 z-40 max-w-xs rounded-sm border border-border bg-background p-4 shadow-md"
      >
        <p className="mb-1 text-sm font-medium text-foreground">{title}</p>
        <p className="mb-3 text-sm text-foreground-muted">{message}</p>
        <Button variant="secondary" onClick={onDismiss}>
          Got it
        </Button>
      </div>
    </Transition>
  );
}
