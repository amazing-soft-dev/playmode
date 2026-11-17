import assert from "node:assert/strict";
import { test } from "node:test";

import { createMockChallenges } from "./challenges.ts";
import { memoryStore } from "./store.ts";

const at = (iso: string) => () => Date.parse(iso);

test("every day has a challenge; future days wait for approval", async () => {
  const repo = createMockChallenges(memoryStore(), at("2026-11-17T08:00:00Z"));
  assert.equal((await repo.forDate("2026-11-17")).status, "backlog");
  assert.equal((await repo.forDate("2026-11-18")).status, "pending");
  await repo.approve("2026-11-18", "u-founder");
  assert.equal((await repo.forDate("2026-11-18")).status, "approved");
});

test("scores outside the sane range or for another day are rejected", async () => {
  const repo = createMockChallenges(memoryStore(), at("2026-11-17T08:00:00Z"));
  const { scoreMax } = await repo.forDate("2026-11-17");
  const base = { date: "2026-11-17", playerId: "anon-1", anonymous: true, displayName: "Guest" };
  assert.equal((await repo.submitScore({ ...base, score: scoreMax + 1 })).accepted, false);
  assert.equal((await repo.submitScore({ ...base, score: -1 })).accepted, false);
  assert.equal((await repo.submitScore({ ...base, score: 1.5 })).accepted, false);
  assert.equal((await repo.submitScore({ ...base, date: "2026-11-16", score: 10 })).accepted, false);
  assert.equal((await repo.submitScore({ ...base, score: scoreMax })).accepted, true);
  const board = await repo.leaderboard("2026-11-17");
  assert.equal(board[0]?.playerId, "anon-1");
  assert.ok(board.length <= 100);
});

test("streak counts consecutive days and resets after a missed day", async () => {
  const store = memoryStore();
  const play = async (iso: string) => {
    const repo = createMockChallenges(store, at(iso));
    await repo.submitScore({ date: iso.slice(0, 10), playerId: "u-1", anonymous: false, displayName: "A", score: 5 });
    return repo;
  };
  await play("2026-11-15T10:00:00Z");
  await play("2026-11-16T10:00:00Z");
  const repo = await play("2026-11-17T10:00:00Z");
  assert.deepEqual(await repo.streak("u-1"), { playerId: "u-1", current: 3, best: 3, lastPlayedDate: "2026-11-17" });

  const later = createMockChallenges(store, at("2026-11-19T10:00:00Z"));
  assert.equal((await later.streak("u-1")).current, 0);
  assert.equal((await later.streak("u-1")).best, 3);
});
