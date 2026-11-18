import type { Metadata } from "next";

import { GalleryBrowser } from "@/components/gallery/GalleryBrowser";
import { PageBanner } from "@/components/sections/PageBanner";
import { Button, Section } from "@/components/ui";
import { gallery } from "@/content/gallery";
import { photos } from "@/content/media";
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
      <PageBanner
        photo={photos.bannerGallery}
        label={gallery.label}
        title={gallery.title}
        lead={gallery.lead}
        action={<Button href="/create">Make a game</Button>}
        compact
      />
      <Section>
        <div className="container-site flex flex-col gap-10">
          <GalleryBrowser initialGames={initialGames} initialTags={initialTags} />
          <p className="max-w-3xl type-small text-ash">{disclosures.aiGames}</p>
        </div>
      </Section>
    </>
  );
}
