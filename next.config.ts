import type { NextConfig } from "next";

/**
 * Two build targets share this config:
 * - server (default `next build`): what Vercel runs. Route handlers and the image optimizer work.
 * - static (`NEXT_OUTPUT=export`): plain HTML in `out/`. No server, so `/api` is left out.
 */
const isStaticExport = process.env.NEXT_OUTPUT === "export";

const nextConfig: NextConfig = {
  reactCompiler: true,
  experimental: {
    turbopackRustReactCompiler: true,
  },
  poweredByHeader: false,
  ...(isStaticExport
    ? {
        output: "export" as const,
        trailingSlash: true,
      }
    : {}),
};

export default nextConfig;
