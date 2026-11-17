import type { MetadataRoute } from "next";

import { seo } from "@/content/site";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  const base = seo.siteUrl.replace(/\/$/, "");
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/admin", "/account", "/login", "/api/"] }],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
