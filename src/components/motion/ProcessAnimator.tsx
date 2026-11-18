"use client";

import { useEffect, useRef, useState, type ComponentType, type ReactNode, type RefObject } from "react";
import { useMediaQuery } from "@/lib/useMediaQuery";

interface ProcessAnimatorProps {
  children: ReactNode;
  className?: string;
}

type MotionComponent = ComponentType<{ target: RefObject<HTMLOListElement | null> }>;

/**
 * The process list for the GSAP sequence. The list renders normally (visible with no JS
 * or reduced motion); when motion is allowed, ProcessMotion and GSAP load as a separate
 * chunk and animate the existing list in place, so nothing re-mounts.
 */
export function ProcessAnimator({ children, className }: ProcessAnimatorProps) {
  const list = useRef<HTMLOListElement>(null);
  const motion = useMediaQuery("(prefers-reduced-motion: no-preference)");
  const [Motion, setMotion] = useState<MotionComponent | null>(null);

  useEffect(() => {
    if (!motion || Motion) return;
    let live = true;
    import("./ProcessMotion").then((m) => {
      if (live) setMotion(() => m.ProcessMotion);
    });
    return () => {
      live = false;
    };
  }, [motion, Motion]);

  return (
    <>
      <ol ref={list} className={className}>
        {children}
      </ol>
      {motion && Motion && <Motion target={list} />}
    </>
  );
}
