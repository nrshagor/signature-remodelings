"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "./Curtain.module.css";

/** Set while the Curtain is mounted (root layout). */
let cover: ((fromPath: string) => void) | null = null;
let reset: (() => void) | null = null;
let stuckTimer = 0;

/** Time for the panel to cover the screen before navigating. Cover 260 ms + leave 340 ms
 * (Curtain.module.css) = 600 ms of animation in total. */
const COVER_MS = 260;
/** If the new page never arrives (error, same page), uncover anyway. */
const STUCK_MS = 4000;

/**
 * Plays the curtain, then calls `navigate`. Returns false (and does nothing) when the
 * curtain can't play: not mounted or reduced motion. The caller then navigates normally.
 */
export function playCurtain(fromPath: string, navigate: () => void): boolean {
  if (!cover || !window.matchMedia("(prefers-reduced-motion: no-preference)").matches) {
    return false;
  }
  cover(fromPath);
  window.setTimeout(navigate, COVER_MS);
  window.clearTimeout(stuckTimer);
  stuckTimer = window.setTimeout(() => reset?.(), STUCK_MS);
  return true;
}

/**
 * Blue panel for link transitions (TransitionLink): wipes up over the page, the route
 * changes underneath, then it leaves upward. Decorative only (aria-hidden); focus, scroll
 * and history are left to the Next.js router. Back/forward never show it.
 */
export function Curtain() {
  const pathname = usePathname();
  // The path the curtain was raised on; the curtain leaves once the path differs.
  const [from, setFrom] = useState<string | null>(null);

  useEffect(() => {
    cover = setFrom;
    reset = () => setFrom(null);
    return () => {
      cover = null;
      reset = null;
    };
  }, []);

  const state = from === null ? "idle" : from === pathname ? "cover" : "leave";
  return (
    <div
      aria-hidden="true"
      className={styles.curtain}
      data-state={state}
      onAnimationEnd={(event) => {
        if (state === "leave" && event.target === event.currentTarget) setFrom(null);
      }}
    />
  );
}
