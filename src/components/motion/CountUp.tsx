"use client";

import { animate, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";

interface CountUpProps {
  to: number;
  /** Seconds; the template counts for 1s. */
  duration?: number;
  prefix?: string;
  suffix?: string;
  /** Digits after the decimal point. */
  decimals?: number;
  className?: string;
}

const format = (value: number, decimals: number) =>
  value.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });

/**
 * Counts from 0 to `to` whenever the number scrolls into view, replaying on every re-entry as
 * the template does. The final value is rendered on the server, so the page reads correctly
 * without JavaScript, and screen readers get the final value only.
 */
export function CountUp({ to, duration = 1, prefix = "", suffix = "", decimals = 0, className }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { amount: 0.5 });
  const reduce = useReducedMotion();
  const finalText = `${prefix}${format(to, decimals)}${suffix}`;

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (!inView || reduce) {
      node.textContent = finalText;
      return;
    }
    const controls = animate(0, to, {
      duration,
      ease: [0.4, 0, 0.2, 1],
      onUpdate: (v) => {
        node.textContent = `${prefix}${format(v, decimals)}${suffix}`;
      },
    });
    return () => controls.stop();
  }, [inView, reduce, to, duration, prefix, suffix, decimals, finalText]);

  return (
    <span className={className}>
      <span ref={ref} aria-hidden>
        {finalText}
      </span>
      <span className="sr-only">{finalText}</span>
    </span>
  );
}
