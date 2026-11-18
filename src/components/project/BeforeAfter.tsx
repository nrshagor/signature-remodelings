"use client";

import Image from "next/image";
import { useState, useSyncExternalStore, type CSSProperties } from "react";
import type { ImageAsset } from "@/content/types";
import styles from "./BeforeAfter.module.css";

interface BeforeAfterProps {
  /** Same-angle company photos with the same aspect ratio (16:10). */
  before: ImageAsset;
  after: ImageAsset;
  labels: { before: string; after: string; sliderLabel: string };
  sizes?: string;
}

const noopSubscribe = () => () => {};

/**
 * Before/after comparison built on a native <input type="range"> laid over two stacked
 * images, so keyboard (arrows, Home/End, Page Up/Down), touch, mouse and screen readers
 * work without extra code. Server render and no-JS: the two photos side by side.
 */
export function BeforeAfter({
  before,
  after,
  labels,
  sizes = "(min-width: 1240px) 1240px, 100vw",
}: BeforeAfterProps) {
  // false on the server and during hydration, true afterwards: no hydration mismatch.
  const interactive = useSyncExternalStore(noopSubscribe, () => true, () => false);
  const [value, setValue] = useState(50);

  if (!interactive) {
    return (
      <div className={styles.fallback}>
        {[
          { image: before, label: labels.before },
          { image: after, label: labels.after },
        ].map(({ image, label }) => (
          <figure key={label} className={styles.fallbackItem}>
            <div className={styles.frame}>
              <Image src={image.src} alt={image.alt} fill sizes="(min-width: 640px) 50vw, 100vw" className={styles.image} />
            </div>
            <figcaption className={styles.fallbackCaption}>{label}</figcaption>
          </figure>
        ))}
      </div>
    );
  }

  const position = { "--position": `${value}%` } as CSSProperties;

  return (
    <div className={styles.slider} style={position}>
      <div className={styles.frame}>
        <Image src={after.src} alt={after.alt} fill sizes={sizes} className={styles.image} />
        <div className={styles.beforeLayer}>
          <Image src={before.src} alt={before.alt} fill sizes={sizes} className={styles.image} />
        </div>
        <span className={`${styles.chip} ${styles.chipBefore}`} aria-hidden="true">
          {labels.before}
        </span>
        <span className={`${styles.chip} ${styles.chipAfter}`} aria-hidden="true">
          {labels.after}
        </span>
        <input
          type="range"
          min={0}
          max={100}
          step={1}
          value={value}
          onChange={(e) => setValue(Number(e.target.value))}
          className={styles.range}
          aria-label={labels.sliderLabel}
          aria-valuetext={`${value}% ${labels.before.toLowerCase()}, ${100 - value}% ${labels.after.toLowerCase()}`}
        />
        <div className={styles.divider} aria-hidden="true">
          <span className={styles.handle} />
        </div>
      </div>
    </div>
  );
}
