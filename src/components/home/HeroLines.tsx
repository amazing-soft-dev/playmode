/**
 * The template hero's decorative linework: thin diagonals forming a large X plus a centre
 * vertical, drawn as SVG so it scales with the section and stays crisp (1px at any size).
 */
export function HeroLines() {
  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute inset-0 size-full text-paper/15"
      preserveAspectRatio="none"
      viewBox="0 0 100 100"
    >
      <g stroke="currentColor" strokeWidth="1" vectorEffect="non-scaling-stroke" fill="none">
        <line x1="0" y1="0" x2="100" y2="100" vectorEffect="non-scaling-stroke" />
        <line x1="100" y1="0" x2="0" y2="100" vectorEffect="non-scaling-stroke" />
        <line x1="50" y1="0" x2="50" y2="100" vectorEffect="non-scaling-stroke" />
      </g>
    </svg>
  );
}
