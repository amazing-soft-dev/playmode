# Sandbox verification

How to check, in a real browser, that a game running in the player cannot reach the site
(plan section 10). Run this after any change to `src/components/game/GamePlayer.tsx`, the
`sandbox` attribute, or the security headers.

## Procedure

1. Start the server build or the dev server and open any page on the site.
2. In the browser console, set a cookie (`document.cookie = "pm_probe=secret; path=/"`) and a
   storage value (`localStorage.setItem("pm.profile.v1", "{}")`).
3. Create an iframe exactly as the player does: `sandbox="allow-scripts"` only, with the contents
   of [`sandbox-probe.html`](sandbox-probe.html) as `srcdoc`, and listen for `message` events.
   The probe uses APIs the static scanner rejects, which is the point: it tests the sandbox layer
   on its own, as if a hostile file had slipped past the scanner.
4. Read the `probe-result` message, then remove the cookie and storage value.
5. Form submission does not throw when blocked, so check it separately: count the frame's `load`
   events after the probe submits a form. One load means the submission was blocked.

## Results

Checked on 2026-11-18 in the built-in Chromium browser against the dev server.

| Attempt from inside the game | Result |
| --- | --- |
| Read `document.cookie` | Blocked (SecurityError) |
| `localStorage`, `sessionStorage`, `indexedDB` | Blocked (SecurityError) |
| Read `parent.document` or `parent.localStorage` | Blocked (SecurityError) |
| Navigate the page with `top.location` | Blocked (SecurityError); the page stayed put |
| `window.open` | Blocked (returned null) |
| Submit a form | Blocked: 1 frame load with `allow-scripts`, 2 with `allow-forms` (control) |
| `fetch("/")` | Blocked (TypeError: opaque origin, no CORS) |
| `self.origin` | `"null"` (opaque origin) |
| Forged `{type:"navigate"}` and `{type:"score", value:"999999"}` messages | Delivered to the window but dropped by `parseGameMessage` (unit-tested in `src/lib/game-messages.test.ts`) |

## Still to do for production

Generated games currently run from `srcdoc`, which inherits the site's CSP rather than the stricter
game CSP. Moving game files to a separate origin (see `docs/architecture.md`) applies the game CSP
and removes any shared origin entirely.
