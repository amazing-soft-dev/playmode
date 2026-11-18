import manifest from "../../media/manifest.json" with { type: "json" };

export interface MediaItem {
  id: string;
  kind: "photo" | "video" | "poster";
  /** Public URL, e.g. /media/photos/cta-arcade.jpg */
  src: string;
  width: number;
  height: number;
  alt: string;
  author: string;
  authorUrl?: string;
  source: "unsplash" | "pexels" | "local";
  sourceUrl: string;
  license: string;
  licenseUrl?: string;
  focal?: string;
  posterOf?: string;
}

interface ManifestItem extends Omit<MediaItem, "src"> {
  file: string;
}

const items = (manifest as { items: ManifestItem[] }).items.map(({ file, ...rest }): MediaItem => ({
  ...rest,
  src: file.replace(/^public/, ""),
}));
const byId = new Map(items.map((item) => [item.id, item]));

/** Looks up a photo or video by its manifest id. Throws on unknown ids so typos fail the build. */
export function media(id: string): MediaItem {
  const item = byId.get(id);
  if (!item) throw new Error(`Unknown media id "${id}". Add it to media/manifest.json.`);
  return item;
}

/** Poster frame for a video, if one is listed. */
export function posterFor(videoId: string): MediaItem | undefined {
  return items.find((item) => item.kind === "poster" && item.posterOf === videoId);
}

/** Everything that needs a credit line (posters inherit their video's credit). */
export function credits(): MediaItem[] {
  return items.filter((item) => item.kind !== "poster");
}
