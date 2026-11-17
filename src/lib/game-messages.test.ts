import assert from "node:assert/strict";
import { test } from "node:test";

import { parseGameMessage, withErrorReporter } from "./game-messages.ts";

test("accepts only score and error messages", () => {
  assert.deepEqual(parseGameMessage({ type: "score", value: 42.9 }), { type: "score", value: 42 });
  assert.deepEqual(parseGameMessage({ type: "error", message: "boom" }), { type: "error", message: "boom" });
  assert.equal(parseGameMessage({ type: "score", value: Number.NaN }), null);
  assert.equal(parseGameMessage({ type: "score", value: "10" }), null);
  assert.equal(parseGameMessage({ type: "navigate", url: "/" }), null);
  assert.equal(parseGameMessage("score"), null);
  assert.equal(parseGameMessage(null), null);
});

test("long error messages are truncated", () => {
  const msg = parseGameMessage({ type: "error", message: "x".repeat(1000) });
  assert.equal(msg?.type === "error" && msg.message.length, 300);
});

test("the error reporter is injected before game scripts", () => {
  const html = withErrorReporter("<html><head><title>x</title></head><body><script>go()</script></body></html>");
  assert.ok(html.indexOf("unhandledrejection") < html.indexOf("go()"));
  assert.ok(html.startsWith("<html><head><script>"));
});
