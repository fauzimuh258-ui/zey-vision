"use client";

import { Button } from "./primitives";
import { BreakReminder } from "./BreakReminder";
import { useFocusTimer } from "../../lib/zey-vision/focus-timer";

export interface FocusTimerWidgetProps {
  workMinutes?: number;
  breakMinutes?: number;
}

function formatTime(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export function FocusTimerWidget({ workMinutes = 25, breakMinutes = 5 }: FocusTimerWidgetProps) {
  const timer = useFocusTimer({ workMinutes, breakMinutes });

  return (
    <div className="flex flex-col items-center gap-3 rounded-sm border border-border bg-surface p-6">
      <p className="zv-ui text-sm font-medium text-foreground-muted">
        {timer.phase === "work" ? "Focus" : "Break"}
      </p>
      <p className="zv-tabular-nums text-4xl font-semibold text-foreground">
        {formatTime(timer.secondsLeft)}
      </p>
      <div className="flex gap-2">
        {timer.running ? (
          <Button variant="secondary" onClick={timer.pause}>
            Pause
          </Button>
        ) : (
          <Button variant="primary" onClick={timer.start}>
            Start
          </Button>
        )}
        <Button variant="ghost" onClick={timer.skip}>
          Skip
        </Button>
      </div>
      <BreakReminder show={timer.eyeBreakDue} onDismiss={timer.dismissEyeBreak} />
    </div>
  );
}
