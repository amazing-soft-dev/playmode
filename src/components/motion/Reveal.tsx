"use client";

import { motion, type HTMLMotionProps } from "motion/react";
import type { ElementType, ReactNode } from "react";

/** The template's single easing curve (docs/audit/motion/scroll-reveals.md). */
export const EASE_TEMPLATE = [0.44, 0, 0.56, 1] as const;

/** Reveal durations used by the template, in seconds. */
export type RevealDuration = 0.6 | 0.7 | 0.8 | 0.9;

interface RevealProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children: ReactNode;
  /** Seconds. The template uses 0.6–0.9 depending on the block. */
  duration?: RevealDuration;
  /** Position in a list: each step delays the reveal by 100ms. */
  index?: number;
  /** Extra delay in seconds. */
  delay?: number;
  /** Fade only, without the 20px rise (used on large video frames). */
  fadeOnly?: boolean;
  as?: "div" | "li" | "section" | "article" | "span";
}

/**
 * Scroll reveal from the template: opacity 0→1 and a 20px rise, played once as soon as any
 * part of the element enters the viewport. Motion's MotionConfig (reducedMotion="user") turns
 * it into an instant fade for people who prefer reduced motion.
 */
export function Reveal({ children, duration = 0.6, index = 0, delay = 0, fadeOnly = false, as = "div", ...rest }: RevealProps) {
  const Tag = motion[as] as ElementType;
  return (
    <Tag
      initial={{ opacity: 0, y: fadeOnly ? 0 : 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0 }}
      transition={{ duration, delay: delay + index * 0.1, ease: EASE_TEMPLATE }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
