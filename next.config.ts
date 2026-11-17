import type { NextConfig } from "next";

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
    : {}),
};

export default nextConfig;
