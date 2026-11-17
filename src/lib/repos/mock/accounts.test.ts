import assert from "node:assert/strict";
import { test } from "node:test";

import { isGeneratedNickname } from "../../domain/nickname.ts";
import { AgeGateError, createMockAuth } from "./accounts.ts";
import { memoryStore } from "./store.ts";

const now = () => Date.parse("2026-11-17T12:00:00Z");
const input = { email: "a@b.test", displayName: "Real Name", country: "US" };

test("adults keep their display name; teens get a generated nickname", async () => {
  const adult = await createMockAuth(memoryStore(), now).signIn({ ...input, birthYear: 1990 });
  assert.equal(adult.displayName, "Real Name");
  const teen = await createMockAuth(memoryStore(), now).signIn({ ...input, birthYear: 2011 });
  assert.equal(teen.ageBand, "13to17");
  assert.ok(isGeneratedNickname(teen.displayName));
});

test("the first age-gate answer is remembered", async () => {
  const store = memoryStore();
  const auth = createMockAuth(store, now);
  await assert.rejects(auth.signIn({ ...input, birthYear: 2016 }), (e) => e instanceof AgeGateError && e.reason === "under-13");
  // Retrying with an older year in the same browser is still refused.
  await assert.rejects(auth.signIn({ ...input, birthYear: 1990 }), AgeGateError);
  assert.equal(await auth.getCurrentProfile(), null);
});
