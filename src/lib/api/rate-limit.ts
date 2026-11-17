/**
 * Fixed-window rate limiter kept in memory per server instance (plan section 15). It is a first
 * line of defence; production adds a shared store (for example Upstash or Vercel KV) so limits
 * hold across instances.
 */
export interface RateLimitResult {
  ok: boolean;
  remaining: number;
  /** Seconds until the window resets. */
  retryAfter: number;
}

export function createRateLimiter({ limit, windowMs }: { limit: number; windowMs: number }) {
  const hits = new Map<string, { count: number; resetAt: number }>();
  return function check(key: string, now: number = Date.now()): RateLimitResult {
    let entry = hits.get(key);
    if (!entry || entry.resetAt <= now) {
      entry = { count: 0, resetAt: now + windowMs };
      hits.set(key, entry);
    }
    entry.count += 1;
    // Drop expired keys now and then so the map can't grow without bound.
    if (hits.size > 10_000) for (const [k, v] of hits) if (v.resetAt <= now) hits.delete(k);
    return {
      ok: entry.count <= limit,
      remaining: Math.max(0, limit - entry.count),
      retryAfter: Math.ceil((entry.resetAt - now) / 1000),
    };
  };
}
