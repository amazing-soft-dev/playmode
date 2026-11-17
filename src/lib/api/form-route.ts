import { type ZodType, z } from "zod";

import { type RateLimitResult } from "./rate-limit.ts";

const MAX_BODY_BYTES = 16 * 1024;

const json = (status: number, body: unknown, headers: Record<string, string> = {}) =>
  new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json", ...headers } });

/** The visitor's IP from proxy headers (Vercel sets x-forwarded-for), used only as a rate-limit key. */
export function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || request.headers.get("x-real-ip") || "local";
}

/** Reusable field rules with friendly messages. */
export const fields = {
  name: z.string().trim().min(1, "Please tell us your name.").max(80, "That name is too long."),
  email: z.string().trim().email("Please enter a valid email address.").max(120),
  message: z.string().trim().min(10, "Please write a little more (10 characters or more).").max(2000, "Please keep it under 2,000 characters."),
};

interface FormRouteOptions<T> {
  schema: ZodType<T>;
  limiter: (key: string) => RateLimitResult;
  handle: (data: T, request: Request) => Promise<void>;
}

/**
 * Wraps a POST route handler with the checks every form needs: JSON only, a 16 KB body cap,
 * a per-IP rate limit, a honeypot (bots that fill company_website get a fake success), schema
 * validation with the first friendly message, and a generic error if sending fails.
 */
export function formRoute<T>({ schema, limiter, handle }: FormRouteOptions<T>) {
  return async function POST(request: Request): Promise<Response> {
    if (!request.headers.get("content-type")?.includes("application/json")) {
      return json(415, { error: "Please send the form as JSON." });
    }
    const limit = limiter(clientIp(request));
    if (!limit.ok) {
      return json(429, { error: "Too many messages. Please wait a few minutes and try again." }, { "retry-after": String(limit.retryAfter) });
    }
    const raw = await request.text();
    if (raw.length > MAX_BODY_BYTES) return json(413, { error: "That message is too long." });
    let body: unknown;
    try {
      body = JSON.parse(raw);
    } catch {
      return json(400, { error: "We couldn't read that form. Please try again." });
    }
    if (typeof body === "object" && body !== null && String((body as Record<string, unknown>).company_website ?? "").trim() !== "") {
      return json(200, { ok: true });
    }
    const parsed = schema.safeParse(body);
    if (!parsed.success) return json(400, { error: parsed.error.issues[0]?.message ?? "Please check the form." });
    try {
      await handle(parsed.data, request);
      return json(200, { ok: true });
    } catch (error) {
      console.error("[form-route]", error);
      return json(502, { error: "We couldn't send that right now. Please try again in a few minutes." });
    }
  };
}
