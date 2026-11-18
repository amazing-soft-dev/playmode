import Image from "next/image";

import { cn } from "@/lib/cn";
import { media } from "@/lib/media";

interface MediaProps {
  /** Manifest id of a photo or poster. */
  id: string;
  /** Responsive sizes hint, e.g. "(min-width: 992px) 50vw, 100vw". */
  sizes: string;
  /** Fill the positioned parent instead of using intrinsic size. */
  fill?: boolean;
  priority?: boolean;
  className?: string;
  /** Override the manifest alt text (use "" for decorative images). */
  alt?: string;
  /** Zoom to 1.1 when a parent with the `group/card` class is hovered (template card hover). */
  zoomOnHover?: boolean;
}

/** A credited stock photo from media/manifest.json, rendered with next/image. */
export function Media({ id, sizes, fill = true, priority = false, className, alt, zoomOnHover = false }: MediaProps) {
  const item = media(id);
  const classes = cn(
    "object-cover",
    zoomOnHover && "transition-transform duration-[600ms] ease-snap group-hover/card:scale-110",
    className,
  );
  const style = item.focal ? { objectPosition: item.focal } : undefined;
  if (fill) {
    return (
      <Image
        src={item.src}
        alt={alt ?? item.alt}
        fill
        sizes={sizes}
        priority={priority}
        className={classes}
        style={style}
      />
    );
  }
  return (
    <Image
      src={item.src}
      alt={alt ?? item.alt}
      width={item.width}
      height={item.height}
      sizes={sizes}
      priority={priority}
      className={classes}
      style={style}
    />
  );
}
