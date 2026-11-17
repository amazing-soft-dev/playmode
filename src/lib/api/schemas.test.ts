import assert from "node:assert/strict";
import { test } from "node:test";

import { contactSchema, newsletterSchema, parentsSchema, reportSchema, waitlistSchema } from "./schemas.ts";

test("contact and parents forms need a known topic", () => {
  const base = { name: "Ana", email: "ana@example.com", message: "Hello, I have a question." };
  assert.equal(contactSchema.safeParse({ ...base, topic: "bug" }).success, true);
  assert.equal(contactSchema.safeParse({ ...base, topic: "other" }).success, false);
  assert.equal(parentsSchema.safeParse({ ...base, topic: "deletion" }).success, true);
});

test("the waitlist is adults only", () => {
  assert.equal(waitlistSchema.safeParse({ email: "a@b.co" }).success, false);
  assert.equal(waitlistSchema.safeParse({ email: "a@b.co", adult: "on" }).success, true);
});

test("newsletter and report bodies are validated", () => {
  assert.equal(newsletterSchema.safeParse({ email: "nope" }).success, false);
  assert.equal(reportSchema.safeParse({ gameId: "garden-grid", reason: "broken" }).success, true);
  assert.equal(reportSchema.safeParse({ gameId: "", reason: "broken" }).success, false);
});
