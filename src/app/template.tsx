import type { ReactNode } from "react";

/**
 * Re-mounts on every navigation. The template swaps pages instantly and lets each page run its
 * own reveals; this adds only a 250ms fade so the swap doesn't flash (none for reduced motion).
 */
export default function Template({ children }: { children: ReactNode }) {
  return <div className="motion-safe:animate-[page-in_250ms_cubic-bezier(0.44,0,0.56,1)]">{children}</div>;
}
