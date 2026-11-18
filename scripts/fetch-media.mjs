#!/usr/bin/env node
// Downloads every photo and video listed in media/manifest.json that is not on disk yet,
// optimizes it, and writes its final dimensions back to the manifest.
//
//   npm run media:fetch              fetch missing files
//   npm run media:fetch -- --force   re-fetch everything
//   npm run media:fetch -- <id> ...  fetch only these ids
//
// Photos are fitted to 2400 px on the longest side and saved as progressive mozjpeg, starting at
// quality 80 and stepping down until the file is under 600 KB.
// Videos need ffmpeg (on PATH or in the FFMPEG env var): they are re-encoded to H.264 without
// audio, at most 1920 px wide (or the entry's maxWidth), trimmed to trimSeconds (default 12),
// with +faststart, and a poster frame is written for each one.
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";

import sharp from "sharp";

const MANIFEST = "media/manifest.json";
const PHOTO_MAX_WIDTH = 2400;
const PHOTO_TARGET_BYTES = 600 * 1024;
const VIDEO_MAX_WIDTH = 1920;
const VIDEO_DEFAULT_SECONDS = 12;
const USER_AGENT = "PlayerModeMediaFetch/1.0 (+https://github.com/amazing-soft-dev/playmode)";

const args = process.argv.slice(2);
const force = args.includes("--force");
const only = new Set(args.filter((a) => !a.startsWith("--")));

const manifest = JSON.parse(readFileSync(MANIFEST, "utf8"));
const ffmpeg = process.env.FFMPEG || "ffmpeg";

async function download(url) {
  const res = await fetch(url, { headers: { "user-agent": USER_AGENT }, redirect: "follow" });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return Buffer.from(await res.arrayBuffer());
}

async function fetchPhoto(item) {
  const input = await download(item.downloadUrl);
  // Fit the longest side to 2400 px (portrait shots too), then step the quality down until the
  // file fits the photo budget that check:images enforces.
  let result;
  for (const quality of [80, 74, 68, 62, 56]) {
    result = await sharp(input)
      .rotate()
      .resize({ width: PHOTO_MAX_WIDTH, height: PHOTO_MAX_WIDTH, fit: "inside", withoutEnlargement: true })
      .jpeg({ quality, mozjpeg: true, progressive: true })
      .toBuffer({ resolveWithObject: true });
    if (result.data.length <= PHOTO_TARGET_BYTES) break;
  }
  const { data, info } = result;
  mkdirSync(dirname(item.file), { recursive: true });
  writeFileSync(item.file, data);
  item.width = info.width;
  item.height = info.height;
}

function runFfmpeg(ffArgs) {
  execFileSync(ffmpeg, ["-hide_banner", "-loglevel", "error", "-y", ...ffArgs], { stdio: "inherit" });
}

async function fetchVideo(item) {
  const raw = join(tmpdir(), `playermode-${item.id}-source.mp4`);
  writeFileSync(raw, await download(item.downloadUrl));
  mkdirSync(dirname(item.file), { recursive: true });
  // Background loops only need a few seconds; trimming keeps files small.
  const seconds = String(item.trimSeconds ?? VIDEO_DEFAULT_SECONDS);
  const width = Math.min(item.maxWidth ?? VIDEO_MAX_WIDTH, VIDEO_MAX_WIDTH);
  runFfmpeg([
    "-i",
    raw,
    "-t",
    seconds,
    "-an",
    "-vf",
    `scale='min(${width},iw)':-2,fps=30`,
    "-c:v",
    "libx264",
    "-preset",
    "slow",
    "-crf",
    "28",
    "-pix_fmt",
    "yuv420p",
    "-movflags",
    "+faststart",
    item.file,
  ]);
  rmSync(raw, { force: true });
  const meta = await probeVideo(item.file);
  item.width = meta.width;
  item.height = meta.height;

  const poster = manifest.items.find((p) => p.kind === "poster" && p.posterOf === item.id);
  if (poster) {
    const frame = join(tmpdir(), `playermode-${item.id}-poster.png`);
    runFfmpeg(["-ss", "0.5", "-i", item.file, "-frames:v", "1", frame]);
    mkdirSync(dirname(poster.file), { recursive: true });
    const info = await sharp(frame).jpeg({ quality: 78, mozjpeg: true, progressive: true }).toFile(poster.file);
    poster.width = info.width;
    poster.height = info.height;
    rmSync(frame, { force: true });
  }
}

async function probeVideo(file) {
  // Grab one frame and let sharp report the size, so ffprobe is not required.
  const frame = join(tmpdir(), `playermode-probe-${Date.now()}.png`);
  runFfmpeg(["-i", file, "-frames:v", "1", frame]);
  const meta = await sharp(frame).metadata();
  rmSync(frame, { force: true });
  return { width: meta.width, height: meta.height };
}

let fetched = 0;
let skipped = 0;
for (const item of manifest.items) {
  if (item.kind === "poster") continue; // written together with its video
  if (only.size > 0 && !only.has(item.id)) continue;
  if (!force && existsSync(item.file)) {
    skipped += 1;
    continue;
  }
  process.stdout.write(`${item.kind} ${item.id} ... `);
  try {
    if (item.kind === "photo") await fetchPhoto(item);
    else await fetchVideo(item);
    const kb = Math.round(statSync(item.file).size / 1024);
    console.log(`${item.width}x${item.height}, ${kb} KB`);
    fetched += 1;
  } catch (error) {
    console.log("failed");
    console.error(`  ${error.message}`);
    process.exitCode = 1;
  }
}

writeFileSync(MANIFEST, `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`media:fetch: ${fetched} fetched, ${skipped} already on disk`);
