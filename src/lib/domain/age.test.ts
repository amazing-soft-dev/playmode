import assert from "node:assert/strict";
import { test } from "node:test";

import { accountDecision, adTreatment, ageBandFor, isChildSafeAudience, minimumAge } from "./age.ts";
import { generateNickname, isGeneratedNickname } from "./nickname.ts";

const NOW = Date.parse("2026-11-17T12:00:00Z");

test("age from a birth year is the youngest possible age", () => {
  assert.equal(minimumAge(2013, NOW), 12);
  assert.equal(ageBandFor(2013, NOW), "under13");
  assert.equal(ageBandFor(2012, NOW), "13to17");
  assert.equal(ageBandFor(2007, NOW), "adult");
  assert.equal(ageBandFor(2008, NOW), "13to17");
});

test("under-13s cannot create accounts and EEA accounts need 16", () => {
  assert.deepEqual(accountDecision(2013, "US", NOW), { ok: false, reason: "under-13" });
  assert.deepEqual(accountDecision(2012, "US", NOW), { ok: true, band: "13to17" });
  assert.deepEqual(accountDecision(2012, "de", NOW), { ok: false, reason: "eea-under-16" });
  assert.deepEqual(accountDecision(2009, "DE", NOW), { ok: true, band: "13to17" });
  assert.deepEqual(accountDecision(1990, "FR", NOW), { ok: true, band: "adult" });
  assert.deepEqual(accountDecision(2030, "US", NOW), { ok: false, reason: "invalid-year" });
  assert.deepEqual(accountDecision(1850, "US", NOW), { ok: false, reason: "invalid-year" });
});

test("ad treatment and child-safe picks follow the age band", () => {
  assert.equal(adTreatment("under13"), 1);
  assert.equal(adTreatment("unknown"), 1);
  assert.equal(adTreatment("13to17"), 2);
  assert.equal(adTreatment("adult"), null);
  assert.equal(isChildSafeAudience("unknown"), true);
  assert.equal(isChildSafeAudience("adult"), false);
});

test("generated nicknames use friendly words and two digits", () => {
  let i = 0;
  const seq = [0, 0, 0.5];
  const name = generateNickname(() => seq[i++ % seq.length]!);
  // Draw order: digits, adjective, noun.
  assert.equal(name, "PixelPanda10");
  for (let n = 0; n < 50; n += 1) assert.ok(isGeneratedNickname(generateNickname()));
});
