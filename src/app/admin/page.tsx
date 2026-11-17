import type { Metadata } from "next";

import { AdminQueues } from "@/components/admin/AdminQueues";
import { Section } from "@/components/ui";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

/**
 * Founder-only queues. In the mock, sign in as founder@playermode.test to see them; production
 * checks the admin flag on the server before returning any data.
 */
export default function AdminPage() {
  return (
    <Section className="pt-[120px] md:pt-[150px]">
      <div className="container-site flex flex-col gap-10">
        <h1 className="type-page">Admin</h1>
        <AdminQueues />
      </div>
    </Section>
  );
}
