import assert from "node:assert/strict";
import { test } from "node:test";

import { addDays, formatCountdown, msUntilNextUtcMidnight, startOfUtcWeek, utcDateKey } from "./time.ts";

test("utcDateKey uses the UTC calendar day", () => {
  assert.equal(utcDateKey(Date.parse("2026-11-17T23:59:59Z")), "2026-11-17");
  assert.equal(utcDateKey(Date.parse("2026-11-18T00:00:00Z")), "2026-11-18");
});

test("addDays crosses month and year boundaries", () => {
  assert.equal(addDays("2026-11-30", 1), "2026-12-01");
  assert.equal(addDays("2027-01-01", -1), "2026-12-31");
});

test("countdown reaches the next 00:00 UTC", () => {
  assert.equal(msUntilNextUtcMidnight(Date.parse("2026-11-17T23:00:00Z")), 3_600_000);
  assert.equal(formatCountdown(3_600_000 + 61_000), "01:01:01");
  assert.equal(formatCountdown(-5), "00:00:00");
});

test("weekly top resets on Monday 00:00 UTC", () => {
  // 2026-11-17 is a Tuesday; 2026-11-16 is the Monday.
  assert.equal(startOfUtcWeek(Date.parse("2026-11-17T10:00:00Z")).toISOString(), "2026-11-16T00:00:00.000Z");
  assert.equal(startOfUtcWeek(Date.parse("2026-11-22T23:59:00Z")).toISOString(), "2026-11-16T00:00:00.000Z");
  assert.equal(startOfUtcWeek(Date.parse("2026-11-23T00:00:00Z")).toISOString(), "2026-11-23T00:00:00.000Z");
});
