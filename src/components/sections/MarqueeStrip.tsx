"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Wrapper for the CSS marquee. The movement itself is a CSS animation; this only sets
 * `data-run` while the strip is on screen and after the visitor's first scroll, tap or
 * key press, so an endless animation never runs during the first load (it would keep
 * the main thread and the paint busy) or off screen. Without JavaScript (no html.js)
 * the CSS runs it straight away.
 */
export function MarqueeStrip({ className, children }: { className: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) return;
    let inView = false;
    let engaged = false;
    const update = () => {
      if (inView && engaged) el.setAttribute("data-run", "");
      else el.removeAttribute("data-run");
    };
    const io = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      update();
    });
    io.observe(el);
    const events = ["scroll", "pointerdown", "keydown", "touchstart"] as const;
    const engage = () => {
      engaged = true;
      update();
      events.forEach((type) => window.removeEventListener(type, engage));
    };
    events.forEach((type) => window.addEventListener(type, engage, { passive: true }));
    return () => {
      io.disconnect();
      events.forEach((type) => window.removeEventListener(type, engage));
    };
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
