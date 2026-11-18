#!/usr/bin/env node
// Validates media/manifest.json against the files on disk and the code that uses them.
//
// Rules
// - Every entry has the required fields, a unique kebab-case id, and a file under public/media/.
// - The license matches the source (Unsplash License for unsplash, Pexels License for pexels).
//   Local entries are posters generated from a listed video.
// - Every listed file exists and stays under the size budget for its kind.
// - Every file under public/media/ (outside the generated _variants/ folder) is listed.
// - Each photo id is referenced exactly once in src/ (each photo is used once on the site).
//   Each video is referenced at least once. Posters are found through their video.
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";

const MANIFEST = "media/manifest.json";
const MEDIA_DIR = "public/media";
const VARIANTS_DIR = join(MEDIA_DIR, "_variants");
const SOURCE_DIRS = ["src"];
const BUDGET_KB = { photo: 700, poster: 300, video: 8 * 1024 };
const LICENSE_BY_SOURCE = { unsplash: "Unsplash License", pexels: "Pexels License" };
const REQUIRED = ["id", "kind", "file", "source", "sourceUrl", "downloadUrl", "author", "license", "alt"];

const errors = [];
const fail = (message) => errors.push(message);
const posix = (p) => p.split(sep).join("/");

function walk(dir, filter) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return walk(path, filter);
    return filter(path) ? [path] : [];
  });
}

if (!existsSync(MANIFEST)) {
  console.log(`check:images: ${MANIFEST} not found, nothing to check`);
  process.exit(0);
}

const { items = [] } = JSON.parse(readFileSync(MANIFEST, "utf8"));
const ids = new Set();

for (const item of items) {
  const label = item.id ?? "(missing id)";
  for (const field of REQUIRED) {
    if (item[field] === undefined) fail(`${label}: missing "${field}"`);
  }
  if (typeof item.id === "string" && !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(item.id)) fail(`${label}: id must be kebab-case`);
  if (ids.has(item.id)) fail(`${label}: duplicate id`);
  ids.add(item.id);

  if (!["photo", "video", "poster"].includes(item.kind)) fail(`${label}: unknown kind "${item.kind}"`);
  if (typeof item.file !== "string" || !item.file.startsWith(`${MEDIA_DIR}/`))
    fail(`${label}: file must be under ${MEDIA_DIR}/`);

  if (item.kind === "poster") {
    if (!items.some((v) => v.kind === "video" && v.id === item.posterOf))
      fail(`${label}: posterOf must name a listed video`);
  } else {
    const expected = LICENSE_BY_SOURCE[item.source];
    if (!expected) fail(`${label}: source must be unsplash or pexels`);
    else if (item.license !== expected) fail(`${label}: license must be "${expected}" for ${item.source}`);
    if (!String(item.sourceUrl).includes(`${item.source}.com/`))
      fail(`${label}: sourceUrl must point at ${item.source}.com`);
    if (!item.author) fail(`${label}: author is required for credits`);
    if (item.kind === "photo" && !item.alt) fail(`${label}: photos need alt text`);
  }

  if (typeof item.file === "string") {
    if (!existsSync(item.file)) {
      fail(`${label}: ${item.file} does not exist (run npm run media:fetch)`);
    } else {
      const kb = statSync(item.file).size / 1024;
      const budget = BUDGET_KB[item.kind];
      if (budget && kb > budget)
        fail(`${label}: ${Math.round(kb)} KB is over the ${budget} KB budget for a ${item.kind}`);
    }
  }
}

// Files on disk that nobody listed.
const listed = new Set(items.map((item) => item.file));
for (const file of walk(MEDIA_DIR, (p) => !p.startsWith(VARIANTS_DIR) && !p.endsWith(".gitkeep"))) {
  if (!listed.has(posix(file))) fail(`${posix(file)} is not listed in ${MANIFEST}`);
}

// How often each id is referenced as a quoted string literal in source files.
const sources = SOURCE_DIRS.flatMap((dir) => walk(dir, (p) => /\.(ts|tsx|mdx)$/.test(p) && !/\.test\.tsx?$/.test(p)));
const text = sources.map((file) => readFileSync(file, "utf8")).join("\n");
const uses = (id) => text.match(new RegExp(`["'\`]${id}["'\`]`, "g"))?.length ?? 0;

for (const item of items) {
  if (typeof item.id !== "string") continue;
  const count = uses(item.id);
  if (item.kind === "photo" && count !== 1) {
    fail(`${item.id}: photo is used ${count} times in ${SOURCE_DIRS.join(", ")}/ (must be exactly once)`);
  }
  if (item.kind === "video" && count < 1) fail(`${item.id}: video is never used`);
}

if (errors.length > 0) {
  console.error(`check:images failed (${errors.length}):`);
  for (const error of errors) console.error(`  - ${error}`);
  process.exit(1);
}

const count = (kind) => items.filter((item) => item.kind === kind).length;
console.log(
  `check:images: ok (${count("photo")} photos, ${count("video")} videos, ${count("poster")} posters; ` +
    `${sources.length} source files scanned in ${relative(".", SOURCE_DIRS[0])}/)`,
);
