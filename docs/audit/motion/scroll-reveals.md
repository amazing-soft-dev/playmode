# Scroll Reveals (appear effect)

The dominant motion. 159 instances across the site. Status **C** (config read from the page modules; values sampled live).

## Technique

Framer "appear effect" = framer-motion inline-style animation triggered by IntersectionObserver. JS-driven (not WAAPI, not CSS keyframes) → `document.getAnimations()` is empty; values live in inline `style`.

## Spec

| Field               | Value                                                                                                                                                                                                   |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Trigger             | element enters viewport; `threshold: 0` (any pixel visible), no rootMargin                                                                                                                              |
| Initial             | `opacity: 0; transform: translateY(20px)` (SSR'd inline, so no flash)                                                                                                                                   |
| Final               | `opacity: 1; transform: none`                                                                                                                                                                           |
| Variant "fade only" | Video Wrapper (stats video frame): opacity 0→1, y 0                                                                                                                                                     |
| Easing              | `cubic-bezier(0.44, 0, 0.56, 1)` (tween)                                                                                                                                                                |
| Durations           | **600ms** (headings, eyebrow/decor, Video Wrapper, section tops), **700ms** (title wrappers, cards, logos, text blocks), **800ms** (hero bottom row, About text column), **900ms** (About media column) |
| Delay               | 0, except lists: `delay = index × 100ms` (tournament cards, blog cards, team cards, stat items)                                                                                                         |
| Repeat              | **once** (`animateOnce: true`) — scrolling back up does not replay                                                                                                                                      |
| On load             | Elements already in view animate immediately after hydration (hero)                                                                                                                                     |

## Sampled (About Us section, scroll 0→260 at 1440×900)

| t (ms)                                                                                                                                                                                     | Decorative (600ms) opacity / y | Title Wrapper (700ms) opacity / y |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------ | --------------------------------- |
| 0                                                                                                                                                                                          | 0.000 / 20.0                   | 0.000 / 20.0                      |
| 91                                                                                                                                                                                         | 0.023 / 19.5                   | 0.017 / 19.7                      |
| 191                                                                                                                                                                                        | 0.156 / 16.9                   | 0.113 / 17.7                      |
| 316                                                                                                                                                                                        | 0.482 / 10.4                   | 0.362 / 12.8                      |
| 401                                                                                                                                                                                        | 0.718 / 5.6                    | 0.568 / 8.6                       |
| 506                                                                                                                                                                                        | 0.907 / 1.9                    | 0.781 / 4.4                       |
| Elements whose top was still below the fold (Media/Text column at y≥1288) stayed at 0/20 → threshold-0 trigger confirmed. Frames: `.research/audit/frames/scroll-reveal-about+header-bg/`. |

## Motion (React) recipe

```tsx
const reveal = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };
<motion.div
  variants={reveal}
  initial="hidden"
  whileInView="show"
  viewport={{ once: true, amount: 0 }}
  transition={{ duration: 0.7, ease: [0.44, 0, 0.56, 1], delay: i * 0.1 }}
/>;
```

- Respect `prefers-reduced-motion`: render final state.
- SSR the hidden state only when JS is available (avoid invisible content without JS) — the template ships `opacity:0` in HTML.
