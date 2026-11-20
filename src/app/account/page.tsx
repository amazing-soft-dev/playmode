import type { Metadata } from "next";

import { AccountDashboard } from "@/components/account/AccountDashboard";
import { PageHeader } from "@/components/sections/PageHeader";
import { Section } from "@/components/ui";

export const metadata: Metadata = {
  title: "Account",
  robots: { index: false },
};

export default function AccountPage() {
  return (
    <>
      <PageHeader label="Account" title="Your games, builds and streak" />
      <Section tightTop>
        <div className="container-site">
          <AccountDashboard />
        </div>
      </Section>
    </>
  );
}
