import assert from "node:assert/strict";
import { test } from "node:test";

import { SEARCH_INDEX, searchSite } from "./search-index.ts";

test("index covers pages, templates and gallery games without duplicates", () => {
  const hrefs = SEARCH_INDEX.map((e) => e.href);
  assert.equal(new Set(hrefs).size, hrefs.length);
  assert.ok(hrefs.includes("/parents"));
  assert.ok(hrefs.includes("/create?template=maze"));
  assert.ok(hrefs.includes("/play/garden-grid"));
});

test("title prefix matches rank first and every word must match", () => {
  const results = searchSite("pri");
  assert.equal(results[0]?.href, "/pricing");
  assert.equal(searchSite("garden puzzle")[0]?.href, "/play/garden-grid");
  assert.deepEqual(searchSite("zzzz-nothing"), []);
  assert.deepEqual(searchSite("   "), []);
});
