import type { MetadataRoute } from "next";

import { allPages, seo } from "@/content/site";
import { posts } from "@/content/news";
import { GAMES } from "@/lib/fixtures/games";

export const dynamic = "force-static";

/** Pages that must not be indexed (they are also noindex in their metadata). */
const PRIVATE = new Set(["/account", "/login", "/admin"]);

export default function sitemap(): MetadataRoute.Sitemap {
  const base = seo.siteUrl.replace(/\/$/, "");
  const pages = allPages.flatMap((g) => g.links.map((l) => l.href)).filter((href) => !PRIVATE.has(href));
  return [
    ...[...new Set(pages)].map((href) => ({
      url: `${base}${href === "/" ? "" : href}`,
      changeFrequency: href === "/daily" ? ("daily" as const) : ("weekly" as const),
      priority: href === "/" ? 1 : 0.7,
    })),
    ...GAMES.map((g) => ({
      url: `${base}/play/${g.id}`,
      lastModified: g.publishedAt ?? undefined,
      changeFrequency: "weekly" as const,
      priority: 0.5,
    })),
    ...posts.map((p) => ({
      url: `${base}/news/${p.slug}`,
      lastModified: p.date,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
  ];
}
