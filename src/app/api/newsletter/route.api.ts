import { sendEmail } from "@/lib/api/email";
import { formRoute } from "@/lib/api/form-route";
import { createRateLimiter } from "@/lib/api/rate-limit";
import { newsletterSchema } from "@/lib/api/schemas";

export const runtime = "nodejs";

/**
 * POST /api/newsletter: devlog updates by email. In V1 the team receives the sign-up and adds it
 * to the mailing list by hand; a Resend audience replaces this once volume grows.
 */
export const POST = formRoute({
  schema: newsletterSchema,
  limiter: createRateLimiter({ limit: 3, windowMs: 10 * 60_000 }),
  handle: async ({ email }) => {
    await sendEmail({ subject: `[Newsletter] ${email}`, text: `Add to the devlog list: ${email}`, replyTo: email });
  },
});
