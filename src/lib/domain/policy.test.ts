import assert from "node:assert/strict";
import { test } from "node:test";

import { POLICY, dailyBuildLimit, isRatingAllowed } from "./policy.ts";

test("free plan gets 3 builds a day and plus gets more", () => {
  assert.equal(dailyBuildLimit("free"), 3);
  assert.ok(dailyBuildLimit("plus") > dailyBuildLimit("free"));
});

test("limits match the V1 plan", () => {
  assert.equal(POLICY.promptMaxChars, 500);
  assert.equal(POLICY.gameMaxBytes, 204_800);
  assert.equal(POLICY.reportHideThreshold, 3);
  assert.equal(POLICY.versionsKept, 5);
  assert.equal(POLICY.leaderboardSize, 100);
});

test("rating ceiling keeps E and E10+ for kids and drops unrated games", () => {
  assert.equal(isRatingAllowed("E", "E10+"), true);
  assert.equal(isRatingAllowed("E10+", "E10+"), true);
  assert.equal(isRatingAllowed("T", "E10+"), false);
  assert.equal(isRatingAllowed("M", "T"), false);
  assert.equal(isRatingAllowed(null, "M"), false);
  assert.equal(isRatingAllowed("RP", "M"), false);
});
