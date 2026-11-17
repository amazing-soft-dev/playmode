import assert from "node:assert/strict";
import { test } from "node:test";

import imageLoader from "./image-loader.ts";

test("local photos map to the next WebP variant up", () => {
  assert.equal(imageLoader({ src: "/media/photos/hero-arcade.jpg", width: 750 }), "/media/_variants/hero-arcade-960.webp");
  assert.equal(imageLoader({ src: "/media/photos/hero-arcade.jpg", width: 640 }), "/media/_variants/hero-arcade-640.webp");
  assert.equal(imageLoader({ src: "/media/posters/hero.jpg", width: 3840 }), "/media/_variants/hero-2400.webp");
});

test("other sources pass through", () => {
  assert.equal(imageLoader({ src: "/brand/playermode-logo-light.png", width: 640 }), "/brand/playermode-logo-light.png");
  assert.equal(imageLoader({ src: "/media/_variants/x-640.webp", width: 640 }), "/media/_variants/x-640.webp");
});
