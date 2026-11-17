/** Liveness check for the server build. Not part of the static export (see pageExtensions). */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export function GET() {
  return Response.json({ ok: true });
}
