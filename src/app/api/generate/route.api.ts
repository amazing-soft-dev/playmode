import { z } from "zod";

import { clientIp } from "@/lib/api/form-route";
import { createRateLimiter } from "@/lib/api/rate-limit";
import { serverAi } from "@/lib/api/server-repos";
import { POLICY } from "@/lib/domain/policy";
import { scanGameHtml } from "@/lib/game-scan";
import { moderatePrompt } from "@/lib/moderation";

export const runtime = "nodejs";
export const maxDuration = 90;

const bodySchema = z.object({
  template: z.enum(["runner", "puzzle", "shooter", "clicker", "maze"]),
  prompt: z.string().max(POLICY.promptMaxChars * 2),
});

// Generous per-IP backstop; the per-account daily quota is enforced with the user's session.
const limiter = createRateLimiter({ limit: 20, windowMs: 60 * 60_000 });

/**
 * POST /api/generate: moderate the prompt, generate a game, and scan the output before returning
 * it (plan section 09 guardrails). Failed scans return 422 so the client can retry without
 * charging a build.
 */
export async function POST(request: Request) {
  const limit = limiter(clientIp(request));
  if (!limit.ok) return Response.json({ error: "Too many builds from this network. Try again later." }, { status: 429, headers: { "retry-after": String(limit.retryAfter) } });

  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "Pick a template and describe your game." }, { status: 400 });

  const checked = moderatePrompt(parsed.data.prompt);
  if (!checked.ok) return Response.json({ error: checked.message, reason: checked.reason }, { status: 400 });

  const result = await serverAi.generate({ template: parsed.data.template, prompt: checked.prompt });
  const scan = scanGameHtml(result.html);
  if (!scan.ok) return Response.json({ error: "The game didn't pass the safety check. Try again; this didn't use a build.", issues: scan.issues }, { status: 422 });

  return Response.json({ html: result.html, model: result.model, tokensIn: result.tokensIn, tokensOut: result.tokensOut, replacements: checked.replacements });
}
