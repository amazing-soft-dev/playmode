import { sendEmail } from "@/lib/api/email";
import { formRoute } from "@/lib/api/form-route";
import { createRateLimiter } from "@/lib/api/rate-limit";
import { waitlistSchema } from "@/lib/api/schemas";

export const runtime = "nodejs";

/** POST /api/waitlist: closed-beta sign-ups (plan section 18, phase 4), adults only. */
export const POST = formRoute({
  schema: waitlistSchema,
  limiter: createRateLimiter({ limit: 3, windowMs: 10 * 60_000 }),
  handle: async ({ email, interest }) => {
    await sendEmail({
      subject: `[Beta waitlist] ${email}`,
      text: `Email: ${email}\nWants to build: ${interest || "(not given)"}`,
      replyTo: email,
    });
  },
});
