import { Reveal } from "@/components/motion/Reveal";
import { ImageFrame } from "@/components/ui/ImageFrame";
import type { ImageAsset } from "@/content/types";
import styles from "./ProjectGallery.module.css";

interface ProjectGalleryProps {
  /** Company photos, drawings and labelled renderings only (never stock). */
  images: ImageAsset[];
}

/** Two-column photo grid; captions (e.g. "Design rendering") are always shown. */
export function ProjectGallery({ images }: ProjectGalleryProps) {
  if (images.length === 0) return null;
  return (
    <Reveal group as="ul" role="list" className={styles.grid}>
      {images.map((image) => (
        <li key={image.src} className={styles.item}>
          <ImageFrame
            image={image}
            ratio="3/2"
            sizes="(min-width: 640px) 50vw, 100vw"
            showCaption
          />
        </li>
      ))}
    </Reveal>
  );
}
