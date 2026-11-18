import { Reveal } from "@/components/motion/Reveal";
import { ImageFrame } from "@/components/ui/ImageFrame";
import type { ImageAsset } from "@/content/types";
import styles from "./ProjectGallery.module.css";

interface ProjectGalleryProps {
  /** Company photos, drawings and labelled renderings only (never stock). */
  images: ImageAsset[];
}

/**
 * Photo grid (two columns from 640px); captions (e.g. "Design rendering") are always
 * shown. From 1024px MotionEngine turns it into one row that scrolls sideways while the
 * section is pinned (`[data-pin-gallery]`); without JavaScript it stays the grid.
 */
export function ProjectGallery({ images }: ProjectGalleryProps) {
  if (images.length === 0) return null;
  return (
    <div className={styles.pin} data-pin-gallery="">
      <Reveal group as="ul" role="list" className={styles.grid}>
        {images.map((image) => (
          <li key={image.src} className={styles.item}>
            <ImageFrame
              image={image}
              ratio="3/2"
              sizes="(min-width: 1240px) 610px, (min-width: 640px) 50vw, 100vw"
              showCaption
            />
          </li>
        ))}
      </Reveal>
    </div>
  );
}
