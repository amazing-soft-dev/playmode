import { sendEmail } from "@/lib/api/email";
import { formRoute } from "@/lib/api/form-route";
import { createRateLimiter } from "@/lib/api/rate-limit";
import { parentsSchema } from "@/lib/api/schemas";

export const runtime = "nodejs";

/** POST /api/parents: parent and teacher questions, including data deletion requests. */
export const POST = formRoute({
  schema: parentsSchema,
  limiter: createRateLimiter({ limit: 5, windowMs: 10 * 60_000 }),
  handle: async ({ name, email, topic, message }) => {
    const urgent = topic === "deletion" || topic === "game";
    await sendEmail({
      subject: `[Parents${urgent ? " · PRIORITY" : ""} · ${topic}] ${name}`,
      text: `From: ${name} <${email}>\nTopic: ${topic}\n\n${message}`,
      replyTo: email,
    });
  },
});
