"use client";

import { useEffect, useState } from "react";

import { formatCountdown, msUntilNextUtcMidnight } from "@/lib/domain/time";

/**
 * Live countdown to the next 00:00 UTC, when the daily challenge rolls over. Renders a stable
 * placeholder on the server and starts ticking after hydration, so markup always matches.
 */
export function Countdown({ className }: { className?: string }) {
  const [ms, setMs] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => setMs(msUntilNextUtcMidnight());
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <time className={className} suppressHydrationWarning aria-live="off" dateTime={ms === null ? undefined : `PT${Math.floor(ms / 1000)}S`}>
      {ms === null ? "--:--:--" : formatCountdown(ms)}
    </time>
  );
}
