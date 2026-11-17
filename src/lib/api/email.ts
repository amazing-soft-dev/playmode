import { Resend } from "resend";

import { serverEnv } from "./env.ts";

export interface OutgoingEmail {
  subject: string;
  /** Plain-text body; form messages are never rendered as HTML. */
  text: string;
  replyTo?: string;
}

/** Sends a form email with Resend, or logs it when no API key is configured (development). */
export async function sendEmail(email: OutgoingEmail): Promise<{ id: string | null; logged: boolean }> {
  const env = serverEnv();
  if (!env.RESEND_API_KEY) {
    console.warn(`[email:dev] To ${env.CONTACT_TO}: ${email.subject}\n${email.text}`);
    return { id: null, logged: true };
  }
  const resend = new Resend(env.RESEND_API_KEY);
  const { data, error } = await resend.emails.send({
    from: env.CONTACT_FROM,
    to: env.CONTACT_TO,
    subject: email.subject,
    text: email.text,
    ...(email.replyTo ? { replyTo: email.replyTo } : {}),
  });
  if (error) throw new Error(`Resend error: ${error.message}`);
  return { id: data?.id ?? null, logged: false };
}
