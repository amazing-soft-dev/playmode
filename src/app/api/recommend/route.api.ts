import { z } from "zod";

import { clientIp } from "@/lib/api/form-route";
import { createRateLimiter } from "@/lib/api/rate-limit";
import { serverAi, serverCatalog } from "@/lib/api/server-repos";
import { POLICY } from "@/lib/domain/policy";
import { applyAudience } from "@/lib/recommend";

export const runtime = "nodejs";

const bodySchema = z.object({
  text: z.string().max(300).default(""),
  price: z.enum(["any", "free", "paid"]).default("any"),
  platforms: z
    .array(z.enum(["pc", "mobile", "browser", "console"]))
    .max(4)
    .default([]),
  genres: z.array(z.string().max(30)).max(10).default([]),
});

// Plan section 15: 20 recommendation requests an hour per IP for logged-out visitors.
const limiter = createRateLimiter({ limit: POLICY.recommendPerHourAnonymous, windowMs: 60 * 60_000 });

/**
 * POST /api/recommend: parse → query → explain. The server cannot verify a visitor's age, so it
 * always applies the child-safe ceiling (E10+); signed-in age bands are applied once real
 * sessions exist. Every returned game is a catalog record.
 */
export async function POST(request: Request) {
  const limit = limiter(clientIp(request));
  if (!limit.ok)
    return Response.json(
      { error: "Too many requests. Try again in a little while." },
      { status: 429, headers: { "retry-after": String(limit.retryAfter) } },
    );

  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "We couldn't read that request." }, { status: 400 });
  const { text, price, platforms, genres } = parsed.data;

  const filters = applyAudience(await serverAi.parseRequest(text, { price, platforms, genres }), "unknown");
  let games = await serverCatalog.search(filters, 10);
  let fallback = false;
  if (games.length === 0 && genres.length === 0 && !text) {
    games = await serverCatalog.fallback();
    fallback = true;
  }
  const lines = await serverAi.explain(text, games);
  return Response.json({ filters, fallback, picks: games.map((game) => ({ game, reason: lines.get(game.id) ?? "" })) });
}
