import assert from "node:assert/strict";
import { test } from "node:test";

import { applyAudience, filterKey, ratingCeilingFor } from "./recommend.ts";

const base = { genres: ["puzzle"], platforms: [], price: "any" as const, ratingCeiling: "M" as const, keywords: [] };

test("unknown ages and under-13s are limited to E10+", () => {
  assert.equal(ratingCeilingFor("unknown"), "E10+");
  assert.equal(ratingCeilingFor("under13"), "E10+");
  assert.equal(ratingCeilingFor("13to17"), "T");
  assert.equal(ratingCeilingFor("adult"), "M");
});

test("a request can tighten but never widen the age ceiling", () => {
  assert.equal(applyAudience(base, "unknown").ratingCeiling, "E10+");
  assert.equal(applyAudience({ ...base, ratingCeiling: "E" }, "adult").ratingCeiling, "E");
});

test("identical filters share a cache key regardless of order", () => {
  assert.equal(filterKey({ ...base, genres: ["b", "a"] }), filterKey({ ...base, genres: ["a", "b"] }));
  assert.notEqual(filterKey(base), filterKey({ ...base, price: "free" }));
});
