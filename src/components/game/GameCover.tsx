import type { TemplateId } from "@/lib/domain/types";
import { cn } from "@/lib/cn";

/** Stable 32-bit hash of a string (FNV-1a), so a game always gets the same cover. */
function hash(text: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i += 1) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

function rng(seed: number) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), a | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4_294_967_296;
  };
}

/**
 * Generated cover art for community games. Gallery games have no screenshots in the mock, and
 * reusing stock photos would break the one-photo-one-use rule, so each game gets a deterministic
 * monochrome motif for its template (runner skyline, puzzle grid, shooter stars, clicker rings,
 * maze walls) with a single lime element.
 */
export function GameCover({ id, template, title, className }: { id: string; template: TemplateId; title: string; className?: string }) {
  const r = rng(hash(id));
  const shapes: React.ReactNode[] = [];

  if (template === "runner") {
    let x = 0;
    while (x < 320) {
      const w = 18 + r() * 40;
      const h = 30 + r() * 110;
      shapes.push(<rect key={`b${x}`} x={x} y={200 - h} width={w - 2} height={h} fill="#1c1c1c" stroke="#333" />);
      x += w;
    }
    shapes.push(<rect key="p" x={70 + r() * 120} y={60 + r() * 40} width="14" height="14" fill="#C6FF3D" />);
  } else if (template === "puzzle") {
    for (let row = 0; row < 5; row += 1)
      for (let col = 0; col < 8; col += 1) {
        const lit = r() > 0.93;
        shapes.push(
          <rect key={`${row}-${col}`} x={12 + col * 38} y={12 + row * 36} width="32" height="30" fill={lit ? "#C6FF3D" : r() > 0.5 ? "#222" : "#151515"} stroke="#333" />,
        );
      }
  } else if (template === "shooter") {
    for (let i = 0; i < 60; i += 1) shapes.push(<circle key={i} cx={r() * 320} cy={r() * 200} r={r() * 1.4 + 0.3} fill="#fff" opacity={0.3 + r() * 0.6} />);
    shapes.push(<path key="ship" d={`M${150 + r() * 20} 170 l12 -26 l12 26 z`} fill="#C6FF3D" />);
  } else if (template === "clicker") {
    const cx = 120 + r() * 80;
    for (let i = 6; i > 0; i -= 1) shapes.push(<circle key={i} cx={cx} cy="100" r={i * 16} fill="none" stroke={i === 2 ? "#C6FF3D" : "#333"} strokeWidth={i === 2 ? 2 : 1} />);
  } else {
    for (let row = 0; row < 7; row += 1)
      for (let col = 0; col < 12; col += 1) {
        const x = 10 + col * 25;
        const y = 10 + row * 26;
        shapes.push(r() > 0.5 ? <line key={`${row}-${col}`} x1={x} y1={y} x2={x + 25} y2={y} stroke="#444" /> : <line key={`${row}-${col}`} x1={x} y1={y} x2={x} y2={y + 26} stroke="#444" />);
      }
    shapes.push(<circle key="orb" cx={30 + r() * 260} cy={30 + r() * 140} r="6" fill="#C6FF3D" />);
  }

  return (
    <svg viewBox="0 0 320 200" role="img" aria-label={`Cover art for ${title}`} className={cn("size-full bg-ink", className)} preserveAspectRatio="xMidYMid slice">
      {shapes}
    </svg>
  );
}
