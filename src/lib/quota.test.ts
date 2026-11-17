import assert from "node:assert/strict";
import { test } from "node:test";

import { buildQuota, repairCostsBuild } from "./quota.ts";

test("free accounts get three builds a day", () => {
  assert.deepEqual(buildQuota("free", { buildsUsed: 0 }), { limit: 3, used: 0, remaining: 3, canBuild: true });
  assert.deepEqual(buildQuota("free", { buildsUsed: 3 }), { limit: 3, used: 3, remaining: 0, canBuild: false });
  assert.equal(buildQuota("free", { buildsUsed: 9 }).remaining, 0);
  assert.ok(buildQuota("plus", { buildsUsed: 3 }).canBuild);
});

test("the first two repairs per build are free", () => {
  assert.equal(repairCostsBuild(0), false);
  assert.equal(repairCostsBuild(1), false);
  assert.equal(repairCostsBuild(2), true);
});
