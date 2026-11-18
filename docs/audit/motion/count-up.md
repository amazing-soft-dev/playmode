# Count-up (Statistic numbers)

Status **C** (component props read from module; JS rAF counter).

| Field      | Value                                                                                                                                                   |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Component  | Framer code component "Counter" inside `Statistic Item`                                                                                                 |
| Trigger    | element in view (IntersectionObserver) — fires together with the item's 700ms reveal (+ index × 100ms stagger)                                          |
| From → to  | 0 → endValue (examples: 8 with suffix "M", 190, 242)                                                                                                    |
| Duration   | **1000ms**                                                                                                                                              |
| Delay      | 0 (beyond reveal stagger)                                                                                                                               |
| Easing     | easeInOut = **cubic-bezier(0.4, 0, 0.2, 1)** (component defaults: linear [0,0,1,1], easeIn [.4,0,1,1], easeOut [0,0,.2,1], bounce [.68,-.55,.265,1.55]) |
| Formatting | integers, thousands separator ",", optional prefix/suffix                                                                                               |
| Repeat     | **Replays on every re-entry** (`resetOnReEntry: true`), no loop                                                                                         |
| Font       | Host Grotesk 54/600, −3px tracking                                                                                                                      |

## Recipe

```tsx
const ref = useRef(null);
const inView = useInView(ref, { amount: 0 });
useEffect(() => {
  if (!inView) {
    set(0);
    return;
  }
  const c = animate(0, end, { duration: 1, ease: [0.4, 0, 0.2, 1], onUpdate: (v) => set(Math.round(v)) });
  return () => c.stop();
}, [inView]);
```

Add `tabular-nums` to stop width jitter (template does not; optional).
