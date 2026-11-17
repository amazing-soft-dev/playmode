import Image from "next/image";
import Link from "next/link";

import { brand } from "@/content/site";
import { cn } from "@/lib/cn";

import logo from "../../../public/brand/playermode-logo-light.png";

/** The PlayerMode mark plus the Syne wordmark, linking home. */
export function Logo({ className, onNavigate }: { className?: string; onNavigate?: () => void }) {
  return (
    <Link
      href="/"
      onClick={onNavigate}
      className={cn("group/logo inline-flex items-center gap-2.5", className)}
      aria-label={`${brand.name} home`}
    >
      <Image src={logo} alt="" width={28} height={28} priority className="size-7" />
      <span className="font-display text-[15px] leading-none font-bold tracking-[0.02em] uppercase transition-colors duration-[400ms] ease-snap group-hover/logo:text-accent">
        {brand.wordmark}
      </span>
    </Link>
  );
}
