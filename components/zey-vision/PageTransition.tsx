"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

export interface PageTransitionProps {
  children: ReactNode;
}

/**
 * Fades page content in on route change. Enter-only: this does not hold
 * the previous page around to play an exit animation before the new one
 * mounts, since that needs deeper routing-lifecycle control than a
 * zero-dependency wrapper can reasonably provide. Reduced-motion is
 * handled by the .zv-transition-fade CSS class, not duplicated here.
 */
export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();
  const [phase, setPhase] = useState<"entering" | "entered">("entering");
  const frame = useRef<number | null>(null);

  useEffect(() => {
    setPhase("entering");
    frame.current = requestAnimationFrame(() => {
      frame.current = requestAnimationFrame(() => setPhase("entered"));
    });
    return () => {
      if (frame.current !== null) cancelAnimationFrame(frame.current);
    };
  }, [pathname]);

  return (
    <div key={pathname} data-phase={phase} className="zv-transition-fade">
      {children}
    </div>
  );
}
