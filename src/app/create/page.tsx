import type { Metadata } from "next";
import { Suspense } from "react";

import { CreateMaker } from "@/components/create/CreateMaker";
import { PageHeader } from "@/components/sections/PageHeader";
import { Section } from "@/components/ui";
import { create } from "@/content/create";

export const metadata: Metadata = {
  title: "Game maker",
  description: create.lead,
};

export default function CreatePage() {
  return (
    <>
      <PageHeader label={create.label} title={create.title} lead={create.lead} />
      <Section tightTop>
        <div className="container-site">
          <Suspense>
            <CreateMaker />
          </Suspense>
        </div>
      </Section>
    </>
  );
}
