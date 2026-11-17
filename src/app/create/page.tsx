import type { Metadata } from "next";
import { Suspense } from "react";

import { CreateMaker } from "@/components/create/CreateMaker";
import { PageBanner } from "@/components/sections/PageBanner";
import { Section } from "@/components/ui";
import { create } from "@/content/create";
import { photos } from "@/content/media";

export const metadata: Metadata = {
  title: "Game maker",
  description: create.lead,
};

export default function CreatePage() {
  return (
    <>
      <PageBanner photo={photos.bannerCreate} label={create.label} title={create.title} lead={create.lead} compact />
      <Section>
        <div className="container-site">
          <Suspense>
            <CreateMaker />
          </Suspense>
        </div>
      </Section>
    </>
  );
}
