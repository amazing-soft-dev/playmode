import type { Metadata } from "next";

import { GalleryBrowser } from "@/components/gallery/GalleryBrowser";
import { PageHeader } from "@/components/sections/PageHeader";
import { Button, Section } from "@/components/ui";
import { gallery } from "@/content/gallery";
import { disclosures } from "@/content/site";
import { serverRepos } from "@/lib/repos";

export const metadata: Metadata = {
  title: "Gallery",
  description: gallery.lead,
};

export default async function GalleryPage() {
  const [initialGames, initialTags] = await Promise.all([
    serverRepos.games.listGallery({ tab: "new", limit: 60 }),
    serverRepos.games.listTags(),
  ]);
  return (
    <>
      <PageHeader
        label={gallery.label}
        title={gallery.title}
        lead={gallery.lead}
        action={<Button href="/create">Make a game</Button>}
      />
      <Section tightTop>
        <div className="container-site flex flex-col gap-10">
          <GalleryBrowser initialGames={initialGames} initialTags={initialTags} />
          <p className="max-w-3xl type-small text-ash">{disclosures.aiGames}</p>
        </div>
      </Section>
    </>
  );
}
