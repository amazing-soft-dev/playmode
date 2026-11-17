import { z } from "zod";

/**
 * Server environment for the form routes. Everything is optional in development: without a
 * Resend key, messages are logged instead of sent, so forms work on a fresh checkout.
 */
const schema = z.object({
  RESEND_API_KEY: z.string().min(1).optional(),
  CONTACT_TO: z.string().email().default("team@playermode.test"),
  CONTACT_FROM: z.string().min(3).default("PlayerMode <noreply@playermode.test>"),
});

export type ServerEnv = z.infer<typeof schema>;

export function serverEnv(source: Record<string, string | undefined> = process.env): ServerEnv {
  const parsed = schema.safeParse(source);
  if (!parsed.success) throw new Error(`Invalid server environment: ${parsed.error.issues.map((i) => i.path.join(".")).join(", ")}`);
  return parsed.data;
}
