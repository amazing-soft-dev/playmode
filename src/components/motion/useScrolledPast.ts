"use client";

import { useEffect, useState } from "react";

/**
 * True once the page has scrolled past `offset` pixels. The template's header turns from
 * transparent to black after 50px and back again when you return to the top
 * (docs/audit/motion/banner-scroll-header.md).
 */
export function useScrolledPast(offset = 50): boolean {
  const [past, setPast] = useState(false);
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      setPast(window.scrollY > offset);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [offset]);
  return past;
}
