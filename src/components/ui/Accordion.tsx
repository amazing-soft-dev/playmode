import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

import { PlusIcon } from "./icons";

export interface AccordionItem {
  id: string;
  question: ReactNode;
  answer: ReactNode;
}

/**
 * FAQ accordion built on <details>, so it works without JavaScript and with the keyboard.
 * Items sharing `name` open one at a time (exclusive accordion), as in the template.
 * The plus icon turns into a lime cross when open.
 */
export function Accordion({ items, name, className }: { items: AccordionItem[]; name: string; className?: string }) {
  return (
    <div className={cn("border-t border-line", className)}>
      {items.map((item) => (
        <details key={item.id} name={name} className="group/acc border-b border-line">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 transition-colors hover:text-accent [&::-webkit-details-marker]:hidden">
            <span className="type-h4 text-balance-safe">{item.question}</span>
            <PlusIcon className="size-6 shrink-0 transition-transform duration-300 ease-snap group-open/acc:rotate-45 group-open/acc:text-accent" />
          </summary>
          <div className="type-body max-w-3xl pb-8 text-fog">{item.answer}</div>
        </details>
      ))}
    </div>
  );
}
