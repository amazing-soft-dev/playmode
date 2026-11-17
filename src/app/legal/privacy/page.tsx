import type { Metadata } from "next";

import { LegalDoc } from "@/components/legal/LegalDoc";
import { privacy } from "@/content/legal/privacy";

export const metadata: Metadata = { title: "Privacy policy", description: privacy.intro };

export default function PrivacyPage() {
  return <LegalDoc label="Legal" title="Privacy policy" {...privacy} />;
}
