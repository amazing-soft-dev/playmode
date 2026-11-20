import type { ReactNode } from "react";

import { BracketLabel } from "@/components/ui";

interface PageHeaderProps {
  title: ReactNode;
  label?: string;
  lead?: ReactNode;
  /** Usually a Button; sits under the lead text. */
  action?: ReactNode;
}

/**
 * Slim header for product pages (create, daily, gallery, game picks, sign-in, account): label,
 * title and lead in one band under the fixed site header, with no photo. On these pages the tool
 * is the point, so it starts on the first screen instead of under a photo banner. Content pages
 * keep the full PageBanner. Pair it with <Section tightTop> so the tool follows closely.
 *
 * The rise is pure CSS, like the home hero, so the title shows before JavaScript loads.
 */
export function PageHeader({ title, label, lead, action }: PageHeaderProps) {
  return (
    <section className="pt-[96px] pb-8 md:pt-[104px]">
      <div className="container-site flex rise-600 flex-col gap-6 motion-reduce:animate-none lg:flex-row lg:items-end lg:justify-between lg:gap-[60px]">
        <div className="flex max-w-[760px] flex-col gap-5">
          {label && <BracketLabel accent>{label}</BracketLabel>}
          <h1 className="type-h2 text-balance-safe">{title}</h1>
        </div>
        {(lead || action) && (
          <div className="flex max-w-[420px] flex-col items-start gap-6">
            {lead && <div className="type-body text-fog">{lead}</div>}
            {action}
          </div>
        )}
      </div>
    </section>
  );
}
