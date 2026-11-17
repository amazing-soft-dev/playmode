import { POLICY, dailyBuildLimit } from "./domain/policy.ts";
import type { BuildUsage, Plan } from "./domain/types.ts";

/** Build allowance for today (plan sections 05 and 15). Failed builds are never recorded. */
export interface Quota {
  limit: number;
  used: number;
  remaining: number;
  canBuild: boolean;
}

export function buildQuota(plan: Plan, usage: Pick<BuildUsage, "buildsUsed">): Quota {
  const limit = dailyBuildLimit(plan);
  const used = Math.max(0, usage.buildsUsed);
  const remaining = Math.max(0, limit - used);
  return { limit, used, remaining, canBuild: remaining > 0 };
}

/**
 * "Fix it" repairs: the first two per build are free; after that each repair counts as a build.
 * Returns whether this repair should be charged as a build.
 */
export function repairCostsBuild(repairsForThisBuild: number): boolean {
  return repairsForThisBuild >= POLICY.freeRepairsPerBuild;
}
