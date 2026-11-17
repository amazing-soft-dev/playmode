/**
 * The only messages a game frame may send to the page (plan section 10, step 4):
 *   { type: "score", value: <finite number> }
 *   { type: "error", message: <string> }
 * Anything else, including messages from other windows, is ignored by the player.
 */
export type GameMessage = { type: "score"; value: number } | { type: "error"; message: string };

export function parseGameMessage(data: unknown): GameMessage | null {
  if (typeof data !== "object" || data === null) return null;
  const record = data as Record<string, unknown>;
  if (record.type === "score" && typeof record.value === "number" && Number.isFinite(record.value)) {
    return { type: "score", value: Math.trunc(record.value) };
  }
  if (record.type === "error" && typeof record.message === "string") {
    return { type: "error", message: record.message.slice(0, 300) };
  }
  return null;
}

/**
 * Script injected at the top of every game document. It forwards uncaught errors and rejected
 * promises so "Fix it" can send them to the AI. It runs inside the sandbox like the game itself.
 */
export const ERROR_REPORTER = `<script>(function(){function s(m){try{parent.postMessage({type:"error",message:String(m).slice(0,300)},"*")}catch(e){}}addEventListener("error",function(e){s(e.message||"Script error")});addEventListener("unhandledrejection",function(e){s(e.reason&&e.reason.message||e.reason||"Unhandled rejection")})})();</script>`;

/** Puts the error reporter before any game script. */
export function withErrorReporter(html: string): string {
  if (/<head[^>]*>/i.test(html)) return html.replace(/<head[^>]*>/i, (m) => `${m}${ERROR_REPORTER}`);
  return `${ERROR_REPORTER}${html}`;
}
