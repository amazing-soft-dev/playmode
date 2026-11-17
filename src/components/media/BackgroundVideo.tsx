import { cn } from "@/lib/cn";
import { media, posterFor } from "@/lib/media";

/**
 * Muted, looping background video with its poster. People who prefer reduced motion get the
 * still poster only (the video element is hidden by CSS, so nothing autoplays for them).
 * Decorative: hidden from assistive technology.
 */
export function BackgroundVideo({
  id,
  className,
  priority = false,
}: {
  /** Manifest id of a video. */
  id: string;
  className?: string;
  /** Preload the video (above-the-fold heroes only). */
  priority?: boolean;
}) {
  const video = media(id);
  const poster = posterFor(id);
  return (
    <div aria-hidden className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      {poster && (
        // A plain <img> keeps the poster sharp and visible under the video while it buffers.
        // eslint-disable-next-line @next/next/no-img-element
        <img src={poster.src} alt="" className="absolute inset-0 size-full object-cover" />
      )}
      <video
        className="absolute inset-0 size-full object-cover motion-reduce:hidden"
        src={video.src}
        poster={poster?.src}
        autoPlay
        muted
        loop
        playsInline
        preload={priority ? "auto" : "metadata"}
      />
    </div>
  );
}
