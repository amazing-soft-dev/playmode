#!/usr/bin/env node
// Pre-builds responsive WebP variants for the static export (implemented in issue #16).
import { existsSync } from "node:fs";

if (!existsSync("media/manifest.json")) {
  console.log("images: no media manifest yet, nothing to build");
  process.exit(0);
}
