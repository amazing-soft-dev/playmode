import assert from "node:assert/strict";
import { test } from "node:test";

import { createRateLimiter } from "./rate-limit.ts";

test("allows up to the limit per window, per key", () => {
  const check = createRateLimiter({ limit: 2, windowMs: 1000 });
  assert.equal(check("a", 0).ok, true);
  assert.equal(check("a", 10).ok, true);
  const third = check("a", 20);
  assert.equal(third.ok, false);
  assert.equal(third.retryAfter, 1);
  assert.equal(check("b", 20).ok, true);
  assert.equal(check("a", 1001).ok, true);
});
