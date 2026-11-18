"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { RefObject } from "react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/** Seconds between one step starting and the next. */
const STEP_GAP = 0.45;

/**
 * GSAP sequence for the process list (loaded on demand by ProcessAnimator; renders
 * nothing). When the list scrolls into view, each step fades up in turn and its
 * connecting line draws (via the --line custom property in ProcessSteps.module.css).
 * Plays once. Reduced motion: nothing runs and the list stays as rendered.
 */
export function ProcessMotion({ target }: { target: RefObject<HTMLOListElement | null> }) {
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const list = target.current;
        if (!list) return;
        const steps = gsap.utils.toArray<HTMLElement>("[data-process-step]", list);
        const tl = gsap.timeline({
          scrollTrigger: { trigger: list, start: "top 80%", once: true },
        });
        steps.forEach((step, i) => {
          const at = i * STEP_GAP;
          tl.from(
            step.children,
            { autoAlpha: 0, y: 16, duration: 0.5, stagger: 0.08, ease: "power2.out" },
            at,
          ).fromTo(
            step,
            { "--line": 0 },
            { "--line": 1, duration: 0.5, ease: "power1.inOut" },
            at + 0.25,
          );
        });
      });
      return () => mm.revert();
    },
    { scope: target },
  );
  return null;
}
