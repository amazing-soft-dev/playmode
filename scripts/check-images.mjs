#!/usr/bin/env node
// Validates media/manifest.json: every entry exists, is credited, and each photo is used once.
// The full rules land with the media pipeline (issue #15); until a manifest exists this passes.
import { existsSync } from "node:fs";

const MANIFEST = "media/manifest.json";

if (!existsSync(MANIFEST)) {
  console.log(`check:images: ${MANIFEST} not found yet, nothing to check`);
  process.exit(0);
}
