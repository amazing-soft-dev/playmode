import type { Metadata } from "next";

import { LegalDoc } from "@/components/legal/LegalDoc";
import { terms } from "@/content/legal/terms";

export const metadata: Metadata = { title: "Terms of service", description: terms.intro };

export default function TermsPage() {
  return <LegalDoc label="Legal" title="Terms of service" {...terms} />;
}
