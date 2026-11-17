import assert from "node:assert/strict";
import { test } from "node:test";

import { moderatePrompt } from "./moderation.ts";

test("franchise names are swapped for original stand-ins", () => {
  const result = moderatePrompt("A Mario game where Pikachu collects coins");
  assert.equal(result.ok, true);
  if (!result.ok) return;
  assert.match(result.prompt, /jumping plumber-style hero/);
  assert.match(result.prompt, /pocket creature/);
  assert.doesNotMatch(result.prompt, /mario|pikachu/i);
  assert.equal(result.replacements.length, 2);
});

test("clean prompts pass unchanged apart from whitespace", () => {
  const result = moderatePrompt("  a fox   running on rooftops ");
  assert.deepEqual(result, { ok: true, prompt: "a fox running on rooftops", replacements: [] });
});

test("blocked, empty and overlong prompts are refused without a build", () => {
  assert.equal(moderatePrompt("a game with gore").ok, false);
  assert.equal(moderatePrompt("   ").ok, false);
  const long = moderatePrompt("x".repeat(501));
  assert.equal(long.ok === false && long.reason, "too-long");
  // Words that merely contain a blocked term are fine.
  assert.equal(moderatePrompt("a sussex countryside farming game").ok, true);
});
