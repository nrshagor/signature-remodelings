"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/** Elements that need GSAP. Pages without any of them never download it. */
const TARGETS = "[data-split], [data-parallax], [data-pin-gallery]";

/**
 * Site-wide GSAP motion (docs/02-TECH-SPEC.md → Animation policy). Rendered once in the
 * root layout. After every navigation it checks the new page for motion targets; only if
 * one exists, and the visitor allows motion, does it load GSAP (`scrollMotion`, a separate
 * chunk) and start it. Everything is reverted when the page changes.
 */
export function MotionEngine() {
  const pathname = usePathname();

  useEffect(() => {
    // Phones get CSS fades only, and every GSAP effect here starts at 768px.
    const query = "(prefers-reduced-motion: no-preference) and (min-width: 768px)";
    if (!window.matchMedia(query).matches) return;
    const root = document.getElementById("main");
    if (!root || !root.querySelector(TARGETS)) return;

    let live = true;
    let stop: (() => void) | undefined;
    // Start after the page-enter transition (500 ms), so ScrollTrigger measures the
    // settled layout, and after the browser has painted the page.
    const timer = window.setTimeout(() => {
      import("./scrollMotion").then(({ startScrollMotion }) => {
        if (live) stop = startScrollMotion(root);
      });
    }, 550);

    return () => {
      live = false;
      window.clearTimeout(timer);
      stop?.();
    };
  }, [pathname]);

  return null;
}
