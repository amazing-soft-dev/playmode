import type { Metadata } from "next";

import { AccountDashboard } from "@/components/account/AccountDashboard";
import { PageBanner } from "@/components/sections/PageBanner";
import { Section } from "@/components/ui";
import { photos } from "@/content/media";

export const metadata: Metadata = {
  title: "Account",
  robots: { index: false },
};

export default function AccountPage() {
  return (
    <>
      <PageBanner photo={photos.bannerAccount} label="Account" title="Your games, builds and streak" compact />
      <Section>
        <div className="container-site">
          <AccountDashboard />
        </div>
      </Section>
    </>
  );
}
