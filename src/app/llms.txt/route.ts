import { allPages, brand, seo } from "@/content/site";
import { posts } from "@/content/news";

export const dynamic = "force-static";

/** /llms.txt: a plain summary of the site for AI assistants and crawlers (llmstxt.org format). */
export function GET() {
  const base = seo.siteUrl.replace(/\/$/, "");
  const lines = [
    `# ${brand.name}`,
    "",
    `> ${brand.tagline} ${brand.shortDescription}`,
    "",
    "PlayerMode is an AI game maker for the browser. Players describe a game, an AI writes a single self-contained HTML5 file from one of five templates (runner, puzzle, shooter, clicker, maze), and the game runs in a sandboxed player. There is also a daily challenge with streaks and a top-100 leaderboard, a community gallery, and AI game recommendations drawn from a real game database.",
    "",
    "Players under 13 can play without an account and no personal data is collected from them. Games are moderated and can be reported.",
    "",
    ...allPages.flatMap((group) => [
      `## ${group.title}`,
      "",
      ...group.links.filter((l) => !["/account", "/login"].includes(l.href)).map((l) => `- [${l.label}](${base}${l.href})${l.description ? `: ${l.description}` : ""}`),
      "",
    ]),
    "## Devlog",
    "",
    ...posts.map((p) => `- [${p.title}](${base}/news/${p.slug}): ${p.excerpt}`),
    "",
  ];
  return new Response(lines.join("\n"), { headers: { "content-type": "text/plain; charset=utf-8" } });
}
