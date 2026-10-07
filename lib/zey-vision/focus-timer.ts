"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useEyeBreakReminder } from "./ambient";

export type FocusPhase = "work" | "break";

export interface FocusTimerOptions {
  workMinutes?: number;
  breakMinutes?: number;
  /** Fold in 20-20-20 eye-break reminders during work phases. Default: true. */
  eyeBreaksDuringWork?: boolean;
}

export interface FocusTimerState {
  phase: FocusPhase;
  running: boolean;
  secondsLeft: number;
  eyeBreakDue: boolean;
  start: () => void;
  pause: () => void;
  skip: () => void;
  dismissEyeBreak: () => void;
}

export function useFocusTimer(options: FocusTimerOptions = {}): FocusTimerState {
  const { workMinutes = 25, breakMinutes = 5, eyeBreaksDuringWork = true } = options;

  const [phase, setPhase] = useState<FocusPhase>("work");
  const [running, setRunning] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(workMinutes * 60);
  const intervalRef = useRef<number | null>(null);
  // Tracks the current phase without the interval's closure going stale —
  // the interval effect only re-runs when `running` changes, so reading
  // `phase` directly inside it would keep returning the value from when
  // the interval started, not the value after a phase flip.
  const phaseRef = useRef<FocusPhase>(phase);

  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  const eyeBreak = useEyeBreakReminder(running && phase === "work" && eyeBreaksDuringWork);

  useEffect(() => {
    if (!running) return;

    intervalRef.current = window.setInterval(() => {
      setSecondsLeft((current) => {
        if (current > 1) return current - 1;

        const finishedPhase = phaseRef.current;
        const nextPhase: FocusPhase = finishedPhase === "work" ? "break" : "work";
        phaseRef.current = nextPhase;
        setPhase(nextPhase);
        return (nextPhase === "work" ? workMinutes : breakMinutes) * 60;
      });
    }, 1000);

    return () => {
      if (intervalRef.current !== null) window.clearInterval(intervalRef.current);
    };
  }, [running, workMinutes, breakMinutes]);

  const start = useCallback(() => setRunning(true), []);
  const pause = useCallback(() => setRunning(false), []);
  const skip = useCallback(() => {
    setPhase((currentPhase) => {
      const next: FocusPhase = currentPhase === "work" ? "break" : "work";
      phaseRef.current = next;
      setSecondsLeft((next === "work" ? workMinutes : breakMinutes) * 60);
      return next;
    });
  }, [workMinutes, breakMinutes]);

  return {
    phase,
    running,
    secondsLeft,
    eyeBreakDue: eyeBreak.dueForBreak,
    start,
    pause,
    skip,
    dismissEyeBreak: eyeBreak.dismiss,
  };
}
