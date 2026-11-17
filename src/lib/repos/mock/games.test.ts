import assert from "node:assert/strict";
import { test } from "node:test";

import { createMockGames } from "./games.ts";

test("gallery tabs sort by date, weekly likes, and staff picks", async () => {
  const { games } = createMockGames();
  const fresh = await games.listGallery({ tab: "new" });
  assert.ok(fresh.length > 0);
  for (let i = 1; i < fresh.length; i += 1) {
    assert.ok((fresh[i - 1]!.publishedAt ?? "") >= (fresh[i]!.publishedAt ?? ""));
  }
  const top = await games.listGallery({ tab: "top-week" });
  for (let i = 1; i < top.length; i += 1) assert.ok(top[i - 1]!.weeklyLikeCount >= top[i]!.weeklyLikeCount);
  const picks = await games.listGallery({ tab: "staff-picks" });
  assert.ok(picks.length > 0 && picks.every((g) => g.staffPick));
});

test("a user can like a game only once", async () => {
  const { games } = createMockGames();
  const before = (await games.get("garden-grid"))!.likeCount;
  await games.like("garden-grid", "u-test");
  const after = await games.like("garden-grid", "u-test");
  assert.equal(after, before + 1);
  assert.equal(await games.hasLiked("garden-grid", "u-test"), true);
});

test("three reports hide a game until it is reviewed", async () => {
  const { games, reports } = createMockGames();
  await reports.create("tide-tiles", "u-a", "broken", "");
  await reports.create("tide-tiles", "u-b", "broken", "");
  assert.equal((await games.get("tide-tiles"))!.status, "published");
  await reports.create("tide-tiles", "u-c", "inappropriate", "");
  assert.equal((await games.get("tide-tiles"))!.status, "hidden");
  assert.equal((await games.listGallery({ tab: "new", limit: 100 })).some((g) => g.id === "tide-tiles"), false);

  for (const report of await reports.listQueue()) await reports.resolve(report.id, "dismissed");
  assert.equal((await games.get("tide-tiles"))!.status, "published");
});
