import type { NextConfig } from "next";

import { COMMON_HEADERS, SITE_CSP, gameCsp } from "./src/lib/security-headers";

/**
 * Two build targets share this config:
 * - server (default `next build`): what Vercel runs. Route handlers and the image optimizer work.
 * - static (`NEXT_OUTPUT=export`): plain HTML in `out/`. No server, so `/api` is left out.
 */
const isStaticExport = process.env.NEXT_OUTPUT === "export";

const nextConfig: NextConfig = {
  /*
   * Route handlers are named route.api.ts. The server build treats "api.ts" as a page extension,
   * so they become routes; the static export drops that extension, so /api is left out of out/
   * instead of failing the export.
   */
  pageExtensions: isStaticExport ? ["tsx", "ts"] : ["api.ts", "tsx", "ts"],
  reactCompiler: true,
  experimental: {
    turbopackRustReactCompiler: true,
  },
  poweredByHeader: false,
  // Lets forms explain that the static export has no API (they send email on the live site only).
  env: { NEXT_PUBLIC_STATIC_EXPORT: isStaticExport ? "1" : "" },
  images: isStaticExport
    ? {
        // No optimizer in a static export: serve the WebP variants made by `npm run images`.
        loader: "custom",
        loaderFile: "./src/lib/image-loader.ts",
      }
    : {
        formats: ["image/avif", "image/webp"],
        deviceSizes: [640, 750, 960, 1280, 1600, 1920, 2400],
        minimumCacheTTL: 60 * 60 * 24 * 30,
      },
  ...(isStaticExport
    ? {
        output: "export" as const,
        trailingSlash: true,
      }
    : {
        // Headers only apply to the server build; a static host needs its own configuration.
        async headers() {
          const origin = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
          return [
            { source: "/:path*", headers: [...COMMON_HEADERS, { key: "Content-Security-Policy", value: SITE_CSP }] },
            {
              source: "/games/:path*",
              headers: [
                ...COMMON_HEADERS,
                { key: "Content-Security-Policy", value: gameCsp(origin) },
                { key: "X-Frame-Options", value: "SAMEORIGIN" },
              ],
            },
          ];
        },
      }),
};

export default nextConfig;
