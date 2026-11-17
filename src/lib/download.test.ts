import assert from "node:assert/strict";
import { test } from "node:test";

import { strFromU8, unzipSync } from "fflate";

import { buildZip, slugify, withLicenseHeader } from "./download.ts";

const info = { title: "Neon <Rooftops>", creator: "PixelOtter42", license: "cc-by-4.0" as const };
const html = "<!-- playermode:game id=runner scoreMin=0 scoreMax=1 -->\n<!doctype html><html><body>x</body></html>";
const day = new Date("2026-11-17T00:00:00Z");

test("downloads carry the site, creator, license and browser note", () => {
  const out = withLicenseHeader(html, info, day);
  assert.match(out, /Made by PixelOtter42 with PlayerMode/);
  assert.match(out, /Creative Commons Attribution 4\.0/);
  assert.match(out, /Open it in a web browser only/);
  assert.doesNotMatch(out, /playermode:game/);
  assert.doesNotMatch(out.split("-->")[0]!, /<Rooftops>/);
});

test("the zip holds index.html and a README with itch.io steps", () => {
  const files = unzipSync(buildZip(html, info, day));
  assert.deepEqual(Object.keys(files).sort(), ["README.md", "index.html"]);
  assert.match(strFromU8(files["README.md"]!), /Upload to itch\.io/);
  assert.match(strFromU8(files["index.html"]!), /<!doctype html>/);
});

test("slugs are file-safe", () => {
  assert.equal(slugify("Neon Rooftops: Night!"), "neon-rooftops-night");
  assert.equal(slugify("***"), "playermode-game");
});
