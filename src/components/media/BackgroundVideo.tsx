"use client";

import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/cn";
import { media, posterFor } from "@/lib/media";

/**
 * Muted, looping background video over its poster frame, hidden from assistive technology.
 * - `priority` (above-the-fold heroes) fetches the poster first and the video as soon as it renders.
 * - Otherwise the video file is only attached when the block nears the viewport, so footer and
 *   section videos cost nothing until someone scrolls to them.
 * - With prefers-reduced-motion the video is never loaded; the still poster stays.
 */
export function BackgroundVideo({
  id,
  className,
  priority = false,
}: {
  id: string;
  className?: string;
  priority?: boolean;
}) {
  const video = media(id);
  const poster = posterFor(id);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const node = wrapRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setActive(true);
          observer.disconnect();
        }
      },
      // Heroes are already in view, so this fires on the first frame; others load just before they appear.
      { rootMargin: priority ? "0px" : "300px 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [priority]);

  return (
    <div ref={wrapRef} aria-hidden className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      {poster && (
        // A plain <img> keeps the poster sharp under the video while it buffers.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={poster.src}
          alt=""
          width={poster.width}
          height={poster.height}
          fetchPriority={priority ? "high" : "low"}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          className="absolute inset-0 size-full object-cover"
        />
      )}
      {active && (
        <video
          className="absolute inset-0 size-full object-cover"
          src={video.src}
          poster={poster?.src}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        />
      )}
    </div>
  );
}
