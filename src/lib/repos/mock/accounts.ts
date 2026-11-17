import { type AccountDecision, accountDecision } from "../../domain/age.ts";
import { generateNickname } from "../../domain/nickname.ts";
import type { BuildUsage, Profile } from "../../domain/types.ts";
import type { AuthRepo, SignInInput, UsageRepo } from "../types.ts";
import { type KeyValueStore, memoryStore, readJson, writeJson } from "./store.ts";

const PROFILE_KEY = "pm.profile.v1";
const USAGE_KEY = "pm.usage.v1";
/** The first age-gate answer is remembered so a child cannot retry with a different year. */
export const AGE_GATE_KEY = "pm.agegate.v1";

type GateReason = Exclude<AccountDecision, { ok: true }>["reason"];

export class AgeGateError extends Error {
  readonly reason: GateReason;

  constructor(reason: GateReason) {
    super(reason);
    this.name = "AgeGateError";
    this.reason = reason;
  }
}

export function createMockAuth(store: KeyValueStore = memoryStore(), now: () => number = Date.now): AuthRepo {
  return {
    async getCurrentProfile() {
      return readJson<Profile | null>(store, PROFILE_KEY, null);
    },
    async signIn({ email, displayName, birthYear, country }: SignInInput) {
      // A remembered answer wins over a new one: the gate is asked once per browser.
      const remembered = readJson<{ birthYear: number; country: string } | null>(store, AGE_GATE_KEY, null);
      const gate = remembered ?? { birthYear, country };
      if (!remembered) writeJson(store, AGE_GATE_KEY, gate);
      const decision = accountDecision(gate.birthYear, gate.country, now());
      if (!decision.ok) throw new AgeGateError(decision.reason);
      const ageBand = decision.band;
      const profile: Profile = {
        id: `u-${email.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
        // Under-18 accounts always show a generated nickname instead of a chosen name.
        displayName: ageBand === "adult" ? displayName.trim().slice(0, 24) : generateNickname(),
        nicknameGenerated: ageBand !== "adult",
        birthYear: gate.birthYear,
        ageBand,
        country: gate.country.toUpperCase(),
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
