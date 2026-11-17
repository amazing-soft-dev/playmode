import type { Metadata } from "next";

import { LegalDoc } from "@/components/legal/LegalDoc";
import { dmca } from "@/content/legal/dmca";

export const metadata: Metadata = { title: "Copyright and DMCA", description: dmca.intro };

export default function DmcaPage() {
  return <LegalDoc label="Legal" title="Copyright and DMCA" {...dmca} />;
}
