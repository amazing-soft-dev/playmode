import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

import { withDocumentTitle } from "./game-title.ts";

test("replaces the template's title with the game's", () => {
  const html = readFileSync("public/games/runner.html", "utf8");
  const out = withDocumentTitle(html, "Neon Rooftops");
  assert.match(out, /<title>Neon Rooftops<\/title>/);
  assert.doesNotMatch(out, /<title>NEON DASH<\/title>/);
  // Only the <head> element changes (the game's own comment mentions "<title>" in prose).
  assert.equal(out.match(/<title>[^<]*<\/title>/g)?.length, 1);
  assert.equal(out.indexOf("<title>Neon Rooftops</title>"), html.indexOf("<title>NEON DASH</title>"));
});

test("escapes markup and keeps dollar signs literal", () => {
  const out = withDocumentTitle("<head><title>x</title></head>", `Cash $& <Grab> "it"`);
  assert.equal(out, "<head><title>Cash $&amp; &lt;Grab&gt; &quot;it&quot;</title></head>");
});

test("adds a title to <head>, or to the start, when there is none", () => {
  assert.equal(
    withDocumentTitle('<html><head lang="en"></head></html>', "A"),
    '<html><head lang="en"><title>A</title></head></html>',
  );
  assert.equal(withDocumentTitle("<canvas></canvas>", "A"), "<title>A</title><canvas></canvas>");
});

test("an empty title leaves the document unchanged", () => {
  const html = "<head><title>NEON DASH</title></head>";
  assert.equal(withDocumentTitle(html, "   "), html);
});
