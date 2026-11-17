#!/usr/bin/env node
// Checks that the static export in out/ is complete and contains no server-only routes.
// Run after `NEXT_OUTPUT=export npm run build`.
import { existsSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const OUT = "out";

/** Files every static export must contain. Later issues append to this list. */
const REQUIRED_FILES = [
  "index.html",
  "404.html",
  "favicon.ico",
  "site.webmanifest",
  "icons/light/android-chrome-192x192.png",
  "icons/light/android-chrome-512x512.png",
  "icons/light/apple-touch-icon.png",
  "icons/dark/favicon-32x32.png",
];

/** Paths that must never be exported (they need a server). */
const FORBIDDEN_PATHS = ["api"];

const errors = [];

if (!existsSync(OUT) || !statSync(OUT).isDirectory()) {
  console.error(`verify-export: ${OUT}/ not found. Build with NEXT_OUTPUT=export first.`);
  process.exit(1);
}

for (const file of REQUIRED_FILES) {
  const path = join(OUT, file);
  if (!existsSync(path)) errors.push(`missing ${path}`);
  else if (statSync(path).size === 0) errors.push(`empty ${path}`);
}

for (const forbidden of FORBIDDEN_PATHS) {
  if (existsSync(join(OUT, forbidden))) errors.push(`${OUT}/${forbidden} must not exist in a static export`);
}

const countHtml = (dir) =>
  readdirSync(dir, { withFileTypes: true }).reduce(
    (n, entry) =>
      n + (entry.isDirectory() ? countHtml(join(dir, entry.name)) : entry.name.endsWith(".html") ? 1 : 0),
    0,
  );

if (errors.length > 0) {
  console.error("verify-export failed:");
  for (const error of errors) console.error(`  - ${error}`);
  process.exit(1);
}

console.log(`verify-export: ok (${countHtml(OUT)} HTML files, ${REQUIRED_FILES.length} required files present)`);
