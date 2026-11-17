import type { AgeBand, BuildUsage, Profile } from "../../domain/types.ts";
import type { AuthRepo, SignInInput, UsageRepo } from "../types.ts";
import { type KeyValueStore, memoryStore, readJson, writeJson } from "./store.ts";

const PROFILE_KEY = "pm.profile.v1";
const USAGE_KEY = "pm.usage.v1";

/** Age band from a birth year; the age gate (issue #31) decides who may sign in at all. */
function ageBandFor(birthYear: number, now: number): AgeBand {
  const age = new Date(now).getUTCFullYear() - birthYear;
  if (age < 13) return "under13";
  if (age < 18) return "13to17";
  return "adult";
}

export function createMockAuth(store: KeyValueStore = memoryStore(), now: () => number = Date.now): AuthRepo {
  return {
    async getCurrentProfile() {
      return readJson<Profile | null>(store, PROFILE_KEY, null);
    },
    async signIn({ email, displayName, birthYear, country }: SignInInput) {
      const ageBand = ageBandFor(birthYear, now());
      if (ageBand === "under13") throw new Error("Accounts are for players 13 and older.");
      const profile: Profile = {
        id: `u-${email.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
        displayName,
        nicknameGenerated: ageBand !== "adult",
        birthYear,
        ageBand,
        country: country.toUpperCase(),
        plan: "free",
        isAdmin: email.trim().toLowerCase() === "founder@playermode.test",
        createdAt: new Date(now()).toISOString(),
      };
      writeJson(store, PROFILE_KEY, profile);
      return profile;
    },
    async signOut() {
      store.remove(PROFILE_KEY);
    },
  };
}

export function createMockUsage(store: KeyValueStore = memoryStore()): UsageRepo {
  const load = () => readJson<Record<string, BuildUsage>>(store, USAGE_KEY, {});
  const bump = (userId: string, date: string, field: "buildsUsed" | "repairsUsed") => {
    const all = load();
    const key = `${userId}:${date}`;
    const usage = all[key] ?? { userId, date, buildsUsed: 0, repairsUsed: 0 };
    usage[field] += 1;
    all[key] = usage;
    writeJson(store, USAGE_KEY, all);
    return usage;
  };
  return {
    async get(userId, date) {
      return load()[`${userId}:${date}`] ?? { userId, date, buildsUsed: 0, repairsUsed: 0 };
    },
    async recordBuild(userId, date) {
      return bump(userId, date, "buildsUsed");
    },
    async recordRepair(userId, date) {
      return bump(userId, date, "repairsUsed");
    },
  };
}
