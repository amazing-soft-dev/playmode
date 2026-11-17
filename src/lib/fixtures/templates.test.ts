import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

import { scanGameHtml } from "../game-scan.ts";
import { CHALLENGE_BACKLOG } from "./challenges.ts";
import { TEMPLATES } from "./templates.ts";

const read = (id: string) => readFileSync(`public/games/${id}.html`, "utf8");

for (const template of TEMPLATES) {
  test(`${template.id}.html passes the game scanner`, () => {
    const result = scanGameHtml(read(template.id));
    assert.equal(result.ok, true, JSON.stringify(result.issues));
    assert.ok(result.sizeBytes < 60 * 1024, `${result.sizeBytes} bytes`);
  });

  test(`${template.id}.html posts its score and matches the template metadata`, () => {
    const html = read(template.id);
    assert.match(html, /parent\.postMessage\(\{\s*type:\s*"score"/);
    const header = /<!-- playermode:game id=(\w+) scoreMin=(\d+) scoreMax=(\d+) -->/.exec(html);
    assert.ok(header, "missing playermode:game header");
    assert.equal(header[1], template.id);
    assert.equal(Number(header[2]), template.scoreMin);
    assert.equal(Number(header[3]), template.scoreMax);
  });
}

test("daily challenges use each template's score ceiling", () => {
  for (const entry of CHALLENGE_BACKLOG) {
    const template = TEMPLATES.find((t) => t.id === entry.template);
    assert.equal(entry.scoreMax, template?.scoreMax, entry.theme);
  }
});
