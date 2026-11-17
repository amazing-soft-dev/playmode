import widths from "../../media/image-widths.json" with { type: "json" };

/**
 * Custom next/image loader for the static export (NEXT_OUTPUT=export), where there is no image
 * optimizer. Local photos map to the WebP variants made by `npm run images`; anything else is
 * returned unchanged.
 */
export default function imageLoader({ src, width }: { src: string; width: number; quality?: number }): string {
  const match = /^\/media\/(?!_variants\/)(?:.+\/)?([^/]+)\.(?:jpe?g|png)$/i.exec(src);
  if (!match) return src;
  const chosen = widths.find((w) => w >= width) ?? widths[widths.length - 1];
  return `/media/_variants/${match[1]}-${chosen}.webp`;
}
