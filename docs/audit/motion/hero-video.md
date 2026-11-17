# Background videos (hero, inner banner, stats, footer)

Status **C** for attributes; visual description from screenshots.

| Instance | Element | Attributes | Treatment |
|---|---|---|---|
| Home hero | `Hero Banner Video` 100%×100vh | autoplay, muted, loop, playsinline, `object-fit: cover`, poster, duration **5s** | full strength; Decorative X-lines image above; content z2 |
| Inner banners | `Inner Banner Video` | autoplay, muted, loop, cover | dimmed by `BG Color` rgba(0,0,0,.6); glass card above |
| Stats frame (home/about) | Video Wrapper 1300×588 | muted, loop, plays when in view (autoplay false → Framer starts on viewport) — I | 1px #333 frame; stats glass strip over bottom |
| About "Video Pause" | 225×200 tile with Play/Pause button | muted loop; tap toggles | Play Button 50×50: hover bg → #fff, icon → #000 (300–350ms tweens) |
| Footer | `Footer Video` | same clip as hero, muted loop | **opacity 0.2** |

## Look
Monochrome, slow undulating black ribbons/folds (hero/footer). No colour grading, no blend modes, no canvas/WebGL, no Lottie.

## Motion details
- Loop is the file's own motion; nothing in the DOM animates. No pointer or scroll reaction.
- Framer `Video` component pauses off-screen videos to save CPU (I, standard behaviour).

## Rebuild / licensing
- Template clips come from website-files CDN / Pexels → **do not reuse**. Produce original loops (e.g. render a dark ribbon shader to MP4/WebM, 5–8s seamless, 1920×1080, <2MB) or use a Canvas/WebGL ribbon approximation.
- Provide `poster`, `preload="metadata"`, and pause for `prefers-reduced-motion`.
