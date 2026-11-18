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

/** Frame height ÷ width for each ratio. */
const ratioValue: Record<Ratio, number> = {
  "4/5": 1.25,
  "3/2": 2 / 3,
  "16/10": 0.625,
  "16/9": 0.5625,
  "1/1": 1,
};

/**
 * Widest the frame may get before `object-fit: cover` would scale the photo above its
 * natural size: the photo must cover both the frame's width and its height.
 */
function maxFrameWidth(image: ImageAsset, ratio: Ratio): number {
  return Math.floor(Math.min(image.width, image.height / ratioValue[ratio]));
}

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
 * Photos are never upscaled: the frame is capped at the photo's natural size (and centred
 * in its column if the column is wider).
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
  const box = (
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

  // The cap sits on a wrapper: padding-top % is relative to the parent's width, so the
  // ratio box itself must stay at 100% of its (capped) parent.
  const frame = image ? (
    <div className={styles.cap} style={{ maxWidth: maxFrameWidth(image, ratio) }}>
      {box}
    </div>
  ) : (
    box
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
