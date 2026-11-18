import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  viewBox: "0 0 20 20",
  "aria-hidden": true,
} as const;

export function ArrowIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M3 10h13M11 5l5 5-5 5" strokeLinecap="square" />
    </svg>
  );
}

export function PlusIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M10 3v14M3 10h14" />
    </svg>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 4l12 12M16 4L4 16" />
    </svg>
  );
}

export function SearchIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="9" cy="9" r="5.5" />
      <path d="M13 13l4 4" />
    </svg>
  );
}

export function MenuIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M3 6h14M3 10h14M3 14h14" />
    </svg>
  );
}

export function ChevronIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M5 8l5 5 5-5" />
    </svg>
  );
}

export function PlayIcon(props: IconProps) {
  return (
    <svg {...base} fill="currentColor" stroke="none" {...props}>
      <path d="M6 4l10 6-10 6z" />
    </svg>
  );
}

export function HeartIcon(props: IconProps & { filled?: boolean }) {
  const { filled, ...rest } = props;
  return (
    <svg {...base} fill={filled ? "currentColor" : "none"} {...rest}>
      <path d="M10 16.5s-6-3.6-6-8A3.5 3.5 0 0 1 10 6a3.5 3.5 0 0 1 6 2.5c0 4.4-6 8-6 8z" />
    </svg>
  );
}

export function FlagIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M5 17V3M5 4h9l-2 3.5L14 11H5" />
    </svg>
  );
}

export function DownloadIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M10 3v10M6 9l4 4 4-4M4 17h12" />
    </svg>
  );
}
