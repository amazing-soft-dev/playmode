import assert from "node:assert/strict";
import { test } from "node:test";

import { SITE_CSP, gameCsp } from "./security-headers.ts";

test("game files get the plan's no-network policy", () => {
  const csp = gameCsp("https://playermode.example");
  assert.match(csp, /default-src 'none'/);
  assert.match(csp, /connect-src 'none'/);
  assert.match(csp, /form-action 'none'/);
  assert.match(csp, /frame-ancestors https:\/\/playermode\.example/);
  assert.doesNotMatch(csp, /https?:\/\/(?!playermode)/);
});

test("the site cannot be framed and has no plugins", () => {
  assert.match(SITE_CSP, /frame-ancestors 'none'/);
  assert.match(SITE_CSP, /object-src 'none'/);
});
