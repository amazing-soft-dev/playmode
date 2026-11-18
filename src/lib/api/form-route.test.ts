import assert from "node:assert/strict";
import { test } from "node:test";

import { z } from "zod";

import { fields, formRoute } from "./form-route.ts";
import { createRateLimiter } from "./rate-limit.ts";

const sent: unknown[] = [];
const POST = formRoute({
  schema: z.object({ name: fields.name, email: fields.email, message: fields.message }),
  limiter: createRateLimiter({ limit: 3, windowMs: 60_000 }),
  handle: async (data) => void sent.push(data),
});

const req = (body: unknown, ip = "1.1.1.1", type = "application/json") =>
  new Request("http://x/api/contact", {
    method: "POST",
    headers: { "content-type": type, "x-forwarded-for": ip },
    body: JSON.stringify(body),
  });

const ok = { name: "Ana", email: "ana@example.com", message: "Hello there, team!" };

test("valid submissions are handled", async () => {
  const res = await POST(req(ok, "2.2.2.2"));
  assert.equal(res.status, 200);
  assert.equal(sent.length, 1);
});

test("invalid fields return the first friendly message", async () => {
  const res = await POST(req({ ...ok, email: "nope" }, "3.3.3.3"));
  assert.equal(res.status, 400);
  assert.match((await res.json()).error, /valid email/);
});

test("honeypot submissions get a fake success and are dropped", async () => {
  const before = sent.length;
  const res = await POST(req({ ...ok, company_website: "spam.example" }, "4.4.4.4"));
  assert.equal(res.status, 200);
  assert.equal(sent.length, before);
});

test("non-JSON and rate-limited requests are refused", async () => {
  assert.equal((await POST(req(ok, "5.5.5.5", "text/plain"))).status, 415);
  for (let i = 0; i < 3; i += 1) await POST(req(ok, "6.6.6.6"));
  const limited = await POST(req(ok, "6.6.6.6"));
  assert.equal(limited.status, 429);
  assert.ok(Number(limited.headers.get("retry-after")) > 0);
});
