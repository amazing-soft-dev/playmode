import assert from "node:assert/strict";
import { test } from "node:test";

import { extractVisibleText, scanGameHtml } from "./game-scan.ts";

const page = (body: string, script = "") =>
  `<!doctype html><html lang="en"><head><title>Test Game</title></head><body>${body}<script>${script}</script></body></html>`;

test("a self-contained canvas game passes", () => {
  const html = page(
    "<canvas id=c></canvas><p>Press Space</p>",
    `const ctx = c.getContext("2d"); ctx.fillText("SCORE", 4, 4);
     requestAnimationFrame(function loop(){ requestAnimationFrame(loop); });
     parent.postMessage({ type: "score", value: 10 }, "*");`,
  );
  const result = scanGameHtml(html);
  assert.equal(result.ok, true, JSON.stringify(result.issues));
});

test("network, storage, dynamic code and navigation are rejected", () => {
  const cases: [string, string][] = [
    ["fetch('/x')", "network-api"],
    ["new XMLHttpRequest()", "network-api"],
    ["new WebSocket('ws://x')", "network-api"],
    ["navigator.sendBeacon('/x')", "network-api"],
    ["localStorage.setItem('a','b')", "storage-api"],
    ["document.cookie", "storage-api"],
    ["eval('1')", "dynamic-code"],
    ["new Function('return 1')", "dynamic-code"],
    ["setTimeout('alert(1)', 1)", "dynamic-code"],
    ["import('./x.js')", "dynamic-code"],
    ["top.location = '/'", "navigation"],
    ["window.open('/')", "navigation"],
  ];
  for (const [code, rule] of cases) {
    const result = scanGameHtml(page("<canvas></canvas>", code));
    assert.equal(result.ok, false, code);
    assert.ok(
      result.issues.some((i) => i.rule === rule),
      `${code} -> ${rule}`,
    );
  }
});

test("external URLs and tags are rejected, even in comments", () => {
  for (const body of [
    "<!-- see https://example.com -->",
    '<img src="//cdn.example.com/a.png">',
    '<script src="game.js"></script>',
    '<link rel="stylesheet" href="a.css">',
    "<iframe></iframe>",
    "<form></form>",
    '<meta http-equiv="refresh" content="0">',
    '<div style="background:url(https://x.test/a.png)"></div>',
  ]) {
    assert.equal(scanGameHtml(page(body)).ok, false, body);
  }
});

test("size cap and document shape are enforced", () => {
  assert.ok(scanGameHtml(page("x".repeat(210 * 1024))).issues.some((i) => i.rule === "size"));
  assert.ok(scanGameHtml("<canvas></canvas>").issues.some((i) => i.rule === "not-html"));
  assert.equal(scanGameHtml(page("ok"), 64).ok, false);
});

test("visible text includes the title, body text and fillText literals only", () => {
  const html = page(
    "<h1>Neon Dash</h1><style>.x{}</style>",
    `ctx.fillText("GAME OVER", 1, 1); ctx.fillText(\`\${score}\`, 1, 1);`,
  );
  assert.deepEqual(extractVisibleText(html), ["Test Game", "Neon Dash", "GAME OVER"]);
});
