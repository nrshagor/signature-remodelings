"use client";

import { useEffect, useState, type ComponentType } from "react";
import { Reveal } from "@/components/motion/Reveal";
import type { ImageAsset } from "@/content/types";
import { SCROLL_MOTION_QUERY, useMediaQuery } from "@/lib/useMediaQuery";
import { BeforeAfter } from "./BeforeAfter";
import type { PinnedStoryProps } from "./PinnedStory";

interface ScrollStoryProps {
  before: ImageAsset;
  after: ImageAsset;
  labels: { before: string; after: string; sliderLabel: string };
}

/**
 * One before/after pair on a project page.
 * Desktop with motion allowed: a pinned section where scrolling wipes from before to
 * after (GSAP, loaded on demand). Mobile, reduced motion, or until GSAP has loaded: the
 * plain slider (and with no JS, the two photos side by side).
 */
export function ScrollStory({ before, after, labels }: ScrollStoryProps) {
  const motion = useMediaQuery(SCROLL_MOTION_QUERY);
  const [Pinned, setPinned] = useState<ComponentType<PinnedStoryProps> | null>(null);

  useEffect(() => {
    if (!motion || Pinned) return;
    let live = true;
    // Separate chunk: GSAP is downloaded only when a desktop visitor needs it.
    import("./PinnedStory").then((m) => {
      if (live) setPinned(() => m.PinnedStory);
    });
    return () => {
      live = false;
    };
  }, [motion, Pinned]);

  if (motion && Pinned) {
    return <Pinned before={before} after={after} labels={labels} />;
  }
  return (
    <Reveal>
      <BeforeAfter before={before} after={after} labels={labels} />
    </Reveal>
  );
}
