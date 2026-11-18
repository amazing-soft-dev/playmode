#!/usr/bin/env node
// Builds a single-file, Figma-style inspector over the template audit (docs/audit) and the local
// audit screenshots (.research/audit), written to .research/audit/inspector.html (gitignored,
// because the screenshots are of a third-party template and stay out of the repository).
//
//   npm run audit:inspector
//
// Views: Components (layer list + spec), Motion, Tokens (colours, type, spacing), Site map,
// Captures (screenshots and animation frames), and QA (measured comparison).
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { basename, join, relative, sep } from "node:path";

const AUDIT = "docs/audit";
const LOCAL = ".research/audit";
const OUT = join(LOCAL, "inspector.html");

const readDir = (dir) =>
  existsSync(dir)
    ? readdirSync(dir)
        .filter((f) => f.endsWith(".md"))
        .sort()
        .map((f) => ({ name: basename(f, ".md"), text: readFileSync(join(dir, f), "utf8") }))
    : [];

const walk = (dir) =>
  existsSync(dir)
    ? readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
        const p = join(dir, e.name);
        return e.isDirectory() ? walk(p) : /\.(jpe?g|png|webp)$/i.test(e.name) ? [p] : [];
      })
    : [];

const data = {
  generated: new Date().toISOString(),
  report: existsSync(join(AUDIT, "report.md")) ? readFileSync(join(AUDIT, "report.md"), "utf8") : "",
  qa: existsSync(join(AUDIT, "qa.md")) ? readFileSync(join(AUDIT, "qa.md"), "utf8") : "",
  tokens: JSON.parse(readFileSync(join(AUDIT, "tokens.json"), "utf8")),
  sitemap: JSON.parse(readFileSync(join(AUDIT, "sitemap.json"), "utf8")),
  components: readDir(join(AUDIT, "components")),
  motion: readDir(join(AUDIT, "motion")),
  captures: walk(LOCAL)
    .filter((p) => !p.endsWith("inspector.html"))
    .map((p) => ({ src: relative(LOCAL, p).split(sep).join("/"), kb: Math.round(statSync(p).size / 1024) })),
};

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Playmode audit inspector</title>
<style>
  :root { --bg:#0b0b0c; --panel:#141416; --line:#2a2a2e; --text:#e8e8ea; --muted:#8a8a92; --accent:#c6ff3d; }
  * { box-sizing: border-box; }
  body { margin:0; background:var(--bg); color:var(--text); font:13px/1.5 ui-monospace, SFMono-Regular, Menlo, monospace; height:100vh; display:grid; grid-template-rows:auto 1fr; }
  header { display:flex; gap:4px; align-items:center; padding:8px 12px; border-bottom:1px solid var(--line); flex-wrap:wrap; }
  header strong { margin-right:12px; }
  header button { background:none; border:1px solid var(--line); color:var(--muted); padding:4px 10px; cursor:pointer; font:inherit; }
  header button[aria-pressed=true] { border-color:var(--accent); color:var(--accent); }
  main { display:grid; grid-template-columns:260px 1fr; min-height:0; }
  aside { border-right:1px solid var(--line); overflow:auto; }
  aside input { width:100%; background:var(--panel); border:0; border-bottom:1px solid var(--line); color:var(--text); padding:8px 10px; font:inherit; }
  aside button { display:block; width:100%; text-align:left; background:none; border:0; border-bottom:1px solid var(--line); color:var(--text); padding:7px 10px; cursor:pointer; font:inherit; }
  aside button[aria-current=true] { background:var(--panel); color:var(--accent); }
  section { overflow:auto; padding:20px 28px; }
  pre { white-space:pre-wrap; word-break:break-word; background:var(--panel); border:1px solid var(--line); padding:16px; }
  .swatches { display:grid; grid-template-columns:repeat(auto-fill,minmax(220px,1fr)); gap:10px; }
  .swatch { border:1px solid var(--line); }
  .swatch div { height:56px; border-bottom:1px solid var(--line); }
  .swatch p { margin:0; padding:8px; }
  .muted { color:var(--muted); }
  table { border-collapse:collapse; width:100%; }
  td, th { border:1px solid var(--line); padding:5px 8px; text-align:left; vertical-align:top; }
  .grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(320px,1fr)); gap:14px; }
  figure { margin:0; border:1px solid var(--line); background:var(--panel); }
  figure img { display:block; width:100%; height:auto; }
  figcaption { padding:6px 8px; color:var(--muted); }
  h1, h2, h3 { font-family: system-ui, sans-serif; }
</style>
</head>
<body>
<header>
  <strong>Playmode audit inspector</strong>
  <span class="muted" id="gen"></span>
  <span style="flex:1"></span>
  <nav id="views"></nav>
</header>
<main>
  <aside><input id="filter" placeholder="Filter" aria-label="Filter the list"><div id="list"></div></aside>
  <section id="detail" aria-live="polite"></section>
</main>
<script>
const DATA = ${JSON.stringify(data).replace(/</g, "\\u003c")};
const $ = (id) => document.getElementById(id);
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;" })[c]);
const VIEWS = {
  Components: () => DATA.components.map((c) => ({ label: c.name, render: () => "<pre>" + esc(c.text) + "</pre>" })),
  Motion: () => DATA.motion.map((m) => ({ label: m.name, render: () => "<pre>" + esc(m.text) + "</pre>" })),
  Tokens: () => [
    { label: "colours", render: () => '<div class="swatches">' + Object.entries(DATA.tokens.colors).map(([k, v]) => {
        const value = typeof v === "object" ? v.value : v;
        return '<div class="swatch"><div style="background:' + esc(value) + '"></div><p>' + esc(k) + '<br><span class="muted">' + esc(value) + '</span><br><span class="muted">' + esc(v.usage || "") + '</span></p></div>';
      }).join("") + "</div>" },
    ...Object.keys(DATA.tokens).filter((k) => k !== "colors").map((k) => ({ label: k, render: () => "<pre>" + esc(JSON.stringify(DATA.tokens[k], null, 2)) + "</pre>" })),
  ],
  "Site map": () => [{ label: "all urls", render: () => {
    const urls = DATA.sitemap.urls || [];
    return "<p class='muted'>" + esc(JSON.stringify(DATA.sitemap.summary.counts)) + "</p><table><tr><th>URL</th><th>Type</th><th>Status</th><th>Depth</th></tr>" +
      urls.map((u) => "<tr><td>" + esc(u.url) + "</td><td>" + esc(u.type) + "</td><td>" + esc(u.status) + "</td><td>" + esc(u.depth ?? "") + "</td></tr>").join("") + "</table>";
  } }],
  Captures: () => {
    const groups = {};
    for (const c of DATA.captures) (groups[c.src.split("/").slice(0, -1).join("/")] ||= []).push(c);
    return Object.entries(groups).map(([dir, items]) => ({ label: dir, render: () => '<div class="grid">' + items.map((i) =>
      '<figure><img loading="lazy" src="' + esc(i.src) + '" alt="' + esc(i.src) + '"><figcaption>' + esc(i.src.split("/").pop()) + " · " + i.kb + " KB</figcaption></figure>").join("") + "</div>" }));
  },
  Report: () => [{ label: "report.md", render: () => "<pre>" + esc(DATA.report) + "</pre>" }, { label: "qa.md", render: () => "<pre>" + esc(DATA.qa) + "</pre>" }],
};
let view = "Components", items = [], current = 0;
function renderList() {
  const q = $("filter").value.toLowerCase();
  $("list").innerHTML = items.map((it, i) => it.label.toLowerCase().includes(q)
    ? '<button data-i="' + i + '" aria-current="' + (i === current) + '">' + esc(it.label) + "</button>" : "").join("");
}
function select(i) { current = i; $("detail").innerHTML = items[i] ? "<h2>" + esc(items[i].label) + "</h2>" + items[i].render() : ""; renderList(); }
function setView(v) {
  view = v; items = VIEWS[v](); current = 0;
  $("views").innerHTML = Object.keys(VIEWS).map((k) => '<button aria-pressed="' + (k === view) + '" data-v="' + k + '">' + k + "</button>").join(" ");
  select(0);
}
$("views").addEventListener("click", (e) => e.target.dataset.v && setView(e.target.dataset.v));
$("list").addEventListener("click", (e) => e.target.dataset.i && select(Number(e.target.dataset.i)));
$("filter").addEventListener("input", renderList);
$("gen").textContent = "generated " + DATA.generated.slice(0, 16).replace("T", " ");
setView("Components");
</script>
</body>
</html>
`;

mkdirSync(LOCAL, { recursive: true });
writeFileSync(OUT, html);
console.log(
  `audit:inspector: wrote ${OUT} (${data.components.length} components, ${data.motion.length} motion specs, ${data.captures.length} captures)`,
);
