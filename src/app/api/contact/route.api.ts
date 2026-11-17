import { sendEmail } from "@/lib/api/email";
import { formRoute } from "@/lib/api/form-route";
import { createRateLimiter } from "@/lib/api/rate-limit";
import { contactSchema } from "@/lib/api/schemas";

export const runtime = "nodejs";

/** POST /api/contact: the contact page form, emailed to the team via Resend. */
export const POST = formRoute({
  schema: contactSchema,
  limiter: createRateLimiter({ limit: 5, windowMs: 10 * 60_000 }),
  handle: async ({ name, email, topic, message }) => {
    await sendEmail({
      subject: `[Contact · ${topic}] ${name}`,
      text: `From: ${name} <${email}>\nTopic: ${topic}\n\n${message}`,
      replyTo: email,
    });
  },
});
