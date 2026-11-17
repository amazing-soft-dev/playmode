/**
 * Anonymous player id (plan section 12): players without an account, including under-13s, get a
 * random id kept in this browser so their streak works. Nothing else about them is stored.
 */
const KEY = "pm.anon.v1";

export function anonymousId(): string {
  try {
    const existing = window.localStorage.getItem(KEY);
    if (existing) return existing;
    const id = `anon-${crypto.randomUUID()}`;
    window.localStorage.setItem(KEY, id);
    return id;
  } catch {
    // Storage blocked: a per-page id still lets the player submit a score.
    return `anon-${crypto.randomUUID()}`;
  }
}
