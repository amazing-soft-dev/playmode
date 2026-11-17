import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

/**
 * Vercel Web Analytics and Speed Insights, production only: they load when Vercel reports the
 * production environment, never in previews, local development or the static export. Both are
 * cookie-light and build no cross-site profiles, in line with the kids and privacy rules.
 */
export function ProductionAnalytics() {
  if (process.env.NEXT_PUBLIC_VERCEL_ENV !== "production") return null;
  return (
    <>
      <Analytics />
      <SpeedInsights />
    </>
  );
}
