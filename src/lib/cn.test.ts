import assert from "node:assert/strict";
import { test } from "node:test";

import { cn } from "./cn.ts";

test("joins truthy class names", () => {
  assert.equal(cn("a", "b"), "a b");
});

test("skips falsy values and flattens arrays", () => {
  assert.equal(cn("a", false, null, undefined, "", ["b", ["c", false]]), "a b c");
});
