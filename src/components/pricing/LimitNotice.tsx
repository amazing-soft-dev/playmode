"use client";

import { useSearchParams } from "next/navigation";

import { pricing } from "@/content/pricing";

/** Shown when the maker sends someone here after they used today's builds (?reason=limit). */
export function LimitNotice() {
  const params = useSearchParams();
  if (params.get("reason") !== "limit") return null;
  return (
    <p role="status" className="border border-accent bg-accent-soft p-5 type-body text-paper">
      {pricing.limitReached}
    </p>
  );
}
