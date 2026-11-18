#!/usr/bin/env node
// Pre-builds responsive WebP variants for every photo and poster in media/manifest.json.
// The static export has no image optimizer, so src/lib/image-loader.ts points <Image> at
// these files: public/media/_variants/<basename>-<width>.webp (gitignored, built in CI).
import { existsSync, mkdirSync, readFileSync, statSync } from "node:fs";
import { basename, extname, join } from "node:path";

import sharp from "sharp";

const MANIFEST = "media/manifest.json";
const OUT_DIR = "public/media/_variants";
const WIDTHS = JSON.parse(readFileSync("media/image-widths.json", "utf8"));

if (!existsSync(MANIFEST)) {
  console.log("images: no media manifest yet, nothing to build");
  process.exit(0);
}

const { items } = JSON.parse(readFileSync(MANIFEST, "utf8"));
const stills = items.filter((item) => item.kind === "photo" || item.kind === "poster");
mkdirSync(OUT_DIR, { recursive: true });

let built = 0;
let skipped = 0;
for (const item of stills) {
  const name = basename(item.file, extname(item.file));
  const sourceTime = statSync(item.file).mtimeMs;
  for (const width of WIDTHS) {
    const target = join(OUT_DIR, `${name}-${width}.webp`);
    // Rebuild only when the source is newer than the variant.
    if (existsSync(target) && statSync(target).mtimeMs >= sourceTime) {
      skipped += 1;
      continue;
    }
    // Every width in the list exists for every image, so the loader never has to know the
    // original size; widths beyond the original are encoded at the original size.
    await sharp(item.file).resize({ width, withoutEnlargement: true }).webp({ quality: 74, effort: 5 }).toFile(target);
    built += 1;
  }
}

console.log(
  `images: ${built} WebP variants built, ${skipped} up to date (${stills.length} images x ${WIDTHS.length} widths)`,
);
