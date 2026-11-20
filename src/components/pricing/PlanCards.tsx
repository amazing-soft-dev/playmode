"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { useProfile } from "@/components/auth/useProfile";
import { BracketLabel, Button, Card } from "@/components/ui";
import { pricing } from "@/content/pricing";
import { browserRepos } from "@/lib/repos";
import type { PlanOffer } from "@/lib/repos/types";
import { cn } from "@/lib/cn";

/**
 * Free and Plus plan cards. Plus checkout is adults only: teens see "Ask a parent", signed-out
 * visitors are sent to sign in first. Checkout goes through the billing provider (Stripe Checkout
 * in production, a simulated URL in the mock).
 */
export function PlanCards({ offers }: { offers: PlanOffer[] }) {
  const { profile } = useProfile();
  const router = useRouter();
  const [note, setNote] = useState<string | null>(null);

  const checkout = async () => {
    if (!profile) return router.push("/login?next=/pricing");
    const url = await browserRepos().billing.checkoutUrl("plus");
    setNote(pricing.mockCheckout);
    router.push(url);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-5 md:grid-cols-2">
        {offers.map((offer) => {
          const isPlus = offer.plan === "plus";
          const current = profile?.plan === offer.plan;
          return (
            <Card key={offer.plan} className={cn("flex flex-col gap-8 p-8", isPlus && "border-accent")}>
              <div className="flex items-center justify-between gap-4">
                <BracketLabel accent={isPlus}>{offer.name}</BracketLabel>
                {current && <span className="type-label text-accent">{pricing.current}</span>}
              </div>
              <p className="flex items-end gap-2">
                <span className="type-stat font-semibold">${offer.priceMonthlyUsd}</span>
                <span className="pb-1 type-small text-ash">{pricing.perMonth}</span>
              </p>
              <ul className="flex flex-1 flex-col gap-3 type-body text-fog">
                {offer.features.map((f) => (
                  <li key={f} className="flex gap-3">
                    <span aria-hidden className={isPlus ? "text-accent" : "text-ash"}>
                      +
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
              {!isPlus ? (
                <Button href="/create" variant="secondary">
                  {pricing.freeCta}
                </Button>
              ) : profile?.ageBand === "13to17" ? (
                <div className="flex flex-col gap-2 border-l-2 border-accent pl-4">
                  <p className="type-h5">{pricing.teenTitle}</p>
                  <p className="type-small text-fog">{pricing.teenText}</p>
                </div>
              ) : (
                <Button onClick={checkout} variant="solid" disabled={current}>
                  {pricing.plusCta}
                </Button>
              )}
              {isPlus && <p className="type-small text-ash">{pricing.adultsOnly}</p>}
            </Card>
          );
        })}
      </div>
      <p className="type-small text-ash">{pricing.priceNote}</p>
      {note && (
        <p role="status" className="type-small text-fog">
          {note}
        </p>
      )}
    </div>
  );
}
