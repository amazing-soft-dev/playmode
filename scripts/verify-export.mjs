#!/usr/bin/env node
// Checks that the static export in out/ is complete and contains no server-only routes.
// Run after `NEXT_OUTPUT=export npm run build`.
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { basename, extname, join } from "node:path";

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

// Every photo and poster must ship with its original and all responsive WebP variants.
if (existsSync("media/manifest.json")) {
  const { items } = JSON.parse(readFileSync("media/manifest.json", "utf8"));
  const widths = JSON.parse(readFileSync("media/image-widths.json", "utf8"));
  for (const item of items) {
    const published = join(OUT, item.file.slice("public/".length));
    if (!existsSync(published)) errors.push(`missing media file ${published}`);
    if (item.kind === "photo" || item.kind === "poster") {
      const name = basename(item.file, extname(item.file));
      for (const width of widths) {
        const variant = join(OUT, "media", "_variants", `${name}-${width}.webp`);
        if (!existsSync(variant)) errors.push(`missing image variant ${variant} (run npm run images before the build)`);
      }
    }
  }
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
