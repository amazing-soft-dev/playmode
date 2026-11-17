import { sendEmail } from "@/lib/api/email";
import { formRoute } from "@/lib/api/form-route";
import { createRateLimiter } from "@/lib/api/rate-limit";
import { reportSchema } from "@/lib/api/schemas";

export const runtime = "nodejs";

/**
 * POST /api/report: a game report (plan sections 05 and 11). The team is alerted so the 48-hour
 * review target holds; hiding at three reports happens in the data layer (Supabase in production).
 * Reports carry no personal data, so anonymous players and under-13s can report too.
 */
export const POST = formRoute({
  schema: reportSchema,
  limiter: createRateLimiter({ limit: 10, windowMs: 60 * 60_000 }),
  handle: async ({ gameId, reason, details }) => {
    await sendEmail({
      subject: `[Report · ${reason}] ${gameId}`,
      text: `Game: ${gameId}\nReason: ${reason}\nDetails: ${details || "(none)"}\n\nReview within 48 hours in /admin.`,
    });
  },
});
