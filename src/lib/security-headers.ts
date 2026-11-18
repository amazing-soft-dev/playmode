/**
 * Security headers for the server build (the static export has no header support; the host's
 * config applies them there). See docs/architecture.md for the production game origin.
 */

const isDev = process.env.NODE_ENV !== "production";

/** Content Security Policy for the main site. */
export const SITE_CSP = [
  "default-src 'self'",
  // Next.js inlines hydration and JSON-LD scripts; dev mode also needs eval for fast refresh.
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""} https://va.vercel-scripts.com`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "media-src 'self'",
  "font-src 'self' data:",
  `connect-src 'self' https://vitals.vercel-insights.com${isDev ? " ws:" : ""}`,
  // Game frames use srcdoc today; production serves them from a separate game origin.
  "frame-src 'self' blob: data:",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
].join("; ");

/**
 * The plan's policy for game files (section 10): scripts and styles inline only, art from data or
 * blob URLs, no network access at all, and framing only by the main site.
 */
export function gameCsp(mainOrigin: string): string {
  return [
    "default-src 'none'",
    "script-src 'unsafe-inline'",
    "style-src 'unsafe-inline'",
    "img-src data: blob:",
    "media-src data: blob:",
    "font-src data:",
    "connect-src 'none'",
    "form-action 'none'",
    `frame-ancestors ${mainOrigin}`,
    "base-uri 'none'",
  ].join("; ");
}

export const COMMON_HEADERS = [
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()",
  },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
];
