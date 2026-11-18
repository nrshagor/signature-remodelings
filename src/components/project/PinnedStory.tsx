"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useRef } from "react";
import type { ImageAsset } from "@/content/types";
import { SCROLL_MOTION_QUERY } from "@/lib/useMediaQuery";
import styles from "./PinnedStory.module.css";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export interface PinnedStoryProps {
  before: ImageAsset;
  after: ImageAsset;
  labels: { before: string; after: string };
}

/** Frame height ÷ width (16:10, same as the slider). */
const RATIO = 0.625;

/** Height of the fixed header, so the story pins just below it. */
function headerOffset(): number {
  const value = getComputedStyle(document.documentElement).getPropertyValue("--header-height");
  return parseFloat(value) || 0;
}

/**
 * Desktop scroll story (loaded on demand by ScrollStory): the section pins below the
 * header and scrolling wipes the before photo away to reveal the after photo, while the
 * step caption changes from "Before" to "After". Scrolling back reverses it.
 */
export function PinnedStory({ before, after, labels }: PinnedStoryProps) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      // Mirrors ScrollStory's switch; also cleans up if the query stops matching first.
      mm.add(SCROLL_MOTION_QUERY, () => {
        const el = root.current;
        if (!el) return;
        gsap.set("[data-step='after']", { autoAlpha: 0, y: 16 });
        gsap
          .timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: el,
              start: () => `top top+=${headerOffset()}`,
              end: "+=100%",
              pin: true,
              scrub: 0.6,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
          })
          .fromTo(el, { "--position": "100%" }, { "--position": "0%", duration: 1 }, 0)
          .to("[data-step='before']", { autoAlpha: 0, y: -16, duration: 0.2 }, 0.4)
          .to("[data-step='after']", { autoAlpha: 1, y: 0, duration: 0.2 }, 0.5);
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  // Never wider than the photos' natural size (no upscaling).
  const cap = Math.floor(
    Math.min(before.width, after.width, before.height / RATIO, after.height / RATIO),
  );
  const sizes = `(min-width: ${cap}px) ${cap}px, 100vw`;

  return (
    <div ref={root} className={styles.story}>
      <div className={styles.cap} style={{ maxWidth: cap }}>
        <div className={styles.fit}>
          <div className={styles.frame}>
            <Image src={after.src} alt={after.alt} fill sizes={sizes} className={styles.image} />
            <div className={styles.beforeLayer}>
              <Image src={before.src} alt={before.alt} fill sizes={sizes} className={styles.image} />
            </div>
            <div className={styles.divider} aria-hidden="true" />
          </div>
        </div>
      </div>
      <ol className={styles.steps}>
        <li className={styles.step} data-step="before">
          <span className={styles.label}>{labels.before}</span>
          {before.caption && <span className={styles.caption}>{before.caption}</span>}
        </li>
        <li className={styles.step} data-step="after">
          <span className={styles.label}>{labels.after}</span>
          {after.caption && <span className={styles.caption}>{after.caption}</span>}
        </li>
      </ol>
    </div>
  );
}
