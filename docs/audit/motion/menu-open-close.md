# Menu / overlay open-close

Status **C** unless marked.

| Surface | Open | Close | Notes |
|---|---|---|---|
| Mobile menu (≤991.98) | header variant → "Phone Opened": bg transparent→#000, height 62→420px (layout anim, 400ms I); links wrapper opacity 0.001→1, **500ms, delay 200ms**, cubic-bezier(.44,0,.56,1) | reverse; links fade out with variant | body scroll locked while open |
| All-pages dropdown | opacity 0→1, **300ms**, cubic-bezier(.44,0,.56,1); no transform | opacity 1→0, 300ms | floating layer, origin top-right, offset (100, 10) |
| Search overlay | backdrop rgba(0,0,0,.95) fade **150ms**; bar spring (stiffness 600, damping 40); list height spring (800/60) | reverse | Esc / backdrop closes |
| FAQ item | height auto (layout), chevron 0→180°, title →#60aaff, answer fade (delay 200, 500ms) | reverse | multiple open allowed |

Frames: mobile menu open `.research/audit/screenshots/states/mobile-menu-open-390.jpg`; FAQ `.research/audit/frames/faq-open/`.

## Recipe
```tsx
<AnimatePresence>{open && (
  <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
    transition={{duration:.3, ease:[.44,0,.56,1]}} />)}</AnimatePresence>
```
