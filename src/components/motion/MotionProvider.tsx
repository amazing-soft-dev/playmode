"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";

import { EASE_TEMPLATE } from "./Reveal";

/**
 * Site-wide motion defaults: the template's easing and 400ms, and reduced motion honoured
 * from the operating system setting (transforms are skipped, opacity still fades).
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user" transition={{ duration: 0.4, ease: EASE_TEMPLATE }}>
      {children}
    </MotionConfig>
  );
}
