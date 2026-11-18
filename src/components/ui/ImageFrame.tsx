import Image from "next/image";
import type { ImageAsset } from "@/content/types";
import styles from "./ImageFrame.module.css";

export type Ratio = "4/5" | "3/2" | "16/10" | "16/9" | "1/1";

const ratioClass: Record<Ratio, string> = {
  "4/5": styles.r4x5,
  "3/2": styles.r3x2,
  "16/10": styles.r16x10,
  "16/9": styles.r16x9,
  "1/1": styles.r1x1,
};

interface ImageFrameProps {
  /** Undefined while the photo is missing: a plain tone panel is shown, with no text. */
  image?: ImageAsset;
  ratio: Ratio;
  /** Required for next/image: how wide the image is at each breakpoint. */
  sizes: string;
  priority?: boolean;
  /** Slow zoom when the closest `[data-zoom-parent]` ancestor is hovered (cards). */
  zoomOnHover?: boolean;
  /** Show image.caption below the image. */
  showCaption?: boolean;
  className?: string;
}

/**
 * Fixed-ratio image box. The ratio comes from padding-top, so it works without
 * aspect-ratio support, and the image uses next/image `fill`. With no image it renders an
 * empty decorative panel, so layouts keep their shape until real photos arrive.
 */
export function ImageFrame({
  image,
  ratio,
  sizes,
  priority,
  zoomOnHover,
  showCaption,
  className,
}: ImageFrameProps) {
  const frame = (
    <div
      className={[styles.frame, ratioClass[ratio], !image && styles.empty, className]
        .filter(Boolean)
        .join(" ")}
      aria-hidden={image ? undefined : true}
    >
      {image && (
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes={sizes}
          priority={priority}
          className={[styles.img, zoomOnHover && styles.zoom].filter(Boolean).join(" ")}
        />
      )}
    </div>
  );

  if (image?.caption && showCaption) {
    return (
      <figure className={styles.figure}>
        {frame}
        <figcaption className={styles.caption}>{image.caption}</figcaption>
      </figure>
    );
  }
  return frame;
}
