# "Banner Scroll Section" → Header scroll variant

Status **C**.

## What it actually is

`Banner Scroll Section` is **not** a visible banner and not a scroll-linked text effect. It is an empty `<section>` 1px tall, `position:absolute; top: 50px`, used as a **scroll target** for the header's "variant appear" effect. The "PLAYMODE —( WITNESS THE FUTURE OF COMPETITIVE GAMING )" row is the hero's static Bottom Text Wrapper (see `components/hero-banner.md`), which only has the normal 800ms reveal.

## Behaviour

| Field                                                                                                                                             | Value                                                                                                 |
| ------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| Trigger                                                                                                                                           | page scrolls past the sentinel (≈ scrollY > 50px)                                                     |
| Effect                                                                                                                                            | Header variant Desktop/Tablet/Phone → "… BG" (`background-color: transparent → #000`)                 |
| Repeat                                                                                                                                            | `animateOnce: false` → reverts to transparent when scrolled back to top                               |
| Duration / ease                                                                                                                                   | sampled ≈ 450–500ms ease-in-out; module tweens are 0.4s cubic-bezier(.44,0,.56,1) (I: exact duration) |
| Samples                                                                                                                                           | bg alpha .01 @91ms, .21 @191ms, .74 @316ms, .957 @401ms, 1.0 @506ms                                   |
| The intermediate alphas (#00000051, #00000087, #000000a1) recorded by earlier captures were mid-transition frames, not a resting translucent nav. |

## Recipe

```tsx
const [scrolled, set] = useState(false);
useEffect(() => {
  const f = () => set(window.scrollY > 50);
  f();
  addEventListener("scroll", f, { passive: true });
  return () => removeEventListener("scroll", f);
}, []);
<header
  className={cn(
    "fixed inset-x-0 top-0 z-10 transition-colors duration-[400ms] ease-[cubic-bezier(.44,0,.56,1)]",
    scrolled ? "bg-black" : "bg-transparent",
  )}
/>;
```
