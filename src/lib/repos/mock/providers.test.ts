import assert from "node:assert/strict";
import { test } from "node:test";

import { CATALOG } from "../../fixtures/catalog.ts";
import { createMockAi, createMockCatalog } from "./providers.ts";

const ai = createMockAi(async (t) => `<!doctype html><html lang="en"><body>${t}</body></html>`);
const catalog = createMockCatalog();

test("parse returns filters only and defaults to the child-safe ceiling", async () => {
  const filters = await ai.parseRequest("a free puzzle game for my phone", {});
  assert.deepEqual(filters.genres, ["puzzle"]);
  assert.deepEqual(filters.platforms, ["mobile"]);
  assert.equal(filters.price, "free");
  assert.equal(filters.ratingCeiling, "E10+");
});

test("search never returns games above the rating ceiling", async () => {
  const results = await catalog.search({ genres: ["shooter"], platforms: [], price: "any", ratingCeiling: "E10+", keywords: [] });
  assert.equal(results.length, 0);
  const teen = await catalog.search({ genres: ["shooter"], platforms: [], price: "any", ratingCeiling: "T", keywords: [] });
  assert.ok(teen.length > 0 && teen.every((g) => g.esrb === "T" || g.esrb === "E" || g.esrb === "E10+"));
});

test("every result is a real catalog record and explanations use its fields", async () => {
  const results = await catalog.search({ genres: ["puzzle"], platforms: [], price: "paid", ratingCeiling: "E10+", keywords: [] });
  assert.ok(results.length > 0);
  for (const g of results) assert.ok(CATALOG.includes(g));
  const lines = await ai.explain("puzzles", results);
  for (const g of results) assert.match(lines.get(g.id) ?? "", new RegExp(g.released ?? "unknown"));
});

test("mock generation stamps the request into the template", async () => {
  const out = await ai.generate({ template: "runner", prompt: "rooftops -- at night" });
  assert.match(out.html, /playermode:mock prompt: rooftops - at night/);
  assert.match(out.html, /runner/);
});
