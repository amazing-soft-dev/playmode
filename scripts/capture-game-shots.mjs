#!/usr/bin/env node
// Captures a mid-play screenshot of each starter game in public/games/ for the home page's template
// cards: public/games/shots/<id>.webp (960x720, the cards' 4:3). These are our own games, so they
// are not stock media and are not listed in media/manifest.json. Run after changing a game:
//
//   npm run games:shots
//
// Drives a local Chrome or Edge in headless mode over the DevTools protocol (Node's built-in
// WebSocket), so it needs no extra dependency. Set CHROME_PATH to use another browser binary.
import { spawn } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

import sharp from "sharp";

const GAMES = ["runner", "puzzle", "shooter", "clicker", "maze"];
const OUT_DIR = "public/games/shots";
const WIDTH = 960;
const HEIGHT = 720;
/** Time after pressing Space before the shot, so each game is in play rather than on its title. */
const PLAY_MS = 1400;

const CANDIDATES = [
  process.env.CHROME_PATH,
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
  "/usr/bin/chromium-browser",
];
const chrome = CANDIDATES.find((p) => p && existsSync(p));
if (!chrome) {
  console.error("games:shots: no Chrome or Edge found; set CHROME_PATH");
  process.exit(1);
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const port = 9400 + Math.floor(Math.random() * 400);
const profile = mkdtempSync(join(tmpdir(), "pm-shots-"));
const browser = spawn(
  chrome,
  [
    "--headless=new",
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${profile}`,
    "--no-first-run",
    "--hide-scrollbars",
    "--force-color-profile=srgb",
    "about:blank",
  ],
  { stdio: "ignore" },
);

try {
  let targets;
  for (let i = 0; i < 50 && !targets; i += 1) {
    try {
      targets = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
    } catch {
      await sleep(200);
    }
  }
  const page = targets?.find((t) => t.type === "page");
  if (!page) throw new Error("could not reach the browser");

  const ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((r) => ws.addEventListener("open", r, { once: true }));
  let nextId = 0;
  const pending = new Map();
  const events = [];
  ws.addEventListener("message", (e) => {
    const msg = JSON.parse(e.data);
    if (msg.id && pending.has(msg.id)) {
      const { res, rej } = pending.get(msg.id);
      pending.delete(msg.id);
      if (msg.error) rej(new Error(msg.error.message));
      else res(msg.result);
    } else events.forEach((fn) => fn(msg));
  });
  const send = (method, params = {}) =>
    new Promise((res, rej) => {
      const id = (nextId += 1);
      pending.set(id, { res, rej });
      ws.send(JSON.stringify({ id, method, params }));
    });
  const loaded = () =>
    new Promise((r) => {
      const fn = (m) => m.method === "Page.loadEventFired" && (events.splice(events.indexOf(fn), 1), r());
      events.push(fn);
    });

  await send("Page.enable");
  await send("Emulation.setDeviceMetricsOverride", {
    width: WIDTH,
    height: HEIGHT,
    deviceScaleFactor: 1,
    mobile: false,
  });
  mkdirSync(OUT_DIR, { recursive: true });

  for (const id of GAMES) {
    const done = loaded();
    await send("Page.navigate", { url: pathToFileURL(resolve(`public/games/${id}.html`)).href });
    await done;
    await sleep(400);
    // Every starter game starts on Space.
    for (const type of ["keyDown", "keyUp"]) {
      await send("Input.dispatchKeyEvent", {
        type,
        key: " ",
        code: "Space",
        windowsVirtualKeyCode: 32,
        text: type === "keyDown" ? " " : undefined,
      });
    }
    await sleep(PLAY_MS);
    const { data } = await send("Page.captureScreenshot", { format: "png" });
    const out = join(OUT_DIR, `${id}.webp`);
    await sharp(Buffer.from(data, "base64")).webp({ quality: 82 }).toFile(out);
    console.log(`games:shots: ${out}`);
  }
  ws.close();
} finally {
  browser.kill();
  await sleep(300);
  rmSync(profile, { recursive: true, force: true });
}
